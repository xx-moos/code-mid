package com.library.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.library.entity.Book;
import com.library.entity.BookCollection;
import com.library.entity.BorrowRecord;
import com.library.entity.BookSimilarity;
import com.library.mapper.BookCollectionMapper;
import com.library.mapper.BookMapper;
import com.library.mapper.BookSimilarityMapper;
import com.library.mapper.BorrowRecordMapper;
import com.library.service.RecommendationService;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
public class RecommendationServiceImpl implements RecommendationService {

    private final BookMapper bookMapper;
    private final BorrowRecordMapper borrowRecordMapper;
    private final BookCollectionMapper bookCollectionMapper;
    private final BookSimilarityMapper bookSimilarityMapper;

    private static final double COLLECTION_IMPLICIT_RATING = 3.0; // 1-5 scale for collections
    private static final int SIMILAR_BOOKS_TO_CONSIDER = 20; //  For each rated book, consider top K similar books

    @Autowired
    public RecommendationServiceImpl(BookMapper bookMapper,
                                     BorrowRecordMapper borrowRecordMapper,
                                     BookCollectionMapper bookCollectionMapper,
                                     BookSimilarityMapper bookSimilarityMapper) {
        this.bookMapper = bookMapper;
        this.borrowRecordMapper = borrowRecordMapper;
        this.bookCollectionMapper = bookCollectionMapper;
        this.bookSimilarityMapper = bookSimilarityMapper;
    }

    @Data
    private static class PredictedScoreComponents {
        private double weightedScoreSum = 0.0; // sum(similarity * rating)
        private double absSimilaritySum = 0.0; // sum(abs(similarity))
        private int predictionContributors = 0;

        public double calculateFinalScore() {
            if (absSimilaritySum == 0 || predictionContributors == 0) return 0.0;
            return weightedScoreSum / absSimilaritySum;
        }
    }

    @Override
    public List<Book> getRecommendations(Long userId, int count) {
        log.info("为用户ID: {} 获取 {} 条图书推荐...", userId, count);

        // 1. 获取用户交互数据 (评分和收藏)
        Map<Long, Double> userRatings = new HashMap<>(); // bookId -> rating (1-5 scale)
        Set<Long> interactedBookIds = new HashSet<>();

        List<BorrowRecord> userBorrows = borrowRecordMapper.selectList(
                new QueryWrapper<BorrowRecord>().eq("user_id", userId)
        );
        for (BorrowRecord borrow : userBorrows) {
            if (borrow.getRating() != null && borrow.getRating() > 0 && borrow.getRating() <= 5) {
                userRatings.put(borrow.getBookId(), borrow.getRating().doubleValue());
            }
            interactedBookIds.add(borrow.getBookId());
        }

        List<BookCollection> userCollections = bookCollectionMapper.selectList(
                new QueryWrapper<BookCollection>().eq("user_id", userId)
        );
        for (BookCollection collection : userCollections) {
            userRatings.putIfAbsent(collection.getBookId(), COLLECTION_IMPLICIT_RATING);
            interactedBookIds.add(collection.getBookId());
        }

        // 2. 判断用户类型 (冷启动或活跃)
        if (userRatings.isEmpty()) {
            log.info("用户ID: {} 是新用户或无有效交互，执行冷启动策略。", userId);
            return getColdStartRecommendations(count);
        } else {
            log.info("用户ID: {} 是活跃用户，共评过/收藏 {} 本书。执行协同过滤推荐。", userId, userRatings.size());
            return getCollaborativeFilteringRecommendations(userId, count, userRatings, interactedBookIds);
        }
    }

    private List<Book> getColdStartRecommendations(int count) {
        QueryWrapper<Book> queryWrapper = new QueryWrapper<Book>()
                .eq("status", 0) // 可借
                // .eq("deleted", 0) // Assuming BaseEntity handles this
                .orderByDesc("avg_rating"); // 按新计算的0-10分综合评分排序

        Page<Book> page = new Page<>(1, count);
        List<Book> recommendedBooks = bookMapper.selectPage(page, queryWrapper).getRecords();

        log.info("冷启动推荐 {} 本书.", recommendedBooks.size());
        return recommendedBooks != null ? recommendedBooks : Collections.emptyList();
    }

    private List<Book> getCollaborativeFilteringRecommendations(Long userId, int count,
                                                                Map<Long, Double> userRatings,
                                                                Set<Long> interactedBookIds) {
        // bookId -> PredictedScoreComponents
        Map<Long, PredictedScoreComponents> candidateBookScores = new HashMap<>();

        // 对用户评过分的每一本书
        for (Map.Entry<Long, Double> userRatedEntry : userRatings.entrySet()) {
            Long ratedBookId = userRatedEntry.getKey();
            Double userRatingForBook = userRatedEntry.getValue();

            //  查找与 ratedBookId 相似的书籍 (book_id_1 = ratedBookId)
            QueryWrapper<BookSimilarity> simQuery1 = new QueryWrapper<BookSimilarity>()
                    .eq("book_id_1", ratedBookId)
                    .orderByDesc("similarity_score")
                    .last("LIMIT " + SIMILAR_BOOKS_TO_CONSIDER);
            List<BookSimilarity> similarToList1 = bookSimilarityMapper.selectList(simQuery1);

            //  查找与 ratedBookId 相似的书籍 (book_id_2 = ratedBookId)
            QueryWrapper<BookSimilarity> simQuery2 = new QueryWrapper<BookSimilarity>()
                    .eq("book_id_2", ratedBookId)
                    .orderByDesc("similarity_score")
                    .last("LIMIT " + SIMILAR_BOOKS_TO_CONSIDER);
            List<BookSimilarity> similarToList2 = bookSimilarityMapper.selectList(simQuery2);

            Set<BookSimilarity> combinedSimilarities = new HashSet<>(similarToList1);
            combinedSimilarities.addAll(similarToList2); //  合并，Set自动去重

            for (BookSimilarity similarityRecord : combinedSimilarities) {
                Long similarBookId = (similarityRecord.getBookId1().equals(ratedBookId)) ?
                        similarityRecord.getBookId2() : similarityRecord.getBookId1();
                double similarityScore = similarityRecord.getSimilarityScore();

                // 如果用户未与该相似图书交互过
                if (!interactedBookIds.contains(similarBookId)) {
                    PredictedScoreComponents components = candidateBookScores.computeIfAbsent(similarBookId, k -> new PredictedScoreComponents());
                    components.setWeightedScoreSum(components.getWeightedScoreSum() + (similarityScore * userRatingForBook));
                    components.setAbsSimilaritySum(components.getAbsSimilaritySum() + Math.abs(similarityScore));
                    components.setPredictionContributors(components.getPredictionContributors() + 1);
                }
            }
        }

        if (candidateBookScores.isEmpty()) {
            log.warn("协同过滤未能为用户ID: {} 生成任何候选推荐，可能由于相似书籍不足或均已交互。", userId);
            return getColdStartRecommendations(count); //  回退到冷启动
        }

        // 计算最终预测分并排序
        List<Long> recommendedBookIds = candidateBookScores.entrySet().stream()
                .filter(entry -> entry.getValue().getPredictionContributors() > 0) // 确保有贡献者
                .sorted(Comparator.comparingDouble((Map.Entry<Long, PredictedScoreComponents> entry) -> entry.getValue().calculateFinalScore()).reversed())
                .limit(count)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());

        if (recommendedBookIds.isEmpty()) {
            log.info("协同过滤后无有效推荐，用户ID: {}，回退到冷启动策略。", userId);
            return getColdStartRecommendations(count);
        }

        // 获取推荐图书的完整信息
        QueryWrapper<Book> bookDetailsQuery = new QueryWrapper<Book>()
                .in("id", recommendedBookIds)
                .eq("status", 0);
        // .eq("deleted", 0) //  Handled by BaseEntity or ensure status check is enough
        List<Book> recommendedBooks = bookMapper.selectList(bookDetailsQuery);

        //  保持推荐ID列表的顺序
        recommendedBooks.sort(Comparator.comparingInt(recommendedBookIds::indexOf));

        log.info("协同过滤为用户ID: {} 生成了 {} 条推荐.", userId, recommendedBooks.size());
        return recommendedBooks;
    }
} 
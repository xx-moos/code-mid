package com.library.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.library.entity.Book;
import com.library.entity.BookCollection;
import com.library.entity.BorrowRecord;
import com.library.entity.BookSimilarity;
import com.library.mapper.BookCollectionMapper;
import com.library.mapper.BookMapper;
import com.library.mapper.BookSimilarityMapper;
import com.library.mapper.BorrowRecordMapper;
import com.library.service.BookSimilarityService;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.scheduling.annotation.Scheduled;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
public class BookSimilarityServiceImpl implements BookSimilarityService {

    private final BookMapper bookMapper;
    private final BorrowRecordMapper borrowRecordMapper;
    private final BookCollectionMapper bookCollectionMapper;
    private final BookSimilarityMapper bookSimilarityMapper;

    //  固定评分值，用于仅收藏但未通过借阅评分的书籍 (1-5分制)
    private static final double COLLECTION_IMPLICIT_RATING = 3.0;

    @Autowired
    public BookSimilarityServiceImpl(BookMapper bookMapper,
                                     BorrowRecordMapper borrowRecordMapper,
                                     BookCollectionMapper bookCollectionMapper,
                                     BookSimilarityMapper bookSimilarityMapper) {
        this.bookMapper = bookMapper;
        this.borrowRecordMapper = borrowRecordMapper;
        this.bookCollectionMapper = bookCollectionMapper;
        this.bookSimilarityMapper = bookSimilarityMapper;
    }

    @Data
    private static class BookSimilarityScoreDto {
        private long bookId1;
        private long bookId2;
        private double score;
    }

    @Override
    @Transactional
    @Scheduled(cron = "0 0 4 * * ?") // 每日凌晨4点执行, 在评分计算之后
    public void calculateAndStoreBookSimilarities() {
        log.info("开始计算图书相似度 (定时任务)...");

        // 1. 获取所有有效图书
        List<Book> activeBooks = bookMapper.selectList(new QueryWrapper<Book>().eq("status", 0));
        if (activeBooks == null || activeBooks.isEmpty() || activeBooks.size() < 2) {
            log.info("有效图书不足2本，无法计算相似度。");
            return;
        }
        List<Long> activeBookIds = activeBooks.stream().map(Book::getId).collect(Collectors.toList());

        // 2. 构建用户-物品评分矩阵 (Map<userId, Map<bookId, rating>>，1-5分制)
        Map<Long, Map<Long, Double>> userBookRatings = new HashMap<>();

        // 从 borrow_record 获取显式评分
        List<BorrowRecord> borrowRecords = borrowRecordMapper.selectList(null); // 获取所有借阅记录
        for (BorrowRecord record : borrowRecords) {
            if (record.getRating() != null && record.getRating() > 0 && record.getRating() <= 5) { // 确保评分有效
                userBookRatings.computeIfAbsent(record.getUserId(), k -> new HashMap<>())
                        .put(record.getBookId(), record.getRating().doubleValue());
            }
        }

        // 从 book_collection 获取隐式行为，并赋予固定评分
        List<BookCollection> collections = bookCollectionMapper.selectList(null); // 获取所有收藏记录
        for (BookCollection collection : collections) {
            Map<Long, Double> userRatings = userBookRatings.computeIfAbsent(collection.getUserId(), k -> new HashMap<>());
            // 如果用户对这本书还没有显式评分 (来自borrow_record)，则添加隐式评分
            userRatings.putIfAbsent(collection.getBookId(), COLLECTION_IMPLICIT_RATING);
        }

        if (userBookRatings.isEmpty()) {
            log.info("没有用户评分数据，无法计算相似度。");
            return;
        }

        log.info("用户-物品评分矩阵构建完毕，用户数: {}, 涉及图书数: {}",
                userBookRatings.size(),
                userBookRatings.values().stream().flatMap(m -> m.keySet().stream()).distinct().count());

        // 3. 计算图书间的余弦相似度
        List<BookSimilarityScoreDto> similarityScoreDtos = new ArrayList<>();

        for (int i = 0; i < activeBookIds.size(); i++) {
            for (int j = i + 1; j < activeBookIds.size(); j++) {
                long bookId1 = activeBookIds.get(i);
                long bookId2 = activeBookIds.get(j);

                // 计算 bookId1 和 bookId2 的余弦相似度
                double dotProduct = 0.0;
                double norm1 = 0.0;
                double norm2 = 0.0;
                int commonUsers = 0;

                for (Map.Entry<Long, Map<Long, Double>> userEntry : userBookRatings.entrySet()) {
                    Map<Long, Double> ratings = userEntry.getValue();
                    Double rating1 = ratings.get(bookId1);
                    Double rating2 = ratings.get(bookId2);

                    if (rating1 != null && rating2 != null) {
                        dotProduct += rating1 * rating2;
                        norm1 += rating1 * rating1;
                        norm2 += rating2 * rating2;
                        commonUsers++;
                    }
                }

                //  可以设置一个最小共同用户数的阈值，例如 commonUsers >= 2 或 3
                if (commonUsers > 1 && norm1 > 0 && norm2 > 0) {
                    double similarity = dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
                    if (similarity > 0.1) { //  存储相似度大于0.1的项
                        BookSimilarityScoreDto bssDto = new BookSimilarityScoreDto();
                        bssDto.setBookId1(bookId1 < bookId2 ? bookId1 : bookId2);
                        bssDto.setBookId2(bookId1 < bookId2 ? bookId2 : bookId1);
                        bssDto.setScore(similarity);
                        similarityScoreDtos.add(bssDto);
                        log.trace("Calculated similarity between book {} and book {}: {}", bookId1, bookId2, similarity);
                    }
                }
            }
        }

        log.info("图书相似度计算完毕，共得到 {} 条有效相似度记录。", similarityScoreDtos.size());

        // 4. 存储相似度 (此处需要 BookSimilarityRepository/Mapper)
        if (!similarityScoreDtos.isEmpty()) {
            log.info("开始存储图书相似度到数据库...");
            bookSimilarityMapper.deleteAllRecords(); // 清空旧数据
            for (BookSimilarityScoreDto dto : similarityScoreDtos) {
                BookSimilarity entity = new BookSimilarity(dto.getBookId1(), dto.getBookId2(), dto.getScore());
                try {
                    bookSimilarityMapper.insert(entity); //  循环插入
                } catch (Exception e) {
                    log.error("插入图书相似度记录失败: {} - {}, score: {}. Error: {}",
                            dto.getBookId1(), dto.getBookId2(), dto.getScore(), e.getMessage());
                }
            }
            log.info("图书相似度已成功存储到数据库。");
        } else {
            // 如果没有计算出相似度条目，也尝试清空一下旧表，确保数据一致性
            bookSimilarityMapper.deleteAllRecords();
            log.info("没有计算出新的相似度记录，已清空旧的相似度数据表。");
        }

        log.info("图书相似度计算过程完成 (定时任务).");
    }
} 
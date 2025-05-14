package com.library.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.library.entity.Book;
import com.library.entity.BookCollection;
import com.library.mapper.BookCollectionMapper;
import com.library.mapper.BookMapper;
import com.library.mapper.BorrowRecordMapper;
import com.library.service.BookRatingService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.scheduling.annotation.Scheduled;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.OptionalInt;
import java.util.stream.Collectors;

@Slf4j
@Service
public class BookRatingServiceImpl implements BookRatingService {

    private final BookMapper bookMapper;
    private final BookCollectionMapper bookCollectionMapper;
    private final BorrowRecordMapper borrowRecordMapper;

    @Autowired
    public BookRatingServiceImpl(BookMapper bookMapper,
                                 BookCollectionMapper bookCollectionMapper,
                                 BorrowRecordMapper borrowRecordMapper) {
        this.bookMapper = bookMapper;
        this.bookCollectionMapper = bookCollectionMapper;
        this.borrowRecordMapper = borrowRecordMapper;
    }

    @Override
    @Transactional
    @Scheduled(cron = "0 0 3 * * ?")
    public void calculateAndSaveAllBookRatings() {
        log.info("开始计算所有图书的综合评分 (定时任务)...");

        QueryWrapper<Book> bookQueryWrapper = new QueryWrapper<>();
        bookQueryWrapper.eq("status", 0); // status = 0 表示 '可借'
        List<Book> books = bookMapper.selectList(bookQueryWrapper);

        if (books == null || books.isEmpty()) {
            log.info("没有找到有效的图书进行评分计算。");
            return;
        }

        List<Integer> collectionCounts = books.stream()
                .map(book -> {
                    QueryWrapper<BookCollection> cw = new QueryWrapper<BookCollection>().eq("book_id", book.getId());
                    Long count = bookCollectionMapper.selectCount(cw);
                    return count != null ? count.intValue() : 0;
                })
                .collect(Collectors.toList());

        List<Integer> borrowCounts = books.stream()
                .map(book -> book.getBorrowCount() != null ? book.getBorrowCount() : 0)
                .collect(Collectors.toList());

        int cMin = collectionCounts.stream().mapToInt(Integer::intValue).min().orElse(0);
        int cMax = collectionCounts.stream().mapToInt(Integer::intValue).max().orElse(0);
        int bMin = borrowCounts.stream().mapToInt(Integer::intValue).min().orElse(0);
        int bMax = borrowCounts.stream().mapToInt(Integer::intValue).max().orElse(0);

        log.debug("收藏数统计: Min={}, Max={}", cMin, cMax);
        log.debug("借阅数统计: Min={}, Max={}", bMin, bMax);

        for (int i = 0; i < books.size(); i++) {
            Book book = books.get(i);
            int c = collectionCounts.get(i);
            int b = borrowCounts.get(i);

            Double rAvgBookRaw = borrowRecordMapper.selectAverageRatingByBookId(book.getId());
            double rAvgBook = (rAvgBookRaw != null && rAvgBookRaw > 0) ? rAvgBookRaw : 0.0;

            double normC = (cMax - cMin == 0) ? 0.0 : (10.0 * (c - cMin) / (cMax - cMin));
            double normB = (bMax - bMin == 0) ? 0.0 : (10.0 * (b - bMin) / (bMax - bMin));
            double normRAvgBook = (rAvgBook > 0 && rAvgBook >= 1.0) ? (10.0 * (rAvgBook - 1.0) / (5.0 - 1.0)) : 0.0;

            double calculatedAvgRating = 0.5 * normRAvgBook + 0.2 * normC + 0.3 * normB;
            calculatedAvgRating = Math.max(0.0, Math.min(10.0, calculatedAvgRating));

            BigDecimal bd = new BigDecimal(Double.toString(calculatedAvgRating));
            book.setAvgRating(bd.setScale(1, RoundingMode.HALF_UP).doubleValue());

            bookMapper.updateById(book);
            log.debug("图书ID: {}, 名称: '{}', 计算后 avg_rating: {}", book.getId(), book.getName(), book.getAvgRating());
        }
        log.info("所有图书的综合评分计算并更新完毕 (定时任务).");
    }
} 
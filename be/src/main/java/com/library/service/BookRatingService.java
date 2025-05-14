package com.library.service;

/**
 * 图书综合评分计算服务接口
 */
public interface BookRatingService {

    /**
     * 计算并保存所有图书的综合评分 (avg_rating)。
     * 该方法设计为由定时任务调用。
     */
    void calculateAndSaveAllBookRatings();
} 
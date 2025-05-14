package com.library.service;

/**
 * 图书相似度计算服务接口
 */
public interface BookSimilarityService {

    /**
     * 计算并存储所有图书对之间的相似度。
     * 该方法设计为由定时任务调用，在图书综合评分计算之后执行。
     */
    void calculateAndStoreBookSimilarities();

    //  可以考虑增加一个方法获取特定书籍的相似书籍，但这通常在推荐服务中处理
    //  Map<Long, Double> getSimilarBooks(Long bookId, int topN);
} 
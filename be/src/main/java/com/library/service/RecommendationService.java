package com.library.service;

import com.library.entity.Book;

import java.util.List;

/**
 * 图书推荐服务接口
 */
public interface RecommendationService {

    /**
     * 为指定用户获取图书推荐列表。
     *
     * @param userId 目标用户的ID
     * @param count  需要推荐的图书数量 (e.g., 10 for Top-10)
     * @return 推荐的图书列表 (List<Book>)，可能为空列表但不应为null。
     */
    List<Book> getRecommendations(Long userId, int count);
} 
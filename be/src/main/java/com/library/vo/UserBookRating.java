package com.library.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 用于封装用户对图书的评分信息 (1-5分制)，主要供推荐系统内部使用。
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserBookRating {
    private Long userId;
    private Long bookId;
    private Double rating; // 1-5分制评分
} 
package com.library.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 图书评论表
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("book_comment")
public class BookComment extends BaseEntity {

    private static final long serialVersionUID = 1L;

    /**
     * 用户ID
     */
    @TableField("user_id")
    private Long userId;

    /**
     * 图书ID
     */
    @TableField("book_id")
    private Long bookId;

    /**
     * 评论内容
     */
    @TableField("content")
    private String content;

    /**
     * 父评论ID（回复评论时使用）
     */
    @TableField("parent_id")
    private Long parentId;

    /**
     * 点赞数
     */
    @TableField("likes")
    private Integer likes;

    /**
     * 状态
     */
    @TableField("status")
    private Integer status;

    /**
     * 星级
     */
    @TableField("star")
    private String star;

} 
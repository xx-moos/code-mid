package com.library.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * 图书实体
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("book")
public class Book extends BaseEntity {
    /**
     * 图书名称
     */
    @TableField("name")
    private String name;

    /**
     * ISBN
     */
    @TableField("isbn")
    private String isbn;

    /**
     * 作者
     */
    @TableField("author")
    private String author;

    /**
     * 出版社
     */
    @TableField("publisher")
    private String publisher;

    /**
     * 出版日期
     */
    @TableField("publish_date")
    private LocalDate publishDate;

    /**
     * 分类
     */
    @TableField("category")
    private String category;


    /**
     * 库存数量
     */
    @TableField("stock")
    private Integer stock;

    /**
     * 简介
     */
    @TableField("description")
    private String description;

    /**
     * 封面图片
     */
    @TableField("cover")
    private String cover;

    /**
     * 状态（0-下架，1-上架） -> SQL中是 0-可借，1-已下架。注释与SQL定义保持一致
     * 根据 SQL: `status` tinyint NOT NULL DEFAULT 0 COMMENT '状态：0-可借，1-已下架'
     */
    @TableField("status")
    private Integer status; //  tinyint 对应 Integer 或 Short 都可以，Integer更常用

    /**
     * 借阅次数
     */
    @TableField("borrow_count")
    private Integer borrowCount;

    /**
     * 综合评分(0-10)
     * 对应数据库 DECIMAL(3,1)
     */
    @TableField("avg_rating")
    private Double avgRating;
} 
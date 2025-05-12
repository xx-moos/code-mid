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
     * 价格
     */
    @TableField("price")
    private BigDecimal price;

    /**
     * 库存数量
     */
    @TableField("stock")
    private Integer stock;

    /**
     * 总库存
     */
    @TableField("total_stock")
    private Integer totalStock;

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
     * 状态（0-下架，1-上架）
     */
    @TableField("status")
    private Integer status;

    /**
     * 借阅次数
     */
    @TableField("borrow_times")
    private Integer borrowTimes;
} 
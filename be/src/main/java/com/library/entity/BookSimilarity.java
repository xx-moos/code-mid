package com.library.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.annotation.TableField;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * 图书相似度实体
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@TableName("book_similarity")
public class BookSimilarity implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 图书ID 1
     * Part of the composite primary key.
     */
    @TableId(value = "book_id_1", type = IdType.INPUT) //  指定为输入类型，因为它是复合主键的一部分
    private Long bookId1;

    /**
     * 图书ID 2
     * Part of the composite primary key.
     */
    @TableField(value = "book_id_2") //  指定为输入类型
    private Long bookId2;

    /**
     * 相似度得分
     */
    @TableField("similarity_score")
    private Double similarityScore;
} 
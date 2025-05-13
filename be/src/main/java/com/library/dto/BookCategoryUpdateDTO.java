package com.library.dto;

import lombok.Data;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import javax.validation.constraints.Min;

/**
 * 更新图书分类 DTO
 *
 * @author AI Assistant
 */
@Data
public class BookCategoryUpdateDTO {

    /**
     * 分类ID
     */
    private Long id;

    /**
     * 分类名称
     */
    private String name;

    /**
     * 分类编码 (字母、数字、下划线，3-50位)
     */
    private String code;

    /**
     * 父分类ID (可以为 null 或 0 表示顶级分类)
     */
    private Long parentId;

    /**
     * 排序 (非负整数)
     */
    private Integer sort;
} 
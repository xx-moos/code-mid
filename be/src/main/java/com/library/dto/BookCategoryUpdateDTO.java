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
    @NotNull(message = "分类ID不能为空")
    private Long id;

    /**
     * 分类名称
     */
    @NotBlank(message = "分类名称不能为空")
    @Size(max = 100, message = "分类名称长度不能超过100个字符")
    private String name;

    /**
     * 分类编码 (字母、数字、下划线，3-50位)
     */
    @NotBlank(message = "分类编码不能为空")
    @Size(min = 3, max = 50, message = "分类编码长度必须在3到50个字符之间")
    @Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "分类编码只能包含字母、数字和下划线")
    private String code;

    /**
     * 父分类ID (可以为 null 或 0 表示顶级分类)
     */
    private Long parentId;

    /**
     * 排序 (非负整数)
     */
    @NotNull(message = "排序值不能为空")
    @Min(value = 0, message = "排序值不能为负数")
    private Integer sort;
} 
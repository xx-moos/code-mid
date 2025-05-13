package com.library.dto;

import lombok.Data;

/**
 * 查询图书分类 DTO (用于列表查询条件)
 *
 * @author AI Assistant
 */
@Data
public class BookCategoryQueryDTO {

    /**
     * 分类名称 (模糊查询)
     */
    private String name;

    /**
     * 分类编码 (精确或模糊查询，根据需要决定)
     */
    private String code;

    /**
     * 分页参数
     */
    private Integer current;
    private Integer size;

} 
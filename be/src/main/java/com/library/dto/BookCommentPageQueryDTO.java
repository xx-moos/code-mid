package com.library.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
@ApiModel(description = "分页查询图书评论请求参数")
public class BookCommentPageQueryDTO {

    @ApiModelProperty(value = "图书ID", required = true)
    private Long bookId;

    private Long content;

    @ApiModelProperty(value = "父评论ID，查询特定父评论下的回复时填写，查询根评论可不填或填0")
    private Long parentId;

    @ApiModelProperty(value = "当前页码", example = "1")
    private Integer current = 1;

    @ApiModelProperty(value = "每页数量", example = "10")
    private Integer size = 10;

    @ApiModelProperty(value = "排序字段和方式，例如：create_time_desc, likes_asc")
    private String sortBy;
} 
package com.library.dto;

import lombok.Data;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

@Data
@ApiModel(description = "修改图书评论请求参数")
public class BookCommentUpdateDTO {

    @ApiModelProperty(value = "评论ID", required = true)
    @NotNull(message = "评论ID不能为空")
    private Long id;

    @ApiModelProperty(value = "评论内容", required = true)
    @NotBlank(message = "评论内容不能为空")
    private String content;
} 
package com.library.dto;

import lombok.Data;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

@Data
@ApiModel(description = "添加图书评论请求参数")
public class BookCommentAddDTO {

    @ApiModelProperty(value = "图书ID", required = true)
    private Long bookId;

    @ApiModelProperty(value = "评论内容", required = true)
    @NotBlank(message = "评论内容不能为空")
    private String content;

    @ApiModelProperty(value = "父评论ID，如果是回复则填写")
    private Long parentId;

    @ApiModelProperty(value = "星级", required = true)
    private String star;
}
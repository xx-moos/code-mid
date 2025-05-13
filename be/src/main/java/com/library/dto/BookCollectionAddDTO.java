package com.library.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotNull;
import java.io.Serializable;

/**
 * 添加图书收藏DTO
 */
@Data
@ApiModel(description = "添加图书收藏请求参数")
public class BookCollectionAddDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    @ApiModelProperty(value = "图书ID", required = true)
    @NotNull(message = "图书ID不能为空")
    private Long bookId;
} 
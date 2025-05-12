package com.library.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotNull;

/**
 * 借阅请求DTO
 */
@Data
@ApiModel("借阅请求")
public class BorrowDTO {
    /**
     * 图书ID
     */
    @NotNull(message = "图书ID不能为空")
    @ApiModelProperty("图书ID")
    private Long bookId;
} 
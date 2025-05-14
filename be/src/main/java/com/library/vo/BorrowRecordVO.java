package com.library.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 借阅记录VO
 */
@Data
@ApiModel("借阅记录视图")
public class BorrowRecordVO {
    /**
     * 借阅记录ID
     */
    @ApiModelProperty("借阅记录ID")
    private Long id;

    /**
     * 用户ID
     */
    @ApiModelProperty("用户ID")
    private Long userId;

    /**
     * 用户名
     */
    @ApiModelProperty("用户名")
    private String username;

    /**
     * 图书ID
     */
    @ApiModelProperty("图书ID")
    private Long bookId;

    /**
     * 图书名称
     */
    @ApiModelProperty("图书名称")
    private String bookName;

    /**
     * 图书作者
     */
    @ApiModelProperty("图书作者")
    private String bookAuthor;

    /**
     * 图书封面
     */
    @ApiModelProperty("图书封面")
    private String bookCover;

    /**
     * 借阅日期
     */
    @ApiModelProperty("借阅日期")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime borrowDate;

    /**
     * 应还日期
     */
    @ApiModelProperty("应还日期")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime returnDate;

    /**
     * 实际归还日期
     */
    @ApiModelProperty("实际归还日期")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime actualReturnDate;

    /**
     * 续借次数
     */
    @ApiModelProperty("续借次数")
    private Integer renewTimes;

    /**
     * 状态（0-待审核, 1-借阅中，2-已归还，3-逾期未还）
     */
    @ApiModelProperty("状态（0-待审核, 1-借阅中，2-已归还，3-逾期未还）")
    private Integer status;

    /**
     * 状态描述
     */
    @ApiModelProperty("状态描述")
    private String statusDesc;

    /**
     * 是否逾期
     */
    @ApiModelProperty("是否逾期")
    private Boolean isOverdue;

    /**
     * 备注
     */
    @ApiModelProperty("备注")
    private String remark;
} 
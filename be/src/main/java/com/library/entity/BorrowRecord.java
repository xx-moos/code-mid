package com.library.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

/**
 * 借阅记录实体
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("borrow_record")
public class BorrowRecord extends BaseEntity {
    /**
     * 用户ID
     */
    @TableField("user_id")
    private Long userId;

    /**
     * 图书ID
     */
    @TableField("book_id")
    private Long bookId;

    /**
     * 借阅日期
     */
    @TableField("borrow_date")
    private LocalDateTime borrowDate;

    /**
     * 应还日期
     */
    @TableField("return_date")
    private LocalDateTime returnDate;

    /**
     * 实际归还日期
     */
    @TableField("actual_return_date")
    private LocalDateTime actualReturnDate;

    /**
     * 续借次数
     */
    @TableField("renew_times")
    private Integer renewTimes;

    /**
     * 状态（0-借阅中，1-已归还，2-逾期未还，3-丢失）
     */
    @TableField("status")
    private Integer status;

    /**
     * 还书时评分(1-5)
     * SQL: `rating` tinyint NULL DEFAULT NULL COMMENT '还书时评分(1-5)'
     */
    @TableField("rating")
    private Integer rating;

    /**
     * 备注
     */
    @TableField("remark")
    private String remark;
} 
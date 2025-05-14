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
   * 状态：0-待审核, 1-借阅中，2-已归还，3-逾期未还
   */
  @TableField("status")
  private Integer status;

  /**
   * 还书时评分(1-5)
   * SQL: `rating` tinyint NULL DEFAULT NULL COMMENT '还书时评分(1-5)'
   */
  @TableField("rating")
  private Integer rating;



  /** 是否已续借：0-否，1-是 */
  @TableField("renewed")
  private Boolean renewed;

}
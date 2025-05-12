package com.library.entity;

import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableLogic;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 实体基类
 */
@Data
public class BaseEntity implements Serializable {
  private static final long serialVersionUID = 1L;

  /**
   * ID
   */
  @TableId(value = "id", type = IdType.AUTO)
  private Long id;

  /**
   * 创建时间
   */
  @TableField(value = "create_time", fill = FieldFill.INSERT)
  private LocalDateTime createTime;

  /**
   * 更新时间
   */
  @TableField(value = "update_time", fill = FieldFill.INSERT_UPDATE)
  private LocalDateTime updateTime;

  /**
   * 删除标记（0-正常，1-已删除）
   */
  @TableLogic
  @TableField("deleted")
  private Integer deleted;
}
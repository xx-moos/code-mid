package com.library.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("announcement")
public class Announcement extends BaseEntity {

    @TableField("title")
    private String title;

    @TableField("content")
    private String content;

    @TableField("publisher_id")
    private Long publisherId;

    @TableField("status")
    private Integer status; // 0-发布，1-撤回
} 
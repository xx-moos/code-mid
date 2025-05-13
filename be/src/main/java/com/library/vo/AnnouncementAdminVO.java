package com.library.vo;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class AnnouncementAdminVO {

    private Long id;

    private String title;

    private String content;

    private Long publisherId;

    // 可以考虑添加 publisherName (通过关联查询获得)
    // private String publisherName;

    private Integer status; // 0-发布, 1-撤回

    private LocalDateTime createTime;

    private LocalDateTime updateTime;

    // 管理员视图通常不需要展示 deleted 字段
} 
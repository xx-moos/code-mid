package com.library.vo;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class AnnouncementPublicVO {

    private Long id;

    private String title;

    private String content; // 实际应用中可能只需要部分内容或摘要

    private LocalDateTime createTime;
} 
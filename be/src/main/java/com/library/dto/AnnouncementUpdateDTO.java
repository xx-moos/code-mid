package com.library.dto;

import lombok.Data;
import javax.validation.constraints.Size;
import javax.validation.constraints.Min;
import javax.validation.constraints.Max;

@Data
public class AnnouncementUpdateDTO {

    @Size(max = 200, message = "公告标题长度不能超过200个字符")
    private String title;

    private String content;

    @Min(value = 0, message = "状态值无效")
    @Max(value = 1, message = "状态值无效") // 0-发布, 1-撤回
    private Integer status;
} 
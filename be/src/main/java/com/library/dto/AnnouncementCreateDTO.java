package com.library.dto;

import lombok.Data;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Data
public class AnnouncementCreateDTO {

    @NotBlank(message = "公告标题不能为空")
    @Size(max = 200, message = "公告标题长度不能超过200个字符")
    private String title;

    @NotBlank(message = "公告内容不能为空")
    private String content;
} 
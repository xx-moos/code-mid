package com.library.dto;

import lombok.Data;
import javax.validation.constraints.Min;

@Data
public class PageQueryDTO {

    @Min(value = 1, message = "页码必须大于0")
    private int page = 1;

    @Min(value = 1, message = "每页数量必须大于0")
    private int size = 10;

    private String title;
}
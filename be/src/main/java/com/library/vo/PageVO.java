package com.library.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PageVO<T> {

    private List<T> list; // 当前页数据列表

    private long total;   // 总记录数

    // 可以根据需要添加其他分页信息，如：
    // private int pageNum;    // 当前页码
    // private int pageSize;   // 每页数量
    // private int totalPages; // 总页数
} 
package com.library.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.library.entity.Book;

/**
 * 图书服务接口
 */
public interface BookService extends IService<Book> {
    /**
     * 分页查询图书
     *
     * @param page     分页参数
     * @param name     图书名称
     * @param author   作者
     * @param category 分类
     * @return 分页结果
     */
    Page<Book> pageBooks(Page<Book> page, String name, String author, String category);

    /**
     * 更新图书库存
     *
     * @param id    图书ID
     * @param stock 库存变化量（正数增加，负数减少）
     * @return 是否成功
     */
    boolean updateStock(Long id, Integer stock);
} 
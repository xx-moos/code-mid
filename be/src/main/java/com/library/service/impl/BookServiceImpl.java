package com.library.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.core.toolkit.StringUtils;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.library.common.Constants;
import com.library.common.ResultCode;
import com.library.common.exception.CustomException;
import com.library.entity.Book;
import com.library.mapper.BookMapper;
import com.library.service.BookService;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 图书服务实现类
 */
@Slf4j
@Service
public class BookServiceImpl extends ServiceImpl<BookMapper, Book> implements BookService {

    @Override
    public Page<Book> pageBooks(Page<Book> page, String name, String author, String category) {
        return page(page, new LambdaQueryWrapper<Book>()
                .like(StringUtils.isNotBlank(name), Book::getName, name)
                .like(StringUtils.isNotBlank(author), Book::getAuthor, author)
                .like(StringUtils.isNotBlank(category), Book::getCategory, category)
                .eq(Book::getDeleted, Constants.NOT_DELETED)
                .eq(Book::getStatus, Constants.STATUS_NORMAL)
                .orderByDesc(Book::getCreateTime));
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean updateStock(Long id, Integer stock) {
        // 参数校验
        if (id == null || stock == 0) {
            return false;
        }

        // 查询图书
        Book book = getById(id);
        if (book == null) {
            throw new CustomException(ResultCode.BOOK_NOT_EXIST);
        }

        // 更新库存
        if (stock < 0) {
            // 减库存，需要判断库存是否足够
            if (book.getStock() < Math.abs(stock)) {
                throw new CustomException(ResultCode.BOOK_STOCK_ERROR);
            }
        }

        // 执行更新
        LambdaUpdateWrapper<Book> updateWrapper = new LambdaUpdateWrapper<>();
        updateWrapper.eq(Book::getId, id);

        if (stock < 0) {
            // 确保库存大于等于减少的数量
            updateWrapper.ge(Book::getStock, Math.abs(stock));
            updateWrapper.setSql("stock = stock + " + stock);
        } else {
            updateWrapper.setSql("stock = stock + " + stock);
        }

        // 更新借阅次数
        updateWrapper.setSql("borrow_count = borrow_count + " + 1);

        return update(updateWrapper);
    }

    @Override
    public List<Book> getHotBooks() {
        List<Book> hotBooks = list(new LambdaQueryWrapper<Book>()
                .orderByDesc(Book::getBorrowCount)
                .last("limit 10"));
        return hotBooks;
    }


}
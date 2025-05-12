package com.library.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.StringUtils;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.library.common.Constants;
import com.library.common.ResultCode;
import com.library.common.exception.CustomException;
import com.library.entity.Book;
import com.library.entity.BorrowRecord;
import com.library.entity.User;
import com.library.mapper.BorrowRecordMapper;
import com.library.service.BookService;
import com.library.service.BorrowService;
import com.library.service.UserService;
import com.library.vo.BorrowRecordVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 借阅服务实现类
 */
@Slf4j
@Service
public class BorrowServiceImpl extends ServiceImpl<BorrowRecordMapper, BorrowRecord> implements BorrowService {

    @Resource
    private UserService userService;

    @Resource
    private BookService bookService;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public BorrowRecord borrow(Long userId, Long bookId) {
        // 校验用户
        User user = userService.getById(userId);
        if (user == null) {
            throw new CustomException(ResultCode.USER_NOT_EXIST);
        }
        if (user.getCreditScore() >= Constants.MAX_CREDIT_SCORE) {
            throw new CustomException(ResultCode.CREDIT_SCORE_LIMIT);
        }

        // 校验图书
        Book book = bookService.getById(bookId);
        if (book == null) {
            throw new CustomException(ResultCode.BOOK_NOT_EXIST);
        }
        if (book.getStock() <= 0) {
            throw new CustomException(ResultCode.BOOK_STOCK_ERROR);
        }

        // 校验用户借阅数量
        long borrowedCount = count(new LambdaQueryWrapper<BorrowRecord>()
                .eq(BorrowRecord::getUserId, userId)
                .eq(BorrowRecord::getStatus, 0)); // 0-借阅中
        if (borrowedCount >= Constants.MAX_BORROW_BOOKS) {
            throw new CustomException(ResultCode.BORROW_LIMIT_EXCEED);
        }

        // 校验是否已借阅该书
        BorrowRecord existingRecord = getOne(new LambdaQueryWrapper<BorrowRecord>()
                .eq(BorrowRecord::getUserId, userId)
                .eq(BorrowRecord::getBookId, bookId)
                .eq(BorrowRecord::getStatus, 0));
        if (existingRecord != null) {
            throw new CustomException(ResultCode.BOOK_ALREADY_BORROWED);
        }

        // 创建借阅记录
        BorrowRecord borrowRecord = new BorrowRecord();
        borrowRecord.setUserId(userId);
        borrowRecord.setBookId(bookId);
        borrowRecord.setBorrowDate(LocalDateTime.now());
        borrowRecord.setReturnDate(LocalDateTime.now().plusDays(Constants.MAX_BORROW_DAYS));
        borrowRecord.setStatus(0); // 0-借阅中
        borrowRecord.setRenewTimes(0);

        // 保存借阅记录
        save(borrowRecord);

        // 更新图书库存
        bookService.updateStock(bookId, -1);

        return borrowRecord;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean returnBook(Long recordId) {
        // 查询借阅记录
        BorrowRecord borrowRecord = getById(recordId);
        if (borrowRecord == null) {
            throw new CustomException("借阅记录不存在");
        }
        if (borrowRecord.getStatus() != 0) { // 0-借阅中
            throw new CustomException("该书已归还或状态异常");
        }

        // 更新借阅记录状态
        borrowRecord.setStatus(1); // 1-已归还
        borrowRecord.setActualReturnDate(LocalDateTime.now());
        updateById(borrowRecord);

        // 更新图书库存
        bookService.updateStock(borrowRecord.getBookId(), 1);

        // 检查是否逾期，更新用户失信值 (简单示例，可根据实际规则调整)
        if (borrowRecord.getActualReturnDate().isAfter(borrowRecord.getReturnDate())) {
            User user = userService.getById(borrowRecord.getUserId());
            if (user != null && user.getCreditScore() < Constants.MAX_CREDIT_SCORE) {
                user.setCreditScore(user.getCreditScore() + 1);
                userService.updateById(user);
            }
        }
        return true;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean renew(Long recordId) {
        // 查询借阅记录
        BorrowRecord borrowRecord = getById(recordId);
        if (borrowRecord == null || borrowRecord.getStatus() != 0) { // 0-借阅中
            throw new CustomException("借阅记录不存在或状态异常");
        }

        // 检查是否允许续借 (简单示例，可根据实际规则调整)
        if (borrowRecord.getRenewTimes() >= 1) { // 假设最多续借1次
            throw new CustomException(ResultCode.RENEW_NOT_ALLOWED);
        }

        // 更新应还日期和续借次数
        borrowRecord.setReturnDate(borrowRecord.getReturnDate().plusDays(Constants.RENEW_DAYS));
        borrowRecord.setRenewTimes(borrowRecord.getRenewTimes() + 1);
        return updateById(borrowRecord);
    }

    @Override
    public Page<BorrowRecordVO> userBorrows(Page<BorrowRecord> page, Long userId, Integer status) {
        Page<BorrowRecord> recordPage = page(page, new LambdaQueryWrapper<BorrowRecord>()
                .eq(userId != null, BorrowRecord::getUserId, userId)
                .eq(status != null, BorrowRecord::getStatus, status)
                .orderByDesc(BorrowRecord::getBorrowDate));
        return convertToVOPage(recordPage);
    }

    @Override
    public Page<BorrowRecordVO> pageBorrows(Page<BorrowRecord> page, String username, String bookName, Integer status) {
        LambdaQueryWrapper<BorrowRecord> queryWrapper = new LambdaQueryWrapper<>();
        if (StringUtils.isNotBlank(username)) {
            User user = userService.getByUsername(username);
            if (user != null) {
                queryWrapper.eq(BorrowRecord::getUserId, user.getId());
            }
        }
        if (StringUtils.isNotBlank(bookName)) {
            // TODO: 根据书名模糊查询图书ID，然后加入查询条件
            // List<Book> books = bookService.list(new LambdaQueryWrapper<Book>().like(Book::getName, bookName));
            // if (!books.isEmpty()) {
            // queryWrapper.in(BorrowRecord::getBookId, books.stream().map(Book::getId).collect(Collectors.toList()));
            // }
        }
        queryWrapper.eq(status != null, BorrowRecord::getStatus, status);
        queryWrapper.orderByDesc(BorrowRecord::getBorrowDate);

        Page<BorrowRecord> recordPage = page(page, queryWrapper);
        return convertToVOPage(recordPage);
    }

    @Override
    public BorrowRecordVO getBorrowDetail(Long recordId) {
        BorrowRecord record = getById(recordId);
        if (record == null) {
            return null;
        }
        return convertToVO(record);
    }

    private Page<BorrowRecordVO> convertToVOPage(Page<BorrowRecord> recordPage) {
        Page<BorrowRecordVO> voPage = new Page<>(recordPage.getCurrent(), recordPage.getSize(), recordPage.getTotal());
        List<BorrowRecordVO> voList = recordPage.getRecords().stream()
                .map(this::convertToVO)
                .collect(Collectors.toList());
        voPage.setRecords(voList);
        return voPage;
    }

    private BorrowRecordVO convertToVO(BorrowRecord record) {
        BorrowRecordVO vo = new BorrowRecordVO();
        BeanUtils.copyProperties(record, vo);

        // 设置用户信息
        User user = userService.getById(record.getUserId());
        if (user != null) {
            vo.setUsername(user.getUsername());
        }

        // 设置图书信息
        Book book = bookService.getById(record.getBookId());
        if (book != null) {
            vo.setBookName(book.getName());
            vo.setBookAuthor(book.getAuthor());
            vo.setBookCover(book.getCover());
        }

        // 设置状态描述和是否逾期
        switch (record.getStatus()) {
            case 0: vo.setStatusDesc("借阅中"); break;
            case 1: vo.setStatusDesc("已归还"); break;
            case 2: vo.setStatusDesc("逾期未还"); break;
            case 3: vo.setStatusDesc("丢失"); break;
            default: vo.setStatusDesc("未知状态");
        }
        vo.setIsOverdue(record.getStatus() == 0 && record.getReturnDate().isBefore(LocalDateTime.now()));

        return vo;
    }
} 
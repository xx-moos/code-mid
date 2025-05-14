package com.library.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.library.dto.BorrowDTO;
import com.library.entity.BorrowRecord;
import com.library.vo.BorrowRecordVO;

/**
 * 借阅服务接口
 */
public interface BorrowService extends IService<BorrowRecord> {
    /**
     * 借书
     *
     * @param userId 用户ID
     * @param bookId 图书ID
     * @return 借阅记录
     */
    BorrowRecord borrow(Long userId, BorrowDTO borrowDTO);

    /**
     * 还书
     *
     * @param recordId 借阅记录ID
     * @return 是否成功
     */
    boolean returnBook(Long recordId, Integer rating);

    /**
     * 续借
     *
     * @param recordId 借阅记录ID
     * @return 是否成功
     */
    boolean renew(Long recordId);

    /**
     * 查询用户的借阅记录
     *
     * @param page   分页参数
     * @param userId 用户ID
     * @param status 借阅状态
     * @return 分页结果
     */
    Page<BorrowRecordVO> userBorrows(Page<BorrowRecord> page, Long userId, Integer status);

    /**
     * 查询所有借阅记录
     *
     * @param page     分页参数
     * @param username 用户名
     * @param bookName 图书名称
     * @param status   借阅状态
     * @return 分页结果
     */
    Page<BorrowRecordVO> pageBorrows(Page<BorrowRecord> page, String username, String bookName, Integer status);

    /**
     * 获取借阅记录详情
     *
     * @param recordId 借阅记录ID
     * @return 借阅记录详情
     */
    BorrowRecordVO getBorrowDetail(Long recordId);

    /**
     * 审核借阅申请
     *
     * @param id 借阅记录ID
     * @return 是否成功
     */
    boolean audit(Long id);
} 
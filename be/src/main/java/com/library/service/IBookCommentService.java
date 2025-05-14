package com.library.service;

import com.library.dto.BookCommentAddDTO;
import com.library.dto.BookCommentPageQueryDTO;
import com.library.dto.BookCommentUpdateDTO;
import com.library.entity.BookComment;
import com.baomidou.mybatisplus.extension.service.IService;
import com.library.vo.BookCommentVO;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

import java.util.List;

/**
 * <p>
 * 图书评论表 服务类
 * </p>
 *
 * @author AI Assistant
 * @since [当前日期]
 */
public interface IBookCommentService extends IService<BookComment> {

    /**
     * 添加评论
     * @param addDTO 评论信息
     */
    void addComment(BookCommentAddDTO addDTO);

    /**
     * 修改评论
     * @param updateDTO 评论信息
     */
    void updateComment(BookCommentUpdateDTO updateDTO);

    /**
     * 删除评论
     * @param commentId 评论ID
     */
    void deleteComment(Long commentId);

    /**
     * 分页查询图书评论
     * @param queryDTO 查询参数
     * @return 分页评论数据
     */
    Page<BookCommentVO> getBookCommentsPage(BookCommentPageQueryDTO queryDTO);

    /**
     * 点赞评论
     * @param commentId 评论ID
     */
    void likeComment(Long commentId);

    /**
     * 取消点赞评论
     * @param commentId 评论ID
     */
    void unlikeComment(Long commentId); // 可选实现

    /**
     * 审核评论
     * @param commentId 评论ID
     * @param status 状态
     */
    void auditComment(Long commentId, Integer status);

    Page<BookCommentVO> getAllComments(BookCommentPageQueryDTO queryDTO);
}
package com.library.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.library.common.Result;
import com.library.dto.BookCommentAddDTO;
import com.library.dto.BookCommentPageQueryDTO;
import com.library.dto.BookCommentUpdateDTO;
import com.library.service.IBookCommentService;
import com.library.vo.BookCommentVO;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.validation.Valid;

@Api(tags = "图书评论管理")
@RestController
@RequestMapping("/api/book-comment") // 根据项目规范调整API前缀, e.g., /api/v1/book-comment
@Slf4j
public class BookCommentController {

    @Resource
    private IBookCommentService bookCommentService;

    @ApiOperation("添加图书评论")
    @PostMapping
    public Result<Void> addComment(@Valid @RequestBody BookCommentAddDTO addDTO) {
        bookCommentService.addComment(addDTO);
        return Result.success();
    }

    @ApiOperation("修改图书评论")
    @PutMapping
    public Result<Void> updateComment(@Valid @RequestBody BookCommentUpdateDTO updateDTO) {
        bookCommentService.updateComment(updateDTO);
        return Result.success();
    }

    @ApiOperation("删除图书评论")
    @DeleteMapping("/{commentId}")
    public Result<Void> deleteComment(@PathVariable Long commentId) {
        bookCommentService.deleteComment(commentId);
        return Result.success();
    }

    @ApiOperation("分页查询图书评论")
    @GetMapping("/page")
    public Result<Page<BookCommentVO>> getBookCommentsPage(@Valid BookCommentPageQueryDTO queryDTO) {
        Page<BookCommentVO> pageData = bookCommentService.getBookCommentsPage(queryDTO);
        return Result.success(pageData);
    }

    @ApiOperation("点赞评论")
    @PostMapping("/{commentId}/like")
    public Result<Void> likeComment(@PathVariable Long commentId) {
        bookCommentService.likeComment(commentId);
        return Result.success();
    }

    @ApiOperation("取消点赞评论")
    @PostMapping("/{commentId}/unlike") // 使用POST或者DELETE均可，根据RESTful偏好选择
    public Result<Void> unlikeComment(@PathVariable Long commentId) {
        bookCommentService.unlikeComment(commentId);
        return Result.success();
    }

    @ApiOperation("审核评论")
    @GetMapping("/audit/{commentId}")
    public Result<Void> auditComment(@PathVariable Long commentId, @RequestParam Integer status) {
        bookCommentService.auditComment(commentId, status);
        return Result.success();
    }


} 
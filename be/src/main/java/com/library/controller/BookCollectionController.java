package com.library.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.library.common.Result;
import com.library.dto.BookCollectionAddDTO;
import com.library.entity.BookCollection;
import com.library.service.IBookCollectionService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.validation.Valid;

/**
 * 图书收藏控制器
 */
@Slf4j
@Api(tags = "图书收藏管理")
@RestController
@RequestMapping("/book-collection") // 保持和计划一致，使用 /api 前缀
public class BookCollectionController {

    @Resource
    private IBookCollectionService bookCollectionService;

    @ApiOperation("添加收藏")
    @PostMapping
    public Result<Void> addCollection(@Valid @RequestBody BookCollectionAddDTO dto) {
        boolean success = bookCollectionService.addCollection(dto.getBookId());
        return success ? Result.success() : Result.failed();
    }

    @ApiOperation("取消收藏")
    @DeleteMapping("/{bookId}")
    public Result<Void> removeCollection(@ApiParam("图书ID") @PathVariable Long bookId) {
        boolean success = bookCollectionService.removeCollection(bookId);
        return success ? Result.success() : Result.failed();
    }

    @ApiOperation("查询我的收藏列表")
    @GetMapping("/my")
    public Result<Page<BookCollection>> listMyCollections(
            @ApiParam("页码") @RequestParam(defaultValue = "1") Integer current,
            @ApiParam("每页条数") @RequestParam(defaultValue = "10") Integer size) {
        Page<BookCollection> page = new Page<>(current, size);
        Page<BookCollection> resultPage = bookCollectionService.listMyCollections(page);
        return Result.success(resultPage);
    }

    @ApiOperation("检查图书是否已收藏")
    @GetMapping("/is-collected/{bookId}")
    public Result<Boolean> isBookCollected(@ApiParam("图书ID") @PathVariable Long bookId) {
        boolean collected = bookCollectionService.isBookCollected(bookId);
        return Result.success(collected);
    }
} 
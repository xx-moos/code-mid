package com.library.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.library.common.Result;
import com.library.entity.Book;
import com.library.service.BookService;
import com.library.service.IBookCategoryService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import javax.validation.Valid;

/**
 * 图书控制器
 */
@Slf4j
@Api(tags = "图书管理")
@RestController
@RequestMapping("/book")
public class BookController {

  @Resource
  private BookService bookService;

  @Resource
  private IBookCategoryService bookCategoryService;

  @ApiOperation("分页查询图书")
  @GetMapping("/page")
  public Result<Page<Book>> page(
      @ApiParam("页码") @RequestParam(defaultValue = "1") Integer current,
      @ApiParam("每页条数") @RequestParam(defaultValue = "10") Integer size,
      @ApiParam("图书名称") @RequestParam(required = false) String name,
      @ApiParam("作者") @RequestParam(required = false) String author,
      @ApiParam("分类") @RequestParam(required = false) String category) {
    Page<Book> page = bookService.pageBooks(new Page<>(current, size), name, author, category);
    return Result.success(page);
  }

  @ApiOperation("根据ID查询图书")
  @GetMapping("/{id}")
  public Result<Object> getById(@PathVariable Long id) {
    Book book = bookService.getById(id);
    if (book != null) {
      book.setCategoryName(bookCategoryService.getCategoryName(book.getCategory()));
    }
    return book != null ? Result.success(book) : Result.failed("图书不存在");
  }

  @ApiOperation("新增图书")
  @PostMapping
//  @PreAuthorize("hasRole('ADMIN')")
  public Result<Void> save(@Valid @RequestBody Book book) {
    boolean result = bookService.save(book);
    return result ? Result.success() : Result.failed("新增图书失败");
  }

  @ApiOperation("修改图书")
  @PutMapping
//  @PreAuthorize("hasRole('ADMIN')")
  public Result<Void> update(@Valid @RequestBody Book book) {
    boolean result = bookService.updateById(book);
    return result ? Result.success() : Result.failed("修改图书失败");
  }

  @ApiOperation("删除图书")
  @DeleteMapping("/{id}")
//  @PreAuthorize("hasRole('ADMIN')")
  public Result<Void> delete(@PathVariable Long id) {
    boolean result = bookService.removeById(id);
    return result ? Result.success() : Result.failed("删除图书失败");
  }

  @ApiOperation("更新图书库存")
  @PutMapping("/stock/{id}")
//  @PreAuthorize("hasRole('ADMIN')")
  public Result<Void> updateStock(
      @ApiParam("图书ID") @PathVariable Long id,
      @ApiParam("库存变化量（正数增加，负数减少）") @RequestParam Integer stock) {
    boolean result = bookService.updateStock(id, stock);
    return result ? Result.success() : Result.failed("更新库存失败");
  }

}
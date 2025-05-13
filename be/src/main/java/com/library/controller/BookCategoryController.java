package com.library.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.library.common.Result;
import com.library.dto.BookCategoryCreateDTO;
import com.library.dto.BookCategoryQueryDTO;
import com.library.dto.BookCategoryUpdateDTO;
import com.library.entity.BookCategory;
import com.library.service.IBookCategoryService;
import com.library.vo.BookCategoryVO;

import io.swagger.annotations.Api;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.List;
import java.util.Objects;

/**
 * 图书分类接口
 *
 * @author AI Assistant
 */
@Api(tags = "图书分类管理")
@RestController
@RequestMapping("/categories") // 定义基础路径
@RequiredArgsConstructor
public class BookCategoryController {

    private final IBookCategoryService bookCategoryService;

    /**
     * 获取图书分类列表（扁平结构）
     *
     * @param queryDTO 查询条件 (可以包含 name, code 等)
     * @return 统一响应结果，包含分类VO列表
     */
    @GetMapping("/list") // 使用 /list 路径
    public Result<List<BookCategoryVO>> getCategoryList(BookCategoryQueryDTO queryDTO) {
        List<BookCategoryVO> list = bookCategoryService.getCategoryList(queryDTO);
        return Result.success(list); // 使用 Result.success 包装
    }

    /* 
     * 分页查询
     */

     @GetMapping("/page")
     public Result<Page<BookCategoryVO>> getCategoryPage(BookCategoryQueryDTO queryDTO) {
        Page<BookCategoryVO> page = bookCategoryService.getCategoryPage(queryDTO);
        return Result.success(page);
     }

    /**
     * 根据 ID 获取图书分类详情
     *
     * @param id 分类ID
     * @return 统一响应结果，包含分类实体或错误信息
     */
    @GetMapping("/{id}")
    public Result<BookCategory> getCategoryById(@PathVariable Long id) {
        BookCategory category = bookCategoryService.getCategoryById(id);
        return category != null ? Result.success(category) : Result.failed("分类不存在");
    }

    /**
     * 创建新的图书分类
     *
     * @param createDTO 图书分类创建 DTO
     * @return 统一响应结果 (成功或失败)
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Result<Void> createCategory(@Valid @RequestBody BookCategoryCreateDTO createDTO) {
        boolean success = bookCategoryService.createCategory(createDTO);
        return success ? Result.success() : Result.failed("创建分类失败");
    }

    /**
     * 更新图书分类
     *
     * @param id        路径中的分类 ID
     * @param updateDTO 图书分类更新 DTO
     * @return 统一响应结果 (成功或失败)
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Result<Void> updateCategory(@PathVariable Long id, @Valid @RequestBody BookCategoryUpdateDTO updateDTO) {
        if (!Objects.equals(id, updateDTO.getId())) {
            return Result.failed("路径ID与请求体ID不一致");
        }
        boolean success = bookCategoryService.updateCategory(updateDTO);
        return success ? Result.success() : Result.failed("更新分类失败");
    }

    /**
     * 删除图书分类
     *
     * @param id 要删除的分类 ID
     * @return 统一响应结果 (成功或失败)
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Result<Void> deleteCategory(@PathVariable Long id) {
        boolean success = bookCategoryService.deleteCategory(id);
        return success ? Result.success() : Result.failed("删除分类失败");
    }


} 
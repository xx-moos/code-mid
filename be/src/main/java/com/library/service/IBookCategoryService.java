package com.library.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.library.dto.BookCategoryCreateDTO;
import com.library.dto.BookCategoryQueryDTO;
import com.library.dto.BookCategoryUpdateDTO;
import com.library.entity.BookCategory;
import com.library.vo.BookCategoryVO;

import java.util.List;

/**
 * 图书分类服务接口
 *
 * @author AI Assistant
 */
public interface IBookCategoryService {

    /**
     * 获取图书分类列表（扁平结构）
     *
     * @param queryDTO 查询条件
     * @return 分类 VO 列表
     */
    List<BookCategoryVO> getCategoryList(BookCategoryQueryDTO queryDTO);


    /**
     * 分页查询
     *
     * @param queryDTO 查询条件
     * @return 分类 VO 列表
     */
    Page<BookCategoryVO> getCategoryPage(BookCategoryQueryDTO queryDTO);

    /**
     * 根据 ID 获取图书分类详情
     *
     * @param id 分类ID
     * @return 分类实体，如果不存在则返回 null 或抛出异常
     */
    BookCategory getCategoryById(Long id);

    /**
     * 创建图书分类
     *
     * @param createDTO 创建 DTO
     * @return 是否创建成功
     */
    boolean createCategory(BookCategoryCreateDTO createDTO);

    /**
     * 更新图书分类
     *
     * @param updateDTO 更新 DTO
     * @return 是否更新成功
     */
    boolean updateCategory(BookCategoryUpdateDTO updateDTO);

    /**
     * 删除图书分类（逻辑删除）
     *
     * @param id 要删除的分类ID
     * @return 是否删除成功
     */
    boolean deleteCategory(Long id);

    String getCategoryName(String category);
} 
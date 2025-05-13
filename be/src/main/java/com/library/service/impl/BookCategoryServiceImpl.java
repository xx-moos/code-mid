package com.library.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.library.dto.BookCategoryCreateDTO;
import com.library.dto.BookCategoryQueryDTO;
import com.library.dto.BookCategoryUpdateDTO;
import com.library.entity.Book;
import com.library.entity.BookCategory;
import com.library.mapper.BookCategoryMapper;
import com.library.mapper.BookMapper;
import com.library.service.IBookCategoryService;
import com.library.vo.BookCategoryVO;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

import java.util.Objects;

/**
 * 图书分类服务实现类
 *
 * @author AI Assistant
 */
@Service
@RequiredArgsConstructor
public class BookCategoryServiceImpl implements IBookCategoryService {

  private final BookCategoryMapper bookCategoryMapper;
  private final BookMapper bookMapper; // 添加 BookMapper 依赖

  @Override
  public List<BookCategoryVO> getCategoryList(BookCategoryQueryDTO queryDTO) {
    LambdaQueryWrapper<BookCategory> wrapper = new LambdaQueryWrapper<>();

    // 添加查询条件
    wrapper.like(StringUtils.hasText(queryDTO.getName()), BookCategory::getName, queryDTO.getName());
    wrapper.eq(StringUtils.hasText(queryDTO.getCode()), BookCategory::getCode, queryDTO.getCode());

    // 添加排序
    wrapper.orderByAsc(BookCategory::getSort).orderByAsc(BookCategory::getId);

    List<BookCategory> categories = bookCategoryMapper.selectList(wrapper);

    // 转换成 VO
    return categories.stream().map(category -> {
      BookCategoryVO vo = new BookCategoryVO();
      BeanUtils.copyProperties(category, vo);
      return vo;
    }).collect(Collectors.toList());
  }

  @Override
  public BookCategory getCategoryById(Long id) {
    // BaseMapper 的 selectById 会自动处理 @TableLogic
    return bookCategoryMapper.selectById(id);
  }

  @Override
  public boolean createCategory(BookCategoryCreateDTO createDTO) {
    // 1. 检查 Code 是否唯一
    LambdaQueryWrapper<BookCategory> wrapper = new LambdaQueryWrapper<>();
    wrapper.eq(BookCategory::getCode, createDTO.getCode());
    // selectCount 会自动处理 @TableLogic
    Long count = bookCategoryMapper.selectCount(wrapper);
    if (count > 0) {
      // throw new BusinessException(ResultCodeEnum.CATEGORY_CODE_EXISTS);
      throw new IllegalArgumentException("分类编码 '" + createDTO.getCode() + "' 已存在");
    }

    BookCategory category = new BookCategory();
    BeanUtils.copyProperties(createDTO, category);

    // 2. 处理 parentId 和 level
    Long parentId = createDTO.getParentId();
    if (parentId != null && parentId > 0) {
      BookCategory parentCategory = this.getCategoryById(parentId);
      if (parentCategory == null) {
        throw new IllegalArgumentException("指定的父分类ID '" + parentId + "' 不存在");
      }
      category.setLevel(parentCategory.getLevel() + 1);
      category.setParentId(parentId); // 确保设置了 parentId
    } else {
      category.setLevel(1); // 顶级分类
      category.setParentId(null); // 顶级分类的 parentId 为 null
    }

    // 3. 插入数据库
    int insertedRows = bookCategoryMapper.insert(category);

    return insertedRows > 0;
  }

  @Override
  public boolean updateCategory(BookCategoryUpdateDTO updateDTO) {
    // 1. 检查分类是否存在
    BookCategory existingCategory = this.getCategoryById(updateDTO.getId());
    if (existingCategory == null) {
      throw new IllegalArgumentException("要更新的分类ID '" + updateDTO.getId() + "' 不存在");
    }

    // 2. 检查 Code 是否与 其他 分类冲突
    if (StringUtils.hasText(updateDTO.getCode()) && !Objects.equals(updateDTO.getCode(), existingCategory.getCode())) {
      LambdaQueryWrapper<BookCategory> wrapper = new LambdaQueryWrapper<>();
      wrapper.eq(BookCategory::getCode, updateDTO.getCode());
      wrapper.ne(BookCategory::getId, updateDTO.getId()); // 排除自身
      Long count = bookCategoryMapper.selectCount(wrapper);
      if (count > 0) {
        // throw new BusinessException(ResultCodeEnum.CATEGORY_CODE_EXISTS);
        throw new IllegalArgumentException("分类编码 '" + updateDTO.getCode() + "' 已被其他分类使用");
      }
    }

    BookCategory categoryToUpdate = new BookCategory();
    BeanUtils.copyProperties(updateDTO, categoryToUpdate);

    // 3. 处理 parentId 和 level
    Long parentId = updateDTO.getParentId();
    if (parentId != null && parentId > 0) {
      // 检查 parentId 是否是自身，防止循环引用
      if (Objects.equals(parentId, categoryToUpdate.getId())) {
        throw new IllegalArgumentException("父分类不能设置为自身");
      }
      BookCategory parentCategory = this.getCategoryById(parentId);
      if (parentCategory == null) {
        // throw new BusinessException(ResultCodeEnum.PARENT_CATEGORY_NOT_FOUND);
        throw new IllegalArgumentException("指定的父分类ID '" + parentId + "' 不存在");
      }
      categoryToUpdate.setLevel(parentCategory.getLevel() + 1);
      // parentId 已经通过 copyProperties 设置了
    } else if (parentId == null || parentId == 0) { // 明确设置为顶级分类
      categoryToUpdate.setLevel(1);
      categoryToUpdate.setParentId(null); // 顶级分类的 parentId 为 null
    } else { // parentId 没有在 DTO 中提供，保持原样
      categoryToUpdate.setLevel(existingCategory.getLevel());
      categoryToUpdate.setParentId(existingCategory.getParentId());
    }

    // 4. 更新数据库
    // updateById 会自动处理 @TableLogic 和填充 update_time
    int updatedRows = bookCategoryMapper.updateById(categoryToUpdate);

    return updatedRows > 0;
  }

  @Override
  public boolean deleteCategory(Long id) {
    // 1. 检查分类是否存在
    BookCategory categoryToDelete = this.getCategoryById(id);
    if (categoryToDelete == null) {
      // throw new BusinessException(ResultCodeEnum.CATEGORY_NOT_FOUND);
      throw new IllegalArgumentException("要删除的分类ID '" + id + "' 不存在");
    }

    // 2. 检查是否有子分类
    LambdaQueryWrapper<BookCategory> childWrapper = new LambdaQueryWrapper<>();
    childWrapper.eq(BookCategory::getParentId, id);
    Long childCount = bookCategoryMapper.selectCount(childWrapper);
    if (childCount > 0) {
      // throw new BusinessException(ResultCodeEnum.CATEGORY_HAS_CHILDREN);
      throw new IllegalArgumentException("分类 '" + categoryToDelete.getName() + "' 下存在子分类，无法删除");
    }

    // 3. 检查是否关联了图书
    // todo
    LambdaQueryWrapper<Book> bookWrapper = new LambdaQueryWrapper<>();
    bookWrapper.eq(Book::getCategory, categoryToDelete.getName());
    Long bookCount = bookMapper.selectCount(bookWrapper);
    if (bookCount > 0) {
      // throw new BusinessException(ResultCodeEnum.CATEGORY_HAS_BOOKS);
      throw new IllegalArgumentException("分类 '" + categoryToDelete.getName() + "' 下关联了图书，无法删除");
    }

    // 4. 删除
    int deletedRows = bookCategoryMapper.deleteById(id);

    return deletedRows > 0;
  }

  @Override
  public Page<BookCategoryVO> getCategoryPage(BookCategoryQueryDTO queryDTO) {
    Page<BookCategory> pageRequest = new Page<>(queryDTO.getCurrent(), queryDTO.getSize());
    // 添加查询条件
    LambdaQueryWrapper<BookCategory> wrapper = new LambdaQueryWrapper<>();
    wrapper.like(StringUtils.hasText(queryDTO.getName()), BookCategory::getName, queryDTO.getName());
    wrapper.eq(StringUtils.hasText(queryDTO.getCode()), BookCategory::getCode, queryDTO.getCode());
    wrapper.orderByAsc(BookCategory::getSort).orderByAsc(BookCategory::getId);

    Page<BookCategory> categoryPage = bookCategoryMapper.selectPage(pageRequest, wrapper); // 应用查询条件

    // 手动转换记录
    List<BookCategoryVO> voList = categoryPage.getRecords().stream().map(category -> {
      BookCategoryVO vo = new BookCategoryVO();
      BeanUtils.copyProperties(category, vo);
      return vo;
    }).collect(Collectors.toList());

    // 创建新的 Page<BookCategoryVO>
    Page<BookCategoryVO> voPage = new Page<>(categoryPage.getCurrent(), categoryPage.getSize(), categoryPage.getTotal());
    voPage.setRecords(voList);

    return voPage;
  }
}
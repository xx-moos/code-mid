package com.library.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.library.common.Constants;
import com.library.dto.BookCategoryCreateDTO;
import com.library.dto.BookCategoryQueryDTO;
import com.library.dto.BookCategoryUpdateDTO;
import com.library.entity.Book;
import com.library.entity.BookCategory;
import com.library.mapper.BookCategoryMapper;
import com.library.mapper.BookMapper;
import com.library.service.IBookCategoryService;
import com.library.utils.RedisUtil;
import com.library.vo.BookCategoryVO;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

import javax.annotation.Resource;

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

  @Resource
  private RedisUtil redisUtil;

  private static final Logger logger = LoggerFactory.getLogger(BookCategoryServiceImpl.class);

  @Override
  public List<BookCategoryVO> getCategoryList(BookCategoryQueryDTO queryDTO) {
    // 1. 动态缓存键生成
    StringBuilder keyBuilder = new StringBuilder(Constants.BOOK_CATEGORY_PREFIX);
    boolean hasName = StringUtils.hasText(queryDTO.getName());
    boolean hasCode = StringUtils.hasText(queryDTO.getCode());

    if (hasName) {
      keyBuilder.append(":name=").append(queryDTO.getName());
    }
    if (hasCode) {
      keyBuilder.append(":code=").append(queryDTO.getCode());
    }
    if (!hasName && !hasCode) {
      keyBuilder.append(":all");
    }
    String redisKey = keyBuilder.toString();

    // 2. 尝试从 Redis 读取缓存
    List<BookCategory> cachedCategories = null;
    try {
      // 假设 redisUtil.get 返回的是 List<BookCategory> 或可转换为 List<BookCategory> 的对象
      // 如果 RedisUtil 返回的是 JSON 字符串，则需要进行反序列化
      // e.g., using Jackson:
      // String cachedJson = (String) redisUtil.get(redisKey);
      // if (StringUtils.hasText(cachedJson)) {
      //   ObjectMapper objectMapper = new ObjectMapper(); // 需要注入或静态化
      //   cachedCategories = objectMapper.readValue(cachedJson, new TypeReference<List<BookCategory>>() {});
      // }
      // 为简化，我们先直接尝试强转，实际项目中应根据 RedisUtil 的具体实现调整
      Object rawCachedObject = redisUtil.get(redisKey);
      if (rawCachedObject instanceof List) {
          // 进行类型安全的转换，避免 ClassCastException
          // 这仍然是一个简化的假设，实际中可能需要更复杂的反序列化逻辑
          // 特别是当 List 元素是自定义对象时，泛型信息在运行时会被擦除
          // 一个更健壮的方式是 redisUtil 提供类似 getList(key, ElementType.class) 的方法
          // 或者如上注释中所示，使用JSON库配合TypeReference
          cachedCategories = (List<BookCategory>) rawCachedObject;

          // 确保列表中的元素确实是 BookCategory 类型 (进一步的运行时检查, 可选但更安全)
          // if (cachedCategories != null && !cachedCategories.isEmpty()) {
          //    if (!(cachedCategories.get(0) instanceof BookCategory)) {
          //        logger.warn("Cached object for key '{}' is a list but not of BookCategory. Cache will be ignored.", redisKey);
          //        cachedCategories = null; //  如果类型不匹配则忽略缓存
          //    }
          // }
      }
    } catch (Exception e) {
      logger.error("Error retrieving from Redis cache for key '{}': {}", redisKey, e.getMessage(), e);
      // 发生异常时，表现为缓存未命中
      cachedCategories = null;
    }

    // 3. 缓存命中处理
    if (cachedCategories != null && !cachedCategories.isEmpty()) {
      logger.info("Cache hit for key: {}", redisKey);
      // 转换成 VO
      return cachedCategories.stream().map(category -> {
        BookCategoryVO vo = new BookCategoryVO();
        BeanUtils.copyProperties(category, vo);
        return vo;
      }).collect(Collectors.toList());
    }

    logger.info("Cache miss for key: {}. Fetching from database.", redisKey);
    // 4. 缓存未命中处理 (现有逻辑)
    LambdaQueryWrapper<BookCategory> wrapper = new LambdaQueryWrapper<>();

    // 添加查询条件
    wrapper.like(hasName, BookCategory::getName, queryDTO.getName());
    wrapper.eq(hasCode, BookCategory::getCode, queryDTO.getCode());

    // 添加排序
    wrapper.orderByAsc(BookCategory::getSort).orderByAsc(BookCategory::getId);

    List<BookCategory> categories = bookCategoryMapper.selectList(wrapper);

    // 5. 将数据库查询结果存入 Redis
    // String redisKey = Constants.BOOK_CATEGORY_PREFIX; // 旧的静态键，已被新的动态 redisKey 替代
    if (categories != null && !categories.isEmpty()) {
        try {
            redisUtil.set(redisKey, categories); // 使用动态生成的 redisKey
            logger.info("Stored data in cache for key: {}", redisKey);
        } catch (Exception e) {
            logger.error("Error storing to Redis cache for key '{}': {}", redisKey, e.getMessage(), e);
        }
    }


    // 6. 转换成 VO
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
    Page<BookCategoryVO> voPage = new Page<>(categoryPage.getCurrent(), categoryPage.getSize(),
        categoryPage.getTotal());
    voPage.setRecords(voList);

    return voPage;
  }
}
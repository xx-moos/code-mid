package com.library.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.library.entity.Book;
import org.apache.ibatis.annotations.Mapper;

/**
 * 图书Mapper接口
 */
@Mapper
public interface BookMapper extends BaseMapper<Book> {
} 
package com.library.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.library.entity.BookCollection;
import org.apache.ibatis.annotations.Mapper;

/**
 * 图书收藏Mapper接口
 */
@Mapper
public interface BookCollectionMapper extends BaseMapper<BookCollection> {
} 
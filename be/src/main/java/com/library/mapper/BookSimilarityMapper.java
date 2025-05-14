package com.library.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.library.entity.BookSimilarity;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 图书相似度Mapper接口
 */
@Mapper
public interface BookSimilarityMapper extends BaseMapper<BookSimilarity> {


    /**
     * 清空图书相似度表中的所有数据。
     */
    @Delete("DELETE FROM book_similarity")
    void deleteAllRecords();

} 
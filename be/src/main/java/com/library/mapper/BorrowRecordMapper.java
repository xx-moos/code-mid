package com.library.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.library.entity.BorrowRecord;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

/**
 * 借阅记录Mapper接口
 */
@Mapper
public interface BorrowRecordMapper extends BaseMapper<BorrowRecord> {

    /**
     * 根据图书ID查询平均评分 (1-5分制)
     * @param bookId 图书ID
     * @return 平均评分，如果没有评分记录则返回null
     */
    @Select("SELECT AVG(rating) FROM borrow_record WHERE book_id = #{bookId} AND rating IS NOT NULL")
    Double selectAverageRatingByBookId(@Param("bookId") Long bookId);
} 
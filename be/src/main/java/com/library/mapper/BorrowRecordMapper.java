package com.library.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.library.entity.BorrowRecord;
import org.apache.ibatis.annotations.Mapper;

/**
 * 借阅记录Mapper接口
 */
@Mapper
public interface BorrowRecordMapper extends BaseMapper<BorrowRecord> {
} 
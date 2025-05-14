package com.library.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.library.entity.Announcement;
import org.apache.ibatis.annotations.Param;
import java.util.List;

public interface AnnouncementMapper extends BaseMapper<Announcement> {

    /**
     * 查询已发布且未删除的公告列表（分页）
     * @param offset 偏移量
     * @param limit 数量
     * @return 公告列表
     */
    List<Announcement> findPublishedAnnouncements(@Param("offset") int offset, @Param("limit") int limit);

    /**
     * 统计已发布且未删除的公告数量
     * @return 数量
     */
    long countPublishedAnnouncements();

    /**
     * 根据ID查询已发布且未删除的公告详情
     * @param id 公告ID
     * @return 公告实体
     */
    Announcement findPublishedById(@Param("id") Long id);


}
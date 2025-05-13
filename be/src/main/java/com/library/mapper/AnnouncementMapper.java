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

    // 管理员相关的查询可以更灵活，如果需要复杂筛选，可以额外传递 DTO
    // MyBatis-Plus 的 Wrapper 也提供了强大的动态SQL构建能力，很多场景下可以不用手写XML

    // 示例：如果需要管理员查询（包括已撤回但未删除的）
    // List<Announcement> findAdminAnnouncements(@Param("offset") int offset, @Param("limit") int limit /*, @Param("filter") AdminAnnouncementFilterDTO filter*/);
    // long countAdminAnnouncements(/*@Param("filter") AdminAnnouncementFilterDTO filter*/);
} 
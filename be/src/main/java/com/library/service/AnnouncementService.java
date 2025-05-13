package com.library.service;

import com.library.dto.AnnouncementCreateDTO;
import com.library.dto.AnnouncementUpdateDTO;
import com.library.dto.PageQueryDTO;
import com.library.vo.AnnouncementAdminVO;
import com.library.vo.AnnouncementPublicVO;
import com.library.vo.PageVO;

public interface AnnouncementService {

    /**
     * 获取已发布的公告列表（分页，供读者查看）
     * @param queryDTO 分页参数
     * @return 分页后的公告列表
     */
    PageVO<AnnouncementPublicVO> getPublishedAnnouncements(PageQueryDTO queryDTO);

    /**
     * 根据ID获取已发布的公告详情（供读者查看）
     * @param id 公告ID
     * @return 公告详情，如果未找到或未发布则抛出异常或返回null
     */
    AnnouncementPublicVO getPublishedAnnouncementById(Long id);

    /**
     * 创建新公告（管理员操作）
     * @param createDTO 公告创建信息
     * @param adminUserId 当前操作的管理员ID
     * @return 创建后的公告信息（管理员视图）
     */
    AnnouncementAdminVO createAnnouncement(AnnouncementCreateDTO createDTO, Long adminUserId);

    /**
     * 更新公告（管理员操作）
     * @param id 要更新的公告ID
     * @param updateDTO 公告更新信息
     * @param adminUserId 当前操作的管理员ID
     * @return 更新后的公告信息（管理员视图）
     */
    AnnouncementAdminVO updateAnnouncement(Long id, AnnouncementUpdateDTO updateDTO, Long adminUserId);

    /**
     * 删除公告（逻辑删除，管理员操作）
     * @param id 要删除的公告ID
     * @param adminUserId 当前操作的管理员ID
     */
    void deleteAnnouncement(Long id, Long adminUserId);

    /**
     * 获取公告列表（分页，管理员视角，可包含筛选条件）
     * @param queryDTO 分页参数
     * @return 分页后的公告列表（管理员视图）
     */
    PageVO<AnnouncementAdminVO> getAdminAnnouncements(PageQueryDTO queryDTO );

    /**
     * 根据ID获取公告详情（管理员视角）
     * @param id 公告ID
     * @return 公告详情（管理员视图）
     */
    AnnouncementAdminVO getAdminAnnouncementById(Long id);
} 
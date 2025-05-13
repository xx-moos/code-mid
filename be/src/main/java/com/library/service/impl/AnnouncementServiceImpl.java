package com.library.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.library.dto.AnnouncementCreateDTO;
import com.library.dto.AnnouncementUpdateDTO;
import com.library.dto.PageQueryDTO;
import com.library.entity.Announcement;
import com.library.mapper.AnnouncementMapper;
import com.library.service.AnnouncementService;
import com.library.vo.AnnouncementAdminVO;
import com.library.vo.AnnouncementPublicVO;
import com.library.vo.PageVO;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AnnouncementServiceImpl implements AnnouncementService {

    private final AnnouncementMapper announcementMapper;

    @Override
    public PageVO<AnnouncementPublicVO> getPublishedAnnouncements(PageQueryDTO queryDTO) {
        int offset = (queryDTO.getPage() - 1) * queryDTO.getSize();
        List<Announcement> announcements = announcementMapper.findPublishedAnnouncements(offset, queryDTO.getSize());
        long total = announcementMapper.countPublishedAnnouncements();

        List<AnnouncementPublicVO> vos = announcements.stream().map(announcement -> {
            AnnouncementPublicVO vo = new AnnouncementPublicVO();
            BeanUtils.copyProperties(announcement, vo);
            return vo;
        }).collect(Collectors.toList());

        return new PageVO<>(vos, total);
    }

    @Override
    public AnnouncementPublicVO getPublishedAnnouncementById(Long id) {
        Announcement announcement = announcementMapper.findPublishedById(id);
        if (announcement == null) {
            // 可以定义自定义异常，例如 ResourceNotFoundException
            throw new RuntimeException("公告不存在或未发布");
        }
        AnnouncementPublicVO vo = new AnnouncementPublicVO();
        BeanUtils.copyProperties(announcement, vo);
        return vo;
    }

    @Override
    @Transactional
    public AnnouncementAdminVO createAnnouncement(AnnouncementCreateDTO createDTO, Long adminUserId) {
        Announcement announcement = new Announcement();
        BeanUtils.copyProperties(createDTO, announcement);
        announcement.setPublisherId(adminUserId);
        // status 和 deleted 字段以及时间字段会由MyBatis-Plus的fill策略或数据库默认值处理，
        // 但也可以在这里显式设置初始值，确保行为一致性。
        announcement.setStatus(0); // 默认发布
        // announcement.setDeleted(0); // 由@TableLogic和fill处理
        // announcement.setCreateTime(LocalDateTime.now()); // 由fill处理
        // announcement.setUpdateTime(LocalDateTime.now()); // 由fill处理

        announcementMapper.insert(announcement);

        AnnouncementAdminVO vo = new AnnouncementAdminVO();
        BeanUtils.copyProperties(announcement, vo);
        return vo;
    }

    @Override
    @Transactional
    public AnnouncementAdminVO updateAnnouncement(Long id, AnnouncementUpdateDTO updateDTO, Long adminUserId) {
        Announcement existingAnnouncement = announcementMapper.selectById(id);
        if (existingAnnouncement == null || existingAnnouncement.getDeleted() == 1) {
            throw new RuntimeException("要更新的公告不存在");
        }

        // 检查操作权限，例如是否是发布者或特定角色的管理员，此处简化

        BeanUtils.copyProperties(updateDTO, existingAnnouncement, "id"); // "id" 避免被覆盖
        // existingAnnouncement.setUpdateTime(LocalDateTime.now()); // 由fill处理

        announcementMapper.updateById(existingAnnouncement);

        AnnouncementAdminVO vo = new AnnouncementAdminVO();
        BeanUtils.copyProperties(existingAnnouncement, vo);
        return vo;
    }

    @Override
    @Transactional
    public void deleteAnnouncement(Long id, Long adminUserId) {
        Announcement existingAnnouncement = announcementMapper.selectById(id);
        if (existingAnnouncement == null || existingAnnouncement.getDeleted() == 1) {
            // 已经删除或不存在，可以不抛异常，幂等处理
            return;
        }
        // 检查操作权限

        // 由于有 @TableLogic, deleteById 会执行逻辑删除
        announcementMapper.deleteById(id);
    }

    @Override
    public PageVO<AnnouncementAdminVO> getAdminAnnouncements(PageQueryDTO queryDTO) {
        Page<Announcement> page = new Page<>(queryDTO.getPage(), queryDTO.getSize());
        // 管理员查看所有未逻辑删除的公告，可以按更新时间倒序
        QueryWrapper<Announcement> queryWrapper = new QueryWrapper<Announcement>()
                .orderByDesc("update_time");

        if (queryDTO.getTitle() != null) {
            queryWrapper.like("title", queryDTO.getTitle());
        }

        Page<Announcement> announcementPage = announcementMapper.selectPage(page, queryWrapper);

        List<AnnouncementAdminVO> vos = announcementPage.getRecords().stream().map(announcement -> {
            AnnouncementAdminVO vo = new AnnouncementAdminVO();
            BeanUtils.copyProperties(announcement, vo);
            return vo;
        }).collect(Collectors.toList());

        return new PageVO<>(vos, announcementPage.getTotal());
    }

    @Override
    public AnnouncementAdminVO getAdminAnnouncementById(Long id) {
        Announcement announcement = announcementMapper.selectById(id);
        // 管理员可以查看未删除的任何公告
        if (announcement == null || announcement.getDeleted() == 1) {
            throw new RuntimeException("公告不存在");
        }
        AnnouncementAdminVO vo = new AnnouncementAdminVO();
        BeanUtils.copyProperties(announcement, vo);
        return vo;
    }
} 
package com.library.controller;

import com.library.dto.AnnouncementCreateDTO;
import com.library.dto.AnnouncementUpdateDTO;
import com.library.dto.PageQueryDTO;
import com.library.service.AnnouncementService;
import com.library.vo.AnnouncementAdminVO;
import com.library.vo.AnnouncementPublicVO;
import com.library.vo.PageVO;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api") // 统一前缀
@RequiredArgsConstructor
public class AnnouncementController {

    private final AnnouncementService announcementService;

    // --- 公开接口 --- (permitAll)

    @GetMapping("/public/announcements")
    public ResponseEntity<PageVO<AnnouncementPublicVO>> getPublishedAnnouncements(@Validated PageQueryDTO queryDTO) {
        PageVO<AnnouncementPublicVO> result = announcementService.getPublishedAnnouncements(queryDTO);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/public/announcements/{id}")
    public ResponseEntity<AnnouncementPublicVO> getPublishedAnnouncementById(@PathVariable Long id) {
        AnnouncementPublicVO result = announcementService.getPublishedAnnouncementById(id);
        return ResponseEntity.ok(result);
    }

    // --- 管理接口 --- (hasRole('ADMIN'))

    @ApiOperation("创建公告")
    @PostMapping("/admin/announcements")
    // @PreAuthorize("hasRole('ADMIN')") // 或 hasAuthority('ROLE_ADMIN')，根据实际配置
    public ResponseEntity<AnnouncementAdminVO> createAnnouncement(@Validated @RequestBody AnnouncementCreateDTO createDTO) {
        // Long adminUserId = SecurityUtils.getCurrentUserId(); // 从安全上下文中获取
        Long adminUserId = 1L; // 假设的管理员ID，用于演示
        AnnouncementAdminVO result = announcementService.createAnnouncement(createDTO, adminUserId);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    @ApiOperation("更新公告")
    @PutMapping("/admin/announcements/{id}")
    // @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AnnouncementAdminVO> updateAnnouncement(@PathVariable Long id,
                                                                  @Validated @RequestBody AnnouncementUpdateDTO updateDTO) {
        // Long adminUserId = SecurityUtils.getCurrentUserId();
        Long adminUserId = 1L; // 假设的管理员ID
        AnnouncementAdminVO result = announcementService.updateAnnouncement(id, updateDTO, adminUserId);
        return ResponseEntity.ok(result);
    }

    @ApiOperation("删除公告")
    @DeleteMapping("/admin/announcements/{id}")
    // @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteAnnouncement(@PathVariable Long id) {
        // Long adminUserId = SecurityUtils.getCurrentUserId();
        Long adminUserId = 1L; // 假设的管理员ID
        announcementService.deleteAnnouncement(id, adminUserId);
        return ResponseEntity.noContent().build();
    }

    @ApiOperation("分页查询所有公告 (管理员)")
    @GetMapping("/admin/announcements")
    // @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PageVO<AnnouncementAdminVO>> getAdminAnnouncements(@Validated PageQueryDTO queryDTO) {
        PageVO<AnnouncementAdminVO> result = announcementService.getAdminAnnouncements(queryDTO);
        return ResponseEntity.ok(result);
    }

    @ApiOperation("查询公告详情 (管理员)")
    @GetMapping("/admin/announcements/{id}")
    // @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AnnouncementAdminVO> getAdminAnnouncementById(@PathVariable Long id) {
        AnnouncementAdminVO result = announcementService.getAdminAnnouncementById(id);
        return ResponseEntity.ok(result);
    }
} 
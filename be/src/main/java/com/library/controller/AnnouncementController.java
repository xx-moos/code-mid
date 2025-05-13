package com.library.controller;

import com.library.dto.AnnouncementCreateDTO;
import com.library.dto.AnnouncementUpdateDTO;
import com.library.dto.PageQueryDTO;
import com.library.service.AnnouncementService;
import com.library.vo.AnnouncementAdminVO;
import com.library.vo.AnnouncementPublicVO;
import com.library.vo.PageVO;
// 假设有一个获取当前用户信息的工具类，实际项目中根据安全框架调整
// import com.library.utils.SecurityUtils; 
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping("/admin/announcements")
    @PreAuthorize("hasRole('ADMIN')") // 或 hasAuthority('ROLE_ADMIN')，根据实际配置
    public ResponseEntity<AnnouncementAdminVO> createAnnouncement(@Validated @RequestBody AnnouncementCreateDTO createDTO) {
        // Long adminUserId = SecurityUtils.getCurrentUserId(); // 从安全上下文中获取
        Long adminUserId = 1L; // 假设的管理员ID，用于演示
        AnnouncementAdminVO result = announcementService.createAnnouncement(createDTO, adminUserId);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    @PutMapping("/admin/announcements/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AnnouncementAdminVO> updateAnnouncement(@PathVariable Long id, 
                                                              @Validated @RequestBody AnnouncementUpdateDTO updateDTO) {
        // Long adminUserId = SecurityUtils.getCurrentUserId();
        Long adminUserId = 1L; // 假设的管理员ID
        AnnouncementAdminVO result = announcementService.updateAnnouncement(id, updateDTO, adminUserId);
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/admin/announcements/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteAnnouncement(@PathVariable Long id) {
        // Long adminUserId = SecurityUtils.getCurrentUserId();
        Long adminUserId = 1L; // 假设的管理员ID
        announcementService.deleteAnnouncement(id, adminUserId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/admin/announcements")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PageVO<AnnouncementAdminVO>> getAdminAnnouncements(@Validated PageQueryDTO queryDTO) {
        PageVO<AnnouncementAdminVO> result = announcementService.getAdminAnnouncements(queryDTO);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/admin/announcements/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AnnouncementAdminVO> getAdminAnnouncementById(@PathVariable Long id) {
        AnnouncementAdminVO result = announcementService.getAdminAnnouncementById(id);
        return ResponseEntity.ok(result);
    }
} 
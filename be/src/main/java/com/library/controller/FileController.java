package com.library.controller;

import com.library.common.Constants;
import com.library.common.Result;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

/**
 * 文件上传控制器
 */
@Slf4j
@Api(tags = "文件管理")
@RestController
@RequestMapping("/file")
public class FileController {

    @ApiOperation("文件上传")
    @PostMapping("/upload")
    public Result<String> upload(@RequestParam MultipartFile file) {
        if (file.isEmpty()) {
            return Result.failed("上传文件不能为空");
        }

        // 获取文件名
        String originalFilename = file.getOriginalFilename();
        String ext = originalFilename.substring(originalFilename.lastIndexOf("."));
        String newFilename = UUID.randomUUID().toString() + ext;

        // 文件存储路径
        String uploadPath = System.getProperty("user.dir") + File.separator + Constants.UPLOAD_PATH;
        File uploadDir = new File(uploadPath);
        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }

        File dest = new File(uploadPath + newFilename);
        try {
            file.transferTo(dest);
            log.info("文件上传成功: {}", dest.getAbsolutePath());
            // 返回文件访问路径
            String fileUrl = "/bapi/" + Constants.UPLOAD_PATH + newFilename;
            return Result.success(fileUrl);
        } catch (IOException e) {
            log.error("文件上传失败", e);
            return Result.failed("文件上传失败");
        }
    }
} 
package com.library.controller;

import com.google.code.kaptcha.impl.DefaultKaptcha;
import com.library.common.Constants;
import com.library.common.Result;
import com.library.utils.RedisUtil;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.util.Base64Utils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * 验证码控制器
 */
@Slf4j
@Api(tags = "验证码管理")
@RestController
@RequestMapping("/auth")
public class CaptchaController {

    @Resource
    private DefaultKaptcha defaultKaptcha;

    @Resource
    private RedisUtil redisUtil;

    @ApiOperation("获取验证码")
    @GetMapping("/captcha")
    public Result<Map<String, String>> getCaptcha() {
        // 生成验证码文本
        String text = defaultKaptcha.createText();
        // 生成验证码图片
        BufferedImage image = defaultKaptcha.createImage(text);
        
        // 生成captchaId
        String captchaId = UUID.randomUUID().toString();
        
        // 将验证码存入Redis，设置过期时间
        String redisKey = Constants.CAPTCHA_PREFIX + captchaId;
        redisUtil.set(redisKey, text, Constants.CAPTCHA_EXPIRE_TIME);
        
        // 将图片转为Base64编码
        String base64Image = imageToBase64(image);
        
        // 返回验证码图片和captchaId
        Map<String, String> result = new HashMap<>();
        result.put("captchaId", captchaId);
        result.put("captchaImg", "data:image/png;base64," + base64Image);
        
        log.info("生成验证码, captchaId: {}, captcha: {}", captchaId, text);
        return Result.success(result);
    }
    
    /**
     * 将图片转为Base64编码
     */
    private String imageToBase64(BufferedImage image) {
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            ImageIO.write(image, "png", outputStream);
            return Base64Utils.encodeToString(outputStream.toByteArray());
        } catch (IOException e) {
            log.error("验证码图片转Base64异常", e);
            throw new RuntimeException("验证码生成失败");
        }
    }
} 
package com.library.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;

/**
 * 登录DTO
 */
@Data
public class LoginDTO {
    /**
     * 用户名
     */
    @NotBlank(message = "用户名不能为空")
    private String username;

    /**
     * 密码
     */
    @NotBlank(message = "密码不能为空")
    private String password;
    
    /**
     * 验证码
     */
    @NotBlank(message = "验证码不能为空")
    private String captcha;
    
    /**
     * 验证码ID
     */
    @NotBlank(message = "验证码ID不能为空")
    private String captchaId;
} 
package com.library.controller;

import com.library.common.Result;
import com.library.dto.LoginDTO;
import com.library.dto.RegisterDTO;
import com.library.entity.User;
import com.library.service.UserService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import javax.validation.Valid;
import java.util.HashMap;
import java.util.Map;

/**
 * 认证控制器
 */
@Slf4j
@Api(tags = "认证管理")
@RestController
@RequestMapping("/auth")
public class AuthController {

    @Resource
    private UserService userService;

    @ApiOperation("用户登录")
    @PostMapping("/login")
    public Result<Map<String, Object>> login(@Valid @RequestBody LoginDTO loginDTO) {
        log.info("用户登录: {}", loginDTO.getUsername());
        String token = userService.login(loginDTO);
        
        // 返回token和用户信息
        Map<String, Object> result = new HashMap<>();
        result.put("token", token);
        
        // 查询用户信息
        User user = userService.getByUsername(loginDTO.getUsername());
        // 隐藏敏感信息
        user.setPassword(null);
        result.put("user", user);
        
        return Result.success(result);
    }

    @ApiOperation("用户注册")
    @PostMapping("/register")
    public Result<Void> register(@Valid @RequestBody RegisterDTO registerDTO) {
        log.info("用户注册: {}", registerDTO.getUsername());
        boolean result = userService.register(registerDTO);
        return result ? Result.success() : Result.failed("注册失败");
    }

    @ApiOperation("获取当前用户信息")
    @GetMapping("/info")
    public Result<User> getUserInfo() {
        User user = userService.getCurrentUser();
        if (user != null) {
            // 隐藏敏感信息
            user.setPassword(null);
            return Result.success(user);
        }
        return Result.unauthorized();
    }
} 
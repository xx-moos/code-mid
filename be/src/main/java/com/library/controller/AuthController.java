package com.library.controller;

import com.library.common.Result;
import com.library.dto.UserLoginDTO;
import com.library.dto.UserRegisterDTO;
import com.library.service.UserService;
import com.library.vo.UserVO;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

/**
 * 认证控制器
 */
@RestController
@RequestMapping("/api/auth")
@Api(tags = "认证管理")
public class AuthController {
    
    @Autowired
    private UserService userService;
    
    @PostMapping("/register")
    @ApiOperation("用户注册")
    public Result<Void> register(@Validated @RequestBody UserRegisterDTO userRegisterDTO) {
        if (userService.register(userRegisterDTO)) {
            return Result.success("注册成功", null);
        } else {
            return Result.fail("注册失败");
        }
    }
    
    @PostMapping("/login")
    @ApiOperation("用户登录")
    public Result<UserVO> login(@Validated @RequestBody UserLoginDTO userLoginDTO) {
        UserVO userVO = userService.login(userLoginDTO);
        return Result.success("登录成功", userVO);
    }
}

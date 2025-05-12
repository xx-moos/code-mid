package com.library.controller;

import com.library.common.Result;
import com.library.service.UserService;
import com.library.vo.UserVO;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 用户控制器
 */
@RestController
@RequestMapping("/api/user")
@Api(tags = "用户管理")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @GetMapping("/info")
    @ApiOperation("获取当前用户信息")
    public Result<UserVO> getCurrentUser() {
        UserVO userVO = userService.getCurrentUser();
        return Result.success(userVO);
    }
    
    @GetMapping("/admin/test")
    @ApiOperation("管理员权限测试")
    @PreAuthorize("hasRole('ADMIN')")
    public Result<String> adminTest() {
        return Result.success("您拥有管理员权限");
    }
}

package com.library.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.library.common.Result;
import com.library.entity.User;
import com.library.service.UserService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import javax.validation.Valid;

/**
 * 用户控制器
 */
@Slf4j
@Api(tags = "用户管理")
@RestController
@RequestMapping("/user")
public class UserController {

  @Resource
  private UserService userService;

  @Resource
  private PasswordEncoder passwordEncoder;

  @ApiOperation("分页查询用户")
  @GetMapping("/page")
  public Result<Page<User>> page(
      @ApiParam("页码") @RequestParam(defaultValue = "1") Integer current,
      @ApiParam("每页条数") @RequestParam(defaultValue = "10") Integer size,
      @ApiParam("用户名") @RequestParam(required = false) String username,
      @ApiParam("状态") @RequestParam(required = false) Integer status) {
    Page<User> page = userService.pageUsers(new Page<>(current, size), username, status);
    // 隐藏敏感信息
    page.getRecords().forEach(user -> user.setPassword(null));
    return Result.success(page);
  }

  @ApiOperation("根据ID查询用户")
  @GetMapping("/{id}")
  public Result<User> getById(@PathVariable Long id) {
    User user = userService.getById(id);
    if (user != null) {
      // 隐藏敏感信息
      user.setPassword(null);
      return Result.success(user);
    }
    return Result.failed("用户不存在");
  }

  @ApiOperation("新增用户")
  @PostMapping
  public Result<Void> save(@Valid @RequestBody User user) {
    // 密码加密
    if (user.getPassword() != null) {
      user.setPassword(passwordEncoder.encode(user.getPassword()));
    }
    boolean result = userService.save(user);
    return result ? Result.success() : Result.failed("新增用户失败");
  }

  @ApiOperation("修改用户")
  @PutMapping
  public Result<Void> update(@Valid @RequestBody User user) {
    // 密码加密
    if (user.getPassword() != null) {
      user.setPassword(passwordEncoder.encode(user.getPassword()));
    }
    boolean result = userService.updateById(user);
    return result ? Result.success() : Result.failed("修改用户失败");
  }

  @ApiOperation("删除用户")
  @DeleteMapping("/{id}")
  public Result<Void> delete(@PathVariable Long id) {
    boolean result = userService.removeById(id);
    return result ? Result.success() : Result.failed("删除用户失败");
  }

  @ApiOperation("修改密码")
  @PostMapping("/updatePassword")
  public Result<Void> updatePassword(
      @ApiParam("旧密码") @RequestParam String oldPassword,
      @ApiParam("新密码") @RequestParam String newPassword) {
    boolean result = userService.updatePassword(oldPassword, newPassword);
    return result ? Result.success() : Result.failed("修改密码失败");
  }

  @ApiOperation("更新用户信息")
  @PutMapping("/updateInfo")
  public Result<Void> updateInfo(@Valid @RequestBody User user) {
    boolean result = userService.updateUserInfo(user);
    return result ? Result.success() : Result.failed("更新用户信息失败");
  }
}
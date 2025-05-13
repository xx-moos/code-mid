package com.library.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.library.dto.LoginDTO;
import com.library.dto.RegisterDTO;
import com.library.entity.User;

import java.util.Collection;
import java.util.List;

/**
 * 用户服务接口
 */
public interface UserService extends IService<User> {
  /**
   * 用户登录
   *
   * @param loginDTO 登录参数
   * @return token
   */
  String login(LoginDTO loginDTO);

  /**
   * 用户注册
   *
   * @param registerDTO 注册参数
   * @return 是否成功
   */
  boolean register(RegisterDTO registerDTO);

  /**
   * 根据用户名查询用户
   *
   * @param username 用户名
   * @return 用户信息
   */
  User getByUsername(String username);

  /**
   * 获取当前登录用户信息
   *
   * @return 用户信息
   */
  User getCurrentUser();

  /**
   * 更新用户信息
   *
   * @param user 用户信息
   * @return 是否成功
   */
  boolean updateUserInfo(User user);

  /**
   * 修改密码
   *
   * @param oldPassword 旧密码
   * @param newPassword 新密码
   * @return 是否成功
   */
  boolean updatePassword(String oldPassword, String newPassword);

  /**
   * 分页查询用户
   *
   * @param page     分页参数
   * @param username 用户名
   * @param status   状态
   * @return 分页结果
   */
  Page<User> pageUsers(Page<User> page, String username, Integer status);

  /**
   * 根据用户ID列表批量查询用户信息
   *
   * @param userIds 用户ID列表
   * @return 用户列表
   */
  List<User> listUsersByIds(Collection<Long> userIds);
}
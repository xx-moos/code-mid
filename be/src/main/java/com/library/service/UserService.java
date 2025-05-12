package com.library.service;

import com.library.dto.UserLoginDTO;
import com.library.dto.UserRegisterDTO;
import com.library.entity.User;
import com.library.vo.UserVO;

/**
 * 用户服务接口
 */
public interface UserService {
    
    /**
     * 用户注册
     * @param userRegisterDTO 用户注册信息
     * @return 是否注册成功
     */
    boolean register(UserRegisterDTO userRegisterDTO);
    
    /**
     * 用户登录
     * @param userLoginDTO 用户登录信息
     * @return 用户信息(包含token)
     */
    UserVO login(UserLoginDTO userLoginDTO);
    
    /**
     * 根据用户名获取用户信息
     * @param username 用户名
     * @return 用户信息
     */
    User getByUsername(String username);
    
    /**
     * 根据用户ID获取用户信息
     * @param id 用户ID
     * @return 用户信息
     */
    User getById(Long id);
    
    /**
     * 获取登录用户信息
     * @return 用户信息(不包含敏感信息)
     */
    UserVO getCurrentUser();
    
    /**
     * 更新用户失信值
     * @param userId 用户ID
     * @param creditScore 失信值
     * @return 是否更新成功
     */
    boolean updateCreditScore(Long userId, Integer creditScore);
}

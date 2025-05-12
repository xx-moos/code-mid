package com.library.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.library.dto.UserLoginDTO;
import com.library.dto.UserRegisterDTO;
import com.library.entity.User;
import com.library.exception.BusinessException;
import com.library.mapper.UserMapper;
import com.library.service.UserService;
import com.library.util.JwtTokenUtil;
import com.library.util.MD5Util;
import com.library.vo.UserVO;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

/**
 * 用户服务实现类
 */
@Service
public class UserServiceImpl implements UserService {
    
    @Autowired
    private UserMapper userMapper;
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private JwtTokenUtil jwtTokenUtil;
    
    @Override
    public boolean register(UserRegisterDTO userRegisterDTO) {
        // 校验用户名是否已存在
        LambdaQueryWrapper<User> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(User::getUsername, userRegisterDTO.getUsername());
        if (userMapper.selectCount(queryWrapper) > 0) {
            throw new BusinessException("用户名已存在");
        }
        
        // 创建用户
        User user = new User();
        BeanUtils.copyProperties(userRegisterDTO, user);
        // 加密密码
        user.setPassword(MD5Util.encrypt(userRegisterDTO.getPassword()));
        // 初始化其他字段
        user.setCreditScore(0);
        user.setStatus(0);
        
        // 保存用户
        return userMapper.insert(user) > 0;
    }
    
    @Override
    public UserVO login(UserLoginDTO userLoginDTO) {
     
    }
    
    @Override
    public User getByUsername(String username) {
        LambdaQueryWrapper<User> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(User::getUsername, username);
        return userMapper.selectOne(queryWrapper);
    }
    
    @Override
    public User getById(Long id) {
        return userMapper.selectById(id);
    }
    
    @Override
    public UserVO getCurrentUser() {
        // 获取当前认证的用户名
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        // 获取用户
        User user = getByUsername(username);
        if (user == null) {
            throw new BusinessException("用户不存在");
        }
        
        // 封装用户信息
        UserVO userVO = new UserVO();
        BeanUtils.copyProperties(user, userVO);
        
        return userVO;
    }
    
    @Override
    public boolean updateCreditScore(Long userId, Integer creditScore) {
        User user = new User();
        user.setId(userId);
        user.setCreditScore(creditScore);
        return userMapper.updateById(user) > 0;
    }
}

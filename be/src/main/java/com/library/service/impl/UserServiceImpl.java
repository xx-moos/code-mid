package com.library.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.StringUtils;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.library.common.Constants;
import com.library.common.ResultCode;
import com.library.common.exception.CustomException;
import com.library.dto.LoginDTO;
import com.library.dto.RegisterDTO;
import com.library.entity.User;
import com.library.mapper.UserMapper;
import com.library.service.UserService;
import com.library.utils.JwtTokenUtil;
import com.library.utils.RedisUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

/**
 * 用户服务实现类
 */
@Slf4j
@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {

    @Resource
    private AuthenticationManager authenticationManager;

    @Resource
    private JwtTokenUtil jwtTokenUtil;

    @Resource
    private PasswordEncoder passwordEncoder;

    @Resource
    private RedisUtil redisUtil;

    @Override
    public String login(LoginDTO loginDTO) {
        // 验证验证码
        String redisKey = Constants.CAPTCHA_PREFIX + loginDTO.getCaptchaId();
        Object captcha = redisUtil.get(redisKey);

        // 验证码不存在或已过期
        if (captcha == null) {
            throw new CustomException("验证码已过期");
        }

        // 验证码不匹配
        if (!captcha.toString().equalsIgnoreCase(loginDTO.getCaptcha())) {
            throw new CustomException("验证码错误");
        }

        // 验证通过后，删除Redis中的验证码
        redisUtil.del(redisKey);


        User userCheck = this.getOne(new LambdaQueryWrapper<User>()
                .eq(User::getUsername, loginDTO.getUsername())
                .eq(User::getRole, loginDTO.getRole())
                .eq(User::getDeleted, Constants.NOT_DELETED));

        if (userCheck == null) {
            log.warn("用户 [{}] 尝试使用角色 [{}] 登录失败: 用户名或角色不存在或无效", loginDTO.getUsername(), loginDTO.getRole());
            throw new CustomException("用户名或角色不存在或无效");
        }

        // 执行登录认证
        Authentication authentication;
        try {
            authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginDTO.getUsername(), loginDTO.getPassword()));
        } catch (Exception e) {
            log.warn("用户 [{}] 登录失败: {}", loginDTO.getUsername(), e.getMessage());
            throw new CustomException(ResultCode.USERNAME_OR_PASSWORD_ERROR);
        }

        // 生成token
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String token = jwtTokenUtil.generateToken(userDetails);

        // 将token存入Redis
        String tokenRedisKey = Constants.TOKEN_PREFIX + userDetails.getUsername();
        redisUtil.set(tokenRedisKey, token, Constants.TOKEN_EXPIRE_TIME);

        return token;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean register(RegisterDTO registerDTO) {
        // 校验用户名是否存在
        if (getByUsername(registerDTO.getUsername()) != null) {
            throw new CustomException(ResultCode.USERNAME_EXIST);
        }

        // 校验两次密码是否一致
        if (!registerDTO.getPassword().equals(registerDTO.getConfirmPassword())) {
            throw new CustomException("两次密码不一致");
        }

        // 创建用户
        User user = new User();
        user.setUsername(registerDTO.getUsername());
        user.setPassword(passwordEncoder.encode(registerDTO.getPassword()));
        user.setEmail(registerDTO.getEmail());
        user.setPhone(registerDTO.getPhone());
        user.setStatus(Constants.STATUS_NORMAL);
        user.setRole(Constants.ROLE_USER);
        user.setCreditScore(0);

        return save(user);
    }

    @Override
    public User getByUsername(String username) {
        return getOne(new LambdaQueryWrapper<User>()
                .eq(User::getUsername, username)
                .eq(User::getDeleted, Constants.NOT_DELETED));
    }

    @Override
    public User getCurrentUser() {
        // 从SecurityContextHolder中获取当前登录用户
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || "anonymousUser".equals(authentication.getPrincipal())) {
            return null;
        }

        String username = ((UserDetails) authentication.getPrincipal()).getUsername();
        return getByUsername(username);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean updateUserInfo(User user) {
        // 获取当前登录用户
        User currentUser = getCurrentUser();
        if (currentUser == null) {
            throw new CustomException(ResultCode.UNAUTHORIZED);
        }

        // 只能修改自己的信息
        if (!currentUser.getId().equals(user.getId())) {
            throw new CustomException(ResultCode.FORBIDDEN);
        }

        // 不允许修改用户名和密码
        user.setUsername(null);
        user.setPassword(null);
        user.setRole(null);
        user.setStatus(null);
        user.setCreditScore(null);

        return updateById(user);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean updatePassword(String oldPassword, String newPassword) {
        // 获取当前登录用户
        User currentUser = getCurrentUser();
        if (currentUser == null) {
            throw new CustomException(ResultCode.UNAUTHORIZED);
        }

        // 校验旧密码
        if (!passwordEncoder.matches(oldPassword, currentUser.getPassword())) {
            throw new CustomException("旧密码错误");
        }

        // 更新密码
        User user = new User();
        user.setId(currentUser.getId());
        user.setPassword(passwordEncoder.encode(newPassword));

        return updateById(user);
    }

    @Override
    public Page<User> pageUsers(Page<User> page, String username, Integer status) {
        return page(page, new LambdaQueryWrapper<User>()
                .like(StringUtils.isNotBlank(username), User::getUsername, username)
                .eq(status != null, User::getStatus, status)
                .eq(User::getDeleted, Constants.NOT_DELETED)
                .orderByDesc(User::getCreateTime));
    }
    
    @Override
    public List<User> listUsersByIds(Collection<Long> userIds) {
        if (userIds == null || userIds.isEmpty()) {
            return Collections.emptyList();
        }
        
        // 使用MyBatis-Plus提供的listByIds方法，并过滤未删除的用户
        List<User> users = listByIds(userIds);
        
        // 过滤已删除的用户
        return users;
    }
}
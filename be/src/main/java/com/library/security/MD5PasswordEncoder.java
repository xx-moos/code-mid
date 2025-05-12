package com.library.security;

import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.util.DigestUtils;

import java.nio.charset.StandardCharsets;

/**
 * MD5密码编码器
 * 用于兼容现有的MD5格式存储的密码
 */
@Slf4j
public class MD5PasswordEncoder implements PasswordEncoder {

    @Override
    public String encode(CharSequence rawPassword) {
      //比如对密码进行 md5 加密
        String md5Pass = DigestUtils.md5DigestAsHex(rawPassword.toString().getBytes());
        return md5Pass;
    }

    @Override
    public boolean matches(CharSequence rawPassword, String encodedPassword) {
        // 将输入的原始密码转换为MD5格式，然后与数据库中存储的密码进行比较
        String md5Password = encode(rawPassword);
        
        log.debug("密码比较详情：");
        log.debug("- 原始密码: {}", rawPassword);
        log.debug("- 生成的MD5: {}", md5Password);
        log.debug("- 数据库中的密码: {}", encodedPassword);
        
        boolean matches = md5Password.equals(encodedPassword);
        if (!matches) {
            log.debug("密码不匹配! 请检查数据库中存储的密码格式是否正确。");
        }
        
        return matches;
    }
} 
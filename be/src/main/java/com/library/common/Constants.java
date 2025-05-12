package com.library.common;

/**
 * 系统常量
 */
public class Constants {
    // 删除标记（0-正常，1-已删除）
    public static final Integer DELETED = 1;
    public static final Integer NOT_DELETED = 0;

    // 状态（0-正常，1-禁用）
    public static final Integer STATUS_NORMAL = 0;
    public static final Integer STATUS_DISABLED = 1;

    // 用户角色
    public static final String ROLE_ADMIN = "ROLE_ADMIN";
    public static final String ROLE_USER = "ROLE_USER";

    // Redis相关
    public static final String TOKEN_PREFIX = "library:token:";
    public static final String USER_PREFIX = "library:user:";
    public static final String CAPTCHA_PREFIX = "library:captcha:";
    public static final Long TOKEN_EXPIRE_TIME = 7 * 24 * 60 * 60L; // 7天
    public static final Long CAPTCHA_EXPIRE_TIME = 5 * 60L; // 5分钟

    // JWT相关
    public static final String JWT_TOKEN_HEADER = "Authorization";
    public static final String JWT_TOKEN_PREFIX = "Bearer ";
    
    // 上传目录
    public static final String UPLOAD_PATH = "upload/";
    
    // 借阅相关
    public static final Integer MAX_BORROW_BOOKS = 5;  // 最大借阅数量
    public static final Integer MAX_BORROW_DAYS = 60;  // 最大借阅天数
    public static final Integer RENEW_DAYS = 30;       // 续借天数
    public static final Integer MAX_CREDIT_SCORE = 3;  // 最大失信值
} 
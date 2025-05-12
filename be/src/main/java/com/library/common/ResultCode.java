package com.library.common;

/**
 * 返回结果状态码
 */
public enum ResultCode {
    SUCCESS(200, "操作成功"),
    ERROR(500, "操作失败"),
    VALIDATE_FAILED(404, "参数检验失败"),
    UNAUTHORIZED(401, "暂未登录或token已经过期"),
    FORBIDDEN(403, "没有相关权限"),
    
    // 用户相关
    USER_NOT_EXIST(1001, "用户不存在"),
    USERNAME_OR_PASSWORD_ERROR(1002, "用户名或密码错误"),
    USERNAME_EXIST(1003, "用户名已存在"),
    ACCOUNT_LOCKED(1004, "账号已被锁定"),
    
    // 图书相关
    BOOK_NOT_EXIST(2001, "图书不存在"),
    BOOK_STOCK_ERROR(2002, "图书库存不足"),
    
    // 借阅相关
    BORROW_LIMIT_EXCEED(3001, "超出借阅数量限制"),
    BOOK_ALREADY_BORROWED(3002, "图书已被借阅"),
    CREDIT_SCORE_LIMIT(3003, "失信值过高，暂停借阅"),
    BOOK_NOT_BORROWED(3004, "此书籍未被借阅"),
    RENEW_NOT_ALLOWED(3005, "不允许续借");

    private int code;
    private String message;

    ResultCode(int code, String message) {
        this.code = code;
        this.message = message;
    }

    public int getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }
} 
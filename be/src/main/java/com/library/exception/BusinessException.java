package com.library.exception;

import lombok.Getter;

/**
 * 业务异常
 */
@Getter
public class BusinessException extends RuntimeException {
    
    /**
     * 错误码
     */
    private final int code;
    
    /**
     * 错误消息
     */
    private final String message;
    
    public BusinessException(String message) {
        this(400, message);
    }
    
    public BusinessException(int code, String message) {
        super(message);
        this.code = code;
        this.message = message;
    }
}

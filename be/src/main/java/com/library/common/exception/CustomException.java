package com.library.common.exception;

import com.library.common.ResultCode;
import lombok.Getter;

/**
 * 自定义异常
 */
@Getter
public class CustomException extends RuntimeException {
    private final int code;
    private final String message;

    public CustomException(ResultCode resultCode) {
        super(resultCode.getMessage());
        this.code = resultCode.getCode();
        this.message = resultCode.getMessage();
    }
    
    public CustomException(String message) {
        super(message);
        this.code = ResultCode.ERROR.getCode();
        this.message = message;
    }
    
    public CustomException(int code, String message) {
        super(message);
        this.code = code;
        this.message = message;
    }
} 
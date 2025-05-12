package com.library.common.exception;

import com.library.common.Result;
import com.library.common.ResultCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.NoHandlerFoundException;

/**
 * 全局异常处理
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * 处理自定义异常
     */
    @ExceptionHandler(CustomException.class)
    public Result<Void> handleCustomException(CustomException e) {
        log.error("自定义异常: {}", e.getMessage());
        return new Result<Void>(e.getCode(), e.getMessage(), null);
    }

    /**
     * 处理参数验证异常
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Result<Void> handleMethodArgumentNotValidException(MethodArgumentNotValidException e) {
        log.error("参数验证失败: {}", e.getMessage());
        BindingResult bindingResult = e.getBindingResult();
        StringBuilder sb = new StringBuilder();
        for (FieldError fieldError : bindingResult.getFieldErrors()) {
            sb.append(fieldError.getField()).append(": ").append(fieldError.getDefaultMessage()).append(", ");
        }
        String msg = sb.toString();
        if (msg.length() > 2) {
            msg = msg.substring(0, msg.length() - 2);
        }
        return Result.validateFailed(msg);
    }

    /**
     * 处理绑定异常
     */
    @ExceptionHandler(BindException.class)
    public Result<Void> handleBindException(BindException e) {
        log.error("参数绑定失败: {}", e.getMessage());
        BindingResult bindingResult = e.getBindingResult();
        StringBuilder sb = new StringBuilder();
        for (FieldError fieldError : bindingResult.getFieldErrors()) {
            sb.append(fieldError.getField()).append(": ").append(fieldError.getDefaultMessage()).append(", ");
        }
        String msg = sb.toString();
        if (msg.length() > 2) {
            msg = msg.substring(0, msg.length() - 2);
        }
        return Result.validateFailed(msg);
    }

    /**
     * 处理认证异常
     */
    @ExceptionHandler({UsernameNotFoundException.class, BadCredentialsException.class, InternalAuthenticationServiceException.class})
    public Result<Void> handleAuthException(Exception e) {
        log.error("认证异常: {}", e.getMessage());
        return Result.failed(ResultCode.USERNAME_OR_PASSWORD_ERROR);
    }

    /**
     * 处理授权异常
     */
    @ExceptionHandler(AccessDeniedException.class)
    public Result<Void> handleAccessDeniedException(AccessDeniedException e) {
        log.error("授权异常: {}", e.getMessage());
        return Result.forbidden();
    }

    /**
     * 处理404异常
     */
    @ExceptionHandler(NoHandlerFoundException.class)
    public Result<Void> handleNoHandlerFoundException(NoHandlerFoundException e) {
        log.error("接口不存在: {}", e.getMessage());
        return Result.failed("接口 [" + e.getRequestURL() + "] 不存在");
    }

    /**
     * 处理所有其他异常
     */
    @ExceptionHandler(Exception.class)
    public Result<Void> handleException(Exception e) {
        log.error("系统异常: ", e);
        return Result.failed("系统异常，请联系管理员");
    }
} 
package com.library.common;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * 通用返回结果
 * @param <T> 返回数据类型
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@ApiModel(value = "通用返回结果")
public class Result<T> implements Serializable {
    
    private static final long serialVersionUID = 1L;
    
    @ApiModelProperty(value = "是否成功")
    private Boolean success;
    
    @ApiModelProperty(value = "状态码")
    private Integer code;
    
    @ApiModelProperty(value = "提示信息")
    private String message;
    
    @ApiModelProperty(value = "数据")
    private T data;
    
    /**
     * 成功返回结果
     * @param data 数据
     * @param <T> 数据类型
     * @return 通用返回结果
     */
    public static <T> Result<T> success(T data) {
        return new Result<>(true, 200, "操作成功", data);
    }
    
    /**
     * 成功返回结果
     * @param message 提示信息
     * @param data 数据
     * @param <T> 数据类型
     * @return 通用返回结果
     */
    public static <T> Result<T> success(String message, T data) {
        return new Result<>(true, 200, message, data);
    }
    
    /**
     * 失败返回结果
     * @param code 状态码
     * @param message 提示信息
     * @param <T> 数据类型
     * @return 通用返回结果
     */
    public static <T> Result<T> fail(Integer code, String message) {
        return new Result<>(false, code, message, null);
    }
    
    /**
     * 失败返回结果
     * @param message 提示信息
     * @param <T> 数据类型
     * @return 通用返回结果
     */
    public static <T> Result<T> fail(String message) {
        return fail(400, message);
    }
    
    /**
     * 参数验证失败返回结果
     * @param message 提示信息
     * @param <T> 数据类型
     * @return 通用返回结果
     */
    public static <T> Result<T> validateFailed(String message) {
        return fail(400, message);
    }
    
    /**
     * 未登录返回结果
     * @param <T> 数据类型
     * @return 通用返回结果
     */
    public static <T> Result<T> unauthorized() {
        return fail(401, "暂未登录或token已过期");
    }
    
    /**
     * 未授权返回结果
     * @param <T> 数据类型
     * @return 通用返回结果
     */
    public static <T> Result<T> forbidden() {
        return fail(403, "没有相关权限");
    }
}

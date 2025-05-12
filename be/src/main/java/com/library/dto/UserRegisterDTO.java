package com.library.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;


/**
 * 用户注册请求DTO
 */
@Data
@ApiModel(value = "用户注册请求")
public class UserRegisterDTO {
    
    @ApiModelProperty(value = "用户名", required = true)
    private String username;
    
    @ApiModelProperty(value = "密码", required = true)
    private String password;
    
    @ApiModelProperty(value = "真实姓名")
    private String realName;
    
    @ApiModelProperty(value = "电子邮箱")
    private String email;
    
    @ApiModelProperty(value = "手机号")
    private String phone;
    
    @ApiModelProperty(value = "角色：0-读者，1-管理员", example = "0")
    private Integer role = 0;
}

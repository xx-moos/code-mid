package com.library.vo;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

/**
 * 用户信息VO
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "用户信息")
public class UserVO {
    
    @ApiModelProperty(value = "用户ID")
    private Long id;
    
    @ApiModelProperty(value = "用户名")
    private String username;
    
    @ApiModelProperty(value = "真实姓名")
    private String realName;
    
    @ApiModelProperty(value = "电子邮箱")
    private String email;
    
    @ApiModelProperty(value = "手机号")
    private String phone;
    
    @ApiModelProperty(value = "头像路径")
    private String avatar;
    
    @ApiModelProperty(value = "角色：0-读者，1-管理员")
    private Integer role;
    
    @ApiModelProperty(value = "失信值")
    private Integer creditScore;
    
    @ApiModelProperty(value = "token")
    private String token;
}

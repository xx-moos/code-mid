package com.library.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;


/**
 * 用户登录请求DTO
 */
@Data
@ApiModel(value = "用户登录请求")
public class UserLoginDTO {
    
    @ApiModelProperty(value = "用户名", required = true)
    private String username;
    
    @ApiModelProperty(value = "密码", required = true)
    private String password;
    
    /**
     * 将DTO转换为Spring Security认证所需的token对象
     * 注意：这只是创建认证请求对象，不代表已认证
     * @return UsernamePasswordAuthenticationToken实例
     */
    public UsernamePasswordAuthenticationToken toAuthenticationToken() {
        return new UsernamePasswordAuthenticationToken(this.username, this.password);
    }
}

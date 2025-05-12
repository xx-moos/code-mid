package com.library.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.experimental.Accessors;

import java.time.LocalDateTime;

/**
 * 用户实体类
 */
@Data
@Accessors(chain = true)
@TableName("user")
public class User {
    
    /**
     * 用户ID
     */
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;
    
    /**
     * 用户名
     */
    private String username;
    
    /**
     * 密码(MD5加密)
     */
    private String password;
    
    /**
     * 真实姓名
     */
    private String realName;
    
    /**
     * 电子邮箱
     */
    private String email;
    
    /**
     * 手机号
     */
    private String phone;
    
    /**
     * 头像路径
     */
    private String avatar;
    
    /**
     * 角色：0-读者，1-管理员
     */
    private Integer role;
    
    /**
     * 失信值
     */
    private Integer creditScore;
    
    /**
     * 状态：0-正常，1-禁用
     */
    private Integer status;
    
    /**
     * 创建时间
     */
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;
    
    /**
     * 更新时间
     */
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
    
    /**
     * 是否删除：0-未删除，1-已删除
     */
    @TableLogic
    private Integer deleted;
    
    /**
     * 是否管理员
     */
    public boolean isAdmin() {
        return role != null && role == 1;
    }
}

package com.library.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 用户实体
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("user")
public class User extends BaseEntity {
    /**
     * 用户名
     */
    @TableField("username")
    private String username;

    /**
     * 密码
     */
    @TableField("password")
    private String password;


    /**
     * 邮箱
     */
    @TableField("email")
    private String email;

    /**
     * 手机号
     */
    @TableField("phone")
    private String phone;

    /**
     * 头像
     */
    @TableField("avatar")
    private String avatar;

    /**
     * 状态（0-禁用，1-正常）
     */
    @TableField("status")
    private Integer status;

    /**
     * 角色（admin-管理员，user-普通用户）
     */
    @TableField("role")
    private String role;

    /**
     * 失信值（0-3，达到3禁止借书）
     */
    @TableField("credit_score")
    private Integer creditScore;
} 
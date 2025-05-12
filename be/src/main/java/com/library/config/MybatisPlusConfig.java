package com.library.config;

import com.baomidou.mybatisplus.annotation.DbType;
import com.baomidou.mybatisplus.core.handlers.MetaObjectHandler;
import com.baomidou.mybatisplus.extension.plugins.MybatisPlusInterceptor;
import com.baomidou.mybatisplus.extension.plugins.inner.PaginationInnerInterceptor;
import com.library.common.Constants;
import org.apache.ibatis.reflection.MetaObject;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;

/**
 * MyBatis Plus配置
 */
@Configuration
public class MyBatisPlusConfig implements MetaObjectHandler {

    /**
     * 分页插件
     */
    @Bean
    public MybatisPlusInterceptor mybatisPlusInterceptor() {
        MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();
        interceptor.addInnerInterceptor(new PaginationInnerInterceptor(DbType.MYSQL));
        return interceptor;
    }

    /**
     * 自动填充创建时间、创建人
     */
    @Override
    public void insertFill(MetaObject metaObject) {
        this.strictInsertFill(metaObject, "createTime", LocalDateTime.class, LocalDateTime.now());
        this.strictInsertFill(metaObject, "updateTime", LocalDateTime.class, LocalDateTime.now());
        this.strictInsertFill(metaObject, "deleted", Integer.class, Constants.NOT_DELETED);
        
        // 获取当前用户
        // Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        // if (authentication != null && authentication.isAuthenticated() && !"anonymousUser".equals(authentication.getPrincipal())) {
        //     this.strictInsertFill(metaObject, "createBy", String.class, authentication.getName());
        //     this.strictInsertFill(metaObject, "updateBy", String.class, authentication.getName());
        // } else {
        //     this.strictInsertFill(metaObject, "createBy", String.class, "system");
        //     this.strictInsertFill(metaObject, "updateBy", String.class, "system");
        // }
    }

    /**
     * 自动填充更新时间、更新人
     */
    @Override
    public void updateFill(MetaObject metaObject) {
        this.strictUpdateFill(metaObject, "updateTime", LocalDateTime.class, LocalDateTime.now());
        
        // 获取当前用户
        // Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        // if (authentication != null && authentication.isAuthenticated() && !"anonymousUser".equals(authentication.getPrincipal())) {
        //     this.strictUpdateFill(metaObject, "updateBy", String.class, authentication.getName());
        // } else {
        //     this.strictUpdateFill(metaObject, "updateBy", String.class, "system");
        // }
    }
} 
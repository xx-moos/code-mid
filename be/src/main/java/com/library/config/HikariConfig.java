package com.library.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * HikariCP连接池配置类
 */
@Data
@Component
@ConfigurationProperties(prefix = "spring.datasource.hikari")
public class HikariConfig {
    /**
     * 最小空闲连接数
     */
    private Integer minimumIdle;

    /**
     * 最大连接池大小
     */
    private Integer maximumPoolSize;

    /**
     * 空闲连接超时时间（毫秒）
     */
    private Long idleTimeout;

    /**
     * 连接池名称
     */
    private String poolName;

    /**
     * 连接最大生命周期（毫秒）
     */
    private Long maxLifetime;

    /**
     * 连接超时时间（毫秒）
     */
    private Long connectionTimeout;
} 
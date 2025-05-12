package com.library.config;

import com.zaxxer.hikari.HikariDataSource;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;

/**
 * 数据源配置类
 * 明确配置HikariCP连接池
 */
@Configuration
public class DataSourceConfig {

    /**
     * 配置主数据源
     * 使用@ConfigurationProperties注解将application.yml中的spring.datasource配置绑定到HikariDataSource
     * 
     * @return 配置好的数据源
     */
    @Bean
    @Primary
    @ConfigurationProperties(prefix = "spring.datasource")
    public DataSource dataSource() {
        // 使用HikariDataSource作为默认数据源
        // 所有的hikari特定配置都将通过spring.datasource.hikari前缀从配置文件中读取
        return new HikariDataSource();
    }

    /**
     * HikariCP是Spring Boot的默认连接池，它具有以下优点：
     * 1. 轻量级：代码精简，无其他依赖
     * 2. 高性能：号称最快的连接池
     * 3. 可靠性：优秀的稳定性和可靠性
     * 
     * 在application.yml中的重要配置参数:
     * - minimum-idle: 最小空闲连接数
     * - maximum-pool-size: 最大连接数
     * - idle-timeout: 连接空闲超时时间
     * - max-lifetime: 连接最长生命周期
     * - connection-timeout: 连接超时时间
     */
}
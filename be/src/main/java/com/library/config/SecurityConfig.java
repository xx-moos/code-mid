package com.library.config;

import com.library.security.JwtAuthenticationTokenFilter;
import com.library.security.MD5PasswordEncoder;
import com.library.security.UserDetailsServiceImpl;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.Arrays;

import javax.annotation.Resource;

/**
 * Spring Security配置类
 */
@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfig extends WebSecurityConfigurerAdapter {

  @Resource
  private UserDetailsServiceImpl userDetailsService;

  @Resource
  private JwtAuthenticationTokenFilter jwtAuthenticationTokenFilter;

  /**
   * 认证管理器
   */
  @Bean
  @Override
  public AuthenticationManager authenticationManagerBean() throws Exception {
    return super.authenticationManagerBean();
  }

  /**
   * 密码编码器
   */
  @Bean
  public PasswordEncoder passwordEncoder() {
    // 使用自定义密码编码器，同时兼容MD5和BCrypt等多种编码方式
    return new MD5PasswordEncoder();
  }

  /**
   * 身份认证配置
   */
  @Override
  protected void configure(AuthenticationManagerBuilder auth) throws Exception {
    auth.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder());
  }

  /**
   * CORS配置
   */
  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
      CorsConfiguration configuration = new CorsConfiguration();
      // 允许所有来源，生产环境应配置具体来源
      configuration.setAllowedOrigins(Arrays.asList("*")); // 兼容旧版Spring，使用 setAllowedOrigins
      configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
      configuration.setAllowedHeaders(Arrays.asList("*"));
      configuration.setAllowCredentials(true);
      configuration.setMaxAge(3600L); // 预检请求的有效期，单位秒

      UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
      source.registerCorsConfiguration("/**", configuration); // 对所有接口生效
      return source;
  }

  /**
   * Http安全配置
   */
  @Override
  protected void configure(HttpSecurity http) throws Exception {
    http
        // 启用CORS
        .cors()
        .and() // 添加 .and() 以连接后续配置
        // 关闭CSRF
        .csrf().disable()
        // 不通过Session获取SecurityContext
        .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
        .and()
        // 允许匿名访问的接口
        .authorizeRequests()
        // 登录、注册、验证码等接口允许匿名访问
        .antMatchers("/auth/**").permitAll()
        .antMatchers("/categories/**").permitAll()
        .antMatchers(HttpMethod.GET, "/book/**").permitAll()

        // 公告公开接口允许匿名访问
        .antMatchers("/api/public/announcements/**").permitAll()

        // Swagger相关接口允许匿名访问
        .antMatchers("/swagger-ui.html", "/swagger-ui/**", "/swagger-resources/**", "/v3/api-docs/**", "/webjars/**")
        .permitAll()
        // 静态资源允许匿名访问
        .antMatchers("/upload/**").permitAll()
        // 其他所有请求需要身份认证 (包括 /api/admin/announcements/**)
        .anyRequest().authenticated();

    // 添加JWT认证过滤器
    http.addFilterBefore(jwtAuthenticationTokenFilter, UsernamePasswordAuthenticationFilter.class);
  }
}
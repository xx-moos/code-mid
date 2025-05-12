package com.library.security;

import com.library.util.JwtTokenUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * JWT认证过滤器
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    @Autowired
    private JwtTokenUtil jwtTokenUtil;
    
    @Autowired
    private CustomUserDetailsService customUserDetailsService;
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        // 获取请求头中的Token
        String tokenHeader = request.getHeader(JwtTokenUtil.TOKEN_HEADER);
        
        // 判断Token是否存在
        if (tokenHeader != null && tokenHeader.startsWith(JwtTokenUtil.TOKEN_PREFIX)) {
            // 从Token中提取用户名
            String token = tokenHeader.substring(JwtTokenUtil.TOKEN_PREFIX.length());
            String username = jwtTokenUtil.getUsernameFromToken(token);
            
            // 判断用户名是否存在且未认证
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                // 加载用户信息
                UserDetails userDetails = customUserDetailsService.loadUserByUsername(username);
                
                // 验证Token是否有效
                if (jwtTokenUtil.validateToken(token, userDetails)) {
                    // 创建认证信息并设置到上下文中
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            }
        }
        
        // 继续执行过滤链
        filterChain.doFilter(request, response);
    }
}

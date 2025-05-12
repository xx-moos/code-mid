package com.library.security;

import com.library.common.Constants;
import com.library.utils.JwtTokenUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.annotation.Resource;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * JWT认证过滤器
 */
@Slf4j
@Component
public class JwtAuthenticationTokenFilter extends OncePerRequestFilter {

    @Resource
    private UserDetailsServiceImpl userDetailsService;

    @Resource
    private JwtTokenUtil jwtTokenUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws ServletException, IOException {
        String requestURI = request.getRequestURI();
        
        // 获取请求头中的token
        String token = getTokenFromRequest(request);
        
        if (StringUtils.hasText(token)) {
            // 从token中获取用户名
            String username = null;
            try {
                username = jwtTokenUtil.getUsernameFromToken(token);
            } catch (Exception e) {
                log.error("JWT token解析异常", e);
            }
            
            // 验证token
            if (StringUtils.hasText(username) && SecurityContextHolder.getContext().getAuthentication() == null) {
                // 加载用户信息
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                
                // 验证token是否有效
                if (jwtTokenUtil.validateToken(token, userDetails)) {
                    // 将用户信息存入SecurityContextHolder
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    log.debug("Authenticated user: {}, uri: {}", username, requestURI);
                }
            }
        }
        
        chain.doFilter(request, response);
    }

    /**
     * 从请求头中获取token
     */
    private String getTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader(Constants.JWT_TOKEN_HEADER);
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith(Constants.JWT_TOKEN_PREFIX)) {
            return bearerToken.substring(Constants.JWT_TOKEN_PREFIX.length());
        }
        return null;
    }
} 
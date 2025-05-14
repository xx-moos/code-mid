package com.library.security;

import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.util.matcher.OrRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;

/**
 * 安全路径匹配器
 * 用于管理匿名访问路径并检查请求是否匹配这些路径
 */
@Component
public class SecurityPathMatcher {

    private OrRequestMatcher anonymousUrlMatcher;
    private List<RequestMatcher> anonymousMatchers = new ArrayList<>();

    /**
     * 添加匿名访问路径
     * @param pattern Ant风格的路径模式
     */
    public void addAnonymousPath(String pattern) {
        anonymousMatchers.add(new AntPathRequestMatcher(pattern));
        // 更新组合匹配器
        anonymousUrlMatcher = new OrRequestMatcher(anonymousMatchers);
    }

    /**
     * 添加匿名访问路径（带HTTP方法限制）
     * @param pattern Ant风格的路径模式
     * @param httpMethod HTTP方法
     */
    public void addAnonymousPath(String pattern, String httpMethod) {
        anonymousMatchers.add(new AntPathRequestMatcher(pattern, httpMethod));
        // 更新组合匹配器
        anonymousUrlMatcher = new OrRequestMatcher(anonymousMatchers);
    }

    /**
     * 检查请求是否匹配匿名访问路径
     * @param request HTTP请求
     * @return 如果匹配返回true，否则返回false
     */
    public boolean matches(HttpServletRequest request) {
        // 如果没有配置匿名路径，直接返回false
        if (anonymousUrlMatcher == null) {
            return false;
        }
        return anonymousUrlMatcher.matches(request);
    }
} 
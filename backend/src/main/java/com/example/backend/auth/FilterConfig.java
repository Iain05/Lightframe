package com.example.backend.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
public class FilterConfig {

    public static final String[] PROTECTED_ROUTES = {
        "/admin/*",
        "/auth/verify",
        "/api/album/create"
    };
    
    @Bean
    public FilterRegistrationBean<JwtFilter> jwtFilterRegistration(@Autowired JwtFilter jwtFilter) {
        FilterRegistrationBean<JwtFilter> reg = new FilterRegistrationBean<>();
        reg.setFilter(jwtFilter);
        reg.addUrlPatterns(PROTECTED_ROUTES);
        return reg;
    }
}

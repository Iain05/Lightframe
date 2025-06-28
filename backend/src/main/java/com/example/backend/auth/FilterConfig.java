package com.example.backend.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
public class FilterConfig {
    
    @Bean
    public FilterRegistrationBean<JwtFilter> jwtFilterRegistration(@Autowired JwtFilter jwtFilter) {
        FilterRegistrationBean<JwtFilter> reg = new FilterRegistrationBean<>();
        reg.setFilter(jwtFilter);
        reg.addUrlPatterns("/admin/*", "/auth/verify"); // Protected routes
        return reg;
    }
}

package com.library;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.mybatis.spring.annotation.MapperScan;


/**
 * 智能图书馆系统启动类
 */
@SpringBootApplication
@MapperScan("com.library.mapper")
public class LibraryApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(LibraryApplication.class, args);
    }
}

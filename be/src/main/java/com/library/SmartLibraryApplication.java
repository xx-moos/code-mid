package com.library;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.mybatis.spring.annotation.MapperScan;

@SpringBootApplication
@MapperScan("com.library.mapper")
public class SmartLibraryApplication {
    public static void main(String[] args) {
        SpringApplication.run(SmartLibraryApplication.class, args);
    }
} 
package com.ustc.webmanage;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class WebManageApplication {
    public static void main(String[] args) {
        SpringApplication.run(WebManageApplication.class, args);
    }
}

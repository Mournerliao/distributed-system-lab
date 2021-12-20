package com.ustc.server.util;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;


@Component
@Slf4j
public class ApplicationRunnerImpl implements ApplicationRunner {
    @Value("${server.port}")
    int port;
    @Override
    public void run(ApplicationArguments args) throws Exception {
        System.out.println("进入applicationRunner");
        String url="http://localhost:"+9001+"/register/online";
        String res= HttpUtil.doGet(url);
        System.out.println(url);
        log.info("register:"+res);//register:{"code":10000,"msg":"ok","data":null}
    }
}

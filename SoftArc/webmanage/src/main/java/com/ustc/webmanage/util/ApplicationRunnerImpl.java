package com.ustc.webmanage.util;

import com.ustc.webmanage.web.MyWebSocketClient;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.java_websocket.client.WebSocketClient;

import java.net.URI;

@Component
@Slf4j
public class ApplicationRunnerImpl implements ApplicationRunner {
    @Override
    public void run(ApplicationArguments applicationArguments) throws Exception {
        MyWebSocketClient myWebSocketClient = MyWebSocketClient.getInstance();
        //MyWebSocketClient myWebSocketClient = new MyWebSocketClient(new URI(url));

        //WebSocketClient myWebSocketClient = com.ustc.webmanage.web.WebSocketConfig.getBean("webSocketClient", WebSocketClient.class);
        myWebSocketClient.connect();

//        System.out.println("进入applicationRunner");
//        String url="http://localhost:"+9002+"/register/online";
//        String res= HttpUtil.doGet(url);
//        System.out.println(url);
//        log.info("register:"+res);//register:{"code":10000,"msg":"ok","data":null}

    }
}

//package com.ustc.webmanage.web;
//
//import com.alibaba.fastjson.JSON;
//import com.alibaba.fastjson.JSONObject;
//
//
//import com.ustc.webmanage.Global.Global;
//import com.ustc.webmanage.util.Message;
//import lombok.extern.slf4j.Slf4j;
//import org.java_websocket.client.WebSocketClient;
//import org.java_websocket.handshake.ServerHandshake;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.stereotype.Component;
//
//import java.net.URI;
//
//@Configuration
//@Component
//@Slf4j
//public class RegisterWebSocket {
//    @Value("${register.onlineapi}")
//    String onlineApi;
//    @Value("${saServer.id}")
//    int id;
//
//
//    @Bean("webSocketClient")
//    public WebSocketClient getClient() {
//        WebSocketClient client = null;
//        try {
//            client = new WebSocketClient(new URI("ws://localhost:9000/server/online/webManage")) {
//                @Override
//                public void onOpen(ServerHandshake serverHandshake) {
//                    log.info("connect to register success");
//                    Message msg = new Message();
//                    msg.setType(6);
//                    send(msg.toString());
//                }
//
//                @Override
//                public void onMessage(String s) {
//                    log.info(s);
//                    JSONObject json = JSON.parseObject(s);
//                    int type = json.getInteger("type");
//                    switch (type) {
//                        case Global.TYPE_REGISTER_HEARTBEAT:
//                            log.info("webManage 下线");
//
//                            break;
//                        case Global.TYPE_REGISTER_SERVERINFO:
//                            Message serverInfo = new Message();
//                            serverInfo.setType(Global.TYPE_REGISTER_SERVERINFO);
//                            send(serverInfo.toString());
////                        case 3:System.out.println("c");break;
//                    }
//                }
//
//                @Override
//                public void onClose(int i, String s, boolean b) {
//
//                    log.error("connection close");
//                    log.error("i=" + i + ",s=" + s + ",b=" + b);
//
//                }
//
//                @Override
//                public void onError(Exception e) {
//                    log.error("error!" + e.getMessage());
//                }
//
//            };
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
//        return client;
//    }
//}

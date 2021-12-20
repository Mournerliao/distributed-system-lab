package com.ustc.webmanage.web;


import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.ustc.webmanage.Global.Global;
import com.ustc.webmanage.entity.Server;
import com.ustc.webmanage.mapper.serverMapper;
import com.ustc.webmanage.util.Message;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.persistence.Id;
import javax.websocket.*;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Component
@Slf4j
@ServerEndpoint("/webManage/online/{serverId}")
public class WebSocketServer {
    private static int onlineCount = 0;
    private static ConcurrentHashMap<Integer, WebSocketServer> serverMap = new ConcurrentHashMap<>();
    private Session session;
    private Integer serverId;
    //private Server server;


    @Value("${websocket.maxTimeout}")
    long maxTimeout;

    com.ustc.webmanage.mapper.serverMapper serverMapper = com.ustc.webmanage.web.WebSocketConfig.getBean("serverMapper",serverMapper.class);

    @OnOpen
    public void open(Session session, @PathParam("serverId") int serverId) throws IOException {
        this.session = session;
        session.setMaxIdleTimeout(maxTimeout);
        this.serverId = serverId;
        if (!serverMap.contains(serverId)) {
            serverMap.put(serverId, this);
            addOnlineCount();
            System.out.println(serverId);
        }
        System.out.println("manage web前端已连接");
//        Message serverInfo = new Message();
//        serverInfo.setType(Global.TYPE_REGISTER_SERVERINFO);
//        sendMessage(serverInfo.toString());
    }

    @OnClose
    public void close() {
        log.info("manage web前端 " +  " offline");
//        if (serverMap.containsKey(serverId)) {
//            log.info("serverid:" + serverId + " has offline");
//        }
    }

    @OnMessage
    public void message(String message) throws IOException {
        log.info("收到：" + message);
        JSONObject json = JSON.parseObject(message);
        Message msg = new Message();
        msg.setType(1);
        switch (json.getInteger("type")) {
            case 6://服务器下线通知web前端
                msg.setData("有服务器上线！");
                sendMessage(msg.toString());
                break;
            case 7://服务器上线通知web前端
                msg.setData("有服务器下线！");
                sendMessage(msg.toString());
                break;
            default:
                break;
        }
    }

    @OnError
    public void error(Session session, Throwable error) {
        log.error("manage web前端" + " error!,info:" + error.getMessage());
        error.printStackTrace();
    }

    public void sendMessage(String message) throws IOException {
        log.info("send message:" + message + " to manage web前端 " );
        log.info("远程web前端id："+ serverId);
        this.session.getBasicRemote().sendText(message);
    }

    public static void close(int serverId) throws IOException {
        WebSocketServer server = serverMap.get(serverId);
        if (server != null) {
            server.session.close();
        }
    }

    public static void send(String message, int serverId) throws IOException {
        if (serverId == -1)//群发消息
        {
            for (WebSocketServer webSocketServer : WebSocketServer.serverMap.values()) {
                webSocketServer.sendMessage(message);
            }
        } else {
            WebSocketServer server = serverMap.get(serverId);
            if (server != null)
                server.sendMessage(message);
        }
    }

    public static synchronized void addOnlineCount() {
        onlineCount++;
    }

    public static synchronized void subOnlineCount() {
        if (onlineCount > 0)
            onlineCount--;
    }

    public static synchronized int getOnlineCount() {
        return onlineCount;
    }



    public static ConcurrentHashMap getServerMap() {
        return serverMap;
    }
}

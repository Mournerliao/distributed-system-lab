package com.ustc.register.web;


import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.ustc.register.Global.Global;
import com.ustc.register.entity.Server;
import com.ustc.register.mapper.serverMapper;
import com.ustc.register.util.Message;
import com.ustc.register.util.ResultWeb;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.websocket.*;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Component
@Slf4j
@ServerEndpoint("/server/online/{serverName}")
public class WebSocketServer {
    private static int onlineCount = 0;
    private static ConcurrentHashMap<Integer, WebSocketServer> serverMap = new ConcurrentHashMap<>();
    private Session session;
    private Integer serverId;
    private String serverName;
    //private Server server;


    @Value("${websocket.maxTimeout}")
    long maxTimeout;

    serverMapper serverMapper = com.ustc.register.web.WebSocketConfig.getBean("serverMapper", serverMapper.class);

    @OnOpen
    public void open(Session session, @PathParam("serverName") String serverName) throws IOException {
        this.serverName = serverName;
        if (serverName.equals("webManage")) {

            this.session = session;
            session.setMaxIdleTimeout(maxTimeout);
            this.serverId = 0;
            if (!serverMap.contains(serverId)) {
                // serverMap.remove(serverId);
                serverMap.put(serverId, this);
                addOnlineCount();
            }

            log.info("webManage connect to register success！");

            return;
        }

        int serverId;
        if (serverMapper.selectOne(new LambdaQueryWrapper<Server>()
                .eq(Server::getName, serverName)) == null) {
            UUID uuid = UUID.randomUUID();
            String str = uuid.toString();
            String uuidStr = str.replace("-", "");
            int num = uuidStr.hashCode();
            num = num < 0 ? -num : num;

            Server newServer = new Server();
            newServer.setId(num);
            newServer.setName(serverName);
            newServer.setStatus(1);
            serverId = num;
            serverMapper.insert(newServer);
            log.info("分配服务器id为：" + serverId);
        } else {
            Server oldServer = serverMapper.selectOne(new LambdaQueryWrapper<Server>()
                    .eq(Server::getName, serverName));
            serverId = oldServer.getId();
            oldServer.setStatus(1);
            serverMapper.updateById(oldServer);
        }

        this.session = session;
        session.setMaxIdleTimeout(maxTimeout);
        this.serverId = serverId;
        if (!serverMap.contains(serverId)) {
            // serverMap.remove(serverId);
            serverMap.put(serverId, this);
            addOnlineCount();
        }
        //this.server = new Server();
        serverMap.forEach((k, v) -> {
            if (k > 0)
                System.out.println("server id have " + k);
        });
        log.info("server " + serverId + " connecting to register ");

    }

    @OnClose
    public void close() throws IOException {
        if (serverMap.containsKey(serverId) && serverId > 0) {
            log.info("serverId:" + serverId + "  serverName:" + this.serverName + " has offline");
            Server oldServer = serverMapper.selectById(serverId);
            oldServer.setStatus(0);
            serverMapper.updateById(oldServer);
            serverMap.remove(serverId);
            serverMap.forEach((k, v) -> {
                if (k > 0)
                    System.out.println("server id have " + k);
            });

            //下线给webManage后端发送下线通知
            Message msg = new Message();
            msg.setType(6);
            ResultWeb result = new ResultWeb();
            result.setId(serverId);
            msg.setData(result);
            send(msg.toString(),0);


        }
    }

    @OnMessage
    public void message(String message) throws IOException {
        log.info("收到：" + message);
        JSONObject json = JSON.parseObject(message);
        JSONObject data = json.getJSONObject("data");
        switch (json.getInteger("type")) {
            case 1:
                Server server = serverMapper.selectOne(new LambdaQueryWrapper<Server>()
                        .eq(Server::getName, data.getString("name")));
                server.setIpAddress(data.getString("ip_address"));
                serverMapper.updateById(server);
                System.out.println(server);
                //serverService.serverHeartBeat(client);
                sendMessage("已与register成功建立WebSocket连接！");

                //给webManage发信息增加日志
                Message onlineMessage = new Message();
                ResultWeb result = new ResultWeb();
                result.setId(server.getId());
                onlineMessage.setType(7);
                onlineMessage.setData(result);
                send(onlineMessage.toString(),0);

                break;
            case 2:
                //String serverName = serverMapper.selectById(this.serverId).getName();
                log.info("heartbeat:" + this.serverId + "  serverName:" + this.serverName);
                break;
            case 3:
                //服务器设备增加
                send(message, 0);
                log.info("serverId: " + this.serverId + "  serverName:" + this.serverName + "  add device");
                break;
            case 4:
                //服务器设备减少
                send(message, 0);
                log.info("serverId: " + this.serverId + "  serverName:" + this.serverName + "  sub device");
                break;
            case 5:
                //服务器设备更新
                send(message, 0);
                log.info("serverId: " + this.serverId + "  serverName:" + this.serverName + "  update device");
                break;
            //下线服务器
            case 6:
                Integer updateId = data.getInteger("id");
//                Message msg = new Message();
//                ResultWeb resultWeb = new ResultWeb();
//                resultWeb.setId(updateId);
//                msg.setType(6);
//                msg.setData(resultWeb);
//                sendMessage(msg.toString());
                log.info(message);
                close(updateId);

                break;
            default:
                break;
        }
//        String serverName = json.getString("name");
//        log.info("name=" + serverName);
//
//        Server test = serverMapper.selectOne(new LambdaQueryWrapper<Server>()
//                .eq(Server::getName, serverName));
//        if(test != null){
//            System.out.println(test.getId());
//            System.out.println(test.getName());
//        }


//        Server newServer = new Server();
//        newServer.setName("杭州服务器");
//        if(serverMapper.selectOne(new LambdaQueryWrapper<Server>()
//                .eq(Server::getName, newServer.getName())) == null){
//            serverMapper.insert(newServer);
//        }
//        查找全部server
        List<Server> serverList = serverMapper.selectList(new LambdaQueryWrapper<Server>());
//        Message serverListMessage = new Message();
//        serverListMessage.setType(1);
//        serverListMessage.setData(serverList);
//        sendMessage(serverListMessage.toString());


    }

    @OnError
    public void error(Session session, Throwable error) {
        //String serverName = serverMapper.selectById(this.serverId).getName();
        log.error("serverId:" + this.serverId + "  serverName:" + this.serverName + " error!,info:" + error.getMessage());
        error.printStackTrace();
    }

    public void sendMessage(String message) throws IOException {
        if (serverId != 0) {
            String serverName = serverMapper.selectById(this.serverId).getName();
            log.info("send message:" + message + " to serverId " + serverId + "serverName" + serverName);
        }
        this.session.getBasicRemote().sendText(message);
    }

    public static void close(int serverId) throws IOException {
        WebSocketServer server = serverMap.get(serverId);
        if (server != null) {
            server.close();
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

//    public Server getServer() {
//        return server;
//    }

    public static ConcurrentHashMap getServerMap() {
        return serverMap;
    }
}

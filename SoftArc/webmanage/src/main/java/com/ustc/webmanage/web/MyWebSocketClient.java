package com.ustc.webmanage.web;


import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.ustc.webmanage.Global.Global;
import com.ustc.webmanage.entity.Device;
import com.ustc.webmanage.entity.Server;
import com.ustc.webmanage.entity.ServerLog;
import com.ustc.webmanage.mapper.DeviceMapper;
import com.ustc.webmanage.mapper.ServerLogMapper;
import com.ustc.webmanage.mapper.serverMapper;
import com.ustc.webmanage.util.Message;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.java_websocket.client.WebSocketClient;
import org.java_websocket.handshake.ServerHandshake;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Date;
import java.util.List;


@Slf4j
public class MyWebSocketClient extends WebSocketClient {
    com.ustc.webmanage.mapper.serverMapper serverMapper = com.ustc.webmanage.web.WebSocketConfig.getBean("serverMapper", serverMapper.class);

    ServerLogMapper serverLogMapper = com.ustc.webmanage.web.WebSocketConfig.getBean("serverLogMapper", ServerLogMapper.class);
    DeviceMapper deviceMapper = com.ustc.webmanage.web.WebSocketConfig.getBean("deviceMapper", DeviceMapper.class);

    private static MyWebSocketClient INSTANCE = null;

    static {
        try {
            INSTANCE = new MyWebSocketClient(new URI("ws://localhost:9000/server/online/webManage"));
        } catch (URISyntaxException e) {
            e.printStackTrace();
        }
    }

    private MyWebSocketClient(URI serverUri) {
        super(serverUri);
    }

    public static MyWebSocketClient getInstance() {
        return INSTANCE;
    }

//    public MyWebSocketClient(URI serverUri) {
//        super(serverUri);
//    }

    @Override
    public void onOpen(ServerHandshake serverHandshake) {
        log.info("webManage connect to register success！");
//        Message message = new Message();
//        message.setType(6);
//        send(message.toString());
    }

    @SneakyThrows
    @Override
    public void onMessage(String s) {
        log.info(s);
        JSONObject json = JSON.parseObject(s);
        JSONObject data = json.getJSONObject("data");
        int type = json.getInteger("type");
        String serverName = new String();
        int serverId = 0;
        int deviceCount = 0;
        ServerLog serverLog = new ServerLog();
        Integer updateId = 0;
        Server updateServer = null;
        if (type == 3 || type == 4 || type == 5) {
            Server server = serverMapper.selectOne(new LambdaQueryWrapper<Server>()
                    .eq(Server::getName, data.getString("name")));
            serverName = server.getName();
            serverId = server.getId();
            List<Device> deviceList = deviceMapper.selectList(new LambdaQueryWrapper<Device>());
            System.out.println(deviceList);
            deviceCount = deviceMapper.selectCount(new LambdaQueryWrapper<Device>()
                    .eq(Device::getServerId, serverId));
            serverLog.setServerId(serverId);
            serverLog.setTime(new Date());
            serverLog.setStatus(3);
        }
        if (type == 6 || type == 7) {
            updateId = data.getInteger("id");
            updateServer = serverMapper.selectById(updateId);
            serverLog.setServerId(updateServer.getId());
            serverLog.setIpAddress(updateServer.getIpAddress());
            serverLog.setTime(new Date());
            serverLog.setDeviceCount(deviceMapper.selectCount(new LambdaQueryWrapper<Device>()
                    .eq(Device::getServerId, updateId)));
        }
        switch (type) {

            case 3:
                //设备增加
                Integer deviceIncrement = data.getInteger("device_increment");
                serverLog.setDeviceCount(deviceCount + deviceIncrement);
                serverLogMapper.insert(serverLog);
                log.info("serverId: " + serverId + "  serverName:" + serverName + "  add device num:" + deviceIncrement);
                break;
            case 4:
                //设备减少
                Integer deviceDecrement = data.getInteger("device_decrement");
                serverLog.setDeviceCount(deviceCount - deviceDecrement);
                serverLogMapper.insert(serverLog);
                log.info("serverId: " + serverId + "  serverName:" + serverName + "  sub device" + deviceDecrement);
                break;
            case 5:
                //设备更新状态
                serverLog.setDeviceCount(deviceCount);
                serverLogMapper.insert(serverLog);
                log.info("serverId: " + serverId + "  serverName:" + serverName + "  update device");
                break;
            case 6:
                //服务器下线
                serverLog.setStatus(2);
                serverLogMapper.insert(serverLog);
                log.info("serverId:" + updateId + "  serverName:" + updateServer.getName() + " has offline");

                if(WebSocketServer.getServerMap() != null){//给web前端群体发送消息
                    Message msg = new Message();
                    msg.setType(6);
                    msg.setData("有服务器下线！");
                    WebSocketServer.send(msg.toString(),-1);
                }

                break;
            case 7:
                //服务器上线
                serverLog.setStatus(1);
                serverLogMapper.insert(serverLog);
                log.info("serverId:" + updateId + "  serverName:" + updateServer.getName() + " has online");

                if(WebSocketServer.getServerMap() != null){//给web前端群体发送消息
                    Message msg1 = new Message();
                    msg1.setType(7);
                    msg1.setData("有新的服务器上线！");
                    WebSocketServer.send(msg1.toString(),-1);
                }


//                WebSocketServer webSocketServer1 =(WebSocketServer) WebSocketServer.getServerMap().get(1);//给单个web前端发送消息
//                Message msg1 = new Message();
//                msg1.setType(7);
//                msg1.setData("有新的服务器上线！");
//                webSocketServer1.sendMessage(msg1.toString());

                break;

            default:break;

        }
    }

    @Override
    public void onClose(int i, String s, boolean b) {
        log.info("webManage" + " has offline");
    }

    @Override
    public void onError(Exception e) {
        log.error("error!" + e.getMessage());
    }
}

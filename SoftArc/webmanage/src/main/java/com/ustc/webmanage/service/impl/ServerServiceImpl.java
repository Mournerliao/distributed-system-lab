package com.ustc.webmanage.service.impl;


import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.ustc.webmanage.entity.Device;
import com.ustc.webmanage.entity.DeviceLog;
import com.ustc.webmanage.entity.Server;
import com.ustc.webmanage.entity.ServerLog;
import com.ustc.webmanage.mapper.DeviceLogMapper;
import com.ustc.webmanage.mapper.DeviceMapper;
import com.ustc.webmanage.mapper.ServerLogMapper;
import com.ustc.webmanage.mapper.serverMapper;
import com.ustc.webmanage.service.IServerService;
import com.ustc.webmanage.util.*;
import com.ustc.webmanage.web.MyWebSocketClient;
import com.ustc.webmanage.web.WebSocketServer;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;


@Slf4j
@Service
public class ServerServiceImpl implements IServerService {

    @Resource
    serverMapper serverMapper;

    @Resource
    DeviceMapper deviceMapper;

    @Autowired
    ServerLogMapper serverLogMapper;

    @Autowired
    DeviceLogMapper deviceLogMapper;

    @Override
    public List<Server> findAllServer() {

        MyWebSocketClient myWebSocketClient = MyWebSocketClient.getInstance();
        List<Server> serverList = serverMapper.selectList(new LambdaQueryWrapper<Server>());
        System.out.println(serverList);

//        Message message = new Message();
//        ResultWeb resultWeb = new ResultWeb();
//        resultWeb.setServerList(serverList);
//        message.setType(6);
//        message.setData(resultWeb);
//        myWebSocketClient.send(message.toString());
//        System.out.println(message.toString());

        return serverList;
    }

    @Override
    public boolean offlineById(int id) throws IOException {

//        WebSocketServer webSocketServer = (WebSocketServer) WebSocketServer.getServerMap().get(1);
//        Message msg = new Message();
//        msg.setType(6);
//        msg.setData("有服务器下线！");
//        webSocketServer.sendMessage(msg.toString());

//        if(WebSocketServer.getServerMap() != null){//给web前端群体发送消息
//            Message msg = new Message();
//            msg.setType(6);
//            msg.setData("有服务器下线！");
//            WebSocketServer.send(msg.toString(),0);
//        }


        MyWebSocketClient myWebSocketClient = MyWebSocketClient.getInstance();
        Message message = new Message();
        ResultWeb resultWeb = new ResultWeb();
        resultWeb.setId(id);
        message.setType(6);
        message.setData(resultWeb);
        myWebSocketClient.send(message.toString());
        System.out.println(message.toString());

        return true;
    }

    @Override
    public boolean deleteById(int id) {

        serverMapper.deleteById(id);

        return true;
    }

    @Override
    public List<ServerLogVo> findAllServerLog() {
        List<ServerLog> serverLogs = serverLogMapper.selectList(new LambdaQueryWrapper<ServerLog>().orderByDesc(ServerLog::getTime));
        List<ServerLogVo> serverLogVos = new ArrayList<>();
        serverLogs.forEach(serverLog -> {
            ServerLogVo serverLogVo = new ServerLogVo();
            String serverName = serverMapper.selectById(serverLog.getServerId()).getName();
            BeanUtils.copyProperties(serverLog,serverLogVo);
            serverLogVo.setServerName(serverName);
            serverLogVos.add(serverLogVo);
        });

        return serverLogVos;
    }

    @Override
    public List<DeviceLogResponse> findAllDeviceLog() {
        List<DeviceLog> deviceLogList = deviceLogMapper.selectList(new LambdaQueryWrapper<DeviceLog>());
        Set<Integer> serverIds = deviceLogList.stream().map(DeviceLog::getServerId).collect(Collectors.toSet());

        List<DeviceLogResponse> deviceLogResponseList = serverIds.stream().map(serverId -> {
            DeviceLogResponse deviceLogResponse = new DeviceLogResponse();
            List<DeviceLog> deviceLogs = deviceLogMapper.selectList(new LambdaQueryWrapper<DeviceLog>()
                    .eq(DeviceLog::getServerId, serverId).orderByDesc(DeviceLog::getTime));
            List<DeviceLogVo> deviceLogVos = new ArrayList<>();
            deviceLogs.forEach(deviceLog -> {
                DeviceLogVo deviceLogVo = new DeviceLogVo();
                String deviceName = deviceMapper.selectById(deviceLog.getDeviceId()).getName();
                BeanUtils.copyProperties(deviceLog, deviceLogVo);
                deviceLogVo.setDeviceName(deviceName);
                deviceLogVos.add(deviceLogVo);
            });
            String serverName = serverMapper.selectById(serverId).getName();
            deviceLogResponse.setDeviceLogList(deviceLogVos);
            deviceLogResponse.setServerName(serverName);
            return deviceLogResponse;

        }).collect(Collectors.toList());
        System.out.println(deviceLogResponseList);
        return deviceLogResponseList;
    }

    @Override
    public int serverCount() {
        Integer serverCount = serverMapper.selectCount(new LambdaQueryWrapper<Server>());
        return serverCount;
    }

    @Override
    public int deviceCount() {
        Integer deviceCount = deviceMapper.selectCount(new LambdaQueryWrapper<Device>());
        return deviceCount;
    }


}

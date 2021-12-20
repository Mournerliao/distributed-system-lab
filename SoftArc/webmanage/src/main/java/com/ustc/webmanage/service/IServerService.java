package com.ustc.webmanage.service;

import com.ustc.webmanage.entity.Server;
import com.ustc.webmanage.util.DeviceLogResponse;
import com.ustc.webmanage.util.ServerLogVo;

import java.io.IOException;
import java.util.List;

public interface IServerService  {
    public List<Server> findAllServer();
    public boolean offlineById(int id) throws IOException;
    public boolean deleteById(int id);
    public List<ServerLogVo> findAllServerLog();
    public List<DeviceLogResponse> findAllDeviceLog();
    public int serverCount();
    public int deviceCount();


}

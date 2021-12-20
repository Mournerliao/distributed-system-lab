package com.ustc.webmanage.util;

import lombok.Data;

import java.util.Date;

@Data
public class ServerLogVo {
    private int id;
    private int serverId;
    private String serverName;
    private Date time;
    private int deviceCount;
    private int status;
    private String ipAddress;
}

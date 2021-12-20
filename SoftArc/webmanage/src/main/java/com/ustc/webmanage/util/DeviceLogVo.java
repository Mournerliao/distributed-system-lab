package com.ustc.webmanage.util;

import lombok.Data;

import java.util.Date;
@Data
public class DeviceLogVo {
    private int id;
    private String deviceId;
    private String deviceName;
    private Date time;
    private int status;
    private int serverId;
}

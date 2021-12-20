package com.ustc.webmanage.util;

import lombok.Data;

import java.util.List;
@Data
public class DeviceLogResponse {
    private String serverName;
    private List<DeviceLogVo> deviceLogList;
}

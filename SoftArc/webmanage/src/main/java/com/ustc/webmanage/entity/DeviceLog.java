package com.ustc.webmanage.entity;

import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.enums.IdType;
import lombok.Data;

import java.util.Date;

@Data
public class DeviceLog {
    @TableId(value = "id", type = IdType.AUTO)
    private int id;
    private String deviceId;
    private Date time;
    private int status;
    private int serverId;
}

package com.ustc.webmanage.entity;

import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.enums.IdType;
import lombok.Data;

import java.util.Date;

@Data
public class ServerLog {
    @TableId(value = "id", type = IdType.AUTO)
    private int id;
    private int serverId;
    private Date time;
    private int deviceCount;
    private int status;
    private String ipAddress;

}

package com.ustc.webmanage.entity;

import com.baomidou.mybatisplus.annotations.TableId;
import lombok.Data;

import java.util.Date;

@Data
public class Device {
    @TableId(value = "id")
    private String id;
    private String name;
    private int status;
    private Date registerTime;
    private int serverId;
}

package com.ustc.register.entity;

import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.enums.IdType;
import lombok.Data;


@Data
public class Server {
    @TableId(value = "id")
    int id;

    String name;

    String ipAddress;

    int status;

}
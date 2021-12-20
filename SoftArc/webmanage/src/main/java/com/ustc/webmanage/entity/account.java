package com.ustc.webmanage.entity;
import com.baomidou.mybatisplus.annotations.TableField;
import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.annotations.TableName;
import com.baomidou.mybatisplus.enums.IdType;
import lombok.Data;

import java.util.Date;

@Data
@TableName("account")
public class account {

    @TableId(value = "username")
    private String username;

    @TableField("password")
    private String password;

    @TableField("register_time")
    private Date registerTime;

}

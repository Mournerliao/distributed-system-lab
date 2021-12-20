package com.ustc.register.util;

import com.alibaba.fastjson.JSON;
import com.ustc.register.entity.Server;
import lombok.Data;

import java.util.List;

@Data
public class ResultWeb {
    private int id;
    private String name;
    private List<Server> serverList;

    @Override
    public String toString() {
        return JSON.toJSONString(this);
    }

    @Override
    public int hashCode() {
        return id + name.hashCode() + serverList.hashCode();
    }
}

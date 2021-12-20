package com.ustc.webmanage.util;

import com.alibaba.fastjson.JSON;
import com.ustc.webmanage.entity.Server;
import lombok.Data;

import java.util.List;

@Data
public class ResultWeb {
    private int id;
    private List<Server> serverList;

    @Override
    public String toString() {
        return JSON.toJSONString(this);
    }

    @Override
    public int hashCode() {
        return id + serverList.hashCode();
    }
}

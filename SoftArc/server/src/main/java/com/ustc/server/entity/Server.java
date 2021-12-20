package com.ustc.server.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Server {
    int id;
    String ip;
    String name;
    String api;
    int currSize;
    int maxSize;

    public void increaseCurrSize(){
        currSize++;
    }
    public void decreaseCurrSize(){
        currSize--;
    }
}

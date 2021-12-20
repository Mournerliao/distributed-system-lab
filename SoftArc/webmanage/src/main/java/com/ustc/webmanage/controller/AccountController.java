package com.ustc.webmanage.controller;

import com.ustc.webmanage.entity.Server;
import com.ustc.webmanage.entity.ServerLog;
import com.ustc.webmanage.mapper.AccountMapper;
import com.ustc.webmanage.mapper.serverMapper;
import com.ustc.webmanage.service.impl.AccountServiceImpl;
import com.ustc.webmanage.service.impl.ServerServiceImpl;
import com.ustc.webmanage.util.DeviceLogResponse;
import com.ustc.webmanage.util.Result;
import com.ustc.webmanage.util.ServerLogVo;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.io.IOException;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/webManage")
public class AccountController {

    @Resource
    AccountMapper accountMapper;

    @Resource
    serverMapper serverMapper;

    @Resource
    ServerServiceImpl serverService;

    @Resource
    AccountServiceImpl accountService;

    @PostMapping("/login")
    public Result login(@RequestParam("userName") String userName, @RequestParam("userPassword") String userPassword) {

        System.out.println(userName+"  "+userPassword);
        System.out.println(accountService.login(userName, userPassword));

        Result result = new Result();
        if(accountService.login(userName, userPassword)){
            result.setCode(200);
            result.setMsg("登录成功！");
            result.setData(new Boolean(true));
        }else{
            result.setCode(200);
            result.setMsg("登录失败！");
            result.setData(new Boolean(false));
        }

        return result;
//        account account = accountMapper.selectOne(new LambdaQueryWrapper<account>()
//                .eq(com.ustc.webmanage.entity.account::getUsername, "admin"));
//
//        System.out.println(account);

//        MyWebSocketClient myWebSocketClient = MyWebSocketClient.getInstance();
//        Message msg = new Message();
//        msg.setType(6);
//        myWebSocketClient.send(msg.toString());

    }

    @PostMapping("/register")
    public Result register(@RequestParam("userName") String userName, @RequestParam("userPassword") String userPassword,
                           @RequestParam("userRePassword") String userRePassword) {

        System.out.println(userName+"  "+userPassword+"  "+userRePassword);
        accountService.register(userName, userPassword,userRePassword);
        System.out.println(accountService.register(userName, userPassword,userRePassword));
        Result result = new Result();

        if(accountService.register(userName, userPassword,userRePassword)){
            result.setCode(200);
            result.setMsg("注册成功！");
            result.setData(new Boolean(true));
        }else{
            result.setCode(200);
            result.setMsg("注册失败！");
            result.setData(new Boolean(true));
        }

        return result;
    }

    @GetMapping("/findAllServer")
    public Result findAllServer() {
        List<Server> serverList = serverService.findAllServer();
        //System.out.println(serverList);
        Result result = new Result();
        result.setCode(200);
        result.setMsg("获取服务器列表成功！");
        result.setData(serverList);
        return result;
    }

    @PostMapping("/offlineServer")
    public Result offlineServerById(@RequestParam("id") int id) throws IOException {
        serverService.offlineById(id);
        Result result = new Result();
        result.setCode(200);
        result.setMsg("服务器下线成功！");
        result.setData(new Boolean(true));
        return result;
    }

    @PostMapping("/deleteServer")
    public Result deleteServerById(@RequestParam("id") int id){
        serverService.deleteById(id);
        Result result = new Result();
        result.setCode(200);
        result.setMsg("服务器删除成功！");
        result.setData(new Boolean(true));
        return result;
    }

    @GetMapping("/findAllServerLog")
    public Result findAllServerLog(){



        List<ServerLogVo> serverLogList = serverService.findAllServerLog();
        //System.out.println(serverList);
        Result result = new Result();
        result.setCode(200);
        result.setMsg("获取服务器日志列表成功！");
        result.setData(serverLogList);
        return result;
    }

    @GetMapping("/findAllDeviceLog")
    public Result findAllDeviceLog(){

        List<DeviceLogResponse> deviceLogList = serverService.findAllDeviceLog();
        //System.out.println(serverList);
        Result result = new Result();
        result.setCode(200);
        result.setMsg("获取设备日志列表成功！");
        result.setData(deviceLogList);



        return result;
    }


    @GetMapping("/serverCount")
    public Result serverCount(){
        int serverCount = serverService.serverCount();
        Result result = new Result();
        result.setCode(200);
        result.setMsg("获取服务器总数成功！");
        result.setData(serverCount);
        return result;

    }

    @GetMapping("/deviceCount")
    public Result deviceCount(){
        int deviceCount = serverService.deviceCount();
        Result result = new Result();
        result.setCode(200);
        result.setMsg("获取服务器总数成功！");
        result.setData(deviceCount);
        return result;

    }

}

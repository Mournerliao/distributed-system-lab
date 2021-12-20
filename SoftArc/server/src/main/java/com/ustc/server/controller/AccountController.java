package com.ustc.server.controller;

import com.ustc.server.entity.account;
import com.ustc.server.service.IAccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;

@RestController
@RequestMapping("/account")
public class AccountController {
    @Autowired
    private IAccountService accountService;

    @RequestMapping("/login")
    public boolean login(){
        account account = accountService.selectById(1);

        System.out.println(account.getUsername()+"  "+ account.getPassword()+"  "+ account.getRegisterTime()+"  "+ account.getIpAddress());
        account account1 = new account();
        account1.setUsername("admin1");
        account1.setPassword("admin1");
        account1.setIpAddress("192.168.1.2");
        account1.setRegisterTime(new Date());
        accountService.insert(account1);
        return true;
    }
}

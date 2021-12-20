package com.ustc.webmanage.service.impl;


import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.ustc.webmanage.entity.account;
import com.ustc.webmanage.mapper.AccountMapper;
import com.ustc.webmanage.mapper.serverMapper;
import com.ustc.webmanage.service.IAccountService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.Date;

@Service
public class AccountServiceImpl implements IAccountService {

    @Resource
    AccountMapper accountMapper;

    @Override
    public boolean login(String userName, String userPassword) {

        account loginAccount = accountMapper.selectOne(new LambdaQueryWrapper<account>()
                .eq(com.ustc.webmanage.entity.account::getUsername, userName));
        if(loginAccount == null){
            return false;
        }

        if(loginAccount.getUsername().equals(userPassword)){
            return true;
        }
        return false;
    }

    @Override
    public boolean register(String userName, String userPassword, String userRepassword) {
        account registerAccount = accountMapper.selectOne(new LambdaQueryWrapper<account>()
                .eq(com.ustc.webmanage.entity.account::getUsername, userName));
        if(registerAccount != null || !userPassword.equals(userRepassword)){
            return false;
        }

        account newAccount = new account();
        newAccount.setUsername(userName);
        newAccount.setPassword(userPassword);
        newAccount.setRegisterTime(new Date());
        accountMapper.insert(newAccount);

        return true;
    }
}

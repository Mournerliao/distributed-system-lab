package com.ustc.server.service.impl;

import com.baomidou.mybatisplus.service.impl.ServiceImpl;
import com.ustc.server.entity.account;
import com.ustc.server.mapper.AccountMapper;
import com.ustc.server.service.IAccountService;
import org.springframework.stereotype.Service;

@Service
public class AccountServiceImpl extends ServiceImpl<AccountMapper, account> implements IAccountService {
}

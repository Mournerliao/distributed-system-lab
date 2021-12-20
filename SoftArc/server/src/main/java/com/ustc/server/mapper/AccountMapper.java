package com.ustc.server.mapper;

import com.baomidou.mybatisplus.mapper.BaseMapper;
import com.ustc.server.entity.account;
import org.apache.ibatis.annotations.Mapper;



@Mapper
public interface AccountMapper extends BaseMapper<account> {
}

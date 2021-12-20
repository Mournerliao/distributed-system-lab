package com.ustc.webmanage.mapper;


import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.ustc.webmanage.entity.ServerLog;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Component;

@Component
@Mapper
public interface ServerLogMapper extends BaseMapper<ServerLog> {
}

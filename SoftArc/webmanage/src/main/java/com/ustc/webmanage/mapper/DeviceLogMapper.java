package com.ustc.webmanage.mapper;


import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.ustc.webmanage.entity.DeviceLog;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Component;

@Component
@Mapper
public interface DeviceLogMapper extends BaseMapper<DeviceLog> {
}

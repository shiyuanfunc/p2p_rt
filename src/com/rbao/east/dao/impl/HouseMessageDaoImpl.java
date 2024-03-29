package com.rbao.east.dao.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;

import com.rbao.east.dao.HouseMessageDao;
import com.rbao.east.entity.HouseMessage;

@Repository
public class HouseMessageDaoImpl extends BaseDaoImpl<HouseMessage> implements HouseMessageDao {

	private static Logger logger = LoggerFactory.getLogger(HouseMessageDaoImpl.class);
}

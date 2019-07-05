	//设备分类结构-作为搜索条件和列展示
	var equipmentStructure = {
			"全部设备" : { 
				"装置列名" : "WEL_NAME",
				"装置单元" : "WEL_UNIT",
				"设备类别" : "EQU_MEMO_ONE",
				"设备位号" : "EQU_POSITION_NUM",
				"设备名称" : "EQU_NAME",
			},
			"仪表设备" : {
				"仪表设备" : "SECONDCLASS_EQUIPMENT"
			},
			"机械设备" : {
				"机械设备" : "SECONDCLASS_EQUIPMENT"
			},
			"电气设备" : {
				"电气设备" : "SECONDCLASS_EQUIPMENT"
			},
			"分析化验设备" : {
				"分析化验设备" : "SECONDCLASS_EQUIPMENT"
			},
			"压力表" : {
				"器具类别" : "MANAGE_TYPE",
				"规格型号" : "EQU_MODEL",
				"测量范围" : "MEARING_RANGE",
				"准确等级" : "MEASURE_ACC",
				"安装地点" : "EQU_INSTALL_POSITION",
				"生产厂家" : "EQU_MANUFACTURER",
				"出厂编号" : "SERIAL_NUM",
				"检定周期" : "CHECK_CYCLE",
				"检定日期" : "CHECK_TIME",
				"下次检定" : "NEXT_CHECK_TIME",
				"备注信息" : "REMARK1"
			},
			"压力差压变送器" : {				
				"器具类别" : "MANAGE_TYPE",
				"规格型号" : "EQU_MODEL",
				"测量介质" : "MEDUIM_TYPE",
				"测量范围" : "MEARING_RANGE",
				"精度" : "MEASURE_ACC",
				"安装地点" : "EQU_INSTALL_POSITION",
				"生产厂家" : "EQU_MANUFACTURER",
				"出厂编号" : "SERIAL_NUM",
				"检定周期" : "CHECK_CYCLE",
				"检定日期" : "CHECK_TIME",
				"有效期" : "NEXT_CHECK_TIME",
				"备注信息" : "REMARK1"				
			},
			"温度计" : {
				"规格型号" : "EQU_MODEL",
				"安装地点" : "EQU_INSTALL_POSITION",
				"插深" : "DEEP_LENGTH",
				"接口尺寸" : "INTER_SIZE",
				"测量介质" : "MEDUIM_TYPE",
				"测量范围" : "MEARING_RANGE",
				"精度" : "MEASURE_ACC",				
				"生产厂家" : "EQU_MANUFACTURER",
				"出厂编号" : "SERIAL_NUM",
				"检定周期" : "CHECK_CYCLE",
				"检定日期" : "CHECK_TIME",
				"有效期" : "NEXT_CHECK_TIME",
				"备注信息" : "REMARK1"				
			},
			"温度变送器" : {
				"分度号" : "ORDER_NUM",
				"规格型号" : "EQU_MODEL",
				"安装地点" : "EQU_INSTALL_POSITION",
				"插深" : "DEEP_LENGTH",
				"接口尺寸" : "INTER_SIZE",
				"测量介质" : "MEDUIM_TYPE",
				"测量范围" : "MEARING_RANGE",
				"精度" : "MEASURE_ACC",				
				"生产厂家" : "EQU_MANUFACTURER",
				"出厂编号" : "SERIAL_NUM",				
				"测试日期" : "CHECK_TIME",
				"周期" : "CHECK_CYCLE",
				"备注信息" : "REMARK1"		
			},
			"气动切断阀" : {
				"规格型号" : "EQU_MODEL",
				"安装地点" : "EQU_INSTALL_POSITION",
				"介质" : "MEDUIM_TYPE",
				"法兰规格" : "FLA_SIZE",
				"作用方式" : "ACTION_MODLE",
				"有无手轮" : "HAVE_NOT",
				"执行机构型号" : "ACTUAL_MODEL",	
				"电磁阀型号" : "VAVLE_TYPE",
				"生产厂家" : "EQU_MANUFACTURER",
				"出厂编号" : "SERIAL_NUM",
				"备注信息" : "REMARK1"		
			},
			"气动调节阀" : {
				"规格型号" : "EQU_MODEL",
				"安装地点" : "EQU_INSTALL_POSITION",
				"介质	" : "MEDUIM_TYPE",
				"行程" : "	MEARING_RANGE",
				"CV值" : "CV",
				"法兰规格" : "FLA_SIZE",
				"作用方式" : "ACTION_MODLE",
				"有无手轮" : "HAVE_NOT",
				"执行机构型号" : "ACTUAL_MODEL",
				"气源Mpa" : "GAS_SOURCE",
				"定位器" : "POSITIONER",
				"电磁阀" : "VAVLE_TYPE",
				"生产厂家" : "EQU_MANUFACTURER",
				"出厂编号" : "SERIAL_NUM",
				"备注" : "REMARK1"
			},
			"液位计(含远程)" : {
				"规格型号" : "EQU_MODEL",
				"中心距离" : "DEEP_LENGTH",
				"安装地点" : "EQU_INSTALL_POSITION",
				"测量介质" : "MEDUIM_TYPE",
				"过程连接尺寸" : "PROCE_LINK_TYPE",
				"生产厂家" : "EQU_MANUFACTURER",
				"出厂编号" : "SERIAL_NUM",
				"备注" : "REMARK1"					
			},
			"流量计" : {
				"规格型号" : "EQU_MODEL",				
				"安装地点" : "EQU_INSTALL_POSITION",
				"介质" : "MEDUIM_TYPE",
				"流量(max)" : "ACTUAL",
				"流量(正常)" : "FLUX",
				"精 度" : "MEASURE_ACC",
				"测量范围" : "MEARING_RANGE",			
				"过程安装方式" : "PROCE_LINK_TYPE",				
				"编号" : "SERIAL_NUM",
				"生产厂家" : "EQU_MANUFACTURER",
				"生产日期" : "EQU_PRODUC_DATE",
				"备注" : "REMARK1"	
			},		

			"节流装置" : {
				"规格型号" : "EQU_MODEL",
				"安装地点" : "EQU_INSTALL_POSITION",
				"测量介质" : "MEDUIM_TYPE",
				"量程" : "MEARING_RANGE",
				"压力MPa" : "PRESSURE_RANGE",
				"温度" : "EQU_WORK_TEMP",
				"法兰规格" : "FLA_SIZE",
				"生产厂家" : "EQU_MANUFACTURER",
				"备注" : "REMARK1"
			},
			"在线分析仪" : {			
				"规格型号" : "EQU_MODEL",
				"安装地点" : "EQU_INSTALL_POSITION",
				"测量介质" : "MEDUIM_TYPE",
				"量程" : "MEARING_RANGE",
				"精 度" : "MEASURE_ACC",
				"测量原理" : "MEASURE_PRIN",
				"生产厂家" : "EQU_MANUFACTURER",
				"出厂编号" : "SERIAL_NUM",
				"备注" : "REMARK1"
			},

//			"震动温度探头" : {
//				"" : "",
//			},
			"DCS/SIS系统" : {
				"规格型号" : "EQU_MODEL",
				"控制器MD" : "EQU_COMMISSION_DATE",
				"控制器MQ" : "MEDUIM_TYPE",
				"AI16" : "EQU_WORK_TEMP",
				"AI18-R" : "EQU_LASTPERIODIC_DATE",
				"AI08-R" : "EQU_PERIODIC_CYCLE",
				"DI32" : "EQU_PERIODIC_WARNDAYS",
				"DO32" : "MEARING_RANGE",
				"串口卡(个)" : "PRESSURE_RANGE",
				"串口卡(对)" : "MANAGE_TYPE",
				"SIS卡(对)" : "SERIAL_NUM",
				"24VDC/20A(对)" : "CHECK_CYCLE",
				"24VDC/40A(对)" : "CHECK_TIME",
				"12VDC/15A(对)" : "NEXT_CHECK_TIME",
				"中继器" : "EXPERY_TIME",
				"AI8" : "INTER_SIZE",
				"AI浪涌" : "MEASURE_ACC",
				"DI浪涌" : "DEEP_LENGTH",
				"继电器" : "ORDER_NUM",
				"备注" : "REMARK1"
			},
			"FGS系统" : {
				"控制器8851" : "MEDUIM_TYPE",
				"模拟量卡件8810" : "EQU_WORK_TEMP",
				"数字量卡件8811" : "EQU_LASTPERIODIC_DATE",
				"电源881312VDC/5A" : "EQU_PERIODIC_CYCLE",
				"电源RM240-24VDC/40A" : "EQU_PERIODIC_WARNDAYS",
				"电源RM120-24VDC/20A" : "MEARING_RANGE",
				"备注" : "REMARK1"
			},
			"固定式报警仪" : {
				"器具类别" : "MANAGE_TYPE",
				"规格型号" : "EQU_MODEL",
				"安装使用地点" : "EQU_INSTALL_POSITION",
				"用途" : "ACTUAL",
				"安装方式" : "ACTION_MODLE",
				"精 度" : "MEASURE_ACC",
				"测量范围" : "MEARING_RANGE",
				"供电" : "ELEC",
				"输出信号(mA)" : "CV",
				"报警值" : "ORDER_NUM",
				"生产厂家" : "EQU_MANUFACTURER",
				"出厂编号" : "SERIAL_NUM",
				"有效期" : "NEXT_CHECK_TIME",
				"备注" : "REMARK1"
			},
//			"其它" : {
//				"" : "",
//			}
			
			
		//机械大类
			"P类设备" : {
				"安装位置" : "EQU_INSTALL_POSITION",
				"类别" : "MANAGE_TYPE",
				"规格型号" : "EQU_MODEL",
				"重量" : "WEIGHT",
				"扬程" : "FLUX",
				"排量" : "COUNT",
				"电压" : "ELECTRIC_PRES",
				"功率" : "POWER_RATE",
				"转速" : "SPEED_RAT",
				"介质" : "MEDUIM_TYPE",
				"泵壳" : "CAPCITY",
				"叶轮" : "BEFORE_BEARING1",
				"主轴" : "BEFORE_BEARING2",
				"制造单位" : "EQU_MANUFACTURER",
				"出厂编号" : "SERIAL_NUM",
				"投用年月" : "EQU_COMMISSION_DATE",
				"备注" : "REMARK1"
			},			
				
			"K类设备" : {
				"安装位置" : "EQU_INSTALL_POSITION",
				"类别" : "MANAGE_TYPE",
				"规格型号" : "EQU_MODEL",
				"重量" : "WEIGHT",
				"出口风压" : "WIND_PRESSURE",
				"排量" : "COUNT",
				"性能转速" : "SPEED_RAT",
				"电压" : "ELECTRIC_PRES",
				"功率" : "POWER_RATE",
				"电机转速" : "SPINDLE_SPEED",
				"介质" : "MEDUIM_TYPE",
				"制造单位" : "EQU_MANUFACTURER",
				"出厂编号" : "SERIAL_NUM",
				"投用年月" : "EQU_COMMISSION_DATE",
				"备注" : "REMARK1"
			}

	};
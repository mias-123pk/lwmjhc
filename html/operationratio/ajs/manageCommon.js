/*
 * 流程调用通用基本方法
 *	ExMobi4.x+ JS
 *	Version	: 1.0.0
 *	Author	: liuhai
 *	Email	:
 *	Weibo	:
 *	Copyright 2016 (c)
 *
 * Server_data_write_back(setUrl, data, callbackName) 服务器数据回写
 * Server_data_loading(setUrl, data, callbackName) 服务器数据加载
 * Problem_information()  问题信息加载
 * Twist_information()  流程扭转信息
 * Handle_person(ATID) 下一节点处理人
 * checkIn(executor, opinion, data) 流程审批--执行下一步
 * workCheckIn(data) 问题闭环执行下一步
 * Backspace_node() 加载回退节点
 * Fallback(ATID,opinion,data)  流程审批--回退
 * termination() 流程终止
 * Application_maintenance()  维修申请单数据
 * Datawriteback() 流程任务表数据回写
 * ClaimTask(piid,tiid) 待办流程—任务申明
 * Audit_judgment() 固定承包商审核判断
 */
var bool = false;
/**流程模板ID****/
/**问题评估*/
var ASSESSMENT = '84F30E1CDCA547AC906F44A66DB62005';
/**问题闭环*/
var PROBLEMCLOSEDLOOP = 'DC0D92D3059540C4A1A3D385E6A0A267';
/*** 任务分配-净化*/
var PURIFY = 'D410F12FE35B49F3B9C0AB73B28622C6';
/*** 对外协调分配*/
var COORDINATE = '37E10560A2114EB39EA9563D24F4725B';
/*** 对外问题处理*/
var PROWBLEM = '36FE31B1D80F490F8DD99E6BD9DB2E5C';
/** 任务分配-维修*/
var REPAIR = '9839022432E549A5885A80EC359C63A5';
/**问题审核--维修工段长 */
var MSUPERVISOR = 'D95627B2A4444B23962F0A4BAC0C6CCB';
/**问题审核--设备办 */
var EQUIPMENT = '568D3B1429494F06BE1DF01B21FEA3A4';
/**问题审核--分管领导 */
var LEADERSHIP = 'DD78249F62C3476ABB2DD1F018200566';
/**联系外协维修（设备办）*/
var LIAISION = '84EBF6AE879147A59C6C19E2B02DD20B';
/**问题闭环-任务指派 */
var ASSIGNMENT = '263AFF428ADB423AAA1EDDDE3A406AD0';
/**问题闭环-作业准备*/
var JOBPREPARATION = '00917C181BC448359BFC715AC7CE8382';
/**固定承包商审核(生产办)*/
var FIXEDOFFICE = '20D36A06E24E449D905BF89E67AE0D72';
/**采购计划审核-物质采购申请*/
var MATERIALREQUEST = 'EBC85AC7FCB34D0FB47C121B5EDDCC2B';
/**采购计划审核-专业技术审核*/
var PROFESSIONAL = '461E1604D8C14CB4B30D8A01D90A69FE';
/**采购计划审核-部门负责人审核*/
var DEPARTMENT = '5619B33DC5D94C2CBB966E0342423668';
/**采购计划审核-领导审核*/
var LEADERSHIPAUDIT = '136E36014B8344DC871963CB9EF451CD';
/**物资申领-部门领导审核*/
var DEPARTMENTAUDIT = 'FB552387043C49F4B7EB3D2BD31957C0';
/**物资申领-分管领导审核*/
var INLEADERSHIPAUDIT = '0D52424A881F45DB8BD11A6D01D5B568';
/**作业过程 */
var OPERTION = '61555DEC31184DDCB0B5D3FBE17EE4BE';
/**作业验收*/
var OPERATIONACCEPTANCE = '9113B5A7AFB6424BAAFF2EC0225DD250';
/**作业完成 */
var JOBCOMPLRTION = '3EB1D4F4638A42B1906ED59BF4E51818';

//问题ID
var T_PROBLEM_REP_ID = '';
//任务分配节点
var fbool = false;
var ADRESS = '';
//是否需要作业票
var WORK_PERMIT = '';
/**
 *问题信息加载
 * piid :流程id
 */
function Problem_information() {
	var html_Problem = '';
	var data = {
		'PIID' : piid
	};
	Server_data_loading('problem/getProblemInfo', data, function(msg) {
		//取消加载层
		if (msg.status == 0) {
			var result = msg.data;
			//数据获取
			T_PROBLEM_REP_ID = result.T_PROBLEM_REP_ID;
			ADRESS = result.ADRESS;
			WORK_PERMIT = result.WORK_PERMIT;
			//页面装载
			html_Problem += '<li><div class="justify-content">';
			html_Problem += '<small>申请人：' + result.APPLYPEOPLE + '</small>';
			html_Problem += '<small>申请日期：' + result.APPLYDATE + '</small>';
			html_Problem += '<small>装置单元：' + result.WEL_NAME + '</small>';
			var PROCESSTYPE = result.PROCESSTYPE;
			if (PROCESSTYPE == 1) {
				PROCESSTYPE = '巡回检查';
			}
			if (PROCESSTYPE == 2) {
				PROCESSTYPE = '属地监督';
			}
			if (PROCESSTYPE == 3) {
				PROCESSTYPE = '临时任务';
			}
			if (PROCESSTYPE == 4) {
				PROCESSTYPE = '例行作业';
			}
			if (PROCESSTYPE == 5) {
				PROCESSTYPE = '化验任务';
			}
			if (PROCESSTYPE == 8) {
				PROCESSTYPE = '问题上报';
			}
			html_Problem += '<small>问题来源：' + PROCESSTYPE + '</small>';
			html_Problem += '<small>当前进度：' + result.REMARKTWO + '</small>';
			var PROBLEMSTATE = result.PROBLEMSTATE;
			if (PROBLEMSTATE == 'FINISHED') {
				PROBLEMSTATE = '已处理';
			}
			if (PROBLEMSTATE == 'UNFINISHED') {
				PROBLEMSTATE = '未处理';
			}
			//html_Problem += '<small>问题状态：' + PROBLEMSTATE + '</small>';
			if (result.RECTIFICATIONPERIOD != '') {
				fbool = true;
				//数据回写
				$("#RECTIFICATIONPERIOD").val(result.RECTIFICATIONPERIOD);
				$(":radio[name='SP_ID'][value='" + result.SP_ID + "']").prop("checked", "checked");
				$(":radio[name='TICKET_NO'][value='" + result.TICKET_NO + "']").prop("checked", "checked");
				$("#RECTIFICATIONMEASURES").val(result.RECTIFICATIONMEASURES);

				$("#RECTIFICATIONPERIOD").attr("readonly", "readonly");
				$("#RECTIFICATIONMEASURES").attr("readonly", "readonly");
				$("input[name='SP_ID']").attr("disabled", "disabled");
				$("input[name='TICKET_NO']").attr("disabled", "disabled");

				html_Problem += '<small>解决日期：' + result.RECTIFICATIONPERIOD + '</small>';
				html_Problem += '<small>进入隐患：' + result.SP_ID + '</small>';
				html_Problem += '<small>解决措施：' + result.RECTIFICATIONMEASURES + '</small>';
			}
			html_Problem += '<small>问题描述：' + result.PROBLEMDESCRIBE + '</small>';
			html_Problem += '</div></li>';
			$('#Problem_information').html(html_Problem);
			//初始化数据
			Initialization();
		} else {
			alert(msg.message);
			return;
		}
	});
}

/**
 *流程扭转信息
 * piid :流程id
 */
function Twist_information() {
	var issue_Twist = '';
	var data = {
		'PIID' : piid
	};
	Server_data_loading('process/getProcessInfo', data, function(msg) {
		if (msg.status == 0) {
			var results = msg.data;
			//页面装载
			$.each(results, function(i, item) {
				issue_Twist += '<li><div class="justify-content">';
				issue_Twist += '<small>处理人：' + item.TASK_PEOPLE + '</small>';
				issue_Twist += '<small> 处理时间：' + item.TASK_DEAL_DATE + '</small>';
				issue_Twist += '<small>任务名称：' + item.TASK_NAME + ' </small>';
				issue_Twist += '<small> 处理操作：' + item.TASK_HANDLE + ' </small>';
				issue_Twist += '<small>处理意见：' + item.TASK_DEAL + '</small>';
				issue_Twist += '</div></li>';
			});
			$('#Twist_information').html(issue_Twist);
		} else {
			alert(data.message);
			return;
		}
	});
}

/**
 *加载处理人
 */
function Handle_person(ATID) {
	var userID = CacheUtil.getCache("username");
	var html_Handle = '';
	html_Handle += '<option value="">请选择下一节点的处理人</option>';
	var data = {
		'ATID' : ATID,
		'type' : 2,
		'userID' : userID,
		'PIID' : piid
	};
	console.log(ajaxurl + 'process/getExecutor?ATID=' + ATID + '&type=2&userID=' + userID + '&PIID=' + piid);
	Server_data_loading('process/getExecutor', data, function(msg) {
		if (msg.status == 0) {
			//数据获取
			var result = msg.data.USERS;
			var str = result.replace(/\"/g, '');
			var results = deleteRepetion(str);
			//解析读取回来的字符串
			for (var i = 0; i < results.length; i++) {
				if (results[i].trim() == 'null' || results[i].trim() == '') {
				} else {
					html_Handle += '<option value="' + results[i].trim() + '"> ' + results[i].trim() + ' </option>';
				}
			}
			$("#Handle_person").html(html_Handle);
		} else {
			alert(data.message);
			return;
		}
	});
}

/**
 *流程审批---执行下一步
 * userID  当前用户名,不能为空
 * PIID 当前流程实例ID，不能为空
 * executor 下一节点执行者，如：张三 不能为空
 * opinion  处理意见(即审批意见)。
 * type 操作类型，此处固定传入： 4 不能为空
 * businessType 业务类型：1:问题闭环，2：物资采购，3：物资申领 不能为空 4 维修申请单
 * data 业务数据,JSONArray格式
 * */
function checkIn(executor, opinion, data, newatid) {
	var userID = CacheUtil.getCache("username");
	console.log("下一步执行--------开始");
	console.log("userID==>>" + userID);
	console.log("data==>>" + data);
	console.log("piid==>>" + piid);
	console.log("下一步执行--------结束");
	var data = {
		'userID' : userID,
		'ATID' : newatid,
		'PIID' : piid,
		'executor' : executor,
		'opinion' : opinion,
		'type' : 4,
		'businessType' : 1,
		'TIID' : tiid,
		'data' : data
	};
	Server_data_loading('process/taskAgree', data, function(msg) {
		if (msg.status == 0) {
			bool = true;
			alert(msg.message);
			PageJump();
			return;
		} else {
			alert(msg.message);
			return;
		}
	});
}

/***
 * 问题闭环--执行下一步
 */
function workCheckIn(data) {
	console.log("问题闭环下一步执行--------开始");
	console.log("data==>>" + data);
	console.log("piid==>>" + piid);
	console.log("问题闭环下一步执行--------结束");
	var data = {
		'PIID' : piid,
		'data' : data
	};
	Server_data_loading('process/taskProblemWorksheet', data, function(msg) {
		if (msg.status == 0) {
			bool = true;
			//alert(msg.message);
			PageJump();
			return;
		} else {
			//alert(msg.message);
			return;
		}
	});
}

/**
 *流程审批--回退
 */
function Fallback(ATID, opinion, data, businessType) {
	var userID = CacheUtil.getCache("username");
	console.log("回退执行--------开始");
	console.log("ATID==>>" + ATID);
	console.log("userID==>>" + userID);
	console.log("data==>>" + data);
	console.log("piid==>>" + piid);
	console.log("回退执行--------结束");
	var data = {
		'userID' : userID,
		'PIID' : piid,
		'ATID' : ATID,
		'opinion' : opinion,
		'type' : 1,
		'data' : data,
		'businessType' : 1,
		'TIID' : tiid
	};
	Server_data_loading('process/taskBack', data, function(msg) {
		if (msg.status == 0) {
			alert(msg.message);
			Rollbacksuccess();
		} else {
			alert(msg.message);
			return;
		}
	});
}

var APPLY_ID = '';
/***
 *维修申请单数据
 */
function SelApplication_maintenance() {
	var data = {
		'PIID' : piid
	};
	Server_data_write_back('process/getRepairApply', data, function(msg) {
		if (msg.status == 0) {
			var result = msg.data;
			APPLY_ID = result.APPLY_ID;
			//数据获取
			Processingnode(1);
			//页面装载
		} else {
			Processingnode(0);
			return;
		}
	});
}

/***
 *维修申请单数据
 */
function Application_maintenance() {
	var html_Application = '';
	var data = {
		'PIID' : piid
	};
	Server_data_loading('process/getRepairApply', data, function(msg) {
		if (msg.status == 0) {
			//数据获取
			var result = msg.data;
			//页面装载
			html_Application += '<li><div class="justify-content">';
			html_Application += '<small>申请部门：' + result.APPLY_DEPT + '</small>';
			html_Application += '<small>申请时间：' + result.APPLY_TIME + '</small>';
			html_Application += '<small>部门负责人：' + result.DEPT_MANAGER + ' </small>';
			html_Application += '<small>单位负责人：' + result.COM_MANAGER + ' </small>';
			html_Application += '<small>维护修理时间：' + result.REPAIR_TIME + '</small>';
			//html_Application += '<small>经办人：'+result.AGENT+'</small>';
			html_Application += '<small>维护修理项目及要求：' + result.PRO_REQUIR + '</small>';
			html_Application += '</div></li>维护修理内容及材料<li>';
			html_Application += '<div class="justify-content"><table>';
			html_Application += '<tr>';
			html_Application += '<td>序号 </td>';
			html_Application += '<td>维修内容及材料</td>';
			html_Application += '<td>规格型号</td>';
			html_Application += '<td>数量</td>';
			html_Application += '<td>备注</td>';
			html_Application += '</tr>';
			var results = result.CZ_REPAIR_APPLY_MATERIAL;
			$.each(results, function(i, item) {
				html_Application += '<tr><td>' + (i + 1) + ' </td>';
				html_Application += '<td>' + item.CONTENT_MATERIAL + '</td>';
				html_Application += '<td>' + item.SPECI_MODEL + '</td>';
				html_Application += '<td>' + item.MATERIAL_NUM + '</td>';
				html_Application += '<td>' + item.REMARK + '</td>';
				html_Application += '</tr>';
			});
			html_Application += '</table></div></li>';
			$('#Application_maintenance').html(html_Application);
		} else {
			alert(msg.message);
			return;
		}
	});
}

/**
 *作业验收时调用
 *userID 当前用户名,不能为空
 * PIID 当前流程实例ID，不能为空
 * opinion 处理意见(即审批意见)。
 * type 操作类型，此处固定传入： 2 不能为空
 * businessType 业务类型：1:问题闭环，2：物资采购，3：物资申领 不能为空
 * data  业务数据,JSONArray格式
 *  终止
 * */
function operatermination(opinion, data) {
	var userID = CacheUtil.getCache("username");
	if (confirm("确认完成任务?")) {
		var data = {
			'userID' : userID,
			'PIID' : piid,
			'opinion' : opinion,
			'type' : 2,
			'businessType' : 1,
			'data' : data,
			'TIID' : tiid
		};
		Server_data_loading('process/taskAdvance', data, function(msg) {
			if (msg.status == 0) {
				//alert(data.message);
				alert("任务执行成功！");
				PageJump();
			} else {
				alert(data.message);
				return;
			}
		});
	} else {

	}
}

/***
 *数据写入维修申请单数据
 */
function addApplication_maintenance() {
	//console.log(ajaxurl + 'process/getRepairApply?PIID='+piid);
	var data = {
		'PIID' : piid
	};
	Server_data_write_back('process/getRepairApply', data, function(msg) {
		//取消加载层
		if (msg.status == 0) {
			//数据获取
			var result = msg.data;
			//数据获取
			var sql = "insert into CZ_REPAIR_APPLY(APPLY_ID,T_PROBLEM_REP_ID,APPLY_DEPT,APPLY_TIME,PRO_REQUIR,DEPT_MANAGER,COM_MANAGER,REPAIR_TIME,AGENT,ACCEPT_RESULT,REMARK,PIID,REMARK_ONE,REMARK_TWO,REMARK_THREE,REMARK_FOUR) values('" + result.APPLY_ID + "','" + result.T_PROBLEM_REP_ID + "','" + result.APPLY_DEPT + "','" + result.APPLY_TIME + "','" + result.PRO_REQUIR + "','" + result.DEPT_MANAGER + "','" + result.COM_MANAGER + "','" + result.REPAIR_TIME + "','" + result.AGENT + "','" + result.ACCEPT_RESULT + "','" + result.REMARK + "','" + result.PIID + "','" + result.REMARK_ONE + "','" + result.REMARK_TWO + "','" + result.REMARK_THREE + "','" + result.REMARK_FOUR + "')";
			db_execute(sql);
			var results = result.CZ_REPAIR_APPLY_MATERIAL;
			$.each(results, function(i, item) {
				var sql_1 = "insert into CZ_REPAIR_APPLY_MATERIAL(MATERIAL_ID,APPLY_ID,CONTENT_MATERIAL,SPECI_MODEL,MATERIAL_NUM,REMARK,PIID,REMARK_TWO,REMARK_THREE,REMARK_FOUR) values('" + item.MATERIAL_ID + "','" + item.APPLY_ID + "','" + item.CONTENT_MATERIAL + "','" + item.SPECI_MODEL + "','" + item.MATERIAL_NUM + "','" + item.REMARK + "','" + item.PIID + "','" + item.REMARK_TWO + "','" + item.REMARK_THREE + "','" + item.REMARK_FOUR + "')";
				db_execute(sql_1);
			});
			Initializationz();
		} else {
			alert(data.message);
			return;
		}
	});
}

/**
 *添加表数据
 */
function add_purchaseld() {
	var data = {
		'PIID' : piid
	};
	//数据远程获取，添加到数据表
	Server_data_write_back('materials/getMaterialApplyInfo', data, function(msg) {
		if (msg.status == 0) {
			db_execute("delete from CZ_MATERIAL_USE_APPLY_HEADER");
			db_execute("delete from CZ_MATERIAL_USE_APPLY_DETAIL");
			//物质申请主表
			var rest = msg.data.HEADER;
			//物质申请详情
			var rests = msg.data.DETAIL;
			$.each(rests, function(i, item) {
				var sql_dateil = " insert into CZ_MATERIAL_USE_APPLY_DETAIL(APPLY_DETAIL_ID,USE_APPLY_HEADER,MATERIAL_ID,MATERIAL_CODE,MATERIAL_NAME,SPECI_MODEL,MATERIAL_QUA,EXEC_STANDARD,UNIT,APPLY_NUM,AUDIT_NUM,ALLOCATION_NUM,REMARKONE,REMARKTWO,REMARKTHREE) ";
				sql_dateil += "values ('" + item.APPLY_DETAIL_ID + "','" + item.USE_APPLY_HEADER + "','" + item.MATERIAL_ID + "','" + item.MATERIAL_CODE + "','" + item.MATERIAL_NAME + "','" + item.SPECI_MODEL + "','" + item.MATERIAL_QUA + "','" + item.EXEC_STANDARD + "','" + item.UNIT + "','" + item.APPLY_NUM + "','" + item.AUDIT_NUM + "','" + item.ALLOCATION_NUM + "','" + item.REMARKONE + "','" + item.REMARKTWO + "','" + piid + "')";
				db_execute(sql_dateil);
			});
		} else {
			//alert(msg.message);
			return;
		}
	});
}

//采购/申领审核人
function Purchase_Apply_person(type) {
	var html_Purchase_Apply = '';
	html_Purchase_Apply += '<option value="">请选择下一节点的处理人</option>';
	var data = {
		'TYPE' : type,
	};
	//流程活动ID
	Server_data_loading('materials/getMaterialAudit', data, function(msg) {
		if (msg.status == 0) {
			//数据获取
			var result = msg.data;
			//解析读取回来的字符串
			var results = result.split(',');
			for (var i = 0; i < results.length; i++) {
				html_Purchase_Apply += '<option value="' + results[i] + '"> ' + results[i] + ' </option>';
			}
			$("#Handle_person").html(html_Purchase_Apply);
		} else {
			alert(msg.message);
			return;
		}
	});
}

/**
 * userID  当前用户名,不能为空
 * PIID 当前流程实例ID，不能为空
 * executor 下一节点执行者，如：张三 不能为空
 * opinion  处理意见(即审批意见)。
 * type 操作类型，此处固定传入： 4 不能为空
 * businessType 业务类型：1:问题闭环，2：物资采购，3：物资申领 不能为空
 * data 业务数据,JSONArray格式
 *  点击同意是调用*/
function checkIn_Purchase_Apply(executor, opinion, data, businessType) {
	var userID = CacheUtil.getCache("username");
	var data = {
		'userID' : userID,
		'PIID' : piid,
		'ATID' : newatid,
		'executor' : executor,
		'opinion' : opinion,
		'type' : 4,
		'data' : data,
		'businessType' : businessType,
		'TIID' : tiid
	};
	Server_data_loading('process/taskAgree', data, function(msg) {
		if (msg.status == 0) {
			PageJumps();
			alert(msg.message);
		} else {
			alert(msg.message);
			return;
		}
	});
}

//终止
function termination_Purchase_Apply(data, businessType) {
	var userID = CacheUtil.getCache("username");
	var data = {
		'userID' : userID,
		'PIID' : piid,
		'opinion' : '',
		'type' : 2,
		'businessType' : businessType,
		'data' : data,
		'TIID' : tiid
	};
	Server_data_loading('process/taskAdvance', data, function(msg) {
		if (msg.status == 0) {
			//alert(data.message);
			alert('任务执行成功！');
			jump('../operationratio.html');
		} else {
			alert(msg.message);
			return;
		}
	});
}

/**
 *userID 当前用户名,不能为空
 * PIID 当前流程实例ID，不能为空
 * opinion 处理意见(即审批意见)。
 * type 操作类型，此处固定传入： 2 不能为空
 * businessType 业务类型：1:问题闭环，2：物资采购，3：物资申领 不能为空
 * data  业务数据,JSONArray格式
 *  终止
 * */
function termination() {
	var userID = CacheUtil.getCache("username");
	if (confirm("终止流程?")) {
		var data = {
			'userID' : userID,
			'PIID' : piid,
			'opinion' : '',
			'type' : 2,
			'businessType' : 1,
			'data' : "{}",
			'TIID' : tiid
		};
		Server_data_loading('process/taskAdvance', data, function(msg) {
			if (msg.status == 0) {
				alert("任务执行成功!");
				//alert(data.message);
				jump('../operationratio.html');
			} else {
				alert(msg.message);
				return;
			}
		});
	} else {
		return;
	}
}

//加载回退节点
function Backspace_node() {
	var html_Backspace_node = '';
	html_Backspace_node += '<option>请选择回退节点</option>';
	var data = {
		'PIID' : piid,
	};
	Server_data_loading('process/getBack', data, function(msg) {
		if (msg.status == 0) {
			//数据获取
			var result = msg.data;
			//解析读取回来的字符串
			$.each(result, function(i, item) {
				html_Backspace_node += '<option value="' + item.TASK_TEMP_ID + '"> ' + item.TASK_INST_NAME + ' </option>';
			});
			$("#Backspace_node").html(html_Backspace_node);
		} else {
			alert(msg.message);
			return;
		}
	});
}

//临时承包商
function Application() {
	var data = {
		'PIID' : piid
	};
	Server_data_write_back('process/getRepairContractorApply', data, function(msg) {
		//取消加载层
		if (msg.status == 0) {
			var result = msg.data;
			APPLY_ID = result.APPLY_ID;
			//送单单位
			$("#APPLY_DEPT").val(result.APPLY_DEPT);
			//送单时间
			$("#APPLY_DATE").val(result.APPLY_DATE);
			//属地单位项目负责人
			$("#SUPERVISION_MANAGER").val(result.SUPERVISION_MANAGER);
			//检修项目及要求
			$("#PRO_REQUIR").val(result.PRO_REQUIR);
			//施工条件及材料准备情况
			$("#PREPARE_STATE").val(result.PREPARE_STATE);
			//安全提示
			$("#SAFETY_TIPS").val(result.SAFETY_TIPS);
			//施工单位
			$("#CONSTRUCTOR_DEPT").val(result.CONSTRUCTOR_DEPT);
			//接单时间
			$("#RECEIVE_TIME").val(result.RECEIVE_TIME);
			//开工时间
			$("#WORK_START_TIME").val(result.WORK_START_TIME);
			//完成时间
			$("#WORK_COMPLETE_TIME").val(result.WORK_COMPLETE_TIME);
			//作业许可证号
			$("#PERMIT_CODE").val(result.PERMIT_CODE);
			//检修人员
			$("#REPAIR_MAN").val(result.REPAIR_MAN);
			//施工单位项目负责人
			$("#CONSTRUCTOR_MANAGER").val(result.CONSTRUCTOR_MANAGER);
			//检修内容及材料
			$("#REPAIT_MATERIAL").val(result.REPAIT_MATERIAL);
			db_execute("insert into CZ_REPAIR_CONTRACTOR_APPLY(APPLY_ID,PIID) values('" + APPLY_ID + "','" + piid + "')");
			Initialization();
		} else {
			db_execute("insert into CZ_REPAIR_CONTRACTOR_APPLY(APPLY_ID,PIID) values('" + com_getUuid() + "','" + piid + "')");
			//alert(msg.message);
			Initialization();
			return;
		}
	});
}

//维修申请单回写本地数据库
function Temporary_contractor() {
	var data = {
		'PIID' : piid
	};
	Server_data_write_back('process/getRepairApply', data, function(msg) {
		//取消加载层
		if (msg.status == 0) {
			var resurt = msg.data;
			//申请部门
			var sql = "insert into CZ_REPAIR_APPLY(APPLY_ID,T_PROBLEM_REP_ID,APPLY_DEPT,APPLY_TIME,PRO_REQUIR,DEPT_MANAGER,COM_MANAGER,REPAIR_TIME,AGENT,ACCEPT_RESULT,REMARK,PIID,REMARK_ONE,REMARK_TWO,REMARK_THREE,REMARK_FOUR) ";
			sql = sql + " values('" + resurt.APPLY_ID + "','" + resurt.T_PROBLEM_REP_ID + "','" + resurt.APPLY_DEPT + "','" + resurt.APPLY_TIME + "','" + resurt.PRO_REQUIR + "','" + resurt.DEPT_MANAGER + "','" + resurt.COM_MANAGER + "','" + resurt.REPAIR_TIME + "','" + resurt.AGENT + "','" + resurt.ACCEPT_RESULT + "','" + resurt.REMARK + "','" + resurt.PIID + "','" + resurt.REMARK_ONE + "','" + resurt.REMARK_TWO + "','" + resurt.REMARK_THREE + "','" + resurt.REMARK_FOUR + "')";
			db_execute(sql);
			var resurts = resurt.CZ_REPAIR_APPLY_MATERIAL;
			$.each(resurts, function(i, item) {
				var sqlm = "insert into CZ_REPAIR_APPLY_MATERIAL(MATERIAL_ID,APPLY_ID,CONTENT_MATERIAL,SPECI_MODEL,MATERIAL_NUM,REMARK,PIID,REMARK_TWO,REMARK_THREE,REMARK_FOUR)";
				sqlm = sqlm + " values('" + item.MATERIAL_ID + "','" + item.APPLY_ID + "','" + item.CONTENT_MATERIAL + "','" + item.SPECI_MODEL + "','" + item.MATERIAL_NUM + "','" + item.REMARK + "','" + item.PIID + "','" + item.REMARK_TWO + "','" + item.REMARK_THREE + "','" + item.REMARK_FOUR + "')"
				db_execute(sqlm);
			});
			InitializationReq();
		} else {
			InitializationReq();
			//alert(msg.message);
			return;
		}
	});
}

/** 待办流程—任务申明*/
function ClaimTask(Piid, Tiid) {
	var userID = CacheUtil.getCache("username");
	var userPwd = CacheUtil.getCache("password");
	var data = {
		'userID' : userID,
		'userPwd' : userPwd,
		'PIID' : Piid,
		'TIID' : Tiid,
		'task_owner' : userID
	};
	Server_data_write_back('process/claimTask', data, function(msg) {
		//取消加载层
		if (msg.status == 0) {
			return;
		} else {
			return;
		}
	});
}

//防腐（保温）申请表
function Anticorrosive_contractor() {
	console.log(ajaxurl + 'process/getEquipmentApply?PIID=' + piid);
	var data = {
		'PIID' : piid
	};
	Server_data_write_back('process/getEquipmentApply', data, function(msg) {
		if (msg.status == 0) {
			var resurt = msg.data;
			db_execute("delete from CZ_EQUIPMENT_APPLY");
			db_execute("delete from CZ_EQUIPMENT_DETAIL");
			//申请部门
			var sql = "insert into CZ_EQUIPMENT_APPLY(EQUIPMENT_APPLY_ID,APPLY_UNIT,APPLY_TIME,APPLY_REQUIREMENT,APPLY_APPLICANT,APPLY_RESPONSIBLE,APPLY_APPROVAL,APPLY_UNIT_RESPONSIBLE,APPLY_CAREFUL,APPLY_WORKLOAD,APPLY_TYPE,PIID,APPLY_ONE,APPLY_TWO,APPLY_THREE,IM_PIID) ";
			sql = sql + " values('" + resurt.EQUIPMENT_APPLY_ID + "','" + resurt.APPLY_UNIT + "','" + resurt.APPLY_TIME + "','" + resurt.APPLY_REQUIREMENT + "','" + resurt.APPLY_APPLICANT + "','" + resurt.APPLY_RESPONSIBLE + "','" + resurt.APPLY_APPROVAL + "','" + resurt.APPLY_UNIT_RESPONSIBLE + "','" + resurt.APPLY_CAREFUL + "','" + resurt.APPLY_WORKLOAD + "','" + resurt.APPLY_TYPE + "','" + resurt.PIID + "','" + resurt.APPLY_ONE + "','" + resurt.APPLY_TWO + "','" + resurt.APPLY_THREE + "','" + resurt.IM_PIID + "')";
			db_execute(sql);
			var resurts = resurt.CZ_EQUIPMENT_DETAIL;
			$.each(resurts, function(i, item) {
				var sqlm = "insert into CZ_EQUIPMENT_DETAIL(DETAIL_ID,EQUIPMENT_APPLY_ID,DETAIL_CONTENT,DETAIL_MODEL,DETAIL_NUBMER,DETAIL_REMARK,DETAIL_WORKLOAD,PIID,DETAIL_ONE,DETAIL_TWO,DETAIL_THREE,IM_PIID)";
				sqlm = sqlm + " values('" + item.DETAIL_ID + "','" + item.EQUIPMENT_APPLY_ID + "','" + item.DETAIL_CONTENT + "','" + item.DETAIL_MODEL + "','" + item.DETAIL_NUBMER + "','" + item.DETAIL_REMARK + "','" + item.DETAIL_WORKLOAD + "','" + item.PIID + "','" + item.DETAIL_ONE + "','" + item.DETAIL_TWO + "','" + item.DETAIL_THREE + "','" + item.IM_PIID + "')"
				db_execute(sqlm);
			});
			Initialization();
		} else {
			Initialization();
			//alert(msg.message);
			return;
		}
	});
}

//固定承包商审核判断
function Audit_judgment() {
	var data = {
		'PIID' : piid
	};
	Server_data_write_back('problem/getIsDealedTaskAllot', data, function(msg) {
		//取消加载层
		if (msg.status == 0) {
			Judgment_result(msg.data.belongTo);
			return;
		} else {
			alert(msg.message);
			return;
		}
	});
}

//当前人所在部门获取
function Sector_acquisition() {
	var userID = CacheUtil.getCache("username");
	var data = {
		'userID' : userID
	};
	Server_data_write_back('process/getUserDept', data, function(msg) {
		if (msg.status == 0) {
			$("#APPLY_DEPT").val(msg.data);
			return;
		} else {
			$("#APPLY_DEPT").val('部门为空');
			//alert(msg.message);
			return;
		}
	});
}

//属地单位项目负责人
function supervision_manager(peoper) {
	var html_manager = '';
	var data = {
		'PRO_INST_ID' : piid,
		'TASK_TEMP_ID' : '',
		'TASK_INST_ID' : ''
	};
	Server_data_write_back('process/getTaskAllocation', data, function(msg) {
		if (msg.status == 0) {
			var ces = msg.data.split(',');
			html_manager += '<option value="">请选择属地单位项目负责人</option>';
			for (var i = 0; i < ces.length; i++) {
				if (ces[i] == peoper) {
					html_manager += '<option value="' + ces[i] + '" selected = "selected">' + ces[i] + '</option>';
				} else {
					html_manager += '<option value="' + ces[i] + '">' + ces[i] + '</option>';
				}
			}
			$("#SUPERVISION_MANAGER").html(html_manager);
			return;
		} else {
			alert(msg.message);
			return;
		}
	});
}


//数据写入
function Data_write_to_database(tableName, dataResule) {
	db_execute("delete from " + tableName);
	var k = 0;
	var ins = 'insert into ' + tableName + '(';
	var key = '';
	var value = '';
	jQuery.each(dataResule, function(i, val) {
		if (k == 0) {
			key = i;
			value = "'" + val + "'";
		} else {
			key = key + ',' + i;
			value = value + ",'" + val + "'";
		}
		k++;
	});
	var sql = ins + key + ') values(' + value + ')';
	db_execute(sql);
}


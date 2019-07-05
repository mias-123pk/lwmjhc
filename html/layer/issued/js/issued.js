/*
 *临时任务下达
 * ExMobi4.x+ JS
 *	Version	: 1.0.0
 *	Author	: zengshuai
 *	Email	:
 *	Weibo	:
 *	Copyright 2017 (c)
 */

//页面初始化加载
var coades = '';

var rcoades = '';
//登陆人
//登陆组的名称
var username = '';
//登陆人的名称
var name = '';

$(function() {
	//获取登陆的人员名称
	//获取登陆的组名称(以及用人员登陆的时候，显示的人员名称)
	username = localStorage.getItem("username");
	//如果是组登陆，则username和name都有值，如果是人员登陆，则name为空，username有值，且人员登陆只能单人登陆
	var html_name = '';
	//	if (!name) {//如果是人员登陆
	html_name += '<option value = "' + username + '">' + username + '</option>';
	//申请人赋值
	//	} else {//如果是组登陆，判断是单人登陆还是多人登陆
	//		var names = name.split(",");
	//		if (names.length > 1) {//如果长度大于1，则是多人登陆，多人登录换文本框为下拉框
	//			$("#creature").empty();
	//			html_name += '<option>请选择任务下达人</option>';
	//			for (var i = 0; i < names.length; i++) {
	//				html_name += '<option value="' + names[i] + '">' + names[i] + '</option>';
	//			}
	//		} else {
	//			//单人登陆
	//			html_name += '<option value = "' + names + '">' + names + '</option>';
	//		}
	//	}
	$("#creature").html(html_name);
	//加载操作卡
	coade();
	//加载小组
	chair();

});

//加载操作卡
var html = '';

function coade() {
	//加载层
	var index = layer.load(2, {
		shade: false
	});
	//0代表加载的风格，支持0-2
	//loading层
	var index = layer.load(1, {
		shade: [0.1, '#fff'] //0.1透明度的白色背景
	});
	//获取流程人物数据
	$.ajax({
		url: ajaxurl + 'common/fetch',
		type: "get",
		data: {
			'userID': username,
			'dataObjectID': 'CZ_OPERATION_CARD_MANAGER'
		},
		dataType: "jsonp",
		jsonp: "jsonpCallBack",
		cache: false,
		success: function(msg) {
			//取消加载层
			layer.close(index);
			if(msg.status == 0) {
				//数据获取
				var results = msg.data;
				$.each(results, function(i, item) {
					html += '&nbsp;&nbsp;&nbsp;<tr><input type="checkbox" name="check"  value="' + item.OPE_CM_ID + '">';
					html += '<span>' + item.OPE_CARD_NAME + '</span></input></tr><br />';
				});
				$("#goodcoade").html(html);
			} else {
				alert(msg.message);
				return;
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			//取消加载层
			layer.close(index);
			alert("连接服务器失败，请联系管理员！");
		}
	});
}

//加载小组
function chair() {
	var html_chair = '';
	db.transaction(function(tx) {
		tx.executeSql("select * from CZ_TASK_TEAM", [], function(tx, result) {
			var len = result.rows.length;
			html_chair += '<option>请选择执行小组</option>';
			for(var i = 0; i < len; i++) {
				var results = result.rows.item(i);
				html_chair += '<option value="' + results.TASK_TEAM_NAME + '">' + results.TASK_TEAM_NAME + '</option>';
			}
			$("#squad").html(html_chair);
		}, function onError(tx, error) {
			console.log(error.message);
		});
	});

}

/**
 *数据封装
 * "GIVENEOPLE ": 下达人,
 * "IS_LINK_EQU": 是否关联设备,
 * "PIID": "",
 * "TASK_TEAM_NAME": 执行小组,
 * "GIVEDATE": 下达时间,
 * "CONTACKINFORMATION": 下达人联系方式,
 * "GIVEDEPARTMENT": 下达部门,
 * "TASK_NAME": 任务名称,*
 * "WEL_NAME": 井站名称,
 * "OPE_CARD_NAME": 操作卡名称,
 * "OPE_CM_ID": 操作卡基本信息表主键,
 * "REQUIREDENDDATE": 要求完成时间,*
 * "PLANNED_COMPLETION_TIME":计划完成时间点,*
 * "REMINDER_TIME": 提前提醒,*
 * "TASKCONTENT": 任务内容,
 * "RISKWARING": 风险提示
 */
/**
 *下达
 *  参数说明：
 *  userID: 当前用户信息(JSONObject格式){'userID':'杨帆'}
 * data:业务数据(参考PC端界面)
 * data={'GIVENEOPLE ':'杨帆','IS_LINK_EQU':'FALSE','PIID':'',
 * 'TASK_TEAM_NAME':'仪表小组','GIVEDATE':'2017-06-05 16:30:06','CONT
 * ACKINFORMATION':'MobileInterfaceTest','GIVEDEPARTMENT':'MobileInt
 * erfaceTest','TASK_NAME':'MobileInterfaceTest','WEL_NAME':'仪表小组','
 * OPE_CARD_NAME':'D-1102污液压送操作卡,MDEA胺液过滤器F-1201更换滤芯操作卡','OPE_C
 * M_ID':'2,3','REQUIREDENDDATE':'2017-06-13 16:28:27','PLANNED_COMPLETIO
 * N_TIME':'2','REMINDER_TIME':'2','TASKCONTENT':'MobileInterfaceTest','RI
 * SKWARING':'MobileInterfaceTest'}
 * dataSourceID:数据源ID(固定值)
 * WsType:处理类型(固定值)
 * className:后台处理类地址(固定值)
 * */
function savecoade() {
	var datas = {};
	datas["GIVENEOPLE "] = $("#creature").val();
	//获取下达部门
	datas["GIVEDEPARTMENT"] = $("#branch").val().trim();
	datas["PIID"] = "";
	//获取下达人联系方式
	var reg = /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/;
	var contact = $("#contact").val().trim();
	if(!reg.test(contact)) {
		alert("请输入正确的联系方式！");
		return;
	}
	datas["CONTACKINFORMATION"] = contact;
	//获取任务名称
	var taskname = $("#taskname").val().trim();
	if(taskname == '' || taskname == null) {
		alert("请输入临时任务名称！");
		return;
	}
	datas["TASK_NAME"] = taskname;
	//操作卡主键
	datas["OPE_CM_ID"] = rcoades;
	//获取小组名

	datas["TASK_TEAM_NAME"] = $("#squad").val().trim();
	datas["WEL_NAME"] = $("#squad").val().trim();
	//获取操作卡名称
	datas["OPE_CARD_NAME"] = coades;
	datas["GIVEDATE"] = com_getNowFormatDate();
	//获取是否关联设备
	datas["IS_LINK_EQU"] = $("#facility").val().trim();
	//获取要求完成日期
	var askTime = com_formatDateTime($("#askTime").val());
	if(askTime == '' || askTime == null) {
		alert("请选择要求完成日期！");
		return;
	}
	datas["REQUIREDENDDATE"] = askTime;
	//获取计划完成时间点
	var reg = /^[0-9]*[1-9][0-9]*$/;
	var planTime = $("#planTime").val().trim();

	if(planTime == '' || planTime == null) {
		alert("请输入计划完成时间点！");
		return;
	}
	if(!reg.test(planTime)) {
		alert("计划完成时间点,请输入数字！");
		return;
	}
	datas["PLANNED_COMPLETION_TIME"] = planTime;
	//获取提前提醒
	var remind = $("#remind").val().trim();
	if(remind == '' || remind == null) {
		alert("请输入提前提醒时间点！");
		return;
	}
	if(!reg.test(remind)) {
		alert("提前提醒,请输入数字！");
		return;
	}
	datas["REMINDER_TIME"] = remind;
	//获取任务内容
	datas["TASKCONTENT"] = $("#content").val().trim();
	//获取风险提示
	datas["RISKWARING"] = $("#reminder").val().trim();
	var data = JSON.stringify(datas);
	var userobj = '{"user":"' + username + '"}';
	//加载层
	var index = layer.load(2, {
		shade: false
	});
	//0代表加载的风格，支持0-2
	//loading层
	var index = layer.load(1, {
		shade: [0.1, '#fff'] //0.1透明度的白色背景
	});
	//获取流程人物数据
	$.ajax({
		url: url + 'dynamicui/ExtendInpoitServlet',
		type: "get",
		data: {
			'user': userobj,
			'data': data,
			'dataSourceID': 'CZ_TASK_TEMPORARY',
			'WsType': 'FormUserExtendInterface',
			'className': 'com.soa.ExtendSer.server.extend.service.TempTaskFactory'
		},
		dataType: "jsonp",
		jsonp: "jsonpCallBack",
		cache: false,
		success: function(msg) {
			//取消加载层
			layer.close(index);
			alert(msg.message);
			jump('../../index.html');
			//数据获取
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			//取消加载层
			layer.close(index);
			//alert("异常！");
			//jump('../../index.html');
			//alert(XMLHttpRequest.status);
			//alert(XMLHttpRequest.readyState);
			//alert(textStatus);
			alert("连接服务器失败，请联系管理员！");
		}
	});
}

//页面跳转
function chocked() {
	layer.open({
		title: '选择操作卡',
		closeBtn: 1, //不显示关闭按钮
		area: ['500px', '500px'],
		btn: ['确定'],
		yes: function(index, layero) {
			//按钮【按钮一】的回调
			confirms();
		},
		shadeClose: true,
		type: 1,
		skin: 'layui-layer-demo', //样式类名
		closeBtn: 0, //不显示关闭按钮
		anim: 2,
		shadeClose: true, //开启遮罩关闭
		content: html
	});

	//jump('issued_list.html?uuid=' + uuid);
}

function confirms() {
	//确认
	var i = 0;
	var html_code = '';
	$('input[name="check"]:checked').each(function() {
		if(i == 0) {
			coades = $(this).next('span').text();
			rcoades = $(this).val();
			html_code += (i + 1) + ':' + $(this).next('span').text() + '<br />';
		} else {
			coades = coades + ',' + $(this).next('span').text();
			rcoades = rcoades + ',' + $(this).val();
			html_code += (i + 1) + ':' + $(this).next('span').text() + '<br />';
		}
		i++;
	});
	$("#spancoade").html(html_code);
	layer.closeAll();
}
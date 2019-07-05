/*
 *首页功能
 *	Version	: 1.0.0
 *	Author	: liuhai
 *	Copyright 2016 (c)
 */
var newdate = ""; //当前日期
var username = ""; //登录的用户名
var userid = ""; //登录的用户ID
var major; //专业
var device; //装置列
$(function() {
	
	getBacklog();
	
//	data_upload();
//	criteSqllite('delete from CZ_TASK_RECORD');
//	username = localStorage.getItem("username");
//	userid = localStorage.getItem("userid");
//	newdate = com_formatDate(new Date());
//	major = localStorage.getItem("major");
//	device = localStorage.getItem("device");
//	if(major == null || device == null) {
//		Set_up();
//	} else {
//		$("#uname").html('<table><tr><td>用户名:' + username + '</td><td>专业:' + major + '</td><td>装置列:' + device + '</td></tr></table>');
//		index_callback(device);
//	}
});


function Set_up() {
	var html = "";
	var ce = '净化,维修';
	var ces = ce.split(',');
	html += '<div>专业选择:';
	html += '<select style="width:200px;height:60px" id="zhuanye">';
	for(var i = 0; i < ces.length; i++) {
		html += '<option>' + ces[i] + '</option>';
	}
	html += '</select>';
	html += '</div>';
	html += '<br />';
	html += '<div>装置选择:';
	html += '<select style="width:200px;height:60px" id="zhuangzhilie">';
	//数据查询
	var dsql="select NAME from IOT_USER_ROLE i1,IOT_USER_USER_ROLE i2 where I1.ROLID=I2.ROLID AND REMARK2='paid' AND  I2.USERID='"+userid+"'";
	console.log(dsql)
	db.transaction(function(tx) {
		tx.executeSql(dsql, [], function(tx, result) {
			var len = result.rows.length;
			for(var i = 0; i < len; i++) {
				var arr = {};
				var results = result.rows.item(i);
				html += '<option>' + results.NAME + '</option>';
			}
			html += '</select>';
			html += '</div>';
			layer.open({
				title: '人员信息配置',
				type: 1,
				skin: 'layui-layer-rim', //加上边框
				btn: ['确定'],
				content: html,
				yes: function() {
					localStorage.setItem("DEPET", $("#zhuangzhilie  option:selected").text());
					localStorage.setItem("major", $("#zhuanye  option:selected").text());
					localStorage.setItem("device", $("#zhuangzhilie  option:selected").text());
					layer.closeAll();
					window.location.reload();
				}
			});
		}, function onError(tx, error) {
			console.log(error.message);
		});
	});
}
//---------任务加载---------------------------------------------------------------------------------
function index_callback(device) {
	var sql_patrolinspection = "select * from CZ_TASK_INSPECTION WHERE SCHEME_NAME LIKE '"+device+"%'";
	console.log(sql_patrolinspection)
	var sql_arr = [{
			"sql": sql_patrolinspection,
			"name": "巡回检查",
			"nextUrl": 'patrolinspection/html/patrolinspection.html',
			"sign": "span_patrolinspection"
		}
//	,
//		{
//			"sql": "select * from CZ_TASK_SUPERVISION_PROCESS",
//			"name": "属地简单",
//			"nextUrl": 'territorial/html/territorialsupervision_inspection.html',
//			"sign": "span_maintaining"
//		},
//		{
//			"sql": "select * from CZ_TASK_ROUTINE ",
//			"name": "例行作业",
//			"nextUrl": 'routine/html/routine_inspect.html',
//			"sign": "span_adhocassig"
//		},
//		{
//			"sql": "select * from CZ_TASK_TEMPORARY ",
//			"name": "临时任务",
//			"nextUrl": 'provisional/html/provisional_port.html',
//			"sign": "span_provisional"
//		},
//		{
//			"sql": "select * from CZ_TASK_ASSAY_SCHEME ",
//			"name": "化验作业",
//			"nextUrl": 'patrolinspection/html/patrolinspection.html',
//			"sign": "span_adhocassignment"
//		}
	];
	selSqllites(sql_arr);
//	getBacklog();//加载流程待办数量
}

//页面展示
function indexsql_true(arr) {
	var html_datastr = '';
	html_datastr += '<tr class="evertop">';
	html_datastr += '<th width="7%">序号</th>';
	html_datastr += '<th width="12%">任务名称</th>';
	html_datastr += '<th width="12%">任务类型</th>';
	html_datastr += '<th width="14%">完成期限</th>';
	html_datastr += '<th width="45px">状态</th>';
	html_datastr += '</tr>';

	$.each(arr, function(i, item) {
		var url = item.nextUrl + '?id=' + item.TASK_ID;
		html_datastr += '<tr  class="on">';
		html_datastr += '<td>' + (i + 1) + '</td>';
		html_datastr += '<td style="word-wrap:break-word;">' + item.TASK_NAME + '</a></td>';
		html_datastr += '<td>' + item.name + '</td>';
		html_datastr += '<td>' + item.TASK_START_TIME + '</td>';
		if(item.TASK_STATE == null || item.TASK_STATE == 'UNFINISHED') {
			if(new Date().getHours() != item.TASK_START_TIME && item.name == '巡回检查') {
				//			if(item.name != '巡回检查') {
				//不能编辑
				html_datastr += '<td><span class="mark-disable">时间未到</span></td>';
			} else {
				//未完成
				html_datastr += '<td><a href="' + url + '"><span class="mark-cancel">未完成</span></a></td>';
			}
		} else if(item.TASK_STATE == 'FINISHED') {
			//已完成
			html_datastr += '<td><a href="' + url + '"><span class="mark-success">已完成</span></a></td>';
		}

		html_datastr += '</tr>';
	});
	$("#indextbody").html(html_datastr);
}
///-----页面跳转-------------------------------------------------------------------------------
/***巡回 检查*/
function skipping(name) {
	if(name == 'patrolinspection') { //巡回检查
		jump('patrolinspection/html/patrolinspection.html');
	} else if(name == 'adhocassig') { //属地监督
		layer.msg("功能建设中...");
//		jump('territorial/html/territorialsupervision.html');
	} else if(name == 'routine') { //例行作业
		layer.msg("功能建设中...");
//		jump('routine/html/routine.html');
	} else if(name == 'provisional') { //临时任务
		layer.msg("功能建设中...");
//		jump('provisional/html/provisional.html');
	} else if(name == 'testCabinet') { //化验室作业
		layer.msg("功能建设中...");
//		jump('testCabinet/html/testCabinet.html');
	} else if(name == 'operationratio') { //我的代办
//		layer.msg("功能建设中...");
//		jump('operationratio/operationratio.html');
		jump('iot_process/html/pending-problem.html');
	} else if(name == 'Issuedprovisional') { //任务下达
		layer.msg("功能建设中...");
//		jump('issued/html/issued.html');
	} else if(name == 'problemReport') { //问题上报
//		layer.msg("功能建设中...");
//		jump('problemReport/html/problemReport_list.html');
		jump('iot_process/html/report.html');
	} else if(name == 'problemtracking') { //问题跟踪
		layer.msg("功能建设中...");
//		jump('problemtracking/html/problemtracking_list.html');
	} else if(name == 'device') { //设备信息
		//		jump('device/index.html');
		jump('device/html/device.html');
		//		jump('device/html/device-entry.html');
	} else if(name == 'supposed') { //应知应会
		layer.msg("功能建设中...");
//		jump('suppose/html/supposed.html');
	} else if(name == 'Remote') { //远程协助
		layer.msg("功能建设中...");
//		jump('TeamViewer/html/TeamViewer.html');
	}
}

//----数据查询-------------------------------------------------------
/**
 * 多数据表数据库数据查询
 * 针对首页数据展示
 */

function selSqllites(sql_arr) {
	var json_arr = [];
	db.transaction(function(tx) {
		$.each(sql_arr, function(i, titem) {
			tx.executeSql(titem.sql, [], function(tx, result) {
				var len = result.rows.length;
				for(var j = 0; j < len; j++) {
					var results = result.rows.item(j);
					var arr = {};

					var times = results.TASK_START_TIME.replace(/-/g, ':').replace(' ', ':');
					times = times.split(':');
					var time1 = new Date(times[0], (times[1] - 1), times[2], times[3], times[4], times[5]);
					//任务执行时间
					var hours = time1.getHours();
					if(titem.name == '巡回检查') {
						arr.TASK_ID = results.TASK_ID;
						arr.TASK_NAME = results.TASK_NAME.substring(0, results.TASK_NAME.indexOf("2"));
						arr.TASK_STATE = results.REMARK2;
						arr.TASK_START_TIME = hours;
					} else if(titem.name == '属地简单') {
						arr.TASK_ID = results.T_SP_ID;
						arr.TASK_NAME = results.TASK_NAME.substring(0, results.TASK_NAME.indexOf("2"));
						arr.TASK_STATE = results.STATE;
						arr.TASK_START_TIME = results.TASK_DEADLINE;
					} else if(titem.name == '例行作业') {
						arr.TASK_ID = results.TASK_ID;
						arr.TASK_NAME = results.TASK_NAME.substring(0, results.TASK_NAME.indexOf("2"));
						arr.TASK_STATE = results.TASK_STATE;
						arr.TASK_START_TIME = results.TASK_START_TIME;
					} else if(titem.name == '临时任务') {
						arr.TASK_ID = results.T_TEMPORARY_ID;
						arr.TASK_NAME = results.TASK_NAME.substring(0, results.TASK_NAME.indexOf("2"));
						arr.TASK_STATE = results.STATE;
						arr.PLANNED_COMPLETION_TIME = results.REQUIREDENDDATE;
					} else if(titem.name == '化验作业') {
						arr.TASK_ID = results.TASK_ID;
						arr.TASK_NAME = results.TASK_NAME.substring(0, results.TASK_NAME.indexOf("2"));
						arr.TASK_STATE = results.TASK_STATE;
						arr.PLANNED_COMPLETION_TIME = results.PLANNED_COMPLETION_TIME;
					}
					arr.name = titem.name;
					arr.nextUrl = titem.nextUrl;
					json_arr.push(arr);
				}
				$('#' + titem.sign).text(len);
				if((i + 1) == sql_arr.length) {
					indexsql_true(json_arr);
				}
			}, function onError(tx, error) {
				console.log(error.message);
			});

		});
	});

}

//我的待办--获取待办数量
function getBacklog(){
	console.log("11111");
//	var setUrl="";
//	var data={};
//	Server_data_write_back(setUrl, data,function(msg){
//		console.log(msg);
		$('#span_operationratio').text(20);
		
//	});
	
}

/*
 *	ExMobi4.x+ JS
 *	Version	: 1.0.0
 *	Author	: liuhai
 *	Email	:
 *	Weibo	:
 *	Copyright 2016 (c)
 */

//上一级  TASK_ID 任务实例ID
var TASK_ID = '',
	bool= 'true',
	POINT_ID = '',
	TASK_TIME = '',SCHEME_TYPE='';

$(function() {
	TASK_ID = getQueryString("TASK_ID");
	TASK_TIME = getQueryString('TASK_TIME');
	SCHEME_TYPE = getQueryString('SCHEME_TYPE');
	getpartition();
});

function getpartition() {
	var sql = "SELECT c1.*,c2.id as id,c2.REMARK1,c2.REMARK2,c2.VALUE from CZ_TASK_INSPECTION_POINT c1 left JOIN CZ_TASK_RECORD c2 on c1.TASK_POINT_ID=c2.TASK_POINT_ID and c2.TASK_TIME='" + TASK_TIME + "' and c2.REMARK2=1 where c1.TASK_ID=" + TASK_ID;
	//查找数据
	db.transaction(function(tx) {
		tx.executeSql(sql, [], function(tx, result) {
			var len = result.rows.length;
			var html_port = "";
			html_port += '<table border="1"><tbody><tr>';
			html_port += ' <td class="text-center">序号</td>';
			html_port += ' <td class="text-center">巡检点</td>';
			html_port += ' <td>状态</td>';
			html_port += ' <td class="text-center" colspan="2">操作</td>';
			html_port += '</tr>';
			for(var i = 0; i < len; i++) {
				var item = result.rows.item(i);
				var state =item.REMARK1;
				if(item.REMARK1 == null) {
					state =  'UNFINISHED';
				};
				var id=item.id;
				console.log(id)
				if(item.id ==null){
					id=com_getUuid();
					var in_sql = "INSERT INTO CZ_TASK_RECORD VALUES ('" + id + "', '', '" + item.TASK_ID + "', '" + item.TASK_POINT_ID + "', '', '" + newDate + "', '', '', '', '','UNFINISHED', 1, '','"+SCHEME_TYPE+"')";
					console.log(in_sql)
					criteSqllite(in_sql);
				}
				html_port += '<tr><td class="text-center">' + (i + 1) + '</td>';
				var TASK_POINT_ID = item.TASK_POINT_ID;
				if(state == 'UNFINISHED') {
					//未完成
					bool = 'false';
					html_port += ' <td>' + item.TASK_POINT_NAME + '</td><td>';
					html_port += '<a href=>';
					html_port += '<span class="mark-cancel">未完成</span></a>';
					html_port += '</td>';
					if(item.TASK_POINT_RFID == '' || item.TASK_POINT_RFID == null) {
						html_port += '<td class="text-center">' + '<a href="#" onclick="javascript:next(\'' + TASK_POINT_ID + '\')">执行</a></td>';
					} else {
						html_port += '<td class="text-center">' + '<a href="#" onclick="javascript:next(\'' + TASK_POINT_ID + '\')">执行</a></td>';
//						html_port += '<td class="text-center">' + '<a href="#" onclick="javascript:deviceentry_rfid_scaner(\'' + TASK_POINT_ID + '\')">执行</a></td>';
					}
					html_port += '<td class="text-center"><a href="#" onclick="javascript:termination(\'' + TASK_POINT_ID + '\',\'' + id + '\',\'' + item.TASK_POINT_NAME + '\')">终止</a></td>';
				} else if(state == 'FINISHED') {
					//完成
					html_port += ' <td>' + item.TASK_POINT_NAME + '</td><td>';
					html_port += '<a href="#" onclick="javascript:next(\'' + TASK_POINT_ID + '\')">';
					html_port += '<span class="mark-success">已完成</span></a></td>';
					html_port += '<td class="text-center" colspan="2">' + '<a href="#" onclick="javascript:next(\'' + TASK_POINT_ID + '\')">查看 </a></td>';
					//终止
				} else if(state == 'TERMINATION') {
					html_port += ' <td class="text-center">' + item.TASK_POINT_NAME + '</td><td>';
					html_port += ' <a href="#" onclick="javascript:termination(\'' + TASK_POINT_ID + '\')">';
					html_port += '<span class="mark-disable">终止</span></a></td>';
					html_port += '<td class="text-center" colspan="2">' + item.VALUE + '</td>';
				}
				html_port += '</tr>';
			}
			html_port += '</tbody></table>';
			
			if(bool == 'true') {
				var sql_CZ_TASK = "select * from CZ_TASK_RECORD where TASK_ID=" + TASK_ID + " and TASK_TIME='" + TASK_TIME + "' and REMARK2=0";
				db.transaction(function(tx) {
					tx.executeSql(sql_CZ_TASK, [], function(tx, result) {
						var len = result.rows.length;
						for(var i = 0; i < len; i++) {
							var item = result.rows.item(i);
							if(item.REMARK1=='UNFINISHED'){
								criteSqllite("update CZ_TASK_RECORD set REMARK1='FINISHED' where id='" + item.ID+"'");
							}
						}
					}, function onError(tx, error) {
						console.log(error.message);
					});
				});
			}
			$("#table1").html(html_port);
		}, function onError(tx, error) {
			console.log(error.message);
		});
	});
}

//调用设备扫描页面，获取RFID标签
function deviceentry_rfid_scaner(TASK_POINT_ID) {
	POINT_ID = TASK_POINT_ID;
	readData();
}

function deviceentry_rfid_scaner_rfidCallback(rfid) {
	var sql = "select * from CZ_TASK_INSPECTION_POINT where  TASK_POINT_RFID ='" + rfid + "' and TASK_POINT_ID= '" + POINT_ID + "'";
	//查找数据
	db.transaction(function(tx) {
		tx.executeSql(sql, [], function(tx, result) {
			var len = result.rows.length;
			if(len > 0) {
				window.open("patrolinspection_project.html?TASK_ID=" + TASK_ID + "&TASK_POINT_ID=" + results.TASK_POINT_ID);
			} else {
				alert('扫描失败，巡检点与巡检标签不匹配！');
			}
		}, function onError(tx, error) {
			console.log(error.message);
		});
	});
}
//下一步
function next(TASK_POINT_ID) {
//	jump('patrolinspection_project.html?TYPE=1&TASK_POINT_ID=' + TASK_POINT_ID + '&TASK_ID=' + TASK_ID + '&TASK_TIME=' + TASK_TIME);
	jump('patrolinspection1_inspection2.html?TYPE=1&TASK_POINT_ID=' + TASK_POINT_ID + '&TASK_ID=' + TASK_ID + '&TASK_TIME=' + TASK_TIME+ '&SCHEME_TYPE=' + SCHEME_TYPE);
}

//右下角返回
function back() {
	jump("patrolinspection.html?TASK_ID=" + TASK_ID + "&TASK_TIME=" + TASK_TIME);
}

//终止
function termination(TASK_POINT_ID,id,title) {
	if(confirm("确认终止?")) {
		jump("patrolinspection_termination.html?type=1&TASK_POINT_ID=" + TASK_POINT_ID+ '&TASK_TIME=' + TASK_TIME + "&TASK_ID=" + TASK_ID+ "&id=" + id+ "&title=" + title);
	} else {
		return;
	}
}
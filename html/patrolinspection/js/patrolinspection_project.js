/*
 *	ExMobi4.x+ JS
 *	Version	: 1.0.0
 *	Author	: liuhai
 *	Email	:
 *	Weibo	:
 *	Copyright 2016 (c)
 */
var TASK_POINT_ID = '',
	TASK_ID = '',
	bool, TASK_TIME = '',SCHEME_TYPE='';
$(function() {
	bool = 'true';
	TASK_ID = getQueryString('TASK_ID');
	TASK_POINT_ID = getQueryString('TASK_POINT_ID');
	TASK_TIME = getQueryString('TASK_TIME');
	SCHEME_TYPE = getQueryString('SCHEME_TYPE');
	var sql = "SELECT c1.*,c2.id,c2.REMARK1,c2.REMARK2,c2.VALUE from CZ_TASK_INSPECTION_CONTENT c1 left JOIN CZ_TASK_RECORD c2 on c1.TASK_CONTENT_ID=c2.TASK_CONTENT_ID and c2.TASK_TIME='" + TASK_TIME + "' and c2.REMARK2=2 where c1.TASK_POINT_ID='" + TASK_POINT_ID + "' order by c1.TASK_CONTENT_ORDER";
	selSqllite(sql);
});

function sql_true(results) {
	var html_port = "";
	html_port += '<tbody><tr>';
	html_port += ' <td>序号</td>';
	html_port += ' <td>巡检项目</td>';
	html_port += ' <td>状态</td>';
	html_port += ' <td class="text-center" colspan="2">操作</td>';
	html_port += '</tr>';
	for(var i = 0; i < results.length; i++) {
		var item = results.item(i);
		var state = item.REMARK1;
		var id=item.ID;
		if(state == null) {
			state = 'UNFINISHED';
		}
		if(id == null) {
			id=com_getUuid() ;
			var in_sql = "INSERT INTO CZ_TASK_RECORD VALUES ('" + id+ "', '', " + TASK_ID + ", '" + TASK_POINT_ID + "', '" + item.TASK_CONTENT_ID + "', '" + newDate + "', '', '', '', '','UNFINISHED', 2, '')";
			criteSqllite(in_sql);
		}
		html_port += '<tr><td>' + (i + 1) + '</td>';
		if(state == 'UNFINISHED') {
			bool = 'false';
			html_port += ' <td>' + item.TASK_CONTENT_NAME + '</td>';
			html_port += '<td><span class="mark-cancel">未完成</span></td><td>';
			html_port += '<a href="#" onclick="javascript:next(\'' + item.TASK_CONTENT_ID + '\',\'' + id + '\')">进入  </a></td>';
			html_port += '<td><a href="#" onclick="javascript:termination(\'' + item.TASK_CONTENT_ID + '\',\'' + id + '\',\'' + item.TASK_CONTENT_NAME + '\')">终止</a></td>';
		} else if(state == 'FINISHED') {
			html_port += ' <td>' + item.TASK_CONTENT_NAME + '</td>';
			html_port += '<td><span class="mark-success">已完成</span></td>';
			html_port += '<td colspan="2" class="text-center" colspan="2">' + '<a href="#" onclick="javascript:next(\'' + item.TASK_CONTENT_ID + '\',\'' + id + '\')"><span class="mark-success">进入</span></a></td>';
		} else if(state == 'TERMINATION') {
			html_port += ' <td>' + item.TASK_CONTENT_NAME + '</td>';
			html_port += '<td><a href="#" onclick="javascript:termination(\'' + item.TASK_CONTENT_ID + '\',\'' + item.TASK_CONTENT_NAME + '\',\'' + id + '\')">';
			html_port += '<span class="mark-disable">终止</span></a></td>';
			html_port += ' <td colspan="2">' + item.VALUE + '</td>';
		}
		html_port += '</tr>';
	}
	html_port += '</tbody>';
	$("#table1").html(html_port);
	if(bool == 'true') {
		var sql_CZ_TASK = "select * from CZ_TASK_RECORD where TASK_POINT_ID='" + TASK_POINT_ID + "' and TASK_TIME='" + TASK_TIME + "' and REMARK2=1";
		
		db.transaction(function(tx) {
			tx.executeSql(sql_CZ_TASK, [], function(tx, result) {
				var len = result.rows.length;
				for(var i = 0; i < len; i++) {
					var item = result.rows.item(i);
					
					console.log(item.REMARK1+"||"+item.ID)
					if(item.REMARK1 == 'UNFINISHED') {
					console.log("update CZ_TASK_RECORD set REMARK1='FINISHED' where ID='" + item.ID + "'")	
						criteSqllite("update CZ_TASK_RECORD set REMARK1='FINISHED' where ID='" + item.ID + "'");
					}
				}
			}, function onError(tx, error) {
				console.log(error.message);
			});
		});
	}
}
//pad右下角点击返回
function back_return() {
	jump("patrolinspection_port.html?TASK_ID=" + TASK_ID + "&TASK_TIME=" + TASK_TIME+ "&SCHEME_TYPE=" + SCHEME_TYPE);
}

//下一步
function next(TASK_CONTENT_ID, id) {
	
	jump('patrolinspection1_inspection1.html?TASK_CONTENT_ID=' + TASK_CONTENT_ID + '&TASK_POINT_ID=' + TASK_POINT_ID + '&TASK_ID=' + TASK_ID + '&TASK_TIME=' + TASK_TIME + "&id=" + id+ "&SCHEME_TYPE=" + SCHEME_TYPE);
}

//终止
function termination(TASK_CONTENT_ID, id, title) {
	if(confirm("确认终止?")) {
		jump("patrolinspection_termination.html?type=2&TASK_CONTENT_ID=" + TASK_CONTENT_ID + '&TASK_TIME=' + TASK_TIME + "&TASK_POINT_ID=" + TASK_POINT_ID + "&TASK_ID=" + TASK_ID + "&id=" + id + "&title=" + title+ "&SCHEME_TYPE=" + SCHEME_TYPE);
	} else {
		return;
	}
}
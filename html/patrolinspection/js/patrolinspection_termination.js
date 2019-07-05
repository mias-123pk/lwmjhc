/**
 *巡回检查_任务超期处理
 */
var TASK_ID = '';
//任务ID
var type = '';
var taskId = "";
//分类
var TASK_POINT_ID = '';
var TASK_CONTENT_ID = '',
	id = '',TASK_TIME='';
document.addEventListener("plusready", onPlusReady, false);

function onPlusReady() {
	TASK_ID = getQueryString('TASK_ID');
	TASK_POINT_ID = getQueryString('TASK_POINT_ID');
	TASK_CONTENT_ID = getQueryString('TASK_CONTENT_ID');
	TASK_TIME = getQueryString('TASK_TIME');
	id = getQueryString('id');
	type = getQueryString('type');
	//标题
	document.getElementById("title").innerText = getQueryString('title');
	initdata();
}

function initdata() {
	//获取当前任务信息
	var sql = "select * from CZ_TASK_RECORD where id='" + id + "'";
	//查找数据
	db.transaction(function(tx) {
		tx.executeSql(sql, [], function(tx, result) {
			var len = result.rows.length;
			for(var i = 0; i < len; i++) {
				var item = result.rows.item(i);
				var remake = item.VALUE;
				if(remake == "" || remake == null) {
					remake = "备用";
				}
				$('#textarea1').val(remake);
			}
		}, function onError(tx, error) {
			console.log(error.message);
		});
	});
}

//保存
function save() {
	problemDescription = $("#textarea1").val();
	if(problemDescription.replace(/(^\s*)/g, "") == '' || problemDescription.replace(/(^\s*)/g, "") == null) {
		alert("请输入终止原因！");
		return;
	} else {
		var sql = "update CZ_TASK_RECORD set REMARK2='TERMINATION',VALUE='" + problemDescription + "' where id='" + id + "'";
		//查找数据
		db.transaction(function(tx) {
			tx.executeSql(sql, [], function(tx, result) {
				alert('保存成功！');
				if(type == 1) {
					jump("patrolinspection_port.html?TASK_ID=" + TASK_ID+ '&TASK_TIME=' + TASK_TIME);
				}
				if(type == 2) {
					jump("patrolinspection_project.html?TASK_POINT_ID=" + TASK_POINT_ID + "&TASK_ID=" + TASK_ID+ '&TASK_TIME=' + TASK_TIME);
				}
			}, function onError(tx, error) {
				console.log(error.message);
			});
		});
	}
}

//页面跳转
function chocked() {
	var reason = '备用,装置检修,其他';
	var html_reason = '';
	var reasons = reason.split(',');
	for(var i = 0; i < reasons.length; i++) {
		html_reason += '&nbsp;&nbsp;&nbsp;<tr><input type="checkbox" name="check">';
		html_reason += '<span>' + reasons[i] + '</span></input><br />';
	}
	layer.open({
		title: '选择原因',
		closeBtn: 1, //不显示关闭按钮
		area: ['500px', 'auto'],
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
		content: html_reason
	});

	//jump('issued_list.html?uuid=' + uuid);
}

function confirms() {
	var coades = '';
	//确认
	var i = 0;
	$('input[name="check"]:checked').each(function() {
		if(i == 0) {
			coades = $(this).next('span').text();
		} else {
			coades = coades + '、' + $(this).next('span').text();
		}
		i++;
	});
	$("#textarea1").val(coades);
	layer.closeAll();
}


/*
 *	ExMobi4.x+ JS
 *	Version	: 1.0.0
 *	Author	: liuhai
 *	Email	:
 *	Weibo	:
 *	Copyright 2016 (c)
 */

//设备大类ID
var TYP_NAME = '';
var TYP_ID = '';

$(function() {
	TYP_ID = getQueryString("TYP_ID");
	TYP_NAME = getQueryString("TYP_NAME");
	$('#title').html(TYP_NAME);
	getpartition();
});

function getpartition() {
	layer.msg('加载设备列表。。。', {
		icon: 16,
		time: 500 * 1000,
		shade: 0.01
	});
	var sql = "select * from CZ_EQUIPMENT_INFO where EQU_MEMO_ONE='" + TYP_NAME + "'";
	$.post(url + "app/selDateSal", {
		sql: sql
	}, function(msg) {
		var rest = msg.data.content;
		var html_port = "";
		html_port += '<table border="1"><tbody><tr>';
		html_port += ' <td class="text-center">序号</td>';
		html_port += ' <td class="text-center">设备名称</td>';
		html_port += ' <td class="text-center">设备位号</td>';
		html_port += ' <td class="text-center">操作</td>';
		html_port += '</tr>';
		$.each(rest, function(i, item) {
			html_port += '<tr><td class="text-center">' + (i + 1) + '</td>';
			var EQU_ID = item.EQU_ID;
			html_port += ' <td class="text-center">' + item.EQU_NAME + '</td>';
			html_port += ' <td class="text-center">' + item.EQU_POSITION_NUM + '</td>';
			html_port += '<td class="text-center">' + '<a href="#" onclick="javascript:deviceentry_rfid_scaner(\'' + EQU_ID + '\',\'' + item.EQU_NAME + '\')">查看</a></td>';
			html_port += '</tr>';
		});
		html_port += '</tbody></table>';
		$("#table1").html(html_port);
		layer.closeAll();
	});
}

function deviceentry_rfid_scaner(EQU_ID, EQU_NAME) {
	jump("device_details.html?EQU_ID=" + EQU_ID + "&TYP_NAME=" + TYP_NAME + "&TYP_ID=" + TYP_ID + "&EQU_NAME=" + EQU_NAME);
}
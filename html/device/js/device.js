/*
 * 设备大类
 *	ExMobi4.x+ JS
 *	Version	: 1.0.0
 *	Author	: liuhai
 *	Email	:
 *	Weibo	:
 *	Copyright 2016 (c)
 */

$(function() {
	layer.msg('加载设备大信息。。。', {
		icon: 16,
		time: 500 * 1000,
		shade: 0.01
	});
	var html_supposed = '';
	var sql = "select * from CZ_EQUIPMENT_TYPES start with TYP_FATHER_ID=0 connect by prior TYP_ID = TYP_FATHER_ID";
	//查找数据
	html_supposed += '<details open>';
	$.post(url + "app/selDateSal", {
		sql: sql
	}, function(msg) {
		var rest = msg.data.content;
		$.each(rest, function(i, item) {
			
			var TYP_NAME = item.TYP_NAME
			if(item.TYP_FATHER_ID == 0) {
				html_supposed += '<details open>';
				html_supposed += '<summary class="sliver color-default bg-12">';
				html_supposed += TYP_NAME + '</summary>';
				html_supposed += '<div class="bg-white">';
				html_supposed += '<ul class="grid border" data-col="3" data-rowspace="8">';
				$.each(rest, function(is, items) {
					if(items.TYP_FATHER_ID == item.TYP_ID) {
						html_supposed += '<li>';
						html_supposed += '<a href="device-list.html?TYP_NAME=' + items.TYP_NAME + '">';
						html_supposed += items.TYP_NAME;
						html_supposed += '</a>';
						html_supposed += '</li>';
					}
				});
				html_supposed += '</ul>';
				html_supposed += '</div>';
				html_supposed += '</details>';
			}
		});
		$("#taskoves").html(html_supposed);
			layer.closeAll();
	});
});

//调用设备扫描页面，获取RFID标签
function deviceentry_rfid_scaner_rfidCallback(rfid) {
	//979CC703
	//查找数据
	db.transaction(function(tx) {
		tx.executeSql("select * from CZ_EQUIPMENT_INFO where SERIAL_NUM='" + rfid + "'", [], function(tx, result) {
			var len = result.rows.length;
			for(var i = 0; i < len; i++) {
				var results = result.rows.item(i);
				db.transaction(function(tx) {
					tx.executeSql("select * from CZ_EQUIPMENT_TYPES where TYP_NAME='" + results.EQU_MEMO_ONE + "'", [], function(tx, result2) {
						var len2 = result2.rows.length;
						for(var J = 0; J < len2; J++) {
							var results2 = result2.rows.item(J);
							console.log("device_details.html?EQU_ID=" + results.EQU_ID + "&TYP_NAME=" + results2.TYP_NAME + "&TYP_ID=" + results2.TYP_ID)
							jump("device_details.html?EQU_ID=" + results.EQU_ID + "&TYP_NAME=" + results2.TYP_NAME + "&TYP_ID=" + results2.TYP_ID);
						}
					}, function onError(tx, error) {
						console.log(error.message);
					});
				});
			}

		}, function onError(tx, error) {
			console.log(error.message);
		});
	});
}
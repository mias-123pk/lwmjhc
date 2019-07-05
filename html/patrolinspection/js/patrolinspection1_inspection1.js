/*
 *	ExMobi4.x+ JS
 *	Version	: 1.0.0
 *	Author	: liuhai
 *	Email	:
 *	Weibo	:
 *	Copyright 2017 (c)
 */
var TASK_CONTENT_ID = '',
	TASK_POINT_ID = '',
	TASK_ID = '',
	TASK_REQUIRE_ID = '',
	sql_CZ = '',
	id,
	TASK_TIME = '';

$(function() {
	
	TASK_CONTENT_ID = getQueryString('TASK_CONTENT_ID');
	TASK_POINT_ID = getQueryString('TASK_POINT_ID');
	TASK_ID = getQueryString('TASK_ID');
	id = getQueryString('id');
	TASK_TIME = getQueryString('TASK_TIME');


	//照片和视频加载
	PHO_CATEGORY_ID = TASK_CONTENT_ID;
	photo_view();

	sql_CZ = "SELECT c1.*,c2.id as id,c2.REMARK2,c2.VALUE from CZ_TASK_INSPECTION_REQUIRE c1 left JOIN CZ_TASK_RECORD c2 on c1.TASK_REQUIRE_ID=c2.TASK_REQUIRE_ID and c2.TASK_TIME='" + TASK_TIME + "' and c2.REMARK2=3 where c1.TASK_CONTENT_ID=" + TASK_CONTENT_ID;
	//数据查询、回调
	selSqllite(sql_CZ);
});

/**数据处理************************************************************/
//保存
var i = 0;
var time = com_getNowFormatDate();
var boo = 'true';

function submit() {
	boo = 'true';
	var ale = '';
	var dscval = '';
	//查找数据
	db.transaction(function(tx) {
		tx.executeSql(sql_CZ, [], function(tx, result) {
			var len = result.rows.length;
			for(var i = 0; i < len; i++) {
				var item = result.rows.item(i);
				if(boo == 'true') {
					if(item.REMARKFOUR == "TRUE") {
						if(item.TASK_REQUIRE_TYPE == '1') {
							if(item.MULCHOICE == 1) {
								ale = clack();
							} else {
								ale = $('input[name="' + item.TASK_REQUIRE_ID + '"]:checked').val();
								if(ale == null || ale == '') {
									alert("请完成所有需要完成的任务！");
									boo = 'false';
									return;
								} else {
									boo = 'true';
								}
							}
						}
						if(item.TASK_REQUIRE_TYPE == '2') {
							ale = $("#" + item.TASK_REQUIRE_ID).val();
							var reg = /^(\-|\+)?\d+(\.\d+)?$/;
							if(item.TASK_REQUIRE_SYMBOL != '') {
								if(ale.replace(/(^s*)|(s*$)/g, "").length == 0) {
									alert("请完成所有需要完成的任务！");
									boo = 'false';
									return;
								} else if(!reg.test(ale)) {
									alert("请输入正确数值！");
									boo = 'false';
									return;
								} else {
									boo = 'true';
								}
							}
							if(item.TASK_RESULT_STATUS == 'TRUE' || item.TASK_RESULT_STATUS == '') {
								var sqls = "select * from CZ_TASK_PROBLEM_REPORT where TAS_ID='" + item.TASK_REQUIRE_ID + "'";
								//查找数据
								db.transaction(function(tx) {
									tx.executeSql(sql, [], function(tx, result) {
										var len = result.rows.length;
										if(len == 0) {
											buileskip(item.TASK_REQUIRE_ID);
										}
									}, function onError(tx, error) {
										console.log(error.message);
									});
								});
							}
						}
						if(item.TASK_REQUIRE_TYPE == '3') {
							ale = $("#" + item.TASK_REQUIRE_ID).val();
							if(item.TASK_REQUIRE_SYMBOL != '') {
								var reg = /^(\-|\+)?\d+(\.\d+)?$/;
								if(ale.replace(/(^s*)|(s*$)/g, "").length == 0) {
									alert("请完成所有需要完成的任务！");
									boo = 'false';
									return;
								} else if(!reg.test(ale)) {
									alert("请输入正确数值！");
									boo = 'false';
									return;
								} else {
									boo = 'true';
								}
							}
						}
						if(item.REMARKFOUR != 'REPORTED') {
							if(item.TASK_RESULT_STATUS == 'FALSE') {
								var sqls = "select * from CZ_TASK_PROBLEM_REPORT where TAS_ID='" + item.TASK_REQUIRE_ID + "'";
								//查找数据
								db.transaction(function(tx) {
									tx.executeSql(sql, [], function(tx, result) {
										var len = result.rows.length;
										if(len == 0) {
											if(boo == 'true') {
												buileskip(item.TASK_REQUIRE_ID);
												boo = 'false';
											}
										}
									}, function onError(tx, error) {
										console.log(error.message);
									});
								});
							}
						}
					}
				}
			}

			if(boo == 'true') {
				for(var i = 0; i < len; i++) {
					var item_1 = result.rows.item(i);
					if(item_1.TASK_REQUIRE_TYPE == '1') {
						if(item_1.MULCHOICE == 1) {
							ale = clack();
						} else {
							ale = $('input[name="' + item_1.TASK_REQUIRE_ID + '"]:checked').val();
						}
					}
					if(item_1.TASK_REQUIRE_TYPE == '2') {
						ale = $("#" + item.TASK_REQUIRE_ID).val();
						dscval = $("#" + item.TASK_REQUIRE_ID + 'dcs').val();
					}
					if(item_1.TASK_REQUIRE_TYPE == '3') {
						ale = $("#" + item.TASK_REQUIRE_ID).val();
						dscval = $("#" + item.TASK_REQUIRE_ID + 'dcs').val();
					}
					if(ale == undefined) {
						ale = '';
					}
					criteSqllite("update CZ_TASK_RECORD set VALUE='" + ale + "',UNIT='" + dscval + "' where id='" + item.id + "'");
				}
				var up_sql = "update CZ_TASK_RECORD set REMARK1='FINISHED' where id='" + id + "'";
				//查找数据
				db.transaction(function(tx) {
					tx.executeSql(up_sql, [], function(tx, result) {
						alert('保存成功！');
						back_return();
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
//dcs数据获取
function builesdcs(TASK_REQUIRE_ID, mun) {
	var data = {
		positionNum: mun
	};
	$.ajax({
		url: dcsurl,
		type: "get",
		data: data,
		cache: true,
		dataType: "jsonp",
		jsonp: "jsonpCallBack",
		success: function(msg) {
			return callbackName(msg.data);
		},
		error: function() {
			alert("访问服务器失败");
		}
	});
}

//处理事件
function buileskip(TASK_REQUIRE_ID) {
	var sql = "select * from CZ_TASK_INSPECTION_REQUIRE where TASK_REQUIRE_ID='" + TASK_REQUIRE_ID + "'";
	//查找数据
	db.transaction(function(tx) {
		tx.executeSql(sql, [], function(tx, result) {
				var len = result.rows.length;
				for(var i = 0; i < len; i++) {
					var item = result.rows.item(i);
					console.log(item.TASK_REQUIRE_RES_DESC);
					var arr = item.TASK_REQUIRE_RES_DESC.split(',');
					if(item.TASK_REQUIRE_TYPE == '1') {
						var value = $('input[name="' + TASK_REQUIRE_ID + '"]:checked').val();
						if(value == arr[1]) {
							up_termination(item.TASK_REQUIRE_ID);
						}
					}
					if(item.TASK_REQUIRE_TYPE == '2') {
						var tale = $("#" + TASK_REQUIRE_ID).val();
						if(item.TASK_REQUIRE_SYMBOL != '') {
							var reg = /^(\-|\+)?\d+(\.\d+)?$/;
							if(tale.replace(/(^s*)|(s*$)/g, "").length == 0) {
								alert("请输入数值！");
								boo = 'false';
								return;
							} else if(!reg.test(tale)) {
								alert("请输入正确数值！");
								boo = 'false';
								return;
							}
							var sqlc = "select * from CZ_CCS_PARA where CCS_PARA_ID='" + item.TASK_CCS_PARA_ID + "'";
							//查找数据
							db.transaction(function(tx) {
								tx.executeSql(sqlc, [], function(tx, result) {
										var len = result.rows.length;
										for(var i = 0; i < len; i++) {
											var item_pa = result.rows.item(i);
											if(item.TASK_REQUIRE_MAX - tale <= 0) {
												return;
											} else {
												up_termination(item.TASK_REQUIRE_ID);
											}
										}
										if(item_pa.TASK_REQUIRE_SYMBOL == 'gt') {
											if(item.TASK_REQUIRE_MAX - tale < 0) {
												return;
											} else {
												up_termination(item.TASK_REQUIRE_ID);
											}
										}
										if(item_pa.TASK_REQUIRE_SYMBOL == 'le') {
											if(tale - item.TASK_REQUIRE_MIX <= 0) {
												return;
											} else {
												up_termination(item.TASK_REQUIRE_ID);
											}
										}
										if(item_pa.TASK_REQUIRE_SYMBOL == 'lt') {
											if(tale - item.TASK_REQUIRE_MIX < 0) {
												return;
											} else {
												up_termination(item.TASK_REQUIRE_ID);
											}
										}
										if(item_pa.TASK_REQUIRE_SYMBOL == 'ba') {
											if(item.TASK_REQUIRE_MIX - tale <= 0 && tale - item.TASK_REQUIRE_MAX <= 0) {
												return;
											} else {
												up_termination(item.TASK_REQUIRE_ID);
											}
										}
									},
									function onError(tx, error) {
										console.log(error.message);
									});
							});

						}
					}
					if(item.TASK_REQUIRE_TYPE == '3') {
						var tale = $("#" + TASK_REQUIRE_ID).val();
						if(item.TASK_REQUIRE_SYMBOL != '') {
							var reg = /^(\-|\+)?\d+(\.\d+)?$/;
							if(tale.replace(/(^s*)|(s*$)/g, "").length == 0) {
								alert("请输入数值！");
								boo = 'false';
								return;
							} else if(!reg.test(tale)) {
								alert("请输入正确数值！");
								boo = 'false';
								return;
							}
							if(item.TASK_REQUIRE_SYMBOL == 'ge') {
								if(item.TASK_REQUIRE_MAX - tale <= 0) {
									return;
								} else {
									up_termination(item.TASK_REQUIRE_ID);
								}
							}
							if(item.TASK_REQUIRE_SYMBOL == 'gt') {
								if(item.TASK_REQUIRE_MAX - tale < 0) {
									return;
								} else {
									up_termination(item.TASK_REQUIRE_ID);
								}
							}
							if(result[0].TASK_REQUIRE_SYMBOL == 'le') {
								if(tale - result[0].TASK_REQUIRE_MIX <= 0) {
									return;
								} else {
									up_termination(item.TASK_REQUIRE_ID);
								}
							}
							if(result[0].TASK_REQUIRE_SYMBOL == 'lt') {
								if(tale - result[0].TASK_REQUIRE_MIX < 0) {
									return
								} else {
									up_termination(item.TASK_REQUIRE_ID);
								}
							}
							if(result[0].TASK_REQUIRE_SYMBOL == 'ba') {
								if(result[0].TASK_REQUIRE_MIX - tale <= 0 && tale - result[0].TASK_REQUIRE_MAX <= 0) {
									return;
								} else {
									up_termination(item.TASK_REQUIRE_ID);
								}
							}
						} else {}
					}

				}
			},
			function onError(tx, error) {
				console.log(error.message);
			});
	});

}
//弹出选框并保存已录入的值,异常上报选择
function up_termination(TASK_REQUIRE_ID) {
	var dscval;
	var ale;
	layer.open({
		btnAlign: 'l',
		content: '设备数据异常！确定上报异常？',
		btn: ['确认', '取消', '已上报'],
		yes: function(index, layero) {
			//按钮【按钮一】的回调
			boo = 'false';
			//查找数据
			db.transaction(function(tx) {
				tx.executeSql(sql_CZ, [], function(tx, result) {
					var len = result.rows.length;
					for(var i = 0; i < len; i++) {
						var item = result.rows.item(i);
						if(item.TASK_REQUIRE_TYPE == '1') {
							ale = $('input[name="' + item.TASK_REQUIRE_ID + '"]:checked').val();
						} else if(item.TASK_REQUIRE_TYPE == '2') {
							ale = $("#" + item.TASK_REQUIRE_ID).val();
							dscval = $("#" + item.TASK_REQUIRE_ID + 'dcs').val();
						} else if(item.TASK_REQUIRE_TYPE == '3') {
							ale = $("#" + item.TASK_REQUIRE_ID).val();
							dscval = $("#" + item.TASK_REQUIRE_ID + 'dcs').val();
						}
						criteSqllite("update CZ_TASK_RECORD set VALUE='" + ale + "',UNIT='" + dscval + "' where id='" + item.id + "'");
						inspection(TASK_REQUIRE_ID);
						return;
					}
				}, function onError(tx, error) {
					console.log(error.message);
				});
			});

		},
		btn2: function(index, layero) {
			//按钮【按钮二】的回调
			boo = 'false';
			return;
		},
		btn3: function(index, layero) {
			//按钮【按钮三】的回调
			var sqls = "update CZ_TASK_INSPECTION_REQUIRE set TASK_RESULT_STATUS='FALSE',REMARKFOUR='REPORTED' where TASK_REQUIRE_ID='" + TASK_REQUIRE_ID + "'";
			criteSqllite(sqls);
			return;
		},
		cancel: function() {}
	});
}

//异常录入
function inspection(TASK_REQUIRE_ID) {
	var condition="?PROCESSTYPE=1&HTMLS='patrolinspection1_inspection2'&T_PROBLEM_REP_ID="+TASK_REQUIRE_ID + "&PARA_1=" + TASK_CONTENT_ID + "&PARA_2=" + TASK_POINT_ID + "&PARA_3=" + TASK_ID+ "&PARA_4=" + id + "&PARA_5=" + TASK_TIME;
	jump("../../problemReport/problemReport_detail.html"+condition);

}

//右下角返回页面
function back_return() {
	jump("patrolinspection_project.html?&TASK_POINT_ID=" + TASK_POINT_ID + "&TASK_ID=" + TASK_ID + "&TASK_TIME=" + TASK_TIME);
}

//获取复选框的值
function clack() {
	var res = '';
	$('input[name="test"]:checked').each(function() {
		if(i == 0) {
			res = $(this).val();
		} else {
			res = res + "," + $(this).val();
		}
		i++;
	});
	return res;
}
/*
 *	ExMobi4.x+ JS
 *	Version	: 1.0.0
 *	Author	: liuhai
 *	Email	:
 *	Weibo	:
 *	Copyright 2016 (c)
 */
var TASK_TIME;
var TASK_WEEK;
//采用回调函数的方式获取
function select_initData(date) {

	TASK_WEEK = getWeekStr(date);
//							criteSqllite("delete from CZ_TASK_RECORD");
	TASK_TIME = date;
	var sql_patrolinspection = "select c1.*,c2.id as id,c2.STATE as STATE,c2.REMARK1,c2.REMARK2,c2.EXECUTOR from CZ_TASK_INSPECTION c1 " +
		"LEFT JOIN CZ_TASK_RECORD c2 on c1.TASK_ID=c2.TASK_ID and POSITION_NUM=0 and (TASK_TIME='" + date + "' or TASK_TIME='" + TASK_WEEK + "')" +
		"where c1.SCHEME_NAME LIKE '" + localStorage.getItem("device") + "%' ORDER BY case when replace(substr(c1.TASK_START_TIME,10,2),'.','')='" + Hours + "' then 0 else 1 end";
	selSqllite(sql_patrolinspection);
	console.log(sql_patrolinspection)
}

function sql_true(results) {
	$("#table1").html('');
	$("#table2").html('');
	var html_initData1 = '',
		html_initData2 = '',
		EXECUTOR = '',
		j = 0,
		k = 0;
	html_initData1 += "<table align='center' style='table-layout:fixed;'>";
	html_initData1 += "<tbody><tr>";
	html_initData1 += " <th class='text-center' style='width:10%'>序号</th>";
	html_initData1 += "  <th  style='width:25%;text-align:center;'>任务名称</th>";
	html_initData1 += " <th style='width:25%;text-align:center;'>完成期限</th>";
	html_initData1 += " <th style='width:25%;text-align:center;'>执行人</th>";
	html_initData1 += "  <th style='width:20%;text-align:center;'>操作</th></tr>";
	html_initData2 += "<table align='center' style='table-layout:fixed;'>";
	html_initData2 += "<tbody><tr>";
	html_initData2 += " <th class='text-center' style='width:10%'>序号</th>";
	html_initData2 += "   <th style='width:25%;text-align:center;'>任务名称</th>";
	html_initData2 += " <th style='width:25%;text-align:center;'>完成期限</th>";
	html_initData2 += " <th style='width:25%;text-align:center;'>执行人</th>";
	html_initData2 += "  <th style='width:20%;text-align:center;'>操作</th></tr>";
	var len = results.length;
	for(var i = 0; i < len; i++) {
		var arr = {};
		var item = results.item(i);
		var c_id = item.id;
		var SCHEME_TYPE = item.SCHEME_TYPE;
		if(SCHEME_TYPE == 1) {

			if(c_id == null && TASK_TIME == newDate) {
				c_id = com_getUuid();
				var sql_json = {};
				sql_json.ID = c_id; //实例ID
				sql_json.TASK_ID = item.TASK_ID; //任务ID
				sql_json.TASK_TIME = newDate; //任务日期
				sql_json.STATE = 'UNFINISHED'; //任务状态
				sql_json.EXECUTOR = localStorage.getItem("username"); //任务执行人
				sql_json.REMARK1 = item.SCHEME_ID; //任务执行人
				sql_json.SCHEME_TYPE = item.SCHEME_TYPE; //任务标识
				sql_json.POSITION_NUM = '0'; //任务类型 0 巡检任务实例 1 巡检点实例 2 巡检要求实例
				//console.log(Assemble_sql_insert(sql_json, 'CZ_TASK_RECORD'))
				criteSqllite_texts(Assemble_sql_insert(sql_json, 'CZ_TASK_RECORD'));
			}
		} else if(SCHEME_TYPE == 5 || SCHEME_TYPE == 4) {
			if(c_id == null && TASK_WEEK == newweek) {
				c_id = com_getUuid();
				var sql_json = {};
				sql_json.ID = c_id; //实例ID
				sql_json.TASK_ID = item.TASK_ID; //任务ID
				sql_json.TASK_TIME = TASK_WEEK; //任务日期
				sql_json.STATE = 'UNFINISHED'; //任务状态
				sql_json.EXECUTOR = localStorage.getItem("username"); //任务执行人
				sql_json.REMARK1 = item.SCHEME_ID; //任务执行人
				sql_json.SCHEME_TYPE = item.SCHEME_TYPE; //任务标识
				sql_json.POSITION_NUM = '0'; //任务类型 0 巡检任务实例 1 巡检点实例 2 巡检要求实例
				//				console.log(Assemble_sql_insert(sql_json, 'CZ_TASK_RECORD'))
				criteSqllite_texts(Assemble_sql_insert(sql_json, 'CZ_TASK_RECORD'));
			}
		} else {
			if(c_id == null && TASK_TIME == newDate) {
				c_id = com_getUuid();
				var sql_json = {};
				sql_json.ID = c_id; //实例ID
				sql_json.TASK_ID = item.TASK_ID; //任务ID
				sql_json.TASK_TIME = newDate; //任务日期
				sql_json.STATE = 'UNFINISHED'; //任务状态
				sql_json.EXECUTOR = localStorage.getItem("username"); //任务执行人
				sql_json.REMARK1 = item.SCHEME_ID; //任务执行人
				sql_json.SCHEME_TYPE = item.SCHEME_TYPE; //任务标识
				sql_json.POSITION_NUM = '0'; //任务类型 0 巡检任务实例 1 巡检点实例 2 巡检要求实例
				//console.log(Assemble_sql_insert(sql_json, 'CZ_TASK_RECORD'))
				criteSqllite_texts(Assemble_sql_insert(sql_json, 'CZ_TASK_RECORD'));
			}
		}

		var state = item.STATE;
		if(state == null) {
			state = 'UNFINISHED';
		}

		var nowDate = com_getNowFormatDate();
		var quaryDate = item.TASK_START_TIME;

		var TASK_NAME = item.SCHEME_NAME;
		//		var TASK_NAME = item.TASK_NAME.substring(0, item.TASK_NAME.indexOf("2"));
		var times = quaryDate.substr(quaryDate.indexOf(".") + 1, 5);
		var task_hours = times.substr(0, times.indexOf('.'));
		//		var times = item.TASK_START_TIME.replace(/-/g, ':').replace(' ', ':');
		//		times = times.split(':');

		//		var time1 = new Date(times[0], (times[1] - 1), times[2], times[3], times[4], times[5]);
		//任务执行时间
		//		var hours = time1;
		var newHouse = new Date().getHours();
		if(item.EXECUTOR != null) {
			EXECUTOR = item.EXECUTOR;
		} else {
			EXECUTOR = localStorage.getItem("username");
		}
		var ID = item.TASK_ID;
		if(state == "UNFINISHED") {
			j = j + 1;
			html_initData1 += "  <tr><td class='text-center'>" + j + "</td><td style='word-wrap:break-word;'>";
			html_initData1 += TASK_NAME;
			console.log(SCHEME_TYPE)
			if(SCHEME_TYPE == 1) {
				html_initData1 += "</td><td class='text-center'>" + task_hours + "</td>";
			} else if(SCHEME_TYPE == 4 || SCHEME_TYPE == 5) {
				html_initData1 += "</td><td class='text-center'>" + TASK_WEEK + "</td>";
			} else {
				html_initData1 += "</td><td class='text-center'>" + task_hours + "</td>";
			}

			html_initData1 += "<td  class='text-center'>" + EXECUTOR + "</td><td class='text-center'>";
			if(SCHEME_TYPE == 1) {
				if(task_hours == newHouse && mutation([TASK_TIME, newDate])) {
					html_initData1 += "<a href='#' onclick='next(\"" + c_id + "\",\"" + task_hours + "\",\"" + item.SCHEME_TYPE + "\")'><span class='mark-info' style='margin: 6px 0 '>执行任务</span></a>";
					html_initData1 += "<a href='#' onclick='add(\"" + c_id + "\")'><span class='mark-success' style='margin:6px 0 '>添加人员</span></a>";
					html_initData1 += "<a href='#' onclick='delet(\"" + c_id + "\")'><span class='mark-cancel' >删除人员</span></a>";
				} else {
					html_initData1 += "<span class='mark-disable'>时间未到</span>";
				}
			} else if(SCHEME_TYPE == 5 || SCHEME_TYPE == 4) {
				if(TASK_WEEK == newweek) {
					html_initData1 += "<a href='#' onclick='next(\"" + c_id + "\",\"" + TASK_WEEK + "\",\"" + item.SCHEME_TYPE + "\")'><span class='mark-info' style='margin: 6px 0 '>执行任务</span></a>";
					html_initData1 += "<a href='#' onclick='add(\"" + c_id + "\")'><span class='mark-success' style='margin:6px 0 '>添加人员</span></a>";
					html_initData1 += "<a href='#' onclick='delet(\"" + c_id + "\")'><span class='mark-cancel' >删除人员</span></a>";
				} else {
					html_initData1 += "<span class='mark-disable'>时间未到</span>";
				}
			} else {
				if(task_hours == newHouse && mutation([TASK_TIME, newDate])) {
					html_initData1 += "<a href='#' onclick='next(\"" + c_id + "\",\"" + task_hours + "\",\"" + item.SCHEME_TYPE + "\")'><span class='mark-info' style='margin: 6px 0 '>执行任务</span></a>";
					html_initData1 += "<a href='#' onclick='add(\"" + c_id + "\")'><span class='mark-success' style='margin:6px 0 '>添加人员</span></a>";
					html_initData1 += "<a href='#' onclick='delet(\"" + c_id + "\")'><span class='mark-cancel' >删除人员</span></a>";
				} else {
					html_initData1 += "<span class='mark-disable'>时间未到</span>";
				}
			}
			html_initData1 += "</td></tr>";
		} else if(state == "FINISHED") {
			k = k + 1;
			html_initData2 += "  <tr><td class='text-center'>" + k + "</td><td style='word-wrap:break-word;'>";
			html_initData2 += TASK_NAME + "</td>";
			html_initData2 += "<td class='text-center'>" + task_hours + "</td>";
			html_initData2 += "<td>" + item.EXECUTOR + "</td><td>";
			html_initData2 += "<a href='#' onclick='next(\"" + item.id + "\")'><span class='mark-success'>已完成</span></a></td></tr>";
		}
	}
	html_initData1 += "  </tbody></table>";
	html_initData2 += "  </tbody></table>";
	$("#table1").html(html_initData1);
	$("#table2").html(html_initData2);
}
var tabbar = document.getElementById("tabbar");
var tab = tabbar.querySelectorAll(".tab");

function tabActive(index) {
	for(var i = 0,
			t; t = tab[i++];) {
		t.classList.remove("active");
	}
	tab[index].classList.add("active");
}

function initTabbar() {
	for(var i = 0,
			t; t = tab[i++];) {
		(function(i) {
			t.addEventListener("click", function() {
				carouselPage.slideTo(i - 1);
				tabActive(i - 1);
			}, false);
		})(i);
	}
}
//添加执行人
function add(id) {
	var html = "";
	html += '<div>用户名:';
	html += '<input type="text" style="height:40px" id="unames" value="邓娟" />';
	html += '</div>';
	html += '<hr>';
	html += '<div>密&nbsp;&nbsp;&nbsp;&nbsp;码:';
	html += '<input type="password" style="height:40px" id="psw" value="123" />';
	html += '</div>';
	layer.open({
		title: '添加执行人',
		type: 1,
		skin: 'layui-layer-rim', //加上边框
		area: ['420px', '240px'], //宽高
		btn: ['确定', '取消'],
		content: html,
		yes: function() {
			var unames = $("#unames").val();
			var psw = $("#psw").val();
			var sql = "select * from IOT_USER_ORGANIZATION where NAME='" + unames + "' and USER_PASSWORD='" + psw + "'";
			//查找数据
			db.transaction(function(tx) {
				tx.executeSql(sql, [], function(tx, result) {
						var len = result.rows.length;
						if(len == 0) {
							alert("用户名或密码错误！");
						} else {
							for(var i = 0; i < len; i++) {
								var results = result.rows.item(i);
								var a = new Array();
								var sql_s = "select * from CZ_TASK_RECORD where id='" + id + "'";
								//查找数据
								db.transaction(function(tx) {
									tx.executeSql(sql_s, [], function(tx, result) {
										var len = result.rows.length;
										for(var i = 0; i < len; i++) {
											var results = result.rows.item(i);
											var zxr = results.EXECUTOR + "";

											var arr_zxr = zxr.split(",");
											if(arr_zxr.indexOf(unames) == -1) {
												if(zxr.length > 0) {
													arr_zxr.push(unames);
													console.log(arr_zxr)
													//写入用户执行表
													var sql_up = "update CZ_TASK_RECORD set EXECUTOR='" + arr_zxr + "' where id='" + id + "'";
													console.log(sql_up)
													criteSqllite(sql_up);
												} else {
													a.push(unames);
													//写入用户执行表
													var sql_up = "update CZ_TASK_RECORD set EXECUTOR='" + a + "' where id='" + id + "'";
													criteSqllite(sql_up);
												}
											}
											layer.closeAll();
											index_p();
										}
									}, function onError(tx, error) {
										console.log(error.message);
									});
								});

							}
						}
					},
					function onError(tx, error) {
						console.log(error.message);
					});
			});
		},
		btn2: function() {

		}
	});
}

//删除执行人
function delet(id) {
	var html = "";
	html += '<table>';
	var sql_s = "select * from CZ_TASK_RECORD where id='" + id + "'";
	//查找数据
	db.transaction(function(tx) {
		tx.executeSql(sql_s, [], function(tx, result) {
				var len = result.rows.length;
				for(var i = 0; i < len; i++) {
					var results = result.rows.item(i);
					var a = results.EXECUTOR;
					var arr = a.split(",");
					if(a.length > 0) {
						for(var i = 0; i < arr.length; i++) {
							html += '<tr>';
							html += '<td>用户名:</td>';
							html += '<td>' + arr[i] + '</td>';
							html += '<td><a href="#" onclick="remove_arr(\'' + arr[i] + '\',\'' + results.ID + '\')">删除</a></td>';
							html += '</tr>';
						}
						html += '</table>';
						layer.open({
							title: '删除执行人',
							type: 1,
							skin: 'layui-layer-rim', //加上边框
							area: ['420px', '440px'], //宽高
							btn: ['确定', '取消'],
							content: html,
							yes: function() {
								//删除关信息
								layer.closeAll();
								index_p();
							},
							btn2: function() {}
						});
					} else {
						alert("没有执行人,请先添加执行人！");
						index_p();
					}
				}
			},
			function onError(tx, error) {
				console.log(error.message);
			});
	});
}

function remove_arr(name, id) {
	var zxr = new Array();
	var sql_s = "select * from CZ_TASK_RECORD where id='" + id + "'";
	//查找数据
	db.transaction(function(tx) {
		tx.executeSql(sql_s, [], function(tx, result) {
				var len = result.rows.length;
				for(var i = 0; i < len; i++) {
					var results = result.rows.item(i);
					var arr_a = results.EXECUTOR;
					var arr = arr_a.split(",");
					for(var i = 0; i < arr.length; i++) {
						if(arr[i] != name) {
							zxr.push(arr[i]);
						}
					}
					var sql_up = "update CZ_TASK_RECORD set EXECUTOR='" + zxr + "' where id='" + id + "'";
					//查找数据
					db.transaction(function(tx) {
						tx.executeSql(sql_up, [], function(tx, result) {
							alert("删除成功!");
							layer.closeAll();
							delet(id);
						}, function onError(tx, error) {
							console.log(error.message);
						});
					});

				}
			},
			function onError(tx, error) {
				console.log(error.message);
			});
	});
}
//下一步跳转
function next(id, task_hours, SCHEME_TYPE) {
	var sql_s = "select * from CZ_TASK_RECORD where id='" + id + "'";
	//查找数据
	db.transaction(function(tx) {
		tx.executeSql(sql_s, [], function(tx, result) {
				var len = result.rows.length;
				for(var i = 0; i < len; i++) {
					var results = result.rows.item(i);
					var arr_a = results.EXECUTOR.split(',');
					if(arr_a.length > 1) {
						jump("accordion.html?TASK_ID=" + results.TASK_ID + "&TASK_TIME=" + TASK_TIME + "&TASK_PIID=" + id + "&SCHEME_ID=" + results.REMARK1 + "&task_hours=" + task_hours + "&SCHEME_TYPE=" + SCHEME_TYPE);
					} else {
						alert("执行任务必须2人以上！");
					}
				}
			},
			function onError(tx, error) {
				console.log(error.message);
			});
	});
}

//pad点击返回上一级
function back() {
	window.open("../../index.html");
}

//返回上一级
function backs() {
	window.open("../../index.html");
}

function index_p() {
	select_initData(TASK_TIME);
}

/**
 * 操作数据库
 */
var i = 0;
var j = 0;

function criteSqllite_texts(sql) {
	layer.msg('数据写入中，请稍后。。。', {
		icon: 16,
		time: 50 * 1000,
		shade: 0.01
	});
	i++;
	//查找数据
	db.transaction(function(tx) {
		tx.executeSql(sql, [], function(tx, result) {
			j++;
			$('#footer').html();
			//			console.log('数据加载进度：' + j + '/' + i);
			if(i == j) {
				layer.closeAll();
				//				$('#footer').html('数据加载完成！');
				console.log("加载完成！！！！！！！！");
			}
		}, function onError(tx, error) {
			console.log(sql);
			console.log(error.message);
		});
	});
}
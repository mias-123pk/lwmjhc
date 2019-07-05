/**
 * html页面通用js方法及通用参数
 */
var File_PATH = "file:///storage/emulated/0/Download/"
//流程地址
var dcsurl = 'http://10.89.90.118:9876/iot_process';
//var HOST = localStorage.getItem("HOST"); //远程访问IP地址
//var PORT = localStorage.getItem("PORT"); //远程访问端口
//var HOST = '10.89.90.118'; //远程访问IP地址

var HOST = '192.168.1.121'; //远程访问IP地址
var PORT = '10238'; //远程访问端口
var times = 50 * 1000; //任务自动上传时间间隔 
var url = 'http://' + HOST + ':' + PORT + '/';
var newDate = com_formatDate(new Date()); //今天
var Hours = new Date().getHours(); //当前小时

var newweek = getWeekStr(com_formatDate(new Date()));

//if(Hours < 10) {
//	Hours = '0' + Hours;
//}

//var ajaxurl = url + 'CZ_PIOTMS/rest/';
/**   
 * 格式化时间,格式“yyyy-MM-dd”
 * date 时间
 */

function com_formatDate(date) {
	var str = date.toString();
	str = str.replace(/ GMT.+$/, '');
	var d = new Date(str);
	var a = [d.getFullYear(), d.getMonth() + 1, d.getDate()];
	if(a[1] < 10) {
		a[1] = "0" + a[1];
	}
	if(a[2] < 10) {
		a[2] = "0" + a[2];
	}
	str = a[0] + '-' + a[1] + '-' + a[2];
	return str;
}

/**获取当前的日期时间 格式“yyyy-MM-dd HH:MM:SS”*/
function com_getNowFormatDate() {
	var date = new Date();
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var date1 = date.getDate();
	var hour = date.getHours();
	var minutes = date.getMinutes();
	var seconds = date.getSeconds();
	if(month < 10) {
		month = "0" + month;
	}
	if(date1 < 10) {
		date1 = "0" + date1;
	}
	if(hour < 10) {
		hour = "0" + hour;
	}
	if(minutes < 10) {
		minutes = "0" + minutes;
	}
	if(seconds < 10) {
		seconds = "0" + seconds;
	}
	var time = year + "-" + month + "-" + date1 + " " + hour + ":" + minutes + ":" + seconds;

	return time;
}

function mutation(arr) {
	// 请把你的代码写在这里
	var a = arr[0].toLowerCase(); //第一个字符串 转小写
	var b = arr[1].toLowerCase(); //第二个字符串 转小写
	for(var i = 0; i < b.length; i++) {
		if(a.indexOf(b[i]) === -1) { //如果第一个字符串中没有包含第二个字符串的某个字符时，表明第一个字符串不包括第二个字符串的所有字符，返回false;
			return false;
		}
	}
	return true;

}

/**生成uuid代码*/
function com_getUuid() {
	var s = [];
	var hexDigits = "0123456789abcdef";
	for(var i = 0; i < 36; i++) {
		s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
	}
	s[14] = "4";
	// bits 12-15 of the time_hi_and_version field to 0010
	s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
	// bits 6-7 of the clock_seq_hi_and_reserved to 01
	s[8] = s[13] = s[18] = s[23] = "";
	var uuid = s.join("");
	return uuid;
}

/**
 * 获取url参数   var xx = getQueryString('reurl');
 * @param {Object} name 参数名
 */
function getQueryString(name) {
	var searchurl = decodeURIComponent(window.location.search);
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = searchurl.substr(1).match(reg);
	if(r != null)
		return unescape(r[2]);
	return null;
}

//页面跳转
function jump(urls) {
	window.open(urls);
}

//数据SQL操作封装(插入)
function Assemble_sql_insert(sql_json, tablename) {
	var sql = '',
		a = '',
		b = '',
		jslength = 0,
		length = 0;

	for(var js2 in sql_json) {
		jslength++;
	}
	sql += 'insert into ' + tablename + '(';
	$.each(sql_json, function(i, item) {
		length++
		if(length == jslength) {
			a += i;
			b += "'" + item + "'";
		} else {
			a += i + ',';
			b += "'" + item + "',";
		}
	});
	sql += a + ') values (' + b + ')';
	return sql;
}

//数据SQL操作封装(更新)
function Assemble_sql_update(sql_json, tablename, id) {
	var sql = '',
		Seta = '',
		Whereb = '',
		jslength = 0,
		length = 0;
	for(var js2 in sql_json) {
		jslength++;
	}
	sql = 'update ' + tablename + ' SET';
	$.each(sql_json, function(i, item) {
		length++
		if(i == id) {
			Whereb = " where " + i + "='" + item + "'";
		} else {
			if(length == jslength) {
				Seta += " " + i + "='" + item + "'";
			} else {
				Seta += " " + i + "='" + item + "',";
			}
		}
	});
	sql = sql + Seta + Whereb;
	return sql;
}

//window.setInterval("hello()", times);

//定时器 异步运行 
function hello() {
	var setUrl = "app/ceslj";
	console.log("尝试连接服务器。==》" + url + setUrl)
	$.post(url + setUrl, null, function(msg) {
		console.log("连接成功。")
		//上传任务
		data_upload();
	});

}

//上传任务数据
var sqlarr, num, jsonp;

function data_upload() {

	sqlarr = [];
	num = 0;
	jsonp = [];
	//	mui.alert('开始任务数据上传！', '数据上传', function() {
	//	layer.load();
	//查询数据封装
	var data = [];
	data.push(" CZ_TASK_RECORD where STATE='FINISHED' and POSITION_NUM='2' and  RECORD_TIME <> 'null'");
	//	data.push(" CZ_TASK_PROBLEM_REPORT where ISDOWNLOAD");

	var datas = [];
	datas.push("CZ_TASK_RECORD");
	//	datas.push("CZ_TASK_PROBLEM_REPORT");

	for(var i = 0; i < data.length; i++) {
		var sql = "select * from " + data[i];
		data_update(datas[i], sql, data.length);
	}
}

function data_update(name, sql, lens) {

	num++;
	var jsona = {};
	db.transaction(function(tx) {
		tx.executeSql(sql, [], function(tx, result) {
				var len = result.rows.length;
				var arr = [];
				if(len == 0) {
					jsona[name] = arr;
					jsonp.push(jsona);
				} else {
					for(var i = 0; i < len; i++) {
						var json = {};
						var results = result.rows.item(i);
						$.each(results, function(is, items) {
							json[is] = items;
						});
						arr.push(json);
						var up_sql = "";
						if(name == 'CZ_TASK_RECORD') {
							up_sql = "Update CZ_TASK_RECORD set RECORD_TIME='null' where ID='" + results.ID + "'";
							var sc_id = results.REMARK1;
							var IVID = results.ID;
							var ENDTIME = results.ENDTIME;
							var VALUE = results.VALUE;
							var REMARKTWO = results.REMARK2;
							var RECORD_TIME = results.RECORD_TIME;
							var TASK_REQUIRE_UNIT = results.TASK_REQUIRE_UNIT;
							var TASK_REQUIRE_ID = results.TASK_REQUIRE_ID;
							var TASK_EQU_POSITION_NUM = results.TASK_EQU_POSITION_NUM;
							var SCHEME_TYPE = results.SCHEME_TYPE;
							var TASK_ID = results.TASK_ID;
							var TASK_PIID = results.TASK_PIID;
							var EQU_NAME = results.EQU_NAME;
							
							var sqls = "";
							//							console.log('SCHEME_TYPE==>>' + results.SCHEME_TYPE)
							if(SCHEME_TYPE == 1) {
								//净化方案
								sqls = "insert into CZ_TASK_INSPECTION_VALUE(IVID,PLAN_ID,RECORD_TIME,POSITION_NUM,VALUE,REMARK1,UNIT,REMARK2)values('" + IVID + "','" + sc_id + "',TO_DATE( '" + ENDTIME + "','YYYY-MM-DD HH24:MI:SS'),'" + results.TASK_EQU_POSITION_NUM + "','" + VALUE + "','" + REMARKTWO + "','" + TASK_REQUIRE_UNIT + "','" + RECORD_TIME + "')";
							} else if(SCHEME_TYPE == 2 || SCHEME_TYPE == 6) {
								//静设备、工艺管道
								sqls = "insert into IOT_INSPECTION_VALUE_JSB(IVID,PLANID,PLANNUM,UNITTYPE,UNITNAME,EQUIPCOL,RECORDTIME,VALUE,UNIT,REQUIREID,REMARK1,REMARK2)values('" + IVID + "','" + sc_id + "','1','1','1','1',TO_DATE( '" + ENDTIME + "','YYYY-MM-DD HH24:MI:SS'),'" + VALUE + "','" + TASK_REQUIRE_UNIT + "','" + TASK_REQUIRE_ID + "','1','1')";
							} else if(SCHEME_TYPE == 3) {
								//维修电站
								sqls = "insert into IOT_INSPECTION_VALUE_LR(IVID,PLAN_ID,RECORD_TIME,POSITION_NAME,RECORD_TIME_NUM,VALUE,REQUIRE_ID)values('" + IVID + "','" + sc_id + "',TO_DATE( '" + ENDTIME + "','YYYY-MM-DD HH24:MI:SS'),'1','1','" + VALUE + "','" + TASK_REQUIRE_ID + "')";
							} else if(SCHEME_TYPE == 5 || SCHEME_TYPE == 4) {
								//动设备一类二类巡检记录
								sqls = "insert into IOT_INSPECTION_VALUE_ME(SCHEME_REMARK,REQUIRE_ID,PARA_VALUE,UNIT,POSITION_NUM,EQU_NAME,STANDBY1,STANDBY2,STANDBY3,RECORD_DATE,TASK_INST_ID)values('" + SCHEME_TYPE + "','" + TASK_REQUIRE_ID + "','" + VALUE + "','" + TASK_REQUIRE_UNIT + "','" + TASK_EQU_POSITION_NUM + "','"+EQU_NAME+"','','','',TO_DATE( '" + ENDTIME + "','YYYY-MM-DD HH24:MI:SS'),'" + TASK_PIID + "')";
							}
							console.log(sqls)
							$.post(url + "app/equitDateSal", {
								sql: sqls
							}, null);
						} else if(name == 'CZ_TASK_PROBLEM_REPORT') {

							up_sql = "Update CZ_TASK_PROBLEM_REPORT set ISDOWNLOAD='2' where T_PROBLEM_REP_ID='" + results.T_PROBLEM_REP_ID + "'";
						}
						sqlarr.push(up_sql);
						//更新数据
						//criteSqllite(up_sql);
					}
					jsona[name] = arr;
					jsonp.push(jsona);
					if(num == lens) {
						up(jsonp);
					}
				}
			},
			function onError(tx, error) {
				console.log(error.message);
			});
	});
}

function up(jsonp) {
	var setUrl = "app/upLoadTask";
	console.log(url + setUrl)
	$.post(url + setUrl, {
		json: JSON.stringify(jsonp)
	}, function(msg) {
		for(var i = 0; i < sqlarr.length; i++) {
			criteSqllite(sqlarr[i]);
		}
		//		layer.closeAll();
		//		layer.msg("上传成功！");
	});
}

function getWeekStr(str) {
	// 将字符串转为标准时间格式
	str2 = Date.parse(str);
	var date = new Date(str2);
	var month = date.getMonth() + 1;
	var week = getWeekFromDate(date);
	if(week === 0) { //第0周归于上月的最后一周
		month = date.getMonth();
		var dateLast = new Date();
		var dayLast = new Date(dateLast.getFullYear(), dateLast.getMonth(), 0).getDate();
		var timestamp = new Date(new Date().getFullYear(), new Date().getMonth() - 1, dayLast);
		week = getWeekFromDate(new Date(timestamp));
	}
	var time = month + "月第" + week + "周";
	return time;
}

function getWeekFromDate(date) {
	// 将字符串转为标准时间格式
	var w = date.getDay(); //周几
	if(w === 0) {
		w = 7;
	}
	var week = Math.ceil((date.getDate() + 6 - w) / 7) - 1;
	return week;
}


/***服务器数据调用*********************************************/
//服务器数据回写
function Server_data_write_back(setUrl, data, callbackName) {
	//数据获取
	$.ajax({
		url : dcsurl + setUrl,
		type : "GET",
		data : data,
		dataType : "json",
		contentType : "application/x-www-form-urlencoded",
		cache : true,
		success : function(msg) {
			return callbackName(msg);
		},
		error : function(XMLHttpRequest, textStatus, errorThrown) {
			//取消加载层
			alert("连接服务器失败，请检查网络连接！");
		}
	});
}

//服务器数据加载
function Server_data_loading(setUrl, data, callbackName) {
	//加载层
	var index = layer.load(2, {
		shade : false
	});
	//0代表加载的风格，支持0-2
	//loading层
	var index = layer.load(1, {
		shade : [0.1, '#fff'] //0.1透明度的白色背景
	});
	//数据获取
	$.ajax({
		url : dcsurl + setUrl,
		type : "GET",
		data : data,
		dataType : "json",
		contentType : "application/x-www-form-urlencoded",
		cache : true,
		success : function(msg) {
			layer.close(index);
			return callbackName(msg);
		},
		error : function(XMLHttpRequest, textStatus, errorThrown) {
			//取消加载层
			layer.close(index);
			console.log("XMLHttpRequest==>>" + XMLHttpRequest.status);
			console.log("textStatus==>>" + XMLHttpRequest.readyState);
			console.log("errorThrown==>>" + textStatus);
			alert("连接服务器失败，请检查网络连接！");
		}
	});
}
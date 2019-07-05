//上传任务数据
var sqlarr, num, jsonp;

function data_upload() {

	sqlarr = [];
	num = 0;
	jsonp = [];
	//	mui.alert('开始任务数据上传！', '数据上传', function() {
	//	layer.load();
	//查询数据封装
	var data = ["CZ_TASK_RECORD where REMARK1='FINISHED' and POSITION_NUM='' ", " CZ_TASK_PROBLEM_REPORT where ISDOWNLOAD=''"];
	//	var data = ["CZ_TASK_RECORD where REMARK1='FINISHED' ", " CZ_TASK_PROBLEM_REPORT"];
	var datas = ["CZ_TASK_RECORD", "CZ_TASK_PROBLEM_REPORT"];
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
				//				layer.closeAll();
				//				layer.msg("无数据上传！");
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
						up_sql = "Update CZ_TASK_RECORD set POSITION_NUM='2' where ID='" + results.ID + "'";
					} else if(name == 'CZ_TASK_PROBLEM_REPORT') {
						up_sql = "Update CZ_TASK_PROBLEM_REPORT set ISDOWNLOAD='2' where T_PROBLEM_REP_ID='" + results.T_PROBLEM_REP_ID + "'";
					}
					sqlarr.push(up_sql);
					//更新数据
					//					criteSqllite(up_sql);
				}

				jsona[name] = arr;
				jsonp.push(jsona);
				if(num == lens) {
					up(jsonp);
				}
			}
		}, function onError(tx, error) {
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
		console.log(sqlarr);
		for(var i = 0; i < sqlarr.length; i++) {
			console.log(sqlarr[i]);
			criteSqllite(sqlarr[i]);
		}
		//		layer.closeAll();
		//		layer.msg("上传成功！");
	});
}

/********多文件上传***********************/
/*
 *系统设置功能
 *	Version	: 1.0.0
 *	Author	: liuhai
 *	Copyright 2016 (c)
 */

var types = null;
function initialization_phase(table) {
	console.log(table)
	types = table;
	layer.load();
	$.post(url + "app/singleTableData", {
		table: table
	}, function(rest) {
		var msg = rest.data;
		layer.closeAll('loading');
		console.log(msg.tablename)
		var sql = "select * from " + msg.tablename;
		db.transaction(function(tx) {
			tx.executeSql(sql, [], function(tx, result) {
				//表存在
				criteSqllite_text("delete from " + msg.tablename);
				inserts(msg.content);
			}, function onError(tx, error) {
				//表不存在
				create_insert(msg.content);
			});

		});
	});

}

function create_insert(msg) {
	$.each(msg, function(i, item) {
		if(i == 'create') {
			$.each(item, function(is, items) {
				//创建数据表
				criteSqllite_text(items);
			});
		} else if(i == 'insert') {
			$.each(item, function(is, items) {
				$.each(items, function(is2, items2) {
					var inse = 'insert into ' + is + '(';
					var a = '';
					var b = '';
					var c = '';
					$.each(items2, function(is3, items3) {
						a += c + is3;
						b += c + "'" + items3 + "'";
						c = ',';
					});
					inse += a + ') values (' + b + ')';
					//写入数据库
					criteSqllite_text(inse);
				});
			});
		}
	});
}

function inserts(msg) {
	$.each(msg, function(i, item) {
		if(i == 'insert') {
			$.each(item, function(is, items) {
				$.each(items, function(is2, items2) {
					var inse = 'insert into ' + is + '(';
					var a = '';
					var b = '';
					var c = '';
					$.each(items2, function(is3, items3) {
						a += c + is3;
						b += c + "'" + items3 + "'";
						c = ',';
					});
					inse += a + ') values (' + b + ')';
					//写入数据库
					criteSqllite_text(inse);
				});
			});
		}
	});
}

/**
 * 操作数据库
 */
var i = 0;
var j = 0;

function criteSqllite_text(sql) {
	i++;
	//查找数据
	db.transaction(function(tx) {
		tx.executeSql(sql, [], function(tx, result) {
			j++;
			$('#' + types).val(j + '/' + i);
			if(i == j) {
				$('#' + types).val('数据加载完成！');
			}
		}, function onError(tx, error) {
			console.log(sql);
			console.log(error.message);
		});
	});
}
var db = openDatabase('westoil.db', '1.0', '移动端数据库',5*1024*1024 );

/**
 * 操作数据库
 */
function criteSqllite(sql) {
	db.transaction(function(tx) {
		tx.executeSql(sql);
	});
}

/**
 * 数据库数据查询
 */
function selSqllite(sql) {
	//查找数据
	db.transaction(function(tx) {
		tx.executeSql(sql, [], function(tx, result) {
			var results = result.rows;
			sql_true(results);
		}, function onError(tx, error) {
			console.log(error.message);
		});
	});
}


/**
 * 数据库数据查询
 */
function text(sql) {
	//查找数据
	db.transaction(function(tx) {
		tx.executeSql(sql, [], function(tx, result) {
			var len = result.rows.length;
				for(var i = 0; i < len; i++) {
					var item = result.rows.item(i);
				}
		}, function onError(tx, error) {
			console.log(error.message);
		});
	});

}





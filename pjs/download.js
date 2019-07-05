//下载初始化数据
var bool = false;

function datasync() {
	//	mui.alert('开始初始化系统！', '系統初始化', function() {
	$('#footer').html('测试服务器连接！==》' + url + "app/ceslj");
	console.log(url + "app/ceslj")
	$.post(url + "app/ceslj", null, function(rest) {
		bool = true;
	});

	layer.msg("服务器连接中...", {
		time: 5000,
		shade: 0.6,
		success: function(layero, index) {
			var msg = layero.text();
			var i = 10;
			var timer = null;
			var fn = function() {
				layero.find(".layui-layer-content").text(msg + '( ' + i + ' )');
				if(!i) {
					layer.close(index);
					clearInterval(timer);
				} else if(bool) {
					layer.close(index);
					clearInterval(timer);
				}
				i--;
			};
			timer = setInterval(fn, 1000);
			fn();
		},
	}, function() {
		if(bool) {
			lianji();
		} else {
			alert("连接操作，请检查网络状态，重新连接");
		}
		//这里写需要执行的
	});
	//	});
}

function lianji() {
	layer.msg('获取初始数据。。。', {
		icon: 16,
		time: 500 * 1000,
		shade: 0.01
	});
	console.log(url)
	$('#footer').html('获取初始数据！==》' + url + "app/dowTableList");
	$.post(url + "app/dowTableList", null, function(rest) {
		var msg = rest.data;
		layer.closeAll('loading');
		layer.msg('数据写入中，请稍后。。。', {
			icon: 16,
			time: 500 * 1000,
			shade: 0.01
		});
		$.each(msg.content, function(i, item) {
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
	});
}

//layer.msg弹窗倒计时
//second : 倒计时时间，单位，秒
//content: 弹窗内容，类型；String
function countDown() {

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
			$('#footer').html('数据加载进度：' + j + '/' + i);
			if(i == j) {
				layer.closeAll();
				$('#footer').html('数据加载完成！');
				console.log("加载完成！！！！！！！！");
			}
		}, function onError(tx, error) {
			console.log(sql);
			j++;
			console.log(error.message);
		});
	});
}
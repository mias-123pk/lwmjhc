/**
 * 登录页面逻辑
 */

var verion = ''; //版本号
var username = ''; //登录用户名
var password = ''; //登录密码
//页面加载方法
$(function() {
	layer.load(1);
	selIP();
});

function selIP() {
	//查找数据
	
	db.transaction(function(tx) {
		tx.executeSql('select * from IPORTHOST', [], function(tx, result) {
			var results = result.rows;
			$.each(results, function(i, item) {
				console.log(item.HOST)
				localStorage.setItem("HOST", item.HOST);
				localStorage.setItem("PORT", item.PORT);
//				HOST = item.HOST;
//				PORT = item.PORT;
				$("#head").html('服务器IP:' + HOST + "   端口 :" + PORT + '<a href="#" onclick="updates()" style="color:red">修改</a>');
				url = 'http://' + HOST + ':' + PORT + '/';
				layer.closeAll();
				remember_password();
			});
		}, function onError(tx, error) {
			insertfilrp();
		});
	});
}
//设置初始的IP和端口
function insertfilrp() {
	//查找数据
	db.transaction(function(tx) {
		tx.executeSql('CREATE TABLE IPORTHOST ("ID"  VARCHAR2(50) NOT null,"HOST"  VARCHAR2(250),"PORT"  VARCHAR2(250),PRIMARY KEY ("ID" ASC))', [], function(tx, result) {
			//查找数据
			db.transaction(function(tx) {
				tx.executeSql("INSERT INTO IPORTHOST VALUES (1, '10.89.90.118', '10238')", [], function(tx, result) {
					selIP();
				}, function onError(tx, error) {
					console.log(error.message);
				});
			});
		}, function onError(tx, error) {
			console.log(error.message);
		});
	});
}
//记住密码
function remember_password() {
	//检查是否需要初始化系统
	db.transaction(function(tx) {
		tx.executeSql("select * from IOT_USER_ORGANIZATION", [], function(tx, result) {
			if(localStorage.getItem("rem_bool") != null) {
				//跳转到首页
				log_Jump();
			}
		}, function onError(tx, error) {
			datasync();
		});
	});
}

//用户登录逻辑
function log_login() {
	username = $('#username').val();
	password = $('#password').val();
	if(username != '' && password != '') {
		var sql = "select * from IOT_USER_ORGANIZATION where NAME='" + username + "' and USER_PASSWORD='" + password + "'";
		//查找数据
		db.transaction(function(tx) {
			tx.executeSql(sql, [], function(tx, result) {
				var results = result.rows;
				sql_trues(results);
			}, function onError(tx, error) {
				alert("请先初始化系统！");
			});
		});

	} else {
		mui.alert('请输入正确的用户名和密码！', '登录提示', null);
		return;
	}
}

//登录成功验证回调
function sql_trues(result) {
	var len = result.length;
	if(result.length == 0) {
		mui.alert('请输入正确的用户名和密码！', '登录提示', null);
		return;
	} else {
		for(var i = 0; i < len; i++) {
			var results = result.item(i);
			var rem_bool = $("input[type='checkbox']").is(':checked');
			localStorage.setItem("username", username);
			localStorage.setItem("userid", results.USERNUM);
			
			localStorage.setItem("organ", results.PARENT_ID);
			
//			localStorage.setItem("DEPET", results.PER_DEPARTMENT);
			localStorage.setItem("rem_bool", rem_bool);
			log_Jump();
		}
	}
}
//登录失败验证回调
function login_false(tx, error) {
	mui.alert(error.message, '登录提示', null);
	return;
}
//登录跳转
function log_Jump() {
	jump('index.html');
}

function updates() {
	
	var html = '';
	html += 'IP地址:<input type="text" style="width: 60%;" id="ip" value="' + HOST + '" /><br />';
	html += '端口号:<input type="text" style="width: 60%;" id="pore" value="' + PORT + '" />';
	layer.open({
		title: '访问地址信息修改',
		type: 1,
		skin: 'layui-layer-rim', //加上边框
		btn: ['确定'],
		content: html,
		yes: function() {
			var sql = "update iporhelp set HOST ='" + $('#ip').val() + "' ,PORT='" + $('#pore').val() + "' where id=1"
			db.transaction(function(tx) {
				tx.executeSql(sql, [], function(tx, result) {
					localStorage.setItem("HOST", '');
					localStorage.setItem("PORT", '');
					selIP();
					layer.closeAll();
				}, function onError(tx, error) {});
			});

		}
	});
}
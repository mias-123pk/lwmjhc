	//上一级  TASK_ID 任务实例ID
	var TASK_POINT_ID = '',
		TASK_ID = '',
		bool, TASK_TIME = '',
		lens = 0,
		POINT_PIID = '',
		TASK_PIID = '',
		state = '',
		SCHEME_ID = '',
		task_hours = '',
		SCHEME_TYPE = '';
	if(window.plus) {
		plusReady();
	} else {
		document.addEventListener('plusready', plusReady, false);
	}
	//
	function plusReady() {
		TASK_ID = getQueryString('TASK_ID');
		TASK_POINT_ID = getQueryString('TASK_POINT_ID');
		TASK_TIME = getQueryString('TASK_TIME');
		POINT_PIID = getQueryString('POINT_PIID');
		TASK_PIID = getQueryString('TASK_PIID');
		SCHEME_ID = getQueryString('SCHEME_ID');
		state = getQueryString('state');
		task_hours = getQueryString('task_hours');
		SCHEME_TYPE = getQueryString('SCHEME_TYPE');

		if(state == 'FINISHED')
			$('#dianji').css('display', 'none');

		Selecta();
	}

	function Selecta() {
		layer.msg('加载界面。。。', {
			icon: 16,
			time: 100 * 1000,
			shade: 0.01
		});
		var sql = " SELECT c1.* from CZ_TASK_INSPECTION_CONTENT c1  where   TASK_POINT_ID='" + TASK_POINT_ID + "'";
		console.log(sql)
		//查找数据
		db.transaction(function(tx) {
			tx.executeSql(sql, [], function(tx, result) {
				lens = result.rows.length;
				console.log(lens)
				if(lens > 0) {
					for(var i = 0; i < lens; i++) {
						var item = result.rows.item(i);
						Seltable(item.TASK_CONTENT_NAME, item.TASK_CONTENT_ID, item.EQU_NAME);
					}
				} else {
					layer.closeAll();
				}
			});
		});
	}

	var a = 0;

	function Seltable(TASK_CONTENT_NAME, TASK_CONTENT_ID, EQU_NAME) {
		var sql = "SELECT c1.*,c2.id as id,c2.STATE,c2.REMARK2,c2.VALUE as value from CZ_TASK_INSPECTION_REQUIRE c1 left JOIN CZ_TASK_RECORD c2 on c1.TASK_REQUIRE_ID=c2.TASK_REQUIRE_ID and c2.TASK_TIME='" + TASK_TIME + "' and c2.POSITION_NUM='2' where C1.REMARKFOUR='TRUE'  and  c1.TASK_CONTENT_ID=" + TASK_CONTENT_ID + " order by TASK_REQUIRE_ORDER";
//		console.log(sql)
		//查找数据
		db.transaction(function(tx) {
			tx.executeSql(sql, [], function(tx, result) {
				var len = result.rows.length;
				if(len > 0) {
					html += '<div class="mui-content">';
					html += '<div class="mui-card">';
					html += '<div class="mui-card-content">';
					html += '<div class="mui-card-content-inner">';
					html += '<table border="1" style="width:100%">';
					html += '<tr style="background-color: #CAE1FF;"><td>巡检项</td><td colspan="3">' + TASK_CONTENT_NAME + '</td><td>';
					html += '<input type="button" value="检修" onclick="overhaul(\'' + TASK_CONTENT_ID + '\')" /></td></tr>';
					html += '<tr><td>仪表位号(名称)</td><td>检查项</td><td>范围</td><td>仪表值</td><td>DCS</td></tr>';

					for(var i = 0; i < len; i++) {
						var item = result.rows.item(i);
						var r_id = item.id;
						var value = item.value;

						var TASK_EQU_POSITION_NUM = item.TASK_EQU_POSITION_NUM;
						if(TASK_EQU_POSITION_NUM == null || TASK_EQU_POSITION_NUM == 'null') {
							TASK_EQU_POSITION_NUM = '无位号';
						}
						if(value == null || value == 'null')
							value = '';

						if(r_id == null) {
							if(a == 0) {
								a++;
								layer.msg('加载中。。。', {
									icon: 16,
									time: 500 * 1000,
									shade: 0.01
								});
							}
							r_id = Date.now() + i;
							var sql_json = {};
							sql_json.ID = r_id; //实例ID
							sql_json.TASK_POINT_ID = TASK_POINT_ID; //巡检要求ID
							sql_json.TASK_ID = TASK_ID; //任务ID
							sql_json.TASK_CONTENT_ID = TASK_CONTENT_ID; //巡检点项
							sql_json.TASK_REQUIRE_ID = item.TASK_REQUIRE_ID; //巡检点ID
							sql_json.TASK_TIME = newDate; //任务日期
							sql_json.STATE = 'UNFINISHED'; //任务状态
							sql_json.TASK_EQU_POSITION_NUM = TASK_EQU_POSITION_NUM; //位号
							sql_json.REMARK1 = SCHEME_ID; //任务执行人
							sql_json.REMARK2 = item.REMARKTWO; //任务执行人
							sql_json.RECORD_TIME = task_hours; //任务执行人
							sql_json.SCHEME_TYPE = SCHEME_TYPE; //任务执行人
							sql_json.TASK_REQUIRE_UNIT = item.TASK_REQUIRE_UNIT; //设备单位
							sql_json.POSITION_NUM = '2'; //任务类型 0 巡检任务实例 1 巡检点实例 2 巡检要求实例
							sql_json.TASK_PIID = TASK_PIID;
							sql_json.EQU_NAME=EQU_NAME;
							console.log(Assemble_sql_insert(sql_json, 'CZ_TASK_RECORD'))
							criteSqllite(Assemble_sql_insert(sql_json, 'CZ_TASK_RECORD'));
						}
						var TASK_REQUIRE_TYPE = item.TASK_REQUIRE_TYPE;

						var TASK_REQUIRE_CONTEXT = item.TASK_REQUIRE_CONTEXT;
						var TASK_REQUIRE_SYMBOL = item.TASK_REQUIRE_SYMBOL;

						var TASK_REQUIRE_MAXS = item.TASK_REQUIRE_MAX;
						if(TASK_REQUIRE_MAXS == 'null' || TASK_REQUIRE_MAXS == null)
							TASK_REQUIRE_MAXS = 0;
						if(TASK_REQUIRE_TYPE == '3') {
							//输入框填值
							var TASK_REQUIRE_MAX = '';
							switch(TASK_REQUIRE_SYMBOL) {
								case 'ge':
									TASK_REQUIRE_MAX = TASK_REQUIRE_MAXS + '≤';
									break;
								case 'gt':
									TASK_REQUIRE_MAX = TASK_REQUIRE_MAXS + '<';
									break;
								case 'le':
									TASK_REQUIRE_MAX = '≤' + TASK_REQUIRE_MAXS;
									break;
								case 'lt':
									TASK_REQUIRE_MAX = '<' + TASK_REQUIRE_MAXS;
									break;
								case 'ba':
									TASK_REQUIRE_MAX = item.TASK_REQUIRE_MIX + '-' + TASK_REQUIRE_MAXS;
									break;
								case 'null':
									TASK_REQUIRE_MAX = TASK_REQUIRE_MAXS;
									break;
							}
							html += '<tr><td style="width:60px">' + TASK_EQU_POSITION_NUM + '</td>';
							html += '<td style="width:60px">' + TASK_REQUIRE_CONTEXT + '</td>';
							html += '<td style="width:60px">' + TASK_REQUIRE_MAX + '</td>';
							html += '<td style="width:60px;padding-top:10px">';
							if(state == 'FINISHED') {
								html += '<input type="text" id="' + r_id + '" disabled="disabled" value="' + value + '" />"' + item.TASK_REQUIRE_UNIT + '"</td>';
							} else {
								html += '<input type="text" id="' + r_id + '" ONBLUR="buileskips(\'' + r_id + '\',\'' + TASK_REQUIRE_SYMBOL + '\',\'' + item.TASK_REQUIRE_MIX + '\',\'' + TASK_REQUIRE_MAXS + '\')" value="' + value + '" />' + item.TASK_REQUIRE_UNIT + '</td>';
							}
							html += '<td style="width:60px"> ' + TASK_REQUIRE_MAXS + ' </td></tr>';
						} else if(TASK_REQUIRE_TYPE == '2') {
							return;
						} else if(TASK_REQUIRE_TYPE == '1') {
							//单选
							html += '<tr><td>' + TASK_EQU_POSITION_NUM + '</td>';
							html += ' <td>' + item.TASK_REQUIRE_CONTEXT + '</td>';
							var TASK_REQUIRE_RES_DESC = item.TASK_REQUIRE_RES_DESC;
							var arr = TASK_REQUIRE_RES_DESC.split(',');
							if(item.MULCHOICE == 1) {
								html += ' <td>在用设备</td>';
								var TASK_REQUIRE_ID = item.TASK_REQUIRE_ID;
								html += '<td>';
								for(var i = 0; i < arr.length; i++) {
									if(item.TASK_REQUIRE_RESULT.indexOf(arr[i]) >= 0) {
										html += '<input onclick="buileskipx(\'' + r_id + '\')" name="' + r_id + '" type="checkbox" value="' + arr[i] + '" checked="checked"/>' + arr[i];
									} else {
										html += '<input onclick="buileskipx(\'' + r_id + '\')" name="' + r_id + '" type="checkbox" value="' + arr[i] + '"/>' + arr[i];
									}
								}
								html += '</td>';
							} else {
								html += ' <td>' + arr[0] + '/' + arr[1] + '</td>';
								var TASK_REQUIRE_ID = item.TASK_REQUIRE_ID;
								if(value == arr[0]) {
									html += '<td><input onclick="buileskip(\'' + r_id + '\')" name="' + r_id + '" type="radio" value="' + arr[0] + '" checked="checked"/>' + arr[0];
									html += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input onclick="buileskip(\'' + r_id + '\')" name="' + r_id + '" type="radio" value="' + arr[1] + '" />' + arr[1] + '</td>';
								} else if(value == arr[1]) {
									html += '<td><input onclick="buileskip(\'' + r_id + '\')" name="' + r_id + '" type="radio" value="' + arr[0] + '" />' + arr[0];
									html += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input onclick="buileskip(\'' + r_id + '\')" name="' + r_id + '" type="radio" value="' + arr[1] + '" checked="checked"/>' + arr[1] + '</td>';
								} else {
									html += '<td><input onclick="buileskip(\'' + r_id + '\')" name="' + r_id + '" type="radio" value="' + arr[0] + '" />' + arr[0];
									html += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input onclick="buileskip(\'' + r_id + '\')" name="' + r_id + '" type="radio" value="' + arr[1] + '" />' + arr[1] + '</td>';
								}
							}
							html += '<td style="width:60px"> ' + TASK_REQUIRE_MAXS + ' </td></tr>';
						}
					}
					html += '</table>';
					html += '</div>';
					html += '</div>';
					html += '</div>';
				}
				num++;
//				console.log(num+'||'+lens)
				if(num == lens) {
					layer.closeAll();
					$('#cc').html(html);
				}
			});
		});
	}

	//数据验证
	function buileskips(r_id, TASK_REQUIRE_SYMBOL, TASK_REQUIRE_MIX, TASK_REQUIRE_MAXS) {
		var ENDTIME=com_getNowFormatDate();
		var sql_1="update CZ_TASK_RECORD set VALUE='" + $('#' + r_id).val() + "', ENDTIME='" + ENDTIME + "' where id='" + r_id + "'";
		console.log(sql_1);
		criteSqllite(sql_1);
	}
	var num = 0;
	var html = '';
	var bool;
	//任务完成	
	function finse() {
		layer.msg('保存任务中。。。', {
			icon: 16,
			time: 500 * 1000,
			shade: 0.01
		});
		var arr = new Array();
		var arrc = new Array();
		bool = true;
		//var sql_cored = "select C1.id as id,C3.TASK_CONTENT_NAME as TASK_CONTENT_NAME,C2.TASK_REQUIRE_TYPE as typr,c2.TASK_REQUIRE_ID as TASK_REQUIRE_ID,c2.TASK_EQU_POSITION_NUM as TASK_EQU_POSITION_NUM  from CZ_TASK_RECORD c1,CZ_TASK_INSPECTION_REQUIRE c2,CZ_TASK_INSPECTION_CONTENT c3 where c1.TASK_REQUIRE_ID=c2.TASK_REQUIRE_ID and c2.REMARKFOUR='TRUE' and c1.TASK_CONTENT_ID=c3.TASK_CONTENT_ID and c1.TASK_POINT_ID='"+TASK_POINT_ID+"' and C1.TASK_TIME='" + newDate + "'";
		var sql_cored = "select C1.id as id,c2.MULCHOICE,C3.TASK_CONTENT_NAME as TASK_CONTENT_NAME,C2.TASK_REQUIRE_TYPE as typr,c2.TASK_REQUIRE_ID as TASK_REQUIRE_ID,c2.TASK_EQU_POSITION_NUM as TASK_EQU_POSITION_NUM from CZ_TASK_RECORD c1,CZ_TASK_INSPECTION_REQUIRE c2,CZ_TASK_INSPECTION_CONTENT c3 where C3.TASK_POINT_ID='" + TASK_POINT_ID + "' and C1.TASK_TIME='" + newDate + "'  and c2.REMARKFOUR='TRUE' and C3.TASK_CONTENT_ID=C2.TASK_CONTENT_ID and C2.TASK_REQUIRE_ID= C1.TASK_REQUIRE_ID";
		console.log(sql_cored)
		//查找数据
		db.transaction(function(tx) {
			tx.executeSql(sql_cored, [], function(tx, result) {
				lens = result.rows.length;
				console.log(lens)
				for(var i = 0; i < lens; i++) {
					var item = result.rows.item(i);

					var typr = item.typr;
					var id = item.id;
					var num = '';
					console.log(typr)
					if(typr == 1) {
						if(item.MULCHOICE == 1) {
							var s = '';
							var v = '';
							$('input[name="' + id + '"]:checked').each(function() {
								s += v + $(this).val();
								v = ',';
							});
							num = s;
						} else {
							num = $('input[name="' + id + '"]:checked').val();
						}
					} else if(typr == 3) {
						num = $('#' + id).val();
					}
					//					console.log(id)
					if(num == null || num == '' || num == 'null') {
						arrc.push(item.TASK_CONTENT_NAME);
						if(typr == 3) {
							arr.push(id);
						}
						bool = false;
					}
				}
				if(bool) {
					perform(lens, result);
				} else {
					if(arr.length > 0) {
						document.getElementById(arr[0]).focus();
					}
					layer.closeAll();
					alert('请先完成巡检项(' + arrc[0] + ')');
				}
			});
		});

	}

	function perform(lens, result) {
		for(var i = 0; i < lens; i++) {
			var item = result.rows.item(i);
			var typr = item.typr;
			var id = item.id;
			var num = '';
			if(typr == 1) {
				if(item.MULCHOICE == 1) {
					var s = '';
					var v = '';
					$('input[name="' + id + '"]:checked').each(function() {
						s += v + $(this).val();
						v = ',';
					});
					num = s;
				} else {
					num = $('input[name="' + id + '"]:checked').val();
				}
			} else if(typr == 3) {
				num = $('#' + id).val();
			}
			var ENDTIME=com_getNowFormatDate();
			var sql_2="update CZ_TASK_RECORD set VALUE='" + num + "',STATE='FINISHED', ENDTIME='" + ENDTIME + "' where id='" + id + "'";
//			console.log(sql_2)
			criteSqllite(sql_2);
			if(i == (lens - 1)) {
				backs();
			}
		}
	}

	//数据跳转时保存
	function saves() {
		var sql_cored = "select C1.id as id,C2.TASK_REQUIRE_TYPE as typr from CZ_TASK_RECORD c1,CZ_TASK_INSPECTION_REQUIRE c2,CZ_TASK_INSPECTION_CONTENT c3 where C3.TASK_POINT_ID='" + TASK_POINT_ID + "' and C3.TASK_CONTENT_ID=C2.TASK_CONTENT_ID and C2.TASK_REQUIRE_ID= C1.TASK_REQUIRE_ID";
		//查找数据
		db.transaction(function(tx) {
			tx.executeSql(sql_cored, [], function(tx, result) {
				lens = result.rows.length;
				for(var i = 0; i < lens; i++) {
					var item = result.rows.item(i);
					var typr = item.typr;
					var id = item.id;
					var num = '';
					if(typr == 1) {
						num = $('input[name="' + id + '"]:checked').val();
					} else if(typr == 3) {
						num = $('#' + id).val();
					}
					if(num == null || num == '' || num == 'undefined' || num == 'null') {} else {
						var sql_3="update CZ_TASK_RECORD set VALUE='" + num + "' where id='" + id + "'";
						console.log(sql_3)
						criteSqllite_creats(sql_3);
					}
				}
			});
		});
	}

	var T_PROBLEM_REP_ID = '';
	/**异常跳转*/
	function buileskip(r_id) {
		var ENDTIME=com_getNowFormatDate();
		var sql_4="update CZ_TASK_RECORD set VALUE='" + $('input[name="' + r_id + '"]:checked').val() + "', ENDTIME='" + ENDTIME + "',STATE='FINISHED' where id='" + r_id + "'";
		console.log(sql_4);
		criteSqllite(sql_4);
	}
	/**异常跳转*/
	function buileskipx(r_id) {
		var s = '';
		var v = '';
		$('input[name="' + r_id + '"]:checked').each(function() {
			s += v + $(this).val();
			v = ',';
		});
		var ENDTIME=com_getNowFormatDate();
		var sql_5="update CZ_TASK_RECORD set VALUE='" + s + "', ENDTIME='" + ENDTIME + "',STATE='FINISHED' where id='" + r_id + "'";
		console.log(sql_5)
		criteSqllite(sql_5);
	}

	function backs() {
		var ENDTIME=com_getNowFormatDate();
		console.log(ENDTIME);
		//巡检点完成
		var sql = "update CZ_TASK_RECORD set STATE='FINISHED',ENDTIME='" + ENDTIME + "' where id='" + POINT_PIID + "'";
		console.log(sql)
		db.transaction(function(tx) {
			tx.executeSql(sql, [], function(tx, result) {
				layer.closeAll();
				alert("完成");
				back();
			});
		});
	}

	function back() {
		jump("accordion.html?TASK_ID=" + TASK_ID + "&TASK_TIME=" + TASK_TIME + "&TASK_PIID=" + TASK_PIID + "&SCHEME_ID=" + SCHEME_ID + "&task_hours=" + task_hours + "&SCHEME_TYPE=" + SCHEME_TYPE);
	}

	/**
	 * 操作数据库
	 */
	var i = 0;
	var j = 0;

	function criteSqllite_creat(sql) {
		i++;
		//查找数据
		db.transaction(function(tx) {
			tx.executeSql(sql, [], function(tx, result) {
				j++;
				if(i == j) {
					layer.closeAll();
				}
			}, function onError(tx, error) {
				js++;
			});
		});
	}

	/**
	 * 操作数据库
	 */
	var is = 0;
	var js = 0;

	function criteSqllite_creats(sql) {
		is++;
		//查找数据
		db.transaction(function(tx) {
			tx.executeSql(sql, [], function(tx, result) {
				js++;
				if(is == js) {
					var condition = "?PROCESSTYPE=1&HTMLS=patrolinspection1inspection2&T_PROBLEM_REP_ID=" + T_PROBLEM_REP_ID + "&PARA_1=" + TASK_POINT_ID + "&PARA_2=" + TASK_ID + "&PARA_3=" + TASK_TIME + "&PARA_4=" + POINT_PIID + "&PARA_5=" + TASK_PIID + "'&SCHEME_ID=" + SCHEME_ID + "&SCHEME_TYPE=" + SCHEME_TYPE;
					jump("../../problemReport/html/problemReport_detail.html" + condition);
				}
			}, function onError(tx, error) {
				js++;
			});
		});
	}

	function overhaul(TASK_CONTENT_ID) {
		var sql = "select * from CZ_TASK_RECORD where TASK_TIME='" + newDate + "' and TASK_CONTENT_ID='" + TASK_CONTENT_ID + "'";
		//查找数据
		db.transaction(function(tx) {
			tx.executeSql(sql, [], function(tx, results) {
				var lens = results.rows.length;
				for(var k = 0; k < lens; k++) {
					var items = results.rows.item(k);
//					console.log(items.ID);
					$('#' + items.ID).val('/');
				}

			}, function onError(tx, error) {
				js++;
			});
		});

//		console.log("1111");
	}
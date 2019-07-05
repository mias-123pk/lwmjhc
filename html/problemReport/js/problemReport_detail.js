/***
 * 问题上报页面逻辑
 */
var T_PROBLEM_REP_ID; //问题上报ID
var PROCESSTYPE = "8"; //问题来源
var HTMLS = ''; //参数4
var PARA_1 = ''; //参数1
var PARA_2 = ''; //参数2
var PARA_3 = ''; //参数3
var PARA_4 = ''; //参数4
var PARA_5 = ''; //参数5

//页面初始化加载
$(function() {
	T_PROBLEM_REP_ID = getQueryString('T_PROBLEM_REP_ID');
	PROCESSTYPE = getQueryString('PROCESSTYPE');
	PARA_1 = getQueryString('PARA_1');
	PARA_2 = getQueryString('PARA_2');
	PARA_3 = getQueryString('PARA_3');
	PARA_4 = getQueryString('PARA_4');
	PARA_5 = getQueryString('PARA_5');
	HTMLS = getQueryString('HTMLS');
	
	if(T_PROBLEM_REP_ID == null) {
		T_PROBLEM_REP_ID = com_getUuid();
	}
	PHO_CATEGORY_ID = T_PROBLEM_REP_ID;
	PHO_CATEGORY = 9;
	//初始化页面赋值
	initialization(T_PROBLEM_REP_ID);
	//加载照片和视频
	photo_view();
});

//数据保存
function save() {
	//数据获取
	var creature = $('#creature').val(); //申请人
	var DEPET = $('#DEPET').val(); //所属部门

	var installationuUnit = $('#installationuUnit').val(); //装置单元
	var questiontype = $('#questiontype').val(); //问题类型
	var PROFESSION = $('#PROFESSION').val(); //所属专业
	var PROBLEMCLASS = $('#PROBLEMCLASS').val(); //问题类别
	var REMARKFIVE = $('#REMARKFIVE').val(); //不安全行为
	var REMARKSIX = $('#REMARKSIX').val(); //具体行为
	var PROBLEMDESCRIBE = $("#PROBLEMDESCRIBE").val(); //问题描述
	//数据判断
	if(installationuUnit == '') {
		alert('请选择装置单元');
	} else if(questiontype == '') {
		alert('请选择问题类型');
	} else if(PROFESSION == '') {
		alert('请选择所属专业');
	} else if(PROBLEMCLASS == '') {
		alert('请选择问题类别');
	} else if(REMARKFIVE == '') {
		alert('请选择不安全行为');
	} else if(REMARKSIX == '') {
		alert('请选择具体行为');
	} else if(PROBLEMDESCRIBE == '') {
		alert('请输入问题描述！');
	} else {
		var questiontypes = questiontype.split(',');
		var sql_json = {};
		sql_json.T_PROBLEM_REP_ID = T_PROBLEM_REP_ID;
		sql_json.WEL_ID = $('#installationuUnit').val();
		sql_json.WEL_NAME = $('#installationuUnit option:selected').text();
		sql_json.PROCESSTYPE = PROCESSTYPE;
		sql_json.PROBLEMDESCRIBE = PROBLEMDESCRIBE;
		sql_json.PROBLEMSTATE = "UNFINISHED";
		sql_json.ORGANIZATION_SITE_OFFICE = "0";
		sql_json.APPLYPEOPLE = localStorage.getItem("username");
		sql_json.PROBLEMTYPE = questiontypes[0];
		sql_json.ADRESS = questiontypes[1];
		sql_json.DEPET = DEPET;
		sql_json.PROBLEMCLASS = PROBLEMCLASS;
		sql_json.REMARKSIX = REMARKSIX;
		sql_json.REMARKSEVEN = localStorage.getItem("username");
		sql_json.PROFESSION = PROFESSION;
		sql_json.REMARKFIVE = REMARKFIVE;
		sql_json.ISDOWNLOAD = '';
		

		var sql_sel = "select * from CZ_TASK_PROBLEM_REPORT where T_PROBLEM_REP_ID='" + T_PROBLEM_REP_ID + "'";
		//数据存储操作	
		db.transaction(function(tx) {
			tx.executeSql(sql_sel, [], function(tx, result) {
				var len = result.rows.length;
				//问题上报表
				var sql = '';
				if(len > 0) {
					//更新
					sql = Assemble_sql_update(sql_json, 'CZ_TASK_PROBLEM_REPORT', 'T_PROBLEM_REP_ID');
				} else {
					//插入
					sql = Assemble_sql_insert(sql_json, 'CZ_TASK_PROBLEM_REPORT');
				}
				save_true(sql);
			}, function onError(tx, error) {
				console.log(error.message);
			});
		});
	}
}

function save_true(sql) {
	//数据存储操作	
	db.transaction(function(tx) {
		tx.executeSql(sql, [], function(tx, result) {
			back_return();
		}, function onError(tx, error) {
			console.log(error.message);
		});
	});
}


function back_return() {
	if(HTMLS === 'patrolinspection1inspection2') {
		jump('../../patrolinspection/html/patrolinspection1_inspection2.html?TASK_POINT_ID=' + PARA_1 + "&TASK_ID=" + PARA_2 + "&TASK_TIME=" + PARA_3 + "&POINT_PIID=" + PARA_4 + "&PARA_5=" + PARA_5);
	} else {
		jump('problemReport_list.html');
	}
}
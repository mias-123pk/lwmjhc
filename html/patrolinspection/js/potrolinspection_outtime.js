var taskId = '';
var userName = '';
var problemDescription = '';
var fileName = '';
var orderNumber = ''; 




document.addEventListener("plusready", onPlusReady, false);
function onPlusReady() {
	taskId = getQueryString('id');
	//获取当前用户名
	nativePage.executeScript('login_getLoginInfo("polling_getLoginInfo_callback")');
	//获取当前任务信息
	var sql="\"select * from CZ_EQUIPMENT_INSPECTION_TASK where TAS_ID='"+getQueryString('id') + "'\"";
	nativePage.executeScript('queryAndReturnByDefualt('+sql+',"initdata")');
}
function initdata(result){
	document.getElementById("title").innerText=result[0].TAS_NAME;
	document.getElementById("textarea1").value = result[0].TAS_DESCRIBE;
}

//获取当前用户名回调函数
function polling_getLoginInfo_callback(result){
	userName=result.username;
}

//查看照片
function lockphoto() {
	window.open("lookpicture_timeout.html?type="+taskId);
}		
//照相功能
function cameraAndReturn(mode, callbackName) {
	nativePage.executeScript("cameraAndReturn('" + mode + "', '" + callbackName + "')");
}

//照相回调
function cameraAndReturnCallback(directory, filePath) {
	var uuid = getuuid();
	fileName = filePath.substring(directory.length);//获取文件名
	var uuid=getuuid();
	//将照片存入数据库
	nativePage.executeScript('createConnection("westoil.db")');
	//照片
	var sql = "insert into CZ_PERSONNER_PHOTO values('" + uuid + "','" + taskId + "','" + fileName + "','" + filePath + "','1','','"+userName+"')";
	nativePage.executeScript('executeBySqlByDefualt("' + sql + '")');
}
//自动生成主键
function getuuid(){
	var s = [];
	var hexDigits = "0123456789abcdef";
	for (var i = 0; i < 36; i++) {
		s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
	}
	s[14] = "4";
	s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
	s[8] = s[13] = s[18] = s[23];
	var uuid = s.join("");
	return uuid;
}

//保存
function save(){
	problemDescription = $("#textarea1").val();
	var sql = "update CZ_EQUIPMENT_INSPECTION_TASK set TAS_STATUS='超期完成',TAS_DESCRIBE='" + problemDescription + "' where TAS_ID='"+taskId+"'";
	nativePage.executeScript('executeBySqlByDefualt("' + sql + '")');
	//保存巡检任务图片
	var sql = "select * from CZ_PERSONNER_PHOTO where PER_IDNUMBER='"+taskId+"' and PER_TYPE='1'" ;
	nativePage.executeScript('queryAndReturnByDefualt("' + sql + '","getimg_callback")');
	alert('保存成功！');
}
function getimg_callback(result){
	
	if(result.length != 0){
		for(var i=0;i<result.length;i++){
 			fileName = result[i].PER_NAME;
 			orderNumber = i+1;
 			var sql_getPicCount = "select * from CZ_INSPECTION_PICTURE where INS_STORE_NAME='" + fileName + "'";
 			nativePage.executeScript('queryAndReturnByDefualt("' + sql_getPicCount + '","sql_getpiccount_callback")');
 		}
	}
}

function sql_getpiccount_callback(result){
	if(result.length >= 1){
	}else{
		var puuid=getuuid();
 		var time = getTime();
		//保存到巡检结果图片表（主键，任务下内容表外键，图片存储名称，上传时间，上传人，序号）
		var sql = "insert into CZ_INSPECTION_PICTURE(INS_PIC_ID,TASK_CONTENT_ID,INS_STORE_NAME,INS_UPLOAD_DATE,INS_UPLOAD_PEOPLE,ORDERNUM,INS_MEMO_ONE) values ('" + puuid + "','" + taskId + "','" + fileName + "','" + time + "','" +userName + "','" + orderNumber +"','1')";
		nativePage.executeScript('executeBySqlByDefualt("' + sql + '")');
	}
	
}

//获取当前时间
function getTime(){
	var date = new Date();
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var date1 = date.getDate();
	var hour = date.getHours();
	var minutes = date.getMinutes();
	var seconds = date.getSeconds();
	if(month<10){
		month = "0" + month;
	}
	if(date1<10){
		date1 = "0" + date1;
	}
	if(hour<10){
		hour = "0" + hour;
	}
	if(minutes<10){
		minutes = "0" + minutes;
	}
	if(seconds<10){
		seconds = "0" + seconds;
	}
	var time = year + "-" + month + "-" + date1 + " " + hour + ":" + minutes + ":" + seconds;
	return time;
}




/*
*	ExMobi4.x+ JS
*	Version	: 1.0.0
*	Author	: zengshuai
*	Email	:
*	Weibo	:
*	Copyright 2017 (c)
*/
//下一节点模板ID
var newatid = '';
var taskname = '';
//流程类型
var atid = '';
//流程ID
var piid = '';
//任务实例ID
var tiid = '';
//初始化页面加载数据
document.addEventListener("plusready", onPlusReady, false);

function onPlusReady() {
	taskname = getQueryString('taskname');
	$("#H1").html(taskname + '_同意');
	//获取流程类型
	newatid = getQueryString('newatid');
	//获取流程类型
	atid = getQueryString('atid');
	//获取URL的参数 PIID，TIID
	piid = getQueryString('piid');
	tiid = getQueryString('tiid');
	Handle_person(newatid);
}

//点击同意调用
function Agree() {
	var data = "{}";
	//获取审批意见
	var opinion = $("#textarea").val();
	//获取流程执行人
	var executor = $("#Handle_person").val();
	if (executor == '') {
		alert("请选择执行人！");
		return;
	} else {
		checkIn(executor, opinion, data, newatid);
	}
}

//页面跳转
function PageJump() {
	if (bool) {
		jump('../operationratio.html');
	}
}

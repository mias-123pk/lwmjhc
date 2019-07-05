/*
* 问题评估
*
*	ExMobi4.x+ JS
*	Version	: 1.0.0
*	Author	: liuhai
*	Email	:
*	Weibo	:
*	Copyright 2016 (c)
*/
//初始化页面加载数据
document.addEventListener("plusready", onPlusReady, false);
var parameter = '';
var taskname = '';
//流程模板类型
var atid = '';
//流程实例ID
var piid = '';
//流程模板ID
var tiid = '';
function onPlusReady() {
	taskname = getQueryString('taskname');
	$("#H1").html(taskname);
	//获取URL的参数 PIID
	atid = getQueryString('atid');
	//获取URL的参数 PIID
	piid = getQueryString('piid');
	//获取URL的参数TIID
	tiid = getQueryString('tiid');
	parameter = "?atid=" + atid + "&piid=" + piid + '&tiid=' + tiid + '&taskname=' + taskname;
	//基本信息
	Problem_information();
	//流程信息
	Twist_information();
}

var newatid = '';
//处理节点判断
function Initialization() {
	if (ADRESS == 0) {
		newatid = PURIFY;
	} else if (ADRESS == 1) {
		newatid = REPAIR;
	} else if (ADRESS == 2) {
		newatid = PROBLEMCLOSEDLOOP;
	}
}

/**
 *流程审批----同意
 */
function consent() {
	jump("issue_auditpg_consent.html" + parameter + "&newatid=" + newatid);
}

/**
 *任务工单
 */
function work() {
	jump("Taskworksheet.html?atid=" + atid + "&piid=" + piid + '&tiid=' + tiid + '&taskname=任务');
}


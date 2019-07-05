/*
*作业准备
* 	ajaxurl :http://10.89.168.3:8080/CZ_PIOTMS/rest/
* 	ExMobi4.x+ JS
*	Version	: 1.0.0
*	Author	: liuhai
*	Email	:
*	Weibo	:
*	Copyright 2016 (c)
*/

//页面加载
var html_operationratio = '';
/**
 *我的待办数据加载
 */
function operationratio() {
	var userID = CacheUtil.getCache("username");
	var data = {
		'userID' : userID
	};
	Server_data_loading('process/getTask', data, function(msg) {
		if (msg.status == 0) {
			var restrts = msg.data;
			//页面装载
			html_operationratio += '<tr><td style="width:10%;text-align:center">序号</td><td style="width:20%;text-align:center">任务名</td><td style="width:20%;text-align:center">流程类型</td><td style="width:20%;text-align:center">发起者</td><td style="width:30%;text-align:center">到达时间</td></tr>';
			$.each(restrts, function(i, item) {
				if (item.ATID == 'D870E2B2617F410F85B1E66C328A8D26' || item.ATID == '3C9BF8C9D7F744C5BD47571380CB2886' || item.ATID == 'E80644E3F534432F84224B95947920CC') {
				} else {
					html_operationratio += '<tr><td style="width:10%;text-align:center">' + (i + 1) + '</td>';
					html_operationratio += '<td style="width:20%;text-align:center"><a href="#" onClick="onacke(\'' + item.ATID + '\',\'' + item.PIID + '\',\'' + item.TIID + '\',\'' + item.TASK_INST_NAME + '\')">' + item.TASK_INST_NAME + '</a></td>';
					html_operationratio += '<td style="width:20%;text-align:center">' + item.PROTEMP_DIS_NAME + '</td>';
					html_operationratio += '<td style="width:20%;text-align:center">' + item.STARTER + '</td>';
					html_operationratio += '<td style="width:30%;text-align:center">' + item.ARRIVE_DATE + '</td></tr>';
				}
			});
			$('#operationratio').html(html_operationratio);
		} else {
			alert(msg.message);
			return;
		}
	});
	
}

/**
 * 方法调用
 * @param {Object} type 流程节点
 * @param {Object} piid 流程节点ID
 * @param {Object} tiid 流程模板ID
 */
function onacke(atid, piid, tiid, taskname) {
	ClaimTask(piid, tiid);
	var parameter = '?atid=' + atid + '&piid=' + piid + '&tiid=' + tiid + '&taskname=' + taskname;
	//问题评估
	if (atid == ASSESSMENT) {
		jump('akissueauditpg/issue_auditpg.html' + parameter);
	}
	//问题闭环
	if (atid == PROBLEMCLOSEDLOOP) {
		jump('akissueauditpg/Taskworksheet.html' + parameter);
	}
	//任务分配-净化、任务分配-维修、对外协调分配、对外问题处理
	if (atid == PURIFY || atid == REPAIR || atid == COORDINATE || atid == PROWBLEM) {
		jump('bissuetaskallot/issue_taskallot.html' + parameter);
	}
	//固定承包商审核(生产办)
	if (atid == FIXEDOFFICE) {
		jump('fixedcontractor/fixedcontractor_audit.html' + parameter);
	}
	//问题审核-维修工段长     问题审核-设备办     问题审核-分管领导    问题闭环-任务指派  作业过程  作业完成
	if (atid == MSUPERVISOR || atid == EQUIPMENT || atid == LEADERSHIP || atid == ASSIGNMENT || atid == LIAISION) {
		jump('cissueaudit/issue_audit.html' + parameter);
	}

	//问题闭环-作业准备
	if (atid == JOBPREPARATION) {
		jump('dissueoperationratio/issue_operationratio.html' + parameter);
	}

	//采购计划审核-物质采购申请
	if (atid == MATERIALREQUEST || atid == PROFESSIONAL || atid == DEPARTMENT || atid == LEADERSHIPAUDIT) {
		jump('pissueassess/issue_assess_list.html' + parameter);
	}
	//	物资申领-部门领导审核
	if (atid == DEPARTMENTAUDIT || atid == INLEADERSHIPAUDIT) {
		jump('purchasebmld/purchase_dept_leader_list.html' + parameter);
	}
	//	作业过程 作业完成
	if (atid == OPERTION || atid == JOBCOMPLRTION) {
		jump('cissueaudit/zyzb_audit.html' + parameter);
	}
	//	作业验收
	if (atid == OPERATIONACCEPTANCE) {
		jump('issuetaskdesignate/issue_taskdesignate.html' + parameter);
	}
}

//返回主页
function backs() {
	jump('../index.html');
}


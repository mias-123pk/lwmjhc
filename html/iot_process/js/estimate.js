/**作业安排*/
/**
 * 全局变量——piid
 */
var piidp = getQueryString('piid');
console.log("actualId"+actualId["其他"]);
/**
 * 全局变量——属地单位
 */
var area = getQueryString('area');
console.log(area+","+piidp);
var user_name = localStorage.getItem("username");

/**
 * 作业安排
 * @param obj
 * @returns
 */
//var usernames="";
//如果为这个几个部门这显示全厂人员
//var era = "生产办公室";
var url_tree = area=='生产办公室' || area =='生产办' || area == 'HSE办公室' || area == 'HSE办' || area == '设备办公室' || area == '设备办'?'../html/organization_tree.html':'../html/organization_tree_problemtype.html?area='+area;
console.log(area);
//弹出层
layui.use('layer', function(){ //独立版的layer无需执行这一句
	var $ = layui.jquery, layer = layui.layer; //独立版的layer无需执行这一句
	//触发事件
	var active = {
			offset: function(othis){
				var type = othis.data('type')
				var ope = layer.open({
				type: 1
				,offset:["20px","20px"] 
				,area: ['300px','400px;']
				,id: 'work_plan'+type //防止重复弹出
				,key:'id'
					//../html/organization_tree.html
				,content: '<iframe frameborder="no" id="addFrame" src="'+url_tree+'" style="width:98%;height:98%;"></iframe>'
				,btn: ['确认',"取消"]
				,btnAlign: 'c' //按钮居中
					,yes: function(){
						var childWindow = $("#addFrame")[0].contentWindow;
						var checkData = childWindow.getCheckedData();
						console.log("选中的人员组织：");
						var usernames = getUserNames(checkData);
						
						/* for (var i = 0; i < checkData.length; i++) {
							
							console.log(checkData[i].id);
							var user=userOrDept(checkData[i].id);
							if (user!="") {
								//对比是否为同一部门
								if (i < checkData.length - 2) {
									if (!compareTodept(checkData[i].id,checkData[i+1].id)) {
										layer.msg('请选择同一部门的人！！！',{icon:7,offset:["20px","20px"] });
										return;
									}
									
								}
								
								usernames +=user;
								if (i!=checkData.length-1) {
									usernames +=",";
								}
							}
						} */
						console.log(usernames);
	
						if (yesCompare()) {
							workPlan(this,usernames['usernames']);
							usernames="";	
	
							layer.close(ope);
						}
						
						usernames="";
					}
				});
			}
	};

	$('#work_plan').on('click', function(){
		if (yesCompare()) {
			var othis = $(this), method = othis.data('method');
			active[method] ? active[method].call(this, othis) : '';
		}
	});

});


/*$.ajax({  
	url : "http://localhost:8080/iot_process/estimates/problemtype",  
	type : "get",
	data : {problemtype:area},
	dataType : "json",  
	success: function( json) {
		//console.log(json.state);
		if (json.state == 0) {
			var datapro = json.data;


		}

	}  
});*/

/**
 * 作业安排确认提交
 * 
 * @param obj 当前对象
 * @param usernames 人名用“，”隔开
 * @returns
 */
function workPlan(obj,usernames){
	var isIngroup;
	
	console.log("id:"+$(obj).attr("id"));
	console.log("id判断:"+$(obj).attr("id")=="work_plant");
	
	if ($(obj).attr("id")=="work_plant") {
		isIngroup = 1;
	}
	
	if ($(obj).attr("id")=="coordinatet") {
		isIngroup = 2;
	}
	console.log(isIngroup);
	$.ajax({
		type: "PUT"
		,url: url+'iot_process/process/nodes/next/group/piid/'+piidp    //piid为流程实例id
		,data: {
			"isIngroup": isIngroup,    /*流程变量名称,流程变量值(属地单位为非维修非净化+前端选择"作业安排"时，值为1；
		     								   属地单位为非维修非净化+前端选择"外部协调"时，值为2；
		     								   属地单位为维修或净化+前端选择"作业安排"时，值为1；
		     								    属地单位为维修或净化+前端选择"下一步"时，值为3 )*/
			"comment": $("#comment").val(),     //节点的处理信息
			"receivor":usernames,
			"userName":user_name
		}   //问题上报表单的内容
		,contentType: "application/x-www-form-urlencoded"
		,dataType: "json"
		,success: function(jsonData){
			//后端返回值： ResultJson<Boolean>
			console.log("人员提交："+jsonData.data);
			if (jsonData.data) {
				modifyEstimated("作业安排成功，问题流转到："+usernames);
			}else{
				layer.msg('安排人员发送失败！！！',{icon:7,offset:["20px","20px"] });
			}
		},
		//,error:function(){}		       
	});
}

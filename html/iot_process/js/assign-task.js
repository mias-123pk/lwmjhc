layui.use(['tree', 'layer', 'form'], function() {
	var tree = layui.tree, layer = layui.layer, $ = layui.$;
	var layer = layui.layer, form = layui.form;
	
	var treeResult, assignUsers = new Array();
	var ticketNo = $("#ticketNo").val();
	$("#ticketNo").val((ticketNo == 1)?"事故事件":((ticketNo == 2)?"隐患事件":"普通事件"));
	
	
	var resavepeople = localStorage.getItem("username");
	var dept = localStorage.getItem("organ");
	//从cookie中获取当前登录用户
	// var resavepeople = getCookie1("name").replace(/"/g,'');
	//从cookie中获取所在组
	// var dept = getCookie1("organ").replace(/"/g,'');
	
	
	//验证表单是否为空
	function isempty(){
		if($("#comment_assign").val().replace(/^\s+/, '').replace(/\s+$/, '') == ''){
			  layer.msg("处理说明不能为空", {icon: 7, offset: '100px'});
			  return true;
		}
		return false;
	}

	/**
	 * 作业指派异步请求
	 */
	function workAssignment(comment, receivor, username){
		$.ajax({
			 async: false
		     ,type: "PUT"
		     ,url: url+'iot_process/process/nodes/next/group/piid/'+piidp    //piid为流程实例id
		     ,data: {
		     	"comment": comment     //通用 -- 节点的处理信息
		     	,"receivor": receivor     //通用 -- 下一个节点问题处理人
		     	,"userName": username    //当前任务的完成人
		     }   //问题上报表单的内容
		     ,contentType: "application/x-www-form-urlencoded"
		     ,dataType: "json"
		     ,success: function(jsonData){
		     	//后端返回值： ResultJson<Boolean>
		    	 if(jsonData.data){
		    		 layer.msg("作业安排成功",{icon:1, time: 2000, offset: '100px'}, function(){
//		    			 window.location.href = "http://localhost:10238/iot_usermanager/html/userCenter/test.html";
		    		 })
		    	 }else{
		    		 layer.msg("作业安排失败",{icon:2, time: 2000, offset: '100px'});
		    	 }
		     }
		     ,error:function(){
		    	 layer.msg("作业安排失败",{icon:2, time: 2000, offset: '100px'});
		     }		       
		});
		
	    return false;
	}
	
	/**
	 * 校验表单是否为空, 为空则不弹出层
	 */
	form.on('submit(arrange)', function(data){
		if(isempty()){
			return false;
		}
		//弹出层
		layer.open({
			type: 1
			,offset: 't'
			,area: ['300px','400px;']
			,id: 'work_arrange'+1 //防止重复弹出
			,content: $("#task_tree")
			,btn: ['确认',"取消"]
			,btnAlign: 'c' //按钮居中
			,yes: function(index, layero){
				//确认按钮的回调函数
				var comment = $("#comment_assign").val();
				var receivor = assignUsers.join("，");
				console.log(receivor);
				workAssignment(comment, receivor, resavepeople);
				//layer.closeAll();
		    }
		,success:function(){	
			//单选框
			tree.render({
				elem: '#task_tree'
				,data: treeResult
				,showCheckbox: true
				,oncheck:function(obj){
					parseTree(obj);
					console.log(assignUsers);
				}
			})
			
			//人名前面 显示人形图标
			$("i.layui-icon-file").addClass("layui-icon-user");
		 }
		});
	    return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
	    
	});
	
	/**
	 * 异步请求人员角色树
	 */
	$.ajax({
		url : url+'iot_process/userOrganizationTree/users',
		type : 'POST',
		dataType : 'json',
		data : {"dept":dept},
		async:true,
		success : function(json) {
			treeResult = json.data;
		},
		error : function() {
		}
	});
	
	
	/**
	 * 解析树型结构,获取选中人员信息
	 */
	function parseTree(obj){
		 //console.log(obj.data); //得到当前点击的节点数据
		 // console.log(obj.checked); //得到当前节点的展开状态：open、close、normal
		 var data = obj.data;
		 //选中就添加人员
		 if(obj.checked){
			 getUser(data);
		 }else{
			 //去掉选中就删除人员
			 removeUser(data);
		 }
	}
	
	function getUser(data){
		if(data.children == null || data.children == undefined){
			assignUsers.push(data.label);
		 }else{
			for(var i=0;i<data.children.length;i++){
				getUser(data.children[i]);
			}
		 }
	}
	
	function removeUser(data){
		if(data.children == null || data.children == undefined){
			for(var i=0;i<assignUsers.length;i++){
				if(assignUsers[i] == data.label){
					assignUsers.splice(i,1);
				}
			}
	    }else{
	    	for(var i=0;i<data.children.length;i++){
	    		removeUser(data.children[i]);
			}
	    }
	}
});
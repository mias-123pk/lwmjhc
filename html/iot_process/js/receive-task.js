//轮播图
layui.use(['carousel', 'form'], function(){
	var carousel = layui.carousel
	,form = layui.form;

	//常规轮播
	carousel.render({
		elem: '#imag'
		,width: '700px'
		,arrow: 'always'
		,interval: 5000
		,anim: 'default'
		,height: '150px'
	});

});  

//折叠
layui.use([ 'element', 'layer' ], function() {
	var element = layui.element;
	var layer = layui.layer;

});


/**
 * 处理过程表格
 */
//从cookie中获得piid
var piid = getQueryString("piid");

var tProblemRepId = null;

layui.use(['form', 'jquery','layer'], function(){
  var form = layui.form
  ,	$ = layui.$
  ,layer = layui.layer;
	
  //异步加载初始化页面数据
  $.ajax({
	  type: "GET",
	  url: url+"iot_process/estimates/estim",
	  data:{"piid": piid},
	  dataType: "json",
	  success: function(json){
		  if(json.state == 0){
			  tProblemRepId = json.data.tproblemRepId;
			//表单初始赋值
			form.val('receive-task', {
			  "incident_sign": ((json.data.ticketNo == 1)?"事故事件":((json.data.ticketNo == 2)?"隐患事件":"普通事件"))    //事件/隐患标记
			  ,"remark": json.data.remark            //整改日期
			  ,"sdate": function(){
				  if(json.data.rectificationperiod != null){
					 return json.data.rectificationperiod.match(/\d+-\d+-\d+/)
				  }
			  }
			  ,"applypeople": json.data.applypeople
			  ,"problemtype": json.data.problemtype
			  ,"welName":  json.data.welName
			  ,"profession": json.data.profession
			  ,"rfid": json.data.rfid
			  ,"problemclass": json.data.problemclass
			  ,"problem_describe": json.data.problemdescribe
			})
			
			 //判断问题类别是否是 "不安全行为/状态"
     		 if(json.data.problemclass == "不安全行为/状态"){
     			$("#div-notsafe").css({"display":"block"});
	       		form.val('receive-task', {
	       			"remarkfive":json.data.remarkfive
	       			,"remarksix":json.data.remarksix
	       		})
        	 }
			
			//判断整改日期
			if(json.data.remark == "指定日期"){
				$("#sdate-div").css({"display":"inline-block"})
			}
			
		  }
	  }
  });
  
  /**
   *问题图片
   */
 $.ajax({  
 	url : url+"iot_process/estimates/problemreportpho",  
 	async: false,
 	type : "get",
 	data : {"piid":piid,"remark":0},
 	dataType : "json",  
 	success: function( json) {
 		if (json.state == 0) {
 			var imgs = json.data;
 			if (imgs.length==0) {
				$("#imag").html("无图");
			}else{
 			var mode = imgs.length%3;
 			var img_id = 0;
 			for (var j = 0; j < Math.ceil(imgs.length/3); j++) {
 				var $img_div=$('<div></div>');
 				if (mode != 0 && j == (Math.ceil(imgs.length/3) - 1) ) {
 					for (var i = 0; i < mode; i++) {
 						$img_div.append('<img data-method="offset" class="big-img" alt="'+imgs[img_id].phoDispiayName+'" src="'+imgs[img_id].phoAddress+'" >');
 						img_id++;
 					}

 				}else{
 					for (var i = 0; i < 3; i++) {
 						$img_div.append('<img data-method="offset" class="big-img" alt="'+imgs[img_id].phoDispiayName+'" src="'+imgs[img_id].phoAddress+'" >');
 						img_id++;
 					}

 				}
 				$("#imag").append($img_div);
 			}
			}
 		}

 	}  
 });
  	
 	//从cookie中获取处理人
    // var userName = getCookie1("name").replace(/"/g,'')
	
	var userName = localStorage.getItem("username");
	//点击下一步按钮操作
	form.on('submit(next_step)', function(data){
		//验证表单是否为空
		 if($("#comment_receive").val().replace(/^\s+/, '').replace(/\s+$/, '') == ''){
			  layer.msg("处理说明不能为空", {icon: 7, offset: '100px'});
			  return;
		  }	
		  console.log(data.field) //当前容器的全部表单字段，名值对形式：{name: value}
		  $.ajax({  
			    async : false,
		    	url : url+"iot_process/process/nodes/next/group/piid/"+piid,   ///iot_process/estimates/problemdescribe
		        type : "PUT",
		        data : {
		        		"comment": data.field.comment,
		        		"complementor":userName,
		        		"userName": userName
		        },
		        contentType: "application/x-www-form-urlencoded",
		        dataType : "json",  
		        success: function(jsonData) {
		        	if(jsonData.data == true){
		        		layer.msg("接收作业成功", {icon: 1, time: 2000, offset: '100px'}, function(){
		        			// window.location.href = "http://localhost:10238/iot_usermanager/html/userCenter/test.html";
		        		jump('../../index.html');
						});
		        	}else{
		        		layer.msg("接收作业失败",{icon: 2, offset: '100px'});
		        	}
		        } 
		        ,error:function(){
		        	layer.msg("接收作业失败",{icon: 2, offset: '100px'});
		        }	
		   });		  
		  
		  //return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
   });
    
   //触发事件
	var active = {
			offset: function(othis){
				
			var imgHtml= "<img src='"+$(this).attr("src")+"'width='750px'  height='500px'/>";
				//var type = othis.data('type')
				layer.open({
				type: 1
				//,offset: type 
				,area: ['800px','500px']
				,content: imgHtml
				,title:false
				//,shadeClose:true
				//,cancel:false
				,offset:'auto'
				
				});
			}
	};

	$('.big-img').click(function(){
		console.log(123);
		var othis = $(this), method = othis.data('method');
		active[method] ? active[method].call(this, othis) : '';
	});
		    
});
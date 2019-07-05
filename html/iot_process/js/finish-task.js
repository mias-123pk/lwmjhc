layui.use(['form', 'jquery','upload','layer'], function(){
  var form = layui.form
  ,	$ = layui.$
  ,layer = layui.layer
  ,upload = layui.upload;
  
   // var area =  localStorage.getItem("organ");
  
  	//从cookie中获取当前登录用户
	var resavepeople = localStorage.getItem("username");
	//var resavepeople = "孙超";
	console.log("当前登录人为:"+resavepeople);
	//用户编号
	var num = localStorage.getItem("userid");
	//num =123;
	console.log("用户编号为:"+num);
	
	//点击完成按钮操作
	form.on('submit(finish_task)', function(data){
		  //验证表单是否为空
		  if($("#comment_finish").val().replace(/^\s+/, '').replace(/\s+$/, '') == ''){
			  layer.msg("处理说明不能为空", {icon: 7, offset: '100px'});
			  return;
		  }
		  if($('#imgZmList').children().length == 0){
			  layer.msg("现场施工图必须上传", {icon: 7, offset: '100px'});
			  return;
		  }
		  
		  console.log(data.field) //当前容器的全部表单字段，名值对形式：{name: value}
		  $.ajax({  
			    async : false,
		    	url : url+"iot_process/process/nodes/next/group/piid/"+piid,   ///iot_process/estimates/problemdescribe
		        type : "put",
		        data : {
	        		"comment": data.field.comment,
	        		"complementor": resavepeople,
	        		"userName": resavepeople
	            },
	            contentType: "application/x-www-form-urlencoded",
		        dataType : "json",  
		        success: function(jsonData) {
		        	if(jsonData.data == true){
		        		//上传问题图片
				   		uploadList.upload();
				   		layer.msg("完成作业提交成功",{icon: 1, time:2000, offset: '100px'}, function(){
				   			//window.location.href = "http://localhost:10238/iot_usermanager/html/userCenter/test.html";
				   		});
		        	}else{
		        		layer.msg("完成作业提交失败",{icon: 2, offset: '100px'});
		        	}
		        } 
		        ,error:function(){
		        	layer.msg("完成作业提交失败",{icon: 2, offset: '100px'});
		        }	
		   });
		  
		  //return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
   });
		  
	//多图片上传功能
    var uploadList = upload.render({
         elem: '#addFinishImg'
         , url: url+'iot_process/report/upload'
         , data: {		resavepeople: function(){ return resavepeople;}, 
			  			piid: function(){console.log("piid: "+piid); return piid;},
			  	   		tProblemRepId: function(){ console.log("tProblemRepId: "+tProblemRepId); return tProblemRepId;},
			  			remark: "1"
         			}
         , accept: 'images'
         , multiple: true
         , auto:false
         , bindAction: '#'
         , choose: function (obj) {
       	  
       	//将每次选择的文件追加到文件队列
         	var files = this.files = obj.pushFile();
         	$("#finish-phos").css({"display":"block"});
         	
          //预读本地文件，如果是多文件，则会遍历。(不支持ie8/9)
          obj.preview(function (index, file, result) {
              console.log(index);
              $('#imgZmList').append('<li style="position:relative"><img style="margin:0px; height:150px; width:180px;" name="imgZmList" src="' + result + '"><div class="img_close" onclick="deleteElement(this)">X</div></li>');
              //删除列表中对应的文件
              $(".img_close").click(function(){
             	 delete files[index]; //删除对应的文件
             	 var len = $('#imgZmList').children().length;
             	 if(len <= 0){
             		 $("#finish-phos").css("display", "none");
             	 }
             	 console.log(index);
             	 uploadList.config.elem.next()[0].value = ''; //清空 input file值，以免删除后出现同名文件不可选
              })
              
              form.render();
           });
         }
     	   //上传前执行的函数
         ,before: function(obj){
   	     
   	  }
          //上传完毕后的，回调函数
         , done: function (res, index, upload) {
       	 // layer.closeAll('loading'); //关闭loading
       	  console.log(res);
       	  if(res.state == 0){
       		  delete this.files[index];  //删除上传成功的文件
       	  }else{
       		 // this.error(index, upload);
       	  }
         }
          //上传失败时，回调函数
         ,error: function(index, upload){
       	 // layer.closeAll('loading'); //关闭loading
       	 // upload();   //重新上传
        	 layer.msg("图片上传失败",{icon: 2, offset:'100px'});
         }
     });
    
    //验证是否上传现场施工图
    form.verify({
    	imgs: function(value, item){  //value：表单的值、item：表单的DOM对象
    		if($('#imgZmList').children("li").length < 1){
    			layer.msg("必须上传现场施工图",{icon: 2, offset:'100px'});
    			return "1";
    		}
    	}
    });
    
    
    
	
});
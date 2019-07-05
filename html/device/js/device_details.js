/*
 *	ExMobi4.x+ JS
 *	Version	: 1.0.0
 *	Author	: liuhai
 *	Copyright 2016 (c)
 * 设备信息查看
 */
var TYP_ID = '',
	TYP_NAME = '',
	TYP_NAME = '',
	EQU_ID = '',
	EQU_NAME = '',
	EQU_POSITION_NUM='';

$(function() {
	//接收设备参数
	EQU_ID = getQueryString("EQU_ID");
	TYP_ID = getQueryString("TYP_ID");
	TYP_NAME = getQueryString("TYP_NAME");
	EQU_NAME = getQueryString("EQU_NAME");
	//标题赋值
	$("#title_deviceName").html(EQU_NAME);
	//照片关联ID
	PHO_CATEGORY_ID = EQU_ID;
	loader();

});

function loader() {
	//加载设备图片信息
	selEQescPhoto()
	//加载备品备件
	selSpare();
	//加载照片和视频
	//	photo_view();
}

function seq_u() {
	var html = '';
	var rests = equipmentStructure.全部设备;
	var a = '',
		sql_b = '';
	$.each(rests, function(is, items) {
		sql_b += a + items;
		a = ',';
	});
	var sql = "select " + sql_b + " from CZ_EQUIPMENT_INFO where EQU_ID='" + EQU_ID + "'";
	console.log(sql)
	$.post(url + "app/selDateSal", {
				sql: sql
			}, function(msgq) {
				$.each(msgq.data.content, function(iq, itemq) {
					EQU_POSITION_NUM=itemq.EQU_POSITION_NUM;
					$.each(itemq, function(iqe, itemeq) {
						html += '<li>';
						html += '<div class="justify-content" style="width:50%;">';
						html += '<div style="float:left; width:180px; text-align:right; color:#aaaaaa;">';
						for(var key in rests) {
							if(rests[key] == iqe) {
								html += key + ':';
							}
						}
						html += '</div>';
						html += '<div style="float:left; padding-left:10px;">';
						html += itemeq;
//						html += '<input style="width:230px" id="' + iqe + '" value="' + itemeq + '" \>';
						html += '</div>';
						html += '</div>';
						html += '</li>';
					});
				});
				$("#deviceExtend").html(html);
			});
		}
			
			
			
			var rest = null;
			var filePath = "";

			function selEQesc() {
				var html_datale = '';
				switch(TYP_NAME) {　　　　
					case '压力表':
						rest = equipmentStructure.压力表;
						break;
					case '压力差压变送器':
						rest = equipmentStructure.压力差压变送器;
						break;
					case '温度计':
						rest = equipmentStructure.温度计;
						break;
					case '温度变送器':
						rest = equipmentStructure.温度变送器;
						break;
					case '气动切断阀':
						rest = equipmentStructure.气动切断阀;
						break;
					case '液位计(含远程)':
						rest = equipmentStructure.液位计(含远程);
						break;
					case '流量计':
						rest = equipmentStructure.流量计;
						break;
					case '节流装置':
						rest = equipmentStructure.节流装置;
						break;
					case '在线分析仪':
						rest = equipmentStructure.在线分析仪;
						break;
					case 'DCS/SIS系统':
						rest = equipmentStructure.DCS / SIS系统;
						break;
					case 'FGS系统':
						rest = equipmentStructure.FGS系统;
						break;
					case '固定式报警仪':
						rest = equipmentStructure.固定式报警仪;
						break;
					case 'P类设备':
						rest = equipmentStructure.P类设备;
						break;
					case 'K类设备':
						rest = equipmentStructure.K类设备;
						break;
				}
				var a = '',
					sql_b = '';
				$.each(rest, function(is, items) {
					sql_b += a + items;
					a = ',';
				});
				var sql = "select " + sql_b + ",EQUIPMENT_ATTACH_URL from CZ_EQUIPMENT_INFO where EQU_ID='" + EQU_ID + "'";
				console.log(sql)
				$.post(url + "app/selDateSal", {
					sql: sql
				}, function(msg) {
					$.each(msg.data.content, function(i, item) {
						filePath = item.EQUIPMENT_ATTACH_URL;
						$.each(item, function(ie, iteme) {
							if(ie != 'EQUIPMENT_ATTACH_URL') {
								html_datale += '<li>';
								html_datale += '<div class="justify-content" style="width:50%;">';
								html_datale += '<div style="float:left; width:180px; text-align:right; color:#aaaaaa;">';
								for(var key in rest) {
									if(rest[key] == ie) {
										html_datale += key + ':';
									}
								}
								html_datale += '</div>';
								html_datale += '<div style="float:left; padding-left:10px;">';
								html_datale += '<input style="width:230px" id="' + ie + '" value="' + iteme + '" \>';
								html_datale += '</div>';
								html_datale += '</div>';
								html_datale += '</li>';
							}
						});

					});
					$("#deviceExtendInfo").html(html_datale);
				});
			}
			var html_photo = ''; //照片
			function selEQescPhoto() {
				var html_void = '';
				layer.msg('加载设备信息。。。', {
					icon: 16,
					time: 500 * 1000,
					shade: 0.01
				});
				//连接服务器获取照片路径
				var sql = "select * from CZ_EQUIPMENT_FILES where EQU_ID='" + EQU_ID + "'";
				console.log(sql);
				//查找数据
				var setUrl = "app/selDateSal";
				$.post(url + setUrl, {
					sql: sql
				}, function(msg) {
					var rest = msg.data.content;
					$.each(rest, function(i, item) {
						var path = url + "app/showImg?imgFile=" + item.FIL_STORE_NAME;
						if(item.FIL_TYPE_NAME == '图片') {
							html_photo += '<li class="mui-table-view-cell mui-media mui-col-xs-2">';
							html_photo += "<a href='#' onclick=\"viewphotos('" + path + "')\">";
							html_photo += '<img src="' + path + '" style="width:200px;height:60px"/> </a>';
							html_photo += "<input class='button grayscale' type='button' value='X' onclick=\"deletePhotos('" + item.EQU_FIL_ID + "')\"></input>";
							html_photo += "</li>";
						} else if(item.FIL_TYPE_NAME == '视频') {
							html_void += '<table><tr><td>';
							html_void += "<a href='#' onclick=\"voides('" + path + "')\" data-size='571x800'> ";
							html_void += item.FIL_STORE_NAME + ' </a></td><td style="width:5%" align="right">';
							html_void += "<input class='button grayscale' type='button' value='x' style='width:50%;' onclick=\"deletePhotos('" + item.EQU_FIL_ID + "')\"></input>";
							html_void += '</td></tr><table>';
						}
					});
					//加载设备基本信息
					seq_u();
					//查询设备信息
					selEQesc();
					//加载设备文件信息
					selEQescfile();
					layer.closeAll();
					//		$("#seq_photo").html(html_photos);
					$("#photo").html(html_photo);
					$("#void").html(html_void);

				});
			}
			var html_decuments = '';

			function selEQescfile() {
				var setUrl = "app/selEQFileList";
				$.post(url + setUrl, {
					filePath: filePath,
					EQU_MEMO_ONE: TYP_NAME
				}, function(msg) {
					var rest = msg.data.content;
					$.each(eval('(' + rest + ')'), function(i, item) {
						html_decuments += '<li>';
						html_decuments += '<div class="justify-content" style="width:10%;">';
						html_decuments += '<p>' + (i + 1) + '</p>';
						html_decuments += '</div>';
						html_decuments += '<div class="justify-content" onclick="downFile(\'' + item.file + '\')" style="width:90%;">';
						html_decuments += '<p>' + item.file + '</p>';
						html_decuments += '</div>';
						html_decuments += '</li>';
					});
					$("#deviceFile").html(html_decuments);
				});
			}

			function selSpare() {
				var html_spear = '';
				var sql = "select * from cz_equipment_spare where SPARE_PARTS_TYPE='" + TYP_NAME + "'";
			console.log(sql)
			//查找数据
				$.post(url + "app/selDateSal", {
					sql: sql
				}, function(msg) {

					html_spear += '<table border="1"><tbody><tr>';
					html_spear += ' <td class="text-center">序号</td>';
					html_spear += ' <td class="text-center">备件名称</td>';
					html_spear += ' <td class="text-center">单位</td>';
					html_spear += ' <td class="text-center">数量</td>';
					html_spear += '</tr>';
					$.each(msg.data.content, function(i, item) {
						html_spear += '<tr><td class="text-center">' + (i + 1) + '</td>';
						html_spear += ' <td class="text-center">' + item.MATERIAL_NAME + '</td>';
						html_spear += ' <td class="text-center">' + item.UNIT + '</td>';
						var ACTUAL_INVENTORY = item.ACTUAL_INVENTORY;
						if(ACTUAL_INVENTORY == null)
							ACTUAL_INVENTORY = 0
						html_spear += '<td class="text-center">' + ACTUAL_INVENTORY + '</td>';
						html_spear += '</tr>';
					});
					html_spear += '</tbody></table>';
					$("#sparepart").html(html_spear);
				});

			}

			//返回
			function back() {
				jump("device-list.html?TYP_NAME=" + TYP_NAME);
			}
			//照片弹出框
			function viewphotos(path) {
				layer.open({
					type: 1,
					title: false,
					closeBtn: 0,
					area: '516px',
					area: ['400px', '450px'],
					skin: 'layui-layer-nobg', //没有背景色
					shadeClose: true,
					content: '<img src="' + path + '" style="width:400px;height:450px" />'
				});
			}

			//设备信息修改
			function updateEQ() {
				layer.msg('修改设备信息。。。', {
					icon: 16,
					time: 500 * 1000,
					shade: 0.01
				});
				var sql = "update CZ_EQUIPMENT_INFO set ";
				var sql1 = "";
				var reg = "";
				for(var key in rest) {
					sql1 += reg + rest[key] + "='" + $("#" + rest[key]).val() + "'";
					reg = ",";
				}
				sql += sql1 + "where EQU_ID='" + EQU_ID + "'";
				$.post(url + "app/equitDateSal", {
					sql: sql
				}, function(rest) {
					layer.closeAll();
					layer.msg('修改成功!');

				});
			}

			function uploadImg(src) {
				layer.msg('上传设备图片，请稍后。。。', {
					icon: 16,
					time: 500 * 1000,
					shade: 0.01
				});
				var task = plus.uploader.createUpload(url + "app/uploadFile", {
					method: 'post',
					blocksize: 204800,
					timeout: 10
				}, function(t, status) {
					layer.closeAll();
					layer.msg('上传成功!');
					window.location.reload();  
				});
				task.addFile(src, {
					key: 'file'
				});
				task.addData('EQU_ID', EQU_ID);
				task.addData('EQU_POSITION_NUM', EQU_POSITION_NUM);
				task.start();

			}

			//文件查看或下载
			function downFile(files) {
				plus.runtime.openFile(File_PATH + files, {}, function(e) {
					window.location.href = url + "app/downloadFile?EQU_MEMO_ONE=" + TYP_NAME + "&NAME=" + files;
				});
			}

			// 拍照
			function getImages() {
				var cmr = plus.camera.getCamera();
				cmr.captureImage(function(p) {
					plus.io.resolveLocalFileSystemURL(p, function(entry) {
						uploadImg(entry.toLocalURL());
						//照片数据存数据表
					}, function(e) {
						outLine('读取拍照文件错误：' + e.message);
					});
				}, function(e) {
					outLine('失败：' + e.message);
				}, {
					filename: '_doc/camera/',
					index: 1
				});
			}

			/***---------------拍视频----------------**/
			// 录像
			function getVideos() {
				var cmr = plus.camera.getCamera();
				cmr.startVideoCapture(function(p) {
					plus.io.resolveLocalFileSystemURL(p, function(entry) {
						uploadImg(entry.toLocalURL());
						//照片数据存数据表
					}, function(e) {
						outLine('读取录像文件错误：' + e.message);
					});
				}, function(e) {
					outLine('失败：' + e.message);
				});
			}

			function deletePhotos(id) {
				layer.confirm('确定需要删除吗？', {
					btn: ['删除', '取消'] //按钮
				}, function() {
					layer.msg('删除中，请稍后。。。', {
						icon: 16,
						time: 500 * 1000,
						shade: 0.01
					});
					var sql = "delete from CZ_EQUIPMENT_FILES where EQU_FIL_ID='" + id + "'";
					$.post(url + "app/equitDateSal", {
						sql: sql
					}, function(msg) {
						layer.closeAll();
						layer.msg('删除成功!');
						window.location.reload();  
					});
				}, function() {
					return;
				});

			}
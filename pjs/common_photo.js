/**---------------------------------------------------*/
var PHO_CATEGORY = 5; //照片类别(1.问题闭环2.属地监督3.临时任务4.操作卡5.问题上报6.巡回检查7.维护保养  9.设备照片)
var PHO_CATEGORY_ID = ''; //关联ID

// 拍照
function getImage() {
	var cmr = plus.camera.getCamera();
	cmr.captureImage(function(p) {
		plus.io.resolveLocalFileSystemURL(p, function(entry) {
			var src = entry.toLocalURL();
			//照片数据存数据表
			var sql = "insert into CZ_M_PHOTO values('" + com_getUuid() + "','" + PHO_CATEGORY + "','" + PHO_CATEGORY_ID + "','" + entry.name + "','" + src + "','photo','','" + com_getNowFormatDate() + "')";
			db.transaction(function(tx) {
				tx.executeSql(sql, [], function(tx, result) {
					//照片显示
					photo_view();
				}, function onError(tx, error) {
					console.log(error.message);
				});
			});
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
function getVideo() {
	var cmr = plus.camera.getCamera();
	cmr.startVideoCapture(function(p) {
		plus.io.resolveLocalFileSystemURL(p, function(entry) {
			var src = entry.toLocalURL();
			//照片数据存数据表
			var sql = "insert into CZ_M_PHOTO values('" + com_getUuid() + "','" + PHO_CATEGORY + "','" + PHO_CATEGORY_ID + "','" + entry.name + "','" + src + "','void','','" + com_getNowFormatDate() + "')";
			db.transaction(function(tx) {
				tx.executeSql(sql, [], function(tx, result) {
					//照片显示
					photo_view();
				}, function onError(tx, error) {
					console.log(error.message);
				});
			});
		}, function(e) {
			outLine('读取录像文件错误：' + e.message);
		});
	}, function(e) {
		outLine('失败：' + e.message);
	});
}

var html_photo = ''; //照片
function photo_view() {
var html_void = ''; //视频
	//照片数据存数据表
	var sql = "select * from CZ_M_PHOTO where PHO_CATEGORY_ID='" + PHO_CATEGORY_ID + "'";
	db.transaction(function(tx) {
		tx.executeSql(sql, [], function(tx, result) {
			//照片显示
			var len = result.rows.length;
			for(var i = 0; i < len; i++) {
				var item = result.rows.item(i);
				if(item.PHO_TYPE == 'photo') {
					html_photo += '<li class="mui-table-view-cell mui-media mui-col-xs-2">';
					html_photo += "<a href='#' onclick=\"viewphoto('" + item.PHO_PATH + "')\">";
					html_photo += '<img src="' + item.PHO_PATH + '" style="width:110px;height:60px"/> </a>';
					html_photo += "<input class='button grayscale' type='button' value='X' onclick=\"deletePhotos('" + item.PHO_ID + "')\"></input></li>";
				} else if(item.PHO_TYPE == 'void') {
					html_void += '<table><tr><td>';
					html_void += "<a href='#' onclick=\"voides('" + item.PHO_PATH + "')\" data-size='571x800'> ";
					html_void += item.PHO_NAME + ' </a></td><td style="width:25%" align="right">';
					html_void += "<input class='button grayscale' type='button' value='X' style='width:50%;' onclick=\"deletePhotos('" + item.PHO_ID + "')\"></input>";
					html_void += '</td></tr><table>';
				}
			}
			$("#photo").html(html_photo);
			$("#void").html(html_void);
		}, function onError(tx, error) {
			console.log(error.message);
		});
	});

}

function viewphoto(path) {
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

function voides(path) {
	var html_void = '<video  width="500px" height="300px"  style="width: 100%;height: 100%" autoplay="autoplay" >' +
		'<source type="video/mp4"  src="' + path + '" ></video>';
	html_void
	layer.open({
		type: 1,
		title: false,
		closeBtn: 0,
		area: '516px',
		area: ['400px', '450px'],
		skin: 'layui-layer-nobg', //没有背景色
		shadeClose: true,
		content: html_void

	});
}

function deletePhotos(PHO_ID) {
	var sql = "delete CZ_M_PHOTO where PHO_ID=" + PHO_ID;
	db.transaction(function(tx) {
		tx.executeSql(sql, [], function(tx, result) {
			photo_view();
		}, function onError(tx, error) {
			console.log(error.message);
		});
	});
}

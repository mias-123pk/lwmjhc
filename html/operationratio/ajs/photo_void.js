/*
*	ExMobi4.x+ JS
*	Version	: 1.0.0
*	Email	:
*	Weibo	:
*	Copyright 2016 (c)
*/

/****照相功能**********************************************************************************************/
/***
 *照相功能方法
 * @param {Object} type 类型
 * @param {Object}  id
 */
function Photo_graph() {
	com_getCamera_save(PHO_CATEGORY, PHO_CATEGORY_ID, 0, function(result, data) {
		Check_photos(PHO_CATEGORY, PHO_CATEGORY_ID);
	});
}

/***
 *照片查询展示方法
 * @param {Object} type_p 类型
 * @param {Object} ids id
 */
function Check_photos() {
	var html_photos = '';
	var results = db_query("select * from CZ_M_PHOTO where REMARK=0 and PHO_CATEGORY='" + PHO_CATEGORY + "' and PHO_CATEGORY_ID='" + PHO_CATEGORY_ID + "'");
	$.each(results, function(i, item) {
		html_photos += '<figure>';
		html_photos += '<a href="' + item.PHO_PATH + '" data-size="571x800"> ';
		html_photos += '<img src="' + item.PHO_PATH + '" /> </a>';
		html_photos += "<input class='button grayscale' type='button' value='删除' style='width:100%;' onclick=\"Delete_attachment('" + item.PHO_ID + "')\"></input>";
		html_photos += '</figure>';
	});
	$("#photo").html(html_photos);
	return;
}

/***
 *删除附件方法
 * @param {Object} id(附件信息主键)
 */
function Delete_attachment(PHO_ID) {
	//删除照片文件
	var results = db_query("select PHO_PATH from CZ_M_PHOTO where PHO_ID='" + PHO_ID + "'");
	$.each(results, function(i, item) {
		if (!file_deleteFile(item.PHO_PATH)) {
			alert("删除文件失败");
			return;
		}
	});
	//删除照片数据
	db_execute("delete from CZ_M_PHOTO where PHO_ID='" + PHO_ID + "'");
	//删除完成后刷新界面，重新展示
	//刷新照片
	Check_photos(PHO_CATEGORY, PHO_CATEGORY_ID);
	//刷新录像
	Check_video(PHO_CATEGORY, PHO_CATEGORY_ID);
}

/****视频功能**********************************************************************************************/
/***
 *视频拍摄方法
 * @param {Object} type_v 类型
 * @param {Object} ids id
 */
function Shoot_video() {
	com_getCamera_saves(PHO_CATEGORY, PHO_CATEGORY_ID, 1, function(result, data) {
		Check_video(PHO_CATEGORY, PHO_CATEGORY_ID)
	});
}

/***
 *视频查询展示方法
 * @param {Object} type_v 类型
 * @param {Object} ids id
 * $("#video").html(html_video);
 */

function Check_video(PHO_CATEGORY, PHO_CATEGORY_ID) {
	var html_video = '';
	var results = db_query("select * from CZ_M_PHOTO where REMARK=1 and PHO_CATEGORY='" + PHO_CATEGORY + "' and PHO_CATEGORY_ID='" + PHO_CATEGORY_ID + "'");
	$.each(results, function(i, item) {
		html_video += '<table><tr><td>';
		html_video += "<a href='#' onclick=\"Video_open('" + item.PHO_PATH + "')\" data-size='571x800'> ";
		html_video += item.PHO_NAME + ' </a></td><td style="width:25%" align="right">';
		html_video += "<input class='button grayscale' type='button' value='删除' style='width:50%;' onclick=\"Delete_attachment('" + item.PHO_ID + "')\"></input>";
		html_video += '</td></tr><table>';
	});
	$("#video").html(html_video);
	return;
}

//3gp视频打开方法
function Video_open(path) {
	nativePage.executeScript('OpenVideo("' + path + '")');
}


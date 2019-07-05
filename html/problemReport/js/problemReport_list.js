	$(function() {
		in_sel();
	});

	function in_sel() {
		var username = localStorage.getItem("username");
//		selSqllite("select T_PROBLEM_REP_ID,PROBLEMDESCRIBE from CZ_TASK_PROBLEM_REPORT where REMARKTWO ISNULL and PROCESSTYPE='8' and ORGANIZATION_SITE_OFFICE='0' and PROBLEMDESCRIBE is not null");
		selSqllite("select T_PROBLEM_REP_ID,PROBLEMDESCRIBE from CZ_TASK_PROBLEM_REPORT");
	}

	function sql_true(results) {
		var html = "";
		var len = results.length;
		for(var i = 0; i < len; i++) {
			var result = results.item(i);
			html += "<tr>";
			html += "<td class='text-center' width='15%'>" + (i + 1) + "</td>";
			html += "<td width='70%'><a href=\"javascript:next_sel('" + result.T_PROBLEM_REP_ID + "')\">" + result.ISDOWNLOAD + "</a></td>";
			html += "<td width='70%'><a href=\"javascript:next_sel('" + result.T_PROBLEM_REP_ID + "')\">" + formatString(result.PROBLEMDESCRIBE, 20) + "</a></td>";
			html += "<td class='text-center' width='15%'><a href=\"javascript:deleteProblem('" + result.T_PROBLEM_REP_ID + "')\">删除</a></td>";
			html += "</tr>";
		}
		$("#tbodyContent").html(html);
	}

	//删除问题
	function deleteProblem(T_PROBLEM_REP_ID) {
		if(confirm("是否确认删除！")) {
			var sql = "delete from CZ_TASK_PROBLEM_REPORT where T_PROBLEM_REP_ID='" + T_PROBLEM_REP_ID + "'";
			db.transaction(function(tx) {
				tx.executeSql(sql, [], function(tx, result) {
					alert('删除成功!');
					in_sel();
				}, function onError(tx, error) {
					console.log(error.message);
				});
			});
		} else {
			return;
		}
	}
	/**格式化字符串，取前N位*/
	function formatString(str, n) {
		if(str.length >= n) {
			return str.substr(0, n) + "...";
		} else if(str.length <= 0) {
			str = "......";
		}
		return str;
	}
	//查看
function next_sel(T_PROBLEM_REP_ID){
	jump('problemReport_detail.html?T_PROBLEM_REP_ID='+T_PROBLEM_REP_ID)
}

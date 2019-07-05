var area = getQueryString("area");
var piid = getQueryString("piid");
var address = getUrlIp();

if (area == "净化工段" || area == "维修工段") {
	window.location.href = +"estimate-team-leader.html?piid="+piid+"&area="+area
}else{
	window.location.href = "estimate.html?piid="+piid+"&area="+area;
}
var config = {
	proxyHost:'xxx.xxx',//your proxy server's host which can access google scholar
	proxyPort:9999,//
	enStr:'import into xxx',
	zhStr:'导入我的网站',
  errElm:'<h1>Sorry,Something went wrong!</h1>',
  authFailElm:'<h1>404:Auth Failure,Not Found!</h1>',
	jqueryElm:'<script src="http://xueshubao.cn/lib/jquery/dist/jquery.js"></script>',
	scriptElm:'<script>'+
    	'$(document).ready(function(){'+
    		'$(".gs_nta.gs_nph").each(function(){'+
    		'$(this).bind("click",getData);'+
  		'});'+
  		'function getData(){'+
    		'var pdfUrl;'+
    		'if($(this).parent().parent().prev(".gs_ggs.gs_fl")){'+
        		'pdfUrl = $(this).parent().parent().prev(".gs_ggs.gs_fl").children("div.gs_md_wp.gs_ttss").children("a").attr("href");}'+
    			'var path = $(this).attr("href");'+
    			'$.ajax({'+
      				'type:"get",'+
      				'url:path,'+
      				'async:false,'+
      				'success:function(data){'+
        				'alert("获取BibTex成功!"+data+"pdfUrl:"+pdfUrl);'+
      				'},'+
      				'error:function(){'+
        				'alert("获取BibTex失败!");'+
      				'}'+
    			'});'+
    		'return false;'+
  		   '}'+
		'});'+
	'</script>',
}

module.exports = config;


var cookieUtil = require('cookie');
var config = require('./config');
var proxyHost = config.proxyHost;

module.exports = {
	/**
	* 解析google返回的cookie
	**/
	parseGoogleCookies: function (cookies) {
		// console.log(cookies);
	    var cookieArr = [];
	    if (cookies && cookies.length > 0) {
	        for (var i = 0; i < cookies.length; i++) {
	            var cookieItem = cookieUtil.parse(cookies[i]);
	            if (cookieItem.domain) {
	             //   delete cookieItem.domain;
	                  cookieItem.domain = proxyHost;
	            }
	            if (cookieItem.path) {
	                cookieItem.path = '/';
	            }
	            var tempArr = [];
	            for (var key in cookieItem) {
	            	if (key === 'expires' || key === 'path') {
		                tempArr.push(key+'='+cookieItem[key]);
	            	} else {
		                tempArr.push(key+'='+cookieItem[key]);
	            	}
	            }
	            cookieArr.push(tempArr.join('; '));
	        };
	    }
	    return cookieArr;
	}
};

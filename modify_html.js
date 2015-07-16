var cheerio = require('cheerio');
var config = require('./config');
var jqueryElm = config.jqueryElm;
var scriptElm = config.scriptElm;

module.exports = function(str,lang){
	$ = cheerio.load(str);
	var str = config.zhStr;
	if(lang.toLowerCase()=='en'){
	    str = config.enStr;
	}
	$(".gs_nta.gs_nph").each(function(i,elem){
	    $(this).text(str);
	});
	str = $.html();
	    // Add or script to the page
	if( str.indexOf( '</body>' ) > -1 ) {
	    str = str.replace( '</body>', jqueryElm+scriptElm + '</body>' );
	} else if ( str.indexOf( '</html>' ) > -1 ){
	    str = str.replace( '</html>', jqueryElm+scriptElm + '</html>' );
	} else {
	    str = str + jqueryElm+scriptElm;
	}

	return str;
}

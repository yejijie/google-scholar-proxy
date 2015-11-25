var cheerio = require('cheerio');
var config = require('./config');

module.exports = function(str,lang,inject){
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
	    str = str.replace( '</body>', inject + '</body>' );
	} else if ( str.indexOf( '</html>' ) > -1 ){
	    str = str.replace( '</html>', inject + '</html>' );
	} else {
	    str = str + inject;
	}

	return str;
}

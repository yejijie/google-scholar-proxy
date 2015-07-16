/**
 * Created by Jaye on 15/7/11.
 */
var config = require('./config');
var http = require('http');
var https = require('https');
var httpProxy = require('http-proxy');
var url = require('url');
var cookie = require('./cookie');
var util = require('util');
var modifyHtml = require('./modify_html');
var querystring = require('querystring');
var jqueryElm = config.jqueryElm;
var scriptElm = config.scriptElm;
var PROXY_PORT = config.proxyPort;


var proxy, server;
var cookieArr = [];
var hl = 'zh-CN';

// 创建代理服务器
proxy = httpProxy.createProxy();

//处理error
proxy.on('error', function (err,req,res) {
    res.writeHead(500, {
        'Content-Type': 'text/plain'
    });
    res.end('Something went wrong. And we are reporting a custom error message.' + err);
});

server = http.createServer(function (req, res) {
    //解析语言,没有设置默认为zh-CN,重构时可以用url_auth来代替
    var query = querystring.parse(url.parse(req.url).query);
    if(query){
         hl = query.hl?query.hl:'zh-CN';
    }
    //todo:加入权限认证，调用url_auth中的urlAuth函数进行判断，如果auth为true放行，否则拦截 
   
   // var finalUrl = req.url,
    var finalUrl = 'https://scholar.google.com',
        finalAgent = null,
        parsedUrl = url.parse(finalUrl);

    if (parsedUrl.protocol === 'https:') {
        finalAgent = https.globalAgent;
    } else {
        finalAgent = http.globalAgent;
    }
    //
    proxy.web(req, res, {
        target: finalUrl,
        agent: finalAgent,
        headers: { host: parsedUrl.hostname,
           'user-agent':req.headers['user-agent'],
           accept:'*/*'
        },
        hostRewrite:config.proxyHost+':'+config.proxyPort,//设置重定向地址,
        protocolRewrite: 'http'//设置重定向协议
    });
});

proxy.on('proxyReq',function(proxyReq,req,res){
    //如果不去掉这个头字段，浏览器报330错误，无法解码
    if(proxyReq._headers){
       if(proxyReq._headers['accept-encoding']){
           proxyReq._headers['accept-encoding'] = '';
        }
    }

});



/**
 * [在响应返回到客户端时，重写htm并注入js脚本]
 * @param  {[type]} proxyRes    [description]
 * @param  {[type]} request     [description]
 * @param  {[type]} response    [description]
 * @return {[type]}             [description]
 */
proxy.on('proxyRes',function(proxyRes,request,response){
    
    if(proxyRes.headers && proxyRes.headers[ 'set-cookie' ]){
       cookieArr =  cookie.parseGoogleCookies(proxyRes.headers['set-cookie']); 
       proxyRes.headers['set-cookie']=cookieArr;
    } 

    //inject js,rewrite html body
    if( proxyRes.headers &&
        proxyRes.headers[ 'content-type' ] &&
        proxyRes.headers[ 'content-type' ].match( 'text/html' ) ) {

        var _end = response.end,
            chunks,
            _writeHead = response.writeHead,
            _write = response.write;

        response.writeHead = function(){
            if( proxyRes.headers && proxyRes.headers[ 'content-length' ] ){
                response.setHeader(
                    'content-length',
                    parseInt( proxyRes.headers[ 'content-length' ], 10 ) + scriptElm.length+jqueryElm.length
                );
            }

            //不设置可能出现少量乱码
            response.setHeader( 'transfer-encoding', proxyRes.headers['transfer-encoding'] );

            // Disable cache for all http as well
            response.setHeader( 'cache-control', 'no-cache' );

            _writeHead.apply( this, arguments );
        };

        response.write = function( data ) {
            if( chunks ) {
                chunks += data;
            } else {
                chunks = data;
            }
        };

        response.end = function() {
            if( chunks && chunks.toString ) {
                _end.apply( this, [ modifyHtml( chunks.toString(),hl ) ] );
            }else {
                _end.apply( this, arguments );
           }    
            
        };
    }
});


console.log('listening on port ' + PROXY_PORT);
server.listen(PROXY_PORT);

var http = require('http');
var cheerio = require("cheerio");
var conn;
var base = "http://bbs.lol.qq.com/";
var stack = [];

function connect(){
	var mysql = require('mysql');
	conn = mysql.createConnection({
	    host: 'localhost',
	    user: 'root',
	    password: '',
	    database:'test',
	    port: 3306
	});
	conn.connect();
}

function UnicodeToUTF8(strInUni){
	  if(null==strInUni)
	    returnnull;
	  var strUni=String(strInUni);
	  var strUTF8=String();
	  for(var i=0;i<strUni.length;i++){
	    var wchr=strUni.charCodeAt(i);
	    if(wchr<0x80){
	      strUTF8+=strUni.charAt(i);
	      }
	    else if(wchr<0x800){
	      var chr1=wchr&0xff;
	      var chr2=(wchr>>8)&0xff;
	      strUTF8+=String.fromCharCode(0xC0|(chr2<<2)|((chr1>>6)&0x3));
	      strUTF8+=String.fromCharCode(0x80|(chr1&0x3F));
	      }
	    else{
	      var chr1=wchr&0xff;
	      var chr2=(wchr>>8)&0xff;
	      strUTF8+=String.fromCharCode(0xE0|(chr2>>4));
	      strUTF8+=String.fromCharCode(0x80|((chr2<<2)&0x3C)|((chr1>>6)&0x3));
	      strUTF8+=String.fromCharCode(0x80|(chr1&0x3F));
	      }
	    }
	  return strUTF8;
	  }


function getUrl($url){
	console.log("get ing " + $url);
	http.get($url, function(res) {

	    var size = 0;
	    var chunks = [];
		
	    res.on('data', function(chunk){
	      size += chunk.length;
	      chunks.push(chunk);
	    });
	  
	    res.on('end', function(){
	    	var data = Buffer.concat(chunks, size);
	    	var $ = cheerio.load(data.toString());
	    	$("th.new").each(function(i, e) {
	    		var link = $(e).find('a.xst');
	    		var view = $(e).find('.y.views');
	    		var re = $(e).find('.y.reply');
	    		var date = new Date();
	    		console.log("- get text " + link.text());
	    		var sql = 'INSERT INTO coloros(`url`,`title`,`summary`,`remark`,`created_at`,`modified_at`)  VALUE("';
	    		sql +=  link.attr('href') + '","';
	    		sql += link.text() + '","';
	    		sql += 'demo","';
	    		sql += 'demo","';
	    		sql += date + '","';
	    		sql += date;
	    		sql += '")';
	    		
	    		conn.query(sql, function(err, rows, fields) {
	    		    if (err) throw err;
	    		});
	    		
	    	});
	    	stack.unshift($("a.nxt").attr('href'));
	    	
	    	
	    	if(stack.length > 0){
	    		getUrl(base + stack.pop());
	    	}else{
	    		console.log("done");
	    	}
	    	
		});
	  
	}).on('error', function(e) {
	  console.log("Got error: " + e.message);
	});

}



connect();
getUrl("http://bbs.lol.qq.com/forum.php?mod=forumdisplay&fid=40");

//FIX ME 何时关闭mysql链接

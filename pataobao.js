var http = require('http');
var cheerio = require("cheerio");
var fs = require("fs");
var conn;
var base = "http://list.tmall.com/search_product.htm";
var stack = [];
var i = 0;
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
	    	
	    	fs.writeFile('log.txt', data.toString(), function (err) {
			  if (err) throw err;
			  console.log('It\'s saved!');
			});
	    	
	    	$("div.item").each(function(i, e) {
	    		
	    		
	    		var link = $(e).find('.pic-box a');
	    		var name = $(e).find('.summary a');
	    		var view = $(e).find('.deal-cnt');

	    		var date = new Date();
	    		if(i == 0){
	    			console.log("- get link " + link.attr('href'));
	    			
	    			
	    		}
	    		
	    		var sql = 'INSERT INTO coloros(`url`,`title`,`summary`,`remark`,`created_at`,`modified_at`)  VALUE("';
	    		sql += link.attr('href') + '","';
	    		sql += name.attr('title') + '","';
	    		sql += view.text() + '","';
	    		sql += 'demo","';
	    		sql += date + '","';
	    		sql += date;
	    		sql += '")';
	    		
	    		conn.query(sql, function(err, rows, fields) {
	    		    if (err) throw err;
	    		});
	    		
	    	});
	    	i++;
	    	stack.unshift("http://s.taobao.com/search?q=%BA%EC%BE%C6&js=1&stats_click=search_radio_all%253A1&initiative_id=staobaoz_20141024" + "&tab=all&bcoffset=-4&s=" + i *44);
	    	
	    	
	    	if(stack.length > 0){
	    		getUrl(stack.pop());
	    	}else{
	    		console.log("done");
	    	}
	    	
		});
	  
	}).on('error', function(e) {
	  console.log("Got error: " + e.message);
	});

}



connect();
getUrl("http://s.taobao.com/search?q=%BA%EC%BE%C6&js=1&stats_click=search_radio_all%253A1&initiative_id=staobaoz_20141024");
//getUrl("http://list.tmall.com/search_product.htm?q=%C7%E5");

//FIX ME 何时关闭mysql链接

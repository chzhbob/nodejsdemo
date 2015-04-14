var fs = require("fs");

var key = [];

function config() {
	key.push('yanwen');
	key.push('1981');
	key.push('81');
	key.push('0115');
	key.push('115');
	key.push('brave');
	key.push('9988');
	key.push('99');
}

var resultStr = "";

function runDict(arr,prefix){
	if(arr.length > 1){
		for(var i in arr){

			// console.log(prefix + arr[i]);
			resultStr += prefix + arr[i] + '\r\n';
			
			newArr = arr.concat();
			newArr.splice(i,1);
			result = runDict(newArr, prefix + arr[i]);

			// console.log(result);
			resultStr += result;
		}
		return "";
	}else{
		return prefix + arr[0] + '\r\n';
	}
	
}

function saveDict(){
	// console.log(resultStr);
	fs.appendFile("pass.lst", resultStr, function(err){  
        if(err)  
            console.log("fail " + err);  
        else  
            console.log("写入文件ok");  
    });
}

config();
runDict(key,"");
saveDict();
return;
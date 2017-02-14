/**********
Shabab Islam
100815199
2406 A2
***********/

/*Used prof's simple server as base*/

// load http module
var http = require('http');
var fs = require('fs');
var mime = require('mime-types');
var url = require('url');

const ROOT = "./public_html";
var files = {};

/*read the recipe folder for names of all files*/
files = fs.readdirSync(ROOT+'/recipes');

/*json object with empty array*/
var recipeNames_json = {rec_names:[]
};

// create http server
var server = http.createServer(handleRequest);
server.listen(2406);

console.log('Server listening on port 2406');

/*make an array of names of the .json recipe files, format it to look prettier*/
function recipeNameToJSON(){
	for (var i = 0;i<files.length;i++){
		if(files[i].endsWith(".json")){
			files[i] = files[i].slice(0,-5);
			files[i] = files[i].replace(/_/g,' ');
			recipeNames_json.rec_names[i] = files[i];
		}
	}
	console.log("--------- Creating JSON object of recipe names ---------");
	console.log(recipeNames_json);
	console.log("--------- DONE ---------");
}

recipeNameToJSON();

function handleRequest(req, res) {
	var filename = ROOT+req.url;
	var myUrl = url.parse(req.url,true);
	console.log(req.method+" request for: "+myUrl.pathname);

	var code;
	var data = "";
	
	/*splitting url into an array*/ 
	var pathArray = myUrl.pathname.split('/');

	/*req.url!= /recipe because /recipe is specific command for loading recipes to client*/
	if(fs.existsSync(filename) && req.url!="/recipes"){		
		var stats = fs.statSync(filename);
		if(stats.isDirectory()){
			filename += "index.html";
		} 
		data = fs.readFileSync(filename);

		code = 200;
	}
	/*prof's mole example used as reference*/
	else if(pathArray[1] === "save"){
		if(pathArray[pathArray.length-1]){
			var postBody="";
			req.setEncoding('utf8');
			req.on('data',function(chunk){			
				postBody+=chunk; 
			});
			req.on('end',function(){
				postBody = postBody.replace(/",/g,'\",\n');
				console.log("Saving to: "+"public_html/recipes/"+pathArray[pathArray.length-1]+".json")
				fs.writeFile("public_html/recipes/"+pathArray[pathArray.length-1]+".json",postBody);

			});
			console.log("Recipe saved!")
		} else {
			console.log("No recipe provided")
		}
		code = 200;
	}
	else if(pathArray[1] === "recipes"){
		/*if the req is just /recipe, send the obj containing array of recipe names*/
		if(pathArray[pathArray.length-1] === "recipes"){
			data = JSON.stringify(recipeNames_json);
			code = 200;
		/*otherwise, check to see which recipe is being requested and then send it*/
		} else {
			console.log("requesting this recipe: "+pathArray[pathArray.length-1]);
			console.log("getting: "+ROOT+"/recipes/"+pathArray[pathArray.length-1]+".json")
			var obj;
			try{
				obj = JSON.parse(fs.readFileSync(ROOT+"/recipes/"+pathArray[pathArray.length-1]+".json"));
			} catch(err){
				obj = {};
			}
			data = JSON.stringify(obj);
			code = 200;
		}
	}else{		
		console.log("File not found: "+ req.url);
		code = 404;
		data = fs.readFileSync(ROOT+"/404.html");
	}
	
	// content header
	res.writeHead(code, {'content-type': mime.lookup(filename)|| 'text/html'});
	// write message and signal communication is complete
	res.end(data);
};


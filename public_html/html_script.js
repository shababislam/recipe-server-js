/**********
Shabab Islam
100815199
2406 A2
***********/

var recipeNames; 

/*
Sends GET request for /recipes, creates new order element with the array of names in the recieved JSON object
*/
function loadElements(){
	var xhr=new XMLHttpRequest();
	xhr.open("GET","/recipes",true);
	xhr.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			doc = document.getElementById("orderSelect");				
			recipeNames = JSON.parse(xhr.responseText);
			for (var i = 0;i<recipeNames.rec_names.length;i++){
				var option = document.createElement("OPTION");
				option.text = recipeNames.rec_names[i];
				doc.appendChild(option);	
			}
		} 
	}
	xhr.send();
}

/*creates a JSON object with the attributes of the current recipe, sends obj through POST request through "/save" to server*/
function submitRecipe(){
	doc = document.getElementById("orderSelect");
	var selOption = doc.options[doc.selectedIndex].value;
	var r_name = document.getElementById("nameID");
	var r_duration = document.getElementById("durationID");
	var r_ing = document.getElementById("ingID");
	var r_steps = document.getElementById("stepsID");
	var r_notes = document.getElementById("noteID");

	var recipe = {};
	recipe.duration = r_duration.value;
	recipe.ingredients = r_ing.value.split("\n");
	recipe.directions = r_steps.value.split("\n");
	recipe.notes = r_notes.value;
	
	var req = new XMLHttpRequest();

	req.open("POST","/save/"+selOption.replace(/ /g,"_"),false);
	req.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
	req.send(JSON.stringify(recipe));
	alert("Recipe saved!");

}

/*Gets the current option selected and sends request for recipes/currentObjectName
Creates textarea elements for the duration, ingredients, directions and notes if 
they don't exist, and if they already exist, overwrite them with new current option.
Directions and ingredients have dynamic size corresponding with the respective list sizes.
*/

function loadRecipe(){	
	doc = document.getElementById("orderSelect");
	var selOption = doc.options[doc.selectedIndex].value;

	var req = new XMLHttpRequest();
	req.open("GET","/recipes/"+selOption.replace(/ /g,"_"),false);
	req.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {

			var recipe = JSON.parse(req.responseText);

			doc1 = document.getElementById("inputArea");

			if(!document.getElementById("durationID")){

				doc1.appendChild(document.createElement("br"));				

				doc1.appendChild(document.createTextNode("Duration:"));	
				doc1.appendChild(document.createElement("br"));	
				
				var durInput = document.createElement("textarea");
				durInput.id = "durationID";
				durInput.type = "text";
				if(recipe.duration){
					durInput.value = recipe.duration;
				}
				doc1.appendChild(durInput);	
				doc1.appendChild(document.createElement("br"));				
				
			}
			if(!document.getElementById("ingID")){
				doc1.appendChild(document.createElement("br"));		

				doc1.appendChild(document.createTextNode("Ingredients:"));	
				doc1.appendChild(document.createElement("br"));	
				
				var ingInput = document.createElement("textarea");
				ingInput.cols = 50;
				ingInput.id = "ingID";
				
				ingInput.type = "text";
				
				if(recipe.ingredients){
					ingInput.rows = recipe.ingredients.length;
					for (var i=0;i<recipe.ingredients.length;i++){
						ingInput.value+=recipe.ingredients[i]+"\n";
					}
				}
				doc1.appendChild(ingInput);	
				
				doc1.appendChild(document.createElement("br"));	
			} 
			if(!document.getElementById("stepsID")){
				doc1.appendChild(document.createElement("br"));		

				doc1.appendChild(document.createTextNode("Steps:"));	
				doc1.appendChild(document.createElement("br"));	
				
				var stepsInput = document.createElement("textarea");
				stepsInput.cols = 50;
				stepsInput.id = "stepsID";
				
				stepsInput.type = "text";
				
				if(recipe.directions){
					stepsInput.rows = recipe.directions.length;
					for (var i=0;i<recipe.directions.length;i++){
						stepsInput.value+=recipe.directions[i]+"\n";
					}
				}
				doc1.appendChild(stepsInput);	
				
				doc1.appendChild(document.createElement("br"));	
			} 
			if(!document.getElementById("noteID")){

				doc1.appendChild(document.createElement("br"));				

				doc1.appendChild(document.createTextNode("Notes:"));	
				doc1.appendChild(document.createElement("br"));	
				
				var noteInput = document.createElement("textarea");
				noteInput.cols = 50;

				noteInput.id = "noteID";
				noteInput.type = "text";
				if(recipe.notes){
					noteInput.value = recipe.notes;
				}
				doc1.appendChild(noteInput);	
				doc1.appendChild(document.createElement("br"));				

			}
			if(!document.getElementById("submitButtonID")){
				doc1.appendChild(document.createElement("br"));				

				var submitButton = document.createElement("input");
				submitButton.type = "button";
				submitButton.id = "submitButtonID";
				submitButton.value = "Submit Recipe!";
				submitButton.onclick = submitRecipe;
				doc1.appendChild(submitButton);
			} else {
				var durInput = document.getElementById("durationID");
				durInput.value = "";
				durInput.value = recipe.duration;
				var ingInput = document.getElementById("ingID");
				ingInput.value = "";
				for (var i=0;i<recipe.ingredients.length;i++){
						ingInput.value+=recipe.ingredients[i]+"\n";
				}
				ingInput.rows = recipe.ingredients.length;
				var stepsInput = document.getElementById("stepsID");
				stepsInput.value = "";
				for (var i=0;i<recipe.directions.length;i++){
						stepsInput.value+=recipe.directions[i]+"\n";
				}
				stepsInput.rows = recipe.directions.length;
				var noteInput = document.getElementById("noteID");
				noteInput.value = "";
				noteInput.value = recipe.notes;
				
			}
		}
	}
	
	req.send();
	
}



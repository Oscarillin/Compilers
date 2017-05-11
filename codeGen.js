//Oscar Reyes
// Code Generation

var astTreePointer;
var symbolTreePointer;
var tempTable = [];
var heapTable = {};
var heapStack = "66 61 6C 73 65 00 74 72 75 65 00";
var tempPair = {};
var codeGen = "";
var fullStack = "";
var zeros = "";
var tempNumber = 0;
var temp = "";
var tempVar = "";

function genCode(ast, symbolTree){
	astTreePointer = ast;
	symbolTreePointer = symbolTree;
	traverseSymbol();
	heapTable["True"] = 251;
	heapTable["False"] = 245;
	codeGen = traverseAst();
	var withoutSpace = codeGen.replace(/ /g,"");
	var nextSpot = withoutSpace.length/2 + 1;
	var nextHex;
	var changedCode;
	fullStack = codeGen + heapStack;
	var fullWithoutSpaces = fullStack.replace(/ /g,"");

	if(fullWithoutSpaces.length/2 > 256){
		//throw error
	} else {
		var zeroCount = 256 - fullWithoutSpaces.length/2;
		console.log(zeroCount)
		 while(zeroCount > 0){
		 	zeros += "00 "
		 	zeroCount--;
		}
	}
	for (var k in tempPair) {
		nextHex = nextSpot.toString(16);
		if(nextHex.length == 1){
			nextHex = "0" + nextHex
		}
		var regEx = RegExp(tempPair[k][0],"g")
        changedCode = codeGen.replace(regEx, nextHex + " 00 ");
        nextSpot = nextSpot + 2;
        codeGen = changedCode;       
    }
    fullStack = codeGen + zeros + heapStack;
	document.getElementById("codeGenOutput").append(fullStack + "\n");
}



function traverseAst() {
        // Initialize the result string.
        var traversalResult = "";

        // Recursive function to handle the expansion of the nodes.
        function expand(node, depth)
        {
            // If there are no children (i.e., leaf nodes)...
            if (!node.children || node.children.length === 0)
            {
                // ... note the leaf node.
            }
            else
            {
                // There are children, so note these interior/branch nodes and ...
                // .. recursively expand them.

                if(node.name == "VarDecl"){
                	if(node.children[0].name == "String"){
                		//Skip this part until initilization
                	} else {
                		console.log(tempPair[node.children[1].name])
                    	traversalResult += "A9 00 8D " + tempPair[node.children[1].name][0] + "";                
                	}
                }
                if(node.name == "Assign"){
                	console.log(node.children[1].name.length)
                	if(node.children[1].name.length == 1){
                   		traversalResult += "A9 0" + node.children[1].name +" 8D " + tempPair[node.children[0].name][0] +  "";
                   	} else {
                   		if(node.children[1].name == "False"){
                   			tempPair[node.children[0].name] = [tempPair[node.children[0].name][0],tempPair[node.children[0].name][1],node.children[1].name]
                    		traversalResult += "A9 00 8D " + tempPair[node.children[0].name][0] + "";               			
                   		} else if(node.children[1].name == "True"){
                   			tempPair[node.children[0].name] = [tempPair[node.children[0].name][0],tempPair[node.children[0].name][1],node.children[1].name]
                   			traversalResult += "A9 01 8D " + tempPair[node.children[0].name][0] + ""; 
                   		} else {
                   			var stringPointer = node.children[1].name;
                   			var hexString = "";
                   			for(var i = 0; i < stringPointer.length; i++){
                   				hexString += stringPointer.charCodeAt(i).toString(16) + " ";
                   			} 
                   			console.log(node.children)
                   			traversalResult += "A9 " + stringPointer.charCodeAt(0).toString(16) + " 8D " + tempPair[node.children[0].name][0] ;
                   			heapStack = hexString + " 00 " + heapStack
                   			console.log(heapStack)
                   		}
                   	}                   
                }
                if(node.name == "While"){
                	console.log(node.children)
                }

                if(node.name == "Print"){
                	console.log(tempPair[node.children[0].name][0])
                	if(node.children[0].name.length == 1){
                		traversalResult += "AC " + tempPair[node.children[0].name][0] + " A2 01 FF "
                	} else if(tempPair[node.children[0].name][1] == "Boolean"){
                		console.log(heapTable[tempPair[node.children[0].name][2]])
                		traversalResult += "A0 " + heapTable[tempPair[node.children[0].name][2]].toString(16) + " A2 02 FF ";
                	} else {
                		traversalResult += "AC " + tempPair[node.children[0].name][0] + "A2 01 FF ";
                	}
                }

                for (var i = 0; i < node.children.length; i++)
                {
                    expand(node.children[i], depth + 1);
                }
            }
        }
        // Make the initial call to expand from the root.
        expand(astTreePointer.root, 0);
        // Return the result.
        traversalResult += "00 "
        return traversalResult;
}

function traverseSymbol() {
    // Initialize the result string.
    var traversalResult = "";

    // Recursive function to handle the expansion of the scopes.
    function expand(scope, depth)
    {
        // If there are no children (i.e., leaf scopes)...
        if (!scope.children || scope.children.length === 0)
        {
            // ... note the leaf scope.
            // traversalResult += "[" + scope.name + "\n";
            for (var k in scope.ht.items) {
                if (scope.ht.hasItem(k)) {
                	temp = k + "@" + scope.name;
                	tempVar = "T" + tempNumber + " XX ";
                	tempNumber++;
                	tempPair[temp] = [tempVar,scope.ht.getItem(k)];
                	tempTable.push(tempPair);
                }
            }  
            // traversalResult += "\n";
        }
        else
        {

            // There are children, so note these interior/branch scopes and ...
            // traversalResult += "[" + scope.name + "\n";
            for (var k in scope.ht.items) {
                if (scope.ht.hasItem(k)) {
                	temp = k + "@" + scope.name;
                	tempVar = "T" + tempNumber + " XX";
                	tempNumber++;
					tempPair[temp] = [tempVar,scope.ht.getItem(k)];
                	tempTable.push(tempPair);
                }
            } 
            // traversalResult += "\n";
            // .. recursively expand them.

            for (var i = 0; i < scope.children.length; i++)
            {
                expand(scope.children[i], depth + 1);
            }
        }
    }
    // Make the initial call to expand from the root.
    expand(symbolTreePointer.root, 0);
    // Return the result.
    return traversalResult;
};





//Oscar Reyes
// Code Generation

var astTreePointer;
var symbolTreePointer;
var tempTable = [];
var tempPair = {};
var codeGen = "";

function genCode(ast, symbolTree){
	astTreePointer = ast;
	symbolTreePointer = symbolTree;
	traverseSymbol();
	codeGen = traverseAst();
	var withoutSpace = codeGen.replace(/ /g,"");
	nextSpot = withoutSpace.length/2 + 1;
	var nextHex;	
	(console.log(nextSpot))
	var changedCode = codeGen;
	for (var k in tempPair) {
		nextHex = nextSpot.toString(16);
		console.log(nextHex.length)
		if(nextHex.length = 1){
			nextHex = "0" + nextHex
		}
		var regEx = RegExp(tempPair[k],"g")
        changedCode = changedCode.replace(regEx, nextHex + " 00 ");
        console.log(changedCode)
        nextSpot = nextSpot + 2;
            
    }
    console.log(changedCode)
    codeGen = changedCode;
	document.getElementById("codeGenOutput").append(codeGen + "\n");
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
                		//DO some stuff
                	} else {
                    	traversalResult += "A9 00 8D " + tempPair[node.children[1].name] + "";                
                	}
                }
                if(node.name == "Assign"){
                    traversalResult += "A9 0" + node.children[1].name +" 8D " + tempPair[node.children[0].name] +  "";
                }
                if(node.name == "Print"){
                	console.log(node.children[0].name.length)
                	if(node.children[0].name.length == 1){
                		traversalResult += "AC 0" + node.children[0].name + " A2 01 FF "
                	} else {
                		traversalResult += "AC " + tempPair[node.children[0].name] + "A2 01 FF ";
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
    var tempNumber = 0;
    var temp = "";
	var tempVar = "";

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
                	tempPair[temp] = tempVar;
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
                	tempPair[temp] = tempVar;
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





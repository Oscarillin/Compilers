//Oscar Reyes
//AST Construction


var astCurrentIndex = 0;
var astTokenList;
var ast;

var usedID = [];
var initalizedID = [];

var currentScope;
var scopeCount = -1;
var sa;

var astNumber = 0;

function runAst(tokenStream){
	astNumber++;
	if(astCurrentIndex == 0){
		astTokenList = tokenStream;
	}
	ast = new Tree();
	sa = new symbolTree();
		try { 
			parseASTProgram();
			genCode(ast, sa);
		}
		catch (e){
			$('#astOutput').append(e);
		}	
	astCurrentIndex = 0;
	scopeCount = -1;
}

function checkType(){
	var currentType = astTokenList[astCurrentIndex].kind;
	var currentIDType = sa.cur.ht.getItem(astTokenList[astCurrentIndex].value);
	var previousType = astTokenList[astCurrentIndex - 2].kind;
	var previousIDType = sa.getValue(astTokenList[astCurrentIndex - 2].value)
	var typeA;
	var typeB;

	if((currentIDType == "Int") || (currentType == "Digit")){
		typeA = "Int"
	}

	if ((currentIDType == "Boolean") || (currentType == "BoolVal")){
		typeA = "Boolean"
	}

	if ((currentIDType == "String") || (currentType == "Quote")){
		typeA = "String"
	}

	if((previousIDType == "Int") || (previousType == "Digit")){
		typeB = "Int"
	}

	if((previousIDType == "Boolean") || (previousType == "BoolVal")){
		typeB = "Boolean"
	}

	if((previousIDType == "String") || (previousType == "Quote")){
		typeB = "String"
	}

	if(typeA == typeB){
		document.getElementById("semanticOutput").append("Successfully matched " + typeA + " to " + typeB + ".\n" );
	} else {
		throw "Type Mismatch at line: " + astTokenList[astCurrentIndex].lineNum + " Cannot match an " + typeA + " to " + typeB + ".\n";
	}
}

function checkComp(){
	if (astTokenList[astCurrentIndex - 1].kind == "IntOp"){
		checkType();
		document.getElementById("semanticOutput").append("Type Matched digit to digit on line: " + astTokenList[astCurrentIndex].lineNum + "\n");
	} else if (astTokenList[astCurrentIndex - 1].kind == "Assign"){
		checkType();
		if(astTokenList[astCurrentIndex].value == '"'){
			document.getElementById("semanticOutput").append("Asigned: " + astTokenList[astCurrentIndex + 1].value + " to id " + astTokenList[astCurrentIndex - 2].value + " at line " + astTokenList[astCurrentIndex].lineNum + "\n");
		} else {
			document.getElementById("semanticOutput").append("Asigned: " + astTokenList[astCurrentIndex].value + " to id " + astTokenList[astCurrentIndex - 2].value + " at line " + astTokenList[astCurrentIndex].lineNum + "\n");			
		}
		initalizedID.push(astTokenList[astCurrentIndex - 2].value)
	} else if (astTokenList[astCurrentIndex - 1].kind == "BoolOp"){
		checkType();
	}
}

function astNextToken(){
	return astTokenList[astCurrentIndex].kind;
}

function astMatch(expected){
	var wholeString = "";
		if(astTokenList[astCurrentIndex].kind == "Char"){// && astTokenList[astCurrentIndex + 1].kind != "Char" && astTokenList[astCurrentIndex + 1].kind != "Quote"){
			if(astTokenList[astCurrentIndex - 1].kind == "Quote"){
				while(astTokenList[astCurrentIndex + 1].kind != "Quote"){
					wholeString += astTokenList[astCurrentIndex].value;
					astCurrentIndex++;
				} wholeString += astTokenList[astCurrentIndex].value
				ast.addNode(wholeString, "leaf");
			} else {
				ast.addNode(astTokenList[astCurrentIndex].value + "@" + scopeCount, "leaf");
			}
		} else {
			ast.addNode(astTokenList[astCurrentIndex].value, "leaf");
		}
		astCurrentIndex++;
}

function parseASTProgram(){
	document.getElementById("astOutput").append("Program Number: " + astNumber + "\n");
	document.getElementById("semanticOutput").append("Program Number: " + astNumber + "\n");
	parseASTBlock();
	astCurrentIndex++;
	document.getElementById("astOutput").append(ast.toString() + "\n");
	document.getElementById("semanticOutput").append(sa.toString());
}

function parseASTBlock(){
	scopeCount++;
	ast.addNode("Block", "branch")
	sa.newScope(scopeCount);
	document.getElementById("semanticOutput").append("Entering Scope: " + scopeCount + "\n")
	astCurrentIndex++; //astMatch("LBRACE");
	parseASTStatementList();
	astCurrentIndex++; //astMatch("RBRACE");
	ast.endChildren();
	sa.kick();
}

function parseASTStatementList(){
	if(astNextToken() != "RBRACE"){
		parseASTStatement();
		parseASTStatementList();
		ast.endChildren();
	} else {
		//Epsilon Production
	}
}

function parseASTStatement(){
	if(astNextToken() == "Print"){
		parseASTPrint();
	} else if (astNextToken() == "Char"){
		parseASTAssign();
	} else if (astNextToken() == "Type"){
		parseASTVarDecl();
	} else if (astNextToken() == "While"){
		parseASTWhile();
	} else if (astNextToken() == "If"){
		parseASTIf();
	} else if (astNextToken() == "LBRACE"){
		parseASTBlock();
	}
	ast.endChildren();
}

function parseASTPrint(){
	ast.addNode("Print", "branch");
	astCurrentIndex++; //astMatch("Print");
	astCurrentIndex++; //astMatch("LPAREN");
	parseASTExpr();
	astCurrentIndex++; //astMatch("RPAREN");
	ast.endChildren();
}

function parseASTAssign(){
	ast.addNode("Assign", "branch");
	parseASTId();
	astCurrentIndex++; //astMatch("Assign");
	parseASTExpr();
}

function parseASTVarDecl(){
	ast.addNode("VarDecl", "branch");
	if(!sa.cur.ht.hasItem(astTokenList[astCurrentIndex + 1].value)){
		sa.cur.ht.setItem(astTokenList[astCurrentIndex + 1].value,astTokenList[astCurrentIndex].value);
		document.getElementById("semanticOutput").append("Declaring Identifier: (" + astTokenList[astCurrentIndex + 1].value + ") Of type: (" + astTokenList[astCurrentIndex].value + ") \n"  )
	} else {
		throw "Cannot Redeclare Identifier: (" + astTokenList[astCurrentIndex + 1].value + ")";
	}
	astMatch("Type");
	parseASTId();
}

function parseASTWhile(){
	ast.addNode("While", "branch");
	astCurrentIndex++; //astMatch("While");
	parseASTBooleanExpr();
	parseASTBlock();
	ast.endChildren();
}

function parseASTIf(){
	ast.addNode("If", "branch");
	astCurrentIndex++; //astMatch("If");
	parseASTBooleanExpr();
	parseASTBlock();
	ast.endChildren();
}

function parseASTExpr(){
	checkComp();
	if(astNextToken() == "Digit"){
		parseASTIntExpr();
	} else if(astNextToken() == "Quote"){
		parseASTStringExpr();
	} else if(astNextToken() == "LPAREN" || astNextToken() == "BoolVal"){
		parseASTBooleanExpr();
	} else if(astNextToken() == "Char"){
		parseASTId();
	}
}

function parseASTIntExpr(){
	astCurrentIndex++;// astMatch("Digit");
	if(astNextToken() == "IntOp"){
		ast.addNode(astTokenList[astCurrentIndex].value, "branch");
		ast.addNode(astTokenList[astCurrentIndex - 1].value, "leaf");
		astCurrentIndex++; //astMatch("IntOp");
		parseASTExpr();
	} else if (astTokenList[astCurrentIndex - 1].kind == "Digit"){
		ast.addNode(astTokenList[astCurrentIndex - 1].value, "leaf");
	}
}

function parseASTStringExpr(){
	astCurrentIndex++; //astMatch("Quote");
	parseASTCharList();
	astCurrentIndex++; //astMatch("Quote");
}

function parseASTBooleanExpr(){
	if(astNextToken() == "LPAREN"){
		ast.addNode(astTokenList[astCurrentIndex + 2].value, "branch");
		astCurrentIndex++; //astMatch("LPAREN");
		parseASTExpr();
		astCurrentIndex++; //astMatch("BoolOp");
		parseASTExpr();
		astCurrentIndex++; //astMatch("RPAREN");
	} else if(astNextToken() == "BoolVal"){
		astMatch("BoolVal");
	}
	//ast.endChildren();
}

function parseASTId(){
	if(sa.checkTree(astTokenList[astCurrentIndex].value) == false){
		throw "Undeclared Identifier: (" + astTokenList[astCurrentIndex].value + ")"; 
	}
	astMatch("Char");
}

function parseASTCharList(){
	if(astNextToken() != "Quote"){
		astMatch("Char");
		parseASTCharList();
		ast.endChildren();
	} else {
		//Epsilon Production
	}
	
}
//Oscar Reyes
//AST Construction

// {int a
// a = 1
// {
// a = 2
// print(a)
// }
// string b
// b = "alan"
// if (a == 1){
// print(b)
// }
// string c
// c = "james"
// b = "blackstone"
// print(b)
// }


var astCurrentIndex = 0;
var astTokenList;
var ast;

function runAst(input){
	if(astCurrentIndex == 0){
		astTokenList = listState(input);
	}
	runCompiler(input);
	ast = new Tree();
	parseASTProgram();
	astCurrentIndex = 0;
}

function astNextToken(){
	return astTokenList[astCurrentIndex].kind;
}

function match(expected){
		 ast.addNode(astTokenList[astCurrentIndex].value, "leaf");
		astCurrentIndex++;
}

function parseASTProgram(){
	parseASTBlock();
	document.getElementById("astOutput").append(ast.toString());
}

function parseASTBlock(){
	ast.addNode("Block", "branch")
	astCurrentIndex++; //match("LBRACE");
	parseASTStatementList();
	astCurrentIndex++; //match("RBRACE");
	ast.endChildren();
}

function parseASTStatementList(){
	console.log(astNextToken())
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
	astCurrentIndex++; //match("Print");
	astCurrentIndex++; //match("LPAREN");
	parseASTExpr();
	astCurrentIndex++; //match("RPAREN");
	ast.endChildren();
}

function parseASTAssign(){
	ast.addNode("Assign", "branch");
	parseASTId();
	astCurrentIndex++; //match("Assign");
	parseASTExpr();
}

function parseASTVarDecl(){
	ast.addNode("VarDecl", "branch");
	match("Type");
	parseASTId();
}

function parseASTWhile(){
	ast.addNode("While", "branch");
	astCurrentIndex++; //match("While");
	parseASTBooleanExpr();
	parseASTBlock();
	ast.endChildren();
}

function parseASTIf(){
	ast.addNode("If", "branch");
	astCurrentIndex++; //match("If");
	parseASTBooleanExpr();
	parseASTBlock();
	ast.endChildren();
}

function parseASTExpr(){
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
	match("Digit");
	if(astNextToken() == "IntOp"){
		match("IntOp");
		parseASTExpr();
	}
}

function parseASTStringExpr(){
	astCurrentIndex++; //match("Quote");
	parseASTCharList();
	astCurrentIndex++; //match("Quote");
}

function parseASTBooleanExpr(){
	if(astNextToken() == "LPAREN"){
		ast.addNode("BoolOp", "branch")
		astCurrentIndex++; //match("LPAREN");
		parseASTExpr();
		astCurrentIndex++; //match("BoolOp");
		parseASTExpr();
		astCurrentIndex++; //match("RPAREN");
	} else if(astNextToken() == "BoolVal"){
		match("BoolVal");
	}
	ast.endChildren();
}

function parseASTId(){
	match("Char");
}

function parseASTCharList(){
	if(astNextToken() != "Quote"){
		match("Char");
		parseASTCharList();
		ast.endChildren();
	} else {
		//Epsilon Production
	}
	
}
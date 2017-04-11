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

var currentScope;
var scopeCount = -1;
var sa;

function runAst(input){
	if(astCurrentIndex == 0){
		astTokenList = listState(input);
	}
	ast = new Tree();
	sa = new symbolTree();
		try { 
			parseASTProgram();
			console.log(sa)
		}
		catch (e){
			$('#astOutput').append(e);
		}	
	// if(astCurrentIndex < astTokenList.length - 1){
	// 	runAst(input);
	// } 
	//astCurrentIndex = 0;
}

function astNextToken(){
	return astTokenList[astCurrentIndex].kind;
}

function astMatch(expected){
		ast.addNode(astTokenList[astCurrentIndex].value, "leaf");
		astCurrentIndex++;
}

function parseASTProgram(){
	parseASTBlock();
	astCurrentIndex++;
	document.getElementById("astOutput").append(ast.toString());
	document.getElementById("semanticOutput").append(sa.toString());
}

function parseASTBlock(){
	scopeCount++;
	ast.addNode("Block", "branch")
	sa.newScope("Scope " + scopeCount);
	currentScope = "Scope " + scopeCount;
	astCurrentIndex++; //astMatch("LBRACE");
	parseASTStatementList();
	astCurrentIndex++; //astMatch("RBRACE");
	ast.endChildren();
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
	sa.cur.ht.setItem(astTokenList[astCurrentIndex + 1].value,astTokenList[astCurrentIndex].value)
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
		console.log(ast.addNode(astTokenList[astCurrentIndex - 1].value, "leaf"))
		ast.addNode(astTokenList[astCurrentIndex - 1].value, "leaf")
		astCurrentIndex++; //astMatch("IntOp");
		parseASTExpr();
	}
}

function parseASTStringExpr(){
	astCurrentIndex++; //astMatch("Quote");
	parseASTCharList();
	astCurrentIndex++; //astMatch("Quote");
}

function parseASTBooleanExpr(){
	if(astNextToken() == "LPAREN"){
		ast.addNode(astTokenList[astCurrentIndex + 2].value, "branch")
		astCurrentIndex++; //astMatch("LPAREN");
		parseASTExpr();
		astCurrentIndex++; //astMatch("BoolOp");
		parseASTExpr();
		astCurrentIndex++; //astMatch("RPAREN");
	} else if(astNextToken() == "BoolVal"){
		astMatch("BoolVal");
	}
	ast.endChildren();
}

function parseASTId(){
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
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

function runAst(tokenStream){
	if(astCurrentIndex == 0){
		astTokenList = tokenStream;
	}
	ast = new Tree();
	sa = new symbolTree();
		try { 
			parseASTProgram();
		}
		catch (e){
			$('#astOutput').append(e);
		}	
	// if(astCurrentIndex < astTokenList.length - 1){
	// 	runAst(input);
	// } 
	//astCurrentIndex = 0;
}

function checkType(){
	console.log(astTokenList[astCurrentIndex].kind)
	console.log(astTokenList[astCurrentIndex - 2].kind)
	if((sa.cur.ht.getItem(astTokenList[astCurrentIndex].value) == "Int") || (astTokenList[astCurrentIndex].kind == "Digit")){
		if((sa.cur.ht.getItem(astTokenList[astCurrentIndex - 2].value) == "Int") || (astTokenList[astCurrentIndex - 2].kind == "Digit")){
			console.log("Int Compar Okay")
		} else {
			console.log("Not valid")
		}
	} else if ((sa.cur.ht.getItem(astTokenList[astCurrentIndex].value) == "Boolean") || (astTokenList[astCurrentIndex].kind == "BoolVal")){
		if ((sa.cur.ht.getItem(astTokenList[astCurrentIndex - 2].value) == "Boolean") || (astTokenList[astCurrentIndex - 2].kind == "BoolVal")){
			console.log("Bool Comp Okay")
		} else {
			console.log("Not valid")
		}
	} else if ((sa.cur.ht.getItem(astTokenList[astCurrentIndex].value) == "String") || (astTokenList[astCurrentIndex].kind == "Quote")){
		if ((sa.cur.ht.getItem(astTokenList[astCurrentIndex - 2].value) == "String") || (astTokenList[astCurrentIndex - 2].kind == "Quote")){
			console.log("Okay")
		} else {
			console.log("Not okay")
		}
	}
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
	// console.log(astNextToken())
	// console.log(sa.cur.ht.getItem(astTokenList[astCurrentIndex - 2].value))
	parseASTExpr();
}

function parseASTVarDecl(){
	ast.addNode("VarDecl", "branch");
	if(!sa.cur.ht.hasItem(astTokenList[astCurrentIndex + 1].value)){
		sa.cur.ht.setItem(astTokenList[astCurrentIndex + 1].value,astTokenList[astCurrentIndex].value);
	} else {
		console.log("Stupid");
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
	console.log(astTokenList[astCurrentIndex - 1].kind)
	if(astTokenList[astCurrentIndex - 1].kind == "IntOp" || astTokenList[astCurrentIndex - 1].kind == "Assign" || astTokenList[astCurrentIndex - 1].kind == "BoolOp"){
		checkType();
	}
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
		if(astNextToken() == "Digit" || sa.cur.ht.getItem(astTokenList[astCurrentIndex].value) == "Int"){
			console.log("Okay")
		} else {
			console.log("NaN")
		}
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
		console.log("No No")
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
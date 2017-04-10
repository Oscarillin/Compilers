//Oscar Reyes
//Parser

var currentIndex = 0;
var tokenList;
var cst;

function runCompiler(input){
	$('#parseOutput').text("");
	$('#lexOutput').text("");
	run(input);
}

function run(input){
	if(currentIndex == 0){
		tokenList = listState(input);
	}
	cst = new Tree();
		try { 
			parseProgram();
			if(currentIndex < tokenList.length - 1){
				run(input);
			} 
			
			runAst(input);
		}
		catch (e){
			$('#parseOutput').append(e);
		}

	currentIndex = 0;	
}

function nextToken(){
	return tokenList[currentIndex].kind;
}

function match(expected){
	if (expected == nextToken()){
		 $('#parseOutput').append("Parse of " + tokenList[currentIndex].kind + " Successful! \n");
		 cst.addNode(tokenList[currentIndex].value, "leaf");
		currentIndex++;
	} else {
		throw "Unexpected Token: " + tokenList[currentIndex].kind + " at Line: " + tokenList[currentIndex].lineNum + " Expected: " + expected + "\n";
	}
}

function parseProgram(){
	cst.addNode("Program", "branch");
	parseBlock();
	match("EOP");
	document.getElementById("parseOutput").append(cst.toString());
}

function parseBlock(){
	cst.addNode("Block", "branch")
	match("LBRACE");
	parseStatementList();
	match("RBRACE");
	cst.endChildren();
}

function parseStatementList(){
	if(nextToken() != "RBRACE"){
		cst.addNode("StatementList", "branch");
		parseStatement();
		parseStatementList();
		cst.endChildren();
	} else {
		//Epsilon Production
	}
}

function parseStatement(){
	cst.addNode("Statement", "branch");
	if(nextToken() == "Print"){
		parsePrint();
	} else if (nextToken() == "Char"){
		parseAssign();
	} else if (nextToken() == "Type"){
		parseVarDecl();
	} else if (nextToken() == "While"){
		parseWhile();
	} else if (nextToken() == "If"){
		parseIf();
	} else if (nextToken() == "LBRACE"){
		parseBlock();
	} else {
		throw "Unexpected Token: " + tokenList[currentIndex].kind + " at Line: " + tokenList[currentIndex].lineNum + " Expecting print, a character, a variable declaration, while, if, or '{' \n";
	}
	cst.endChildren();
}

function parsePrint(){
	cst.addNode("Print", "branch");
	match("Print");
	match("LPAREN");
	parseExpr();
	match("RPAREN");
	cst.endChildren();
}

function parseAssign(){
	cst.addNode("Assign", "branch");
	parseId();
	match("Assign");
	parseExpr();
	cst.endChildren();
}

function parseVarDecl(){
	cst.addNode("VarDecl", "branch");
	match("Type");
	parseId();
	cst.endChildren();
}

function parseWhile(){
	cst.addNode("While", "branch");
	match("While");
	parseBooleanExpr();
	parseBlock();
	cst.endChildren();
}

function parseIf(){
	cst.addNode("If", "branch");
	match("If");
	parseBooleanExpr();
	parseBlock();
	cst.endChildren();
}

function parseExpr(){
	cst.addNode("Expr", "branch")
	if(nextToken() == "Digit"){
		parseIntExpr();
	} else if(nextToken() == "Quote"){
		parseStringExpr();
	} else if(nextToken() == "LPAREN" || nextToken() == "BoolVal"){
		parseBooleanExpr();
	} else if(nextToken() == "Char"){
		parseId();
	} else {
		throw "Unexpected Token: " + tokenList[currentIndex].kind + " at Line: " + tokenList[currentIndex].lineNum + "Expecting a type declaration (Int, String, or Boolean) or a character \n";
	}
	cst.endChildren();
}

function parseIntExpr(){
	cst.addNode("IntExpr", "branch");
	match("Digit");
	if(nextToken() == "IntOp"){
		match("IntOp");
		parseExpr();
	}
	cst.endChildren();
}

function parseStringExpr(){
	cst.addNode("StringExpr", "branch");
	match("Quote");
	parseCharList();
	match("Quote");
}

function parseBooleanExpr(){
	cst.addNode("BooleanExpr", "branch");
	if(nextToken() == "LPAREN"){
		match("LPAREN");
		parseExpr();
		match("BoolOp");
		parseExpr();
		match("RPAREN");
	} else if(nextToken() == "BoolVal"){
		match("BoolVal");
	} else {
		throw "Unexpected Token: " + tokenList[currentIndex].kind + " at Line: " + tokenList[currentIndex].lineNum + " Expecting '(', true, or false \n";
	}
	cst.endChildren();
}

function parseId(){
	cst.addNode("Id", "branch");
	match("Char");
	cst.endChildren();
}

function parseCharList(){
	if(nextToken() != "Quote"){
		cst.addNode("CharList", "branch");
		match("Char");
		parseCharList();
		cst.endChildren();
	} else {
		//Epsilon Production
	}
	
}
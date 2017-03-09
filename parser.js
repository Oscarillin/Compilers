//Oscar Reyes
//Parser

var currentIndex = 0;
var tokenList;

function nextToken(){
	return tokenList[currentIndex].kind;
}

function match(expected){
	if (expected == nextToken()){
		currentIndex++;
	} else {
		throw "Unexpected Token: " + tokenList[currentIndex].kind + " Expected: " + expected + "\n";
	}
}

function parseProgram(){
	parseBlock();
	match("EOP");
}

function parseBlock(){
	match("LBRACE");
	parseStatementList();
	match("RBRACE");
}

function parseStatementList(){
	if(nextToken() != "RBRACE"){
		parseStatement();
		parseStatementList();
	} else {
		//Epsilon Production
	}
}

function parseStatement(){
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
		//error
	}
}

function parsePrint(){
	match("Print");
	match("LPAREN");
	parseExpr();
	match("RPAREN");
}

function parseAssign(){
	parseId();
	match("Assign");
	parseExpr();

function parseVarDecl(){
	match("Type");
	parseId();
}

function parseWhile(){
	match("While");
	parseBooleanExpr();
	parseBlock();
}

function parseIf(){
	match("If");
	parseBooleanExpr();
	parseBlock();
}

function parseExpr(){
	if(nextToken() == "Digit"){
		parseIntExpr();
	} else if(nextToken() == "Quote"){
		parseStringExpr();
	} else if(nextToken() == "LPAREN"){
		parseBooleanExpr();
	} else if(nextToken() == "Char"){
		parseId();
	} else {
		//error
	}
}

function parseIntExpr(){
	match("Digit");
	if(nextToken() == "IntOp"){
		match("IntOp");
		parseExpr();
	}
}

function parseStringExpr(){
	match("Quote");
	parseCharList();
	match("Quote");
}

function parseBooleanExpr(){
	if(nextToken() == "LPAREN"){
		match("LPAREN");
		parseExpr();
		match("BoolOp");
		parseExpr();
		match("RPAREN");
	} else if(nextToken() == "BoolVal"){
		match("BoolVal");
	} else {
		//error
	}
}

function parseId(){
	match("Char");
}

function parseCharList(){
	if(nextToken() != "Quote"){
		match("Char");
		parseCharList();
	} else {
		//Epsilon Production
	}
	
}
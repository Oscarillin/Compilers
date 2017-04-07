//Oscar Reyes
//AST Construction

int a
a = 1
{
a = 2
print(a)
}
string b
b = "alan"
if (a == 1){
print(b)
}
string c
c = "james"
b = "blackstone"
print(b)
}

var currentIndex = 0;
var tokenList;
var ast;

ast = new Tree();

function nextToken(){
	return tokenList[currentIndex].kind;
	console.log(tokenList[currentIndex].kind);
}

function match(expected){
		 ast.addNode(tokenList[currentIndex].value, "leaf");
		currentIndex++;
}

function parseProgram(){
	parseBlock();
	match("EOP");
	document.getElementById("parseOutput").append(ast.toString());
}

function parseBlock(){
	ast.addNode("Block", "branch")
	match("LBRACE");
	parseStatementList();
	match("RBRACE");
	ast.endChildren();
}

function parseStatementList(){
	if(nextToken() != "RBRACE"){
		ast.addNode("StatementList", "branch");
		parseStatement();
		parseStatementList();
		ast.endChildren();
	} else {
		//Epsilon Production
	}
}

function parseStatement(){
	ast.addNode("Statement", "branch");
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
	ast.endChildren();
}

function parsePrint(){
	ast.addNode("Print", "branch");
	match("Print");
	match("LPAREN");
	parseExpr();
	match("RPAREN");
	ast.endChildren();
}

function parseAssign(){
	ast.addNode("Assign", "branch");
	parseId();
	match("Assign");
	parseExpr();
	ast.endChildren();
}

function parseVarDecl(){
	ast.addNode("VarDecl", "branch");
	match("Type");
	parseId();
	ast.endChildren();
}

function parseWhile(){
	ast.addNode("While", "branch");
	match("While");
	parseBooleanExpr();
	parseBlock();
	ast.endChildren();
}

function parseIf(){
	ast.addNode("If", "branch");
	match("If");
	parseBooleanExpr();
	parseBlock();
	ast.endChildren();
}

function parseExpr(){
	ast.addNode("Expr", "branch")
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
	ast.endChildren();
}

function parseIntExpr(){
	ast.addNode("IntExpr", "branch");
	match("Digit");
	if(nextToken() == "IntOp"){
		match("IntOp");
		parseExpr();
	}
	ast.endChildren();
}

function parseStringExpr(){
	ast.addNode("StringExpr", "branch");
	match("Quote");
	parseCharList();
	match("Quote");
}

function parseBooleanExpr(){
	ast.addNode("BooleanExpr", "branch");
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
	ast.endChildren();
}

function parseId(){
	ast.addNode("Id", "branch");
	match("Char");
	ast.endChildren();
}

function parseCharList(){
	if(nextToken() != "Quote"){
		ast.addNode("CharList", "branch");
		match("Char");
		parseCharList();
		ast.endChildren();
	} else {
		//Epsilon Production
	}
	
}
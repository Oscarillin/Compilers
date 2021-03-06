//Oscar Reyes
//Symbol Tree

function symbolTree(){

	this.root = null;
	this.cur = {};

	this.newScope = function(name){

		var scope = { name: name,
					  children: [],
					  parent: {},
					  ht: new HashTable
					};

		if ((this.root == null) || (!this.root) )
		{
			this.root = scope;
		}
		else
		{
			scope.parent = this.cur;

			this.cur.children.push(scope);
		}

		this.cur = scope;
		
	};

	this.kick = function() {

		if ((this.cur.parent !== null) && (this.cur.parent.name !== undefined))
		{
			this.cur = this.cur.parent;
		}
		else
		{
			//Error logging
		}

	};

	    this.toString = function() {
        // Initialize the result string.
        var traversalResult = "";

        // Recursive function to handle the expansion of the scopes.
        function expand(scope, depth)
        {
            // Space out based on the current depth so
            // this looks at least a little tree-like.
            for (var i = 0; i < depth; i++)
            {
                traversalResult += "-";
            }

            // If there are no children (i.e., leaf scopes)...
            if (!scope.children || scope.children.length === 0)
            {
                // ... note the leaf scope.
                traversalResult += "[ Scope " + scope.name + "\n";
                for (var k in scope.ht.items) {
                    if (scope.ht.hasItem(k)) {
                        traversalResult +=  "[ " + k + " | " + scope.ht.items[k] + " ] \n";
                    }
                }  
                traversalResult += "\n";
            }
            else
            {
                // There are children, so note these interior/branch scopes and ...
                traversalResult += "[ Scope " + scope.name + "\n";
                for (var k in scope.ht.items) {
                    if (scope.ht.hasItem(k)) {
                        traversalResult +=  "[ " + k + " | " + scope.ht.items[k] + " ] \n";
                    }
                } 
                traversalResult += "\n";
                // .. recursively expand them.
                for (var i = 0; i < scope.children.length; i++)
                {
                    expand(scope.children[i], depth + 1);
                }
            }
        }
        // Make the initial call to expand from the root.
        expand(this.root, 0);
        // Return the result.
        return traversalResult;
    };

    this.checkTree = function(key) {
        var pointer = this.cur;
        while(pointer.parent != null){
            if(pointer.ht.hasItem(key) == false){
                pointer = pointer.parent;
            } else {
                return true;
            }
        } return false;
    };

    this.getValue = function(key) {
        var pointer = this.cur;
        while(pointer.parent != null){
            if(pointer.ht.hasItem(key) == false){
                pointer = pointer.parent;
            } else {
                console.log(pointer.ht.getItem(key))
                return pointer.ht.getItem(key);
            }
        } return "No"
    }
}

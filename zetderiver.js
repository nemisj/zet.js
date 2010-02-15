(function(){
var key = {};

function buildChain(child, super){
	for(var i in child){
		var parentFnc = super[i];
		if(typeof(parentFnc) == "function"
			&& i != "inherited"
			&& i != "$Protected"
			&& i != "$Public"
		){
			//check if this is not the same
			if(parentFnc !== child[i]){
				child[i]._superMethod = parentFnc;	
			}
		}
	}
}

var g = window.$Declare = function derived(def){
    return function(k){

		var instance, scope;

		var superScope, superThis;
		var cacheScope, cacheThis;

        if(typeof(def.superclass) != "undefined"){
            superThis  = new (def.superclass)(key);
            superScope = super.getProtectedScope && super.getProtectedScope();
        }

		if(superThis){
			for(var i in superThis){
				cacheThis[i] = superThis;
			}
		}

		if(superScope){
			for(var i in superScope){
				cacheScope[i] = superScope;
			}
		}
        
        scope = (superScope || {
            that  : null
        });

		instance = superThis || {};

        scope.$Protected = function(proto){
            for(var i in proto){
                scope[i] = proto[i];
            }    
        }

        scope.$Public = function(proto){
            for(var i in proto){
                instance[i] = proto[i];
            }
        }

        var fact = def.factory;
        with(scope){
            eval("fact = " + fact.toString());
        }

        fact();

        scope.that = instance;

		// making inheritance chain for public
		if(cacheThis){
			buildChain(instance,cacheThis); 
		}

		// making inheritance chain for protected
		if(cacheScope){
			buildChain(instance,cacheScope); 
		}

		that.inherited = function(fncName, args){
			if(arguments.length == 1){
			}
		}

        if(k === key){
            //dealing with subclasses
            console.debug('inheritance');
            instance.getProtectedScope = function(){
                return scope;
            }
        }else if(instance.init){ //normal call
            instance.init.apply(instance, arguments);
        }
    };
}
})();


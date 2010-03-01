;(function(){
var key = {};

function buildChain(child, zuper){
	for(var i in zuper){  // parent has less info than child, so, faster
		var childFnc = child[i];
		if(typeof(childFnc) == "function"
			&& i != "inherited"
			&& i != "$Protected"
			&& i != "$Public"
			&& i != "getProtectedScope"
		){
			//check if this is not the same
			if(zuper[i] !== childFnc){
				childFnc._superMethod = zuper[i];	
			}
		}
	}
}

function cache(obj){
	var result = {};
	for(var i in obj){
		result[i] = obj[i];
	}
	return result;
}

function setter(to){
	return function(proto){
		for(var i in proto){
			to[i] = proto[i];
		}    
	}
}

var undef;
var g = window.$Declare = function derived(superclass, def){
	
	// $Declare(BlaaClass,function(){}
	// this can be the case when someone passes uninited contructor
	// helps to prevent such errors
	
	var superklazz; 

	if(arguments.length == 1){
		def = superclass;
	}else if(arguments.length == 2){
		superklazz = superclass;
	}

    return function(k){

		var instance, scope;
		var hasSuper = typeof(superklazz) != "undefined";

		var superScope, superThis;
		var cacheScope, cacheThis;

        if(hasSuper){
            superThis  = superclass(key);
            superScope = superThis.getProtectedScope && superThis.getProtectedScope();

			cacheThis  = superThis  && cache(superThis);
			cacheScope = superScope && cache(superScope);
        }
        
        scope = (superScope || {
            that  : null
        });

		instance = superThis || {};

		scope.$Protected = setter(scope);
		scope.$Public    = setter(instance);

		// building object from factory function
		var fact = null;
        with(scope){
            eval("fact = " + def.toString());
        }

		//discard use of 'this'
		fact.call(window); 

		//putting back instance, so that it's become available to private scope
        scope.that = instance;

		if(hasSuper){
			// making inheritance chain for public
			cacheThis && buildChain(instance, cacheThis); 

			// making inheritance chain for protected
			cacheScope && buildChain(scope, cacheScope); 
		}

		instance.inherited = function(newargs, args){
			var callee;
			if(arguments.length == 1){
				callee = newargs.callee;
			}else if(arguments.length == 2){
				callee = args.callee;
			}

			if(callee){
				//searching for superCall
				var method = callee._superMethod;
				if(method){
//					console.debug('Found method');
					method.apply(window,newargs);
				}else{
//					console.error('Has no super method');
				}
			}else{
//				console.error('Wrong arguments');
			}
		}

        if(k === key){
            //dealing with subclasses
            instance.getProtectedScope = function(){
                return scope;
            }
        }else if(instance.init){ //normal call
            instance.init.apply(window, arguments);
        }

		return instance;
    };
}
})();


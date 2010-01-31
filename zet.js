(function(){

    //
    // GLOBAL is the reference in nodejs implementation to the global scope
    // node.js supports Modules specs, so, Zet will go into separate scope
    //
    
    var globalscope = (typeof(GLOBAL) == "undefined") ? window : GLOBAL;

    //
    // Scope which is the entry point for Classes declaration;
    //

    var declarescope = globalscope; 

    //
    // support for CommonJS Modules 1.0 API
    // Zet.js can be include as CommonJS module, by calling
    // var Zet = require('zet.js');
    //

	var _c = (typeof(exports) != "undefined") ? exports : (globalscope.Zet = function zet(){
        if(arguments.length == 1){
            var sub = arguments[0];
            return sub.instanceOf ? sub : {
                instanceOf : function(superclass){
                    return (typeof sub == "string") ? 
                        superclass == String 
                            : sub instanceof superclass; 
                }
            }
        }else if(arguments.length == 2){
            return zet.declare(arguments[0], arguments[1]);
        }
    });

    // cache for undefined
    var undef;

    //logger provider
    var logger;

	function prepareArgs(args){
		var result = [];
		if(args && args.length){
			for(var i=0;i < args.length;i++){
				result.push(args[i]); 
			}
		}  
		return result;
	};

	function mixin(obj ,prop){
		if(typeof(prop) == "object"){
			for(var i in prop){
				if(prop.hasOwnProperty(i)){
					obj[i] = prop[i];	
				}
			}
		}

        return obj;
	}

    function inherited(args){
        var currentFnc   = arguments.callee.caller;
        var inheritedFnc = currentFnc.__chain;

        if(inheritedFnc && (typeof(inheritedFnc) == "function")){
            var a = prepareArgs(args);
            return inheritedFnc.apply(globalscope, a);
        }
    }

	_c.declare = function(className, kwArgs) {

        // className ommited for anonymous declaration
        if(arguments.length == 1){
            kwArgs    = className;
            className = null;
        }

		var superclass = kwArgs.superclass;
		var defineBody = kwArgs.defineBody;

        if(superclass && typeof(superclass) != "function"){
            throw new Error("Zet.declare : Superclass of " + className + " is not a constructor.");
        }else if(defineBody !== undef && (typeof(defineBody) != "function")){
            throw new Error("Zet.declare : defineBody of " + className + " is not a function.");
        }

        var instanceOf = function(clazz){
			if(clazz == create){
				return true;
			}else if(superclass){ 
                //one level deep
				return superclass.instanceOf ? superclass.instanceOf(clazz) : superclass == clazz;
			}

			return false;
        }

		var create = function create(){
			var params = prepareArgs(arguments);

			var superStore  = null;
			var that        = null;        

			if(superclass){
                // protection agains outside calls
				var superi = superclass(create);
				if(superi == null){
					//throw or warning
                    throw new Error("Zet.declare : Superclass of " + className + " should return object.");
				}

				// mixin all functions into superStore, for inheritance
				superStore = mixin({}, superi);
				that = superi;
			}

			that  = that || {}; // testing if the object already exists;

            if(defineBody){
                var proto = null;
                try{
                    proto = defineBody(that);
                }catch(e){
                    if(e.__publicbody){
                        proto = e.__seeding;
                    }else{
                        throw e;	
                    }
                }

                if(proto){
                    //some extra arguments are here
                    mixin(that, proto);
                }
            }

            // doing inheritance stuff
            if(superStore){
                for(var i in superStore){
                    if((that[i] != superStore[i]) && (typeof(superStore[i]) == "function" && typeof(that[i]) == "function")){
                        //name collisions, apply __chain trick
                        that[i].__chain = superStore[i];
                    }
                }
            }   

            // adding helper functions
			mixin(that, {
                className   : className,
				inherited   : inherited,
				instanceOf  : instanceOf,
				public      : _c.public,
                constructor : create // for var that = bla.constructor();
			});

            var childscope  = arguments.callee.caller;
            var passedscope = arguments[0];

            // checking for execution scope
			if(childscope == passedscope){
				// Constructor called within child constructor
			} else {
                // Constructor called outside the body
				var construct = that.construct;
				if(construct && typeof(construct) == "function"){
					construct.apply(globalscope, params);	
				}
			}

			return that;
		};

		create.instanceOf = instanceOf;

        // in case for anonymous Classes declaration check for className
        return className ? _c.setClass(className, create) : create;
	}

	_c.public = function(body){
		var error = new Error('');
		error.__seeding = body;
		error.__publicbody = true;
		throw error;
	}

    _c.profile = function(kwArgs){
        if(kwArgs.scope){
            declarescope = kwArgs.scope; 
        }

        if(kwArgs.logger){
           logger = kwArgs.logger; 
        }
    }

    _c.getClass = function(className){
		var curr  = declarescope;

		var split = className.split(".");
		for(var i=0; i < split.length; i++){
            if(curr[split[i]]){
                curr =  curr[split[i]];
            } else {
                throw new Error("Zet.getClass: Can't find class: " + className);
            }
		}

        return curr;
    }

    _c.setClass = function(className, constructor){
		var curr  = declarescope;

		var split = className.split(".");
		for(var i=0;i<split.length-1;i++){
			curr = curr[split[i]] ? curr[split[i]] : (curr[split[i]] = {});
		}

		return (curr[split[split.length-1]] = constructor);
    }

	//
	// Logging facilities
	//
	
    // default logger
    logger = {
        log : function(){
            if(globalscope.console && console.log){
                console.log.apply(console, arguments);
            }else if(window && window.document){
                var div= document.createElement("div");
                document.body.appendChild(div);
                var str = '';
                for(var i=0;i< arguments.length;i++){
                    str += (arguments[i] + ' ');	
                }
                div.innerHTML = str;
            }
        },

        error : function(){
            if(globalscope.console && console.error){
                console.error.apply(console, arguments);
            }else if(window && window.document){
                var div= document.createElement("div");
                document.body.appendChild(div);
                var str = '';
                for(var i=0;i< arguments.length;i++){
                    str += (arguments[i] + ' ');	
                }
                div.innerHTML = str;
                div.style.color = 'red';
            }
        }  
    }
	
    _c.level = function(lvl){
        if(logger && logger.level){
            logger.level(lvl);
        }
    }

	_c.log = function(){
        if(logger && logger.log){
            logger.log.apply(logger,arguments);
        }
	}

    _c.error = function(){
        if(logger && logger.error){
            logger.error.apply(logger,arguments);
        }
    }

})();


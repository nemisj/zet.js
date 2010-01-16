(function(){
  var globalscope = (typeof(GLOBAL) == "undefined") ? window : GLOBAL;
	var _c = globalscope.Zet = {};
	var undef;

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

		var superclass = kwArgs.superclass;
		var defineBody = kwArgs.defineBody;

        if(superclass && typeof(superclass) != "function"){
            throw new Error("Zet.declare : Superclass of " + className + " is not a constructor.");
        }else if(defineBody === undef || (typeof(defineBody) != "function")){
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

            // doing inheritance stuff
            if(superStore){
                for(var i in superStore){
                    if(typeof(superStore[i]) == "function" && typeof(that[i]) == "function"){
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

		var split = className.split(".");
		var curr  = globalscope;

		for(var i=0;i<split.length-1;i++){
			curr = curr[split[i]] ? curr[split[i]] : (curr[split[i]] = {});
		}

		return (curr[split[split.length-1]] = create);
	}

	_c.public = function(body){
		var error = new Error('');
		error.__seeding = body;
		error.__publicbody = true;
		throw error;
	}

	//
	// Logging facilities
    // XXX: change it to logger providerrrr	
	//
	
	_c.log = function(){
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
	}

    _c.error = function(){
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

})();


function debug(str){
   var div= document.createElement("div");
   document.body.appendChild(div);
   div.innerHTML = str;
}

(function(){
	var _c = window.Zet = {};
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
	}

	_c.declare = function(className, kwArgs) {

		var superclass = kwArgs.superclass;
		var defineBody = kwArgs.defineBody;

		var create = function create(){
			var params = prepareArgs(arguments);

			var superStore = null;
			var obj        = null;        

			if(superclass && typeof superclass == "function"){
				superStore = {};

				var superi = superclass.call(window, superclass);
				if(superi == null){
					//throw or warning
					throw new Error('Superclass of ' + className + ' is not a constructor ');  
				}
				// mixin all functions into superStore, for caching purpose
				// in case child has them aswel
				mixin(superStore, superi);
				obj = superi;
			}

			obj  = obj || {}; // testing if the object already exists;

			mixin(obj, {
				inherited : function(fncName, args) {
					var currentFnc = arguments.callee.caller;
					if(currentFnc.__chain){
						return currentFnc.__chain.apply(obj,prepareArgs(args));
					}
				},

				instanceof : function(clazz){
					return create.instanceof(clazz);
				},

				public : _c.public
			});

			var proto = null;
			try{
				proto = defineBody.apply(obj, [ obj ]);
			}catch(e){
				if(e.__publicbody){
					proto = e.__seeding;
				}else{
					throw e;	
				}
			}

			if(proto){
				//some extra arguments are here
				mixin(obj, proto);
			}


			// doing inheritence stuff
			if(superStore){
				for(var i in superStore){
					if(typeof(superStore[i]) == "function" && typeof(obj[i]) == "function"){
						//name collision	
						var fnc = obj[i];
						fnc.__chain = superStore[i];
					}
				}
			}

			// helping to be able to do
			// var obj = bla.constructor();
			obj.constructor = create;

			// time to execute construct
			if(arguments[0] == create){
				// console.warn(className + ':We are called from some child.');
			} else {
				// console.warn(className + ':We are called standalone.');
				var construct = obj.construct;
				if(construct && typeof(construct) == "function"){
					construct.apply(obj, params);	
				}
			}

			return obj;
		}

		var split = className.split(".");
		var curr  = window;

		for(var i=0;i<split.length-1;i++){
			curr = curr[split[i]] ? curr[split[i]] : (curr[split[i]] = {});
		}

		curr[split[split.length-1]] = create;

		create.instanceof = function(clazz){
			if(clazz == create){
				return true;
			}else if(superclass){
				return superclass.instanceof(clazz);
			}

			return false;
		}
	}

	_c.public = function(body){
		var error = new Error('');
		error.__seeding = body;
		error.__publicbody = true;
		throw error;
	}
})();

Zet.declare('namespace.another.superClass', 
{
	defineBody : function(that){

		var name     = 'tab_' + new Date().getTime();
		var lastName = '';
		
        var privateFunction = function(){
			console.debug(that, 'privateFunction');
		}

		that.publicOwnFunction = function(){
			console.debug(that,'publicOwnFunction');	
		}

		Zet.public({
			construct : function(){
				privateFunction();
				that.publicOwnFunction();
			},

			publicFunction : function(){
				console.debug(that,'publicFunction');
			},

			toString : function(){
				return name;
			}
		});
	}
});

Zet.declare("User", {
	superclass : namespace.another.superClass,
	defineBody : function(that){
		Zet.public({
			construct : function(){
				console.debug('Constructing2', that);	
				that.inherited(arguments)
			},

			publicFunction : function(){
				console.debug(that,'publicFunction2');
				that.inherited(arguments);
			}
		});
	}
});

Zet.declare("Student", {
	superclass : User,
	defineBody : function(that){
		Zet.public({
			construct : function(){
				console.debug('Constructing3', that);	
				that.inherited(arguments)
			},

			publicFunction : function(){
				console.debug(that,'publicFunction3');
				that.inherited(arguments);
			}
		});
	}
});

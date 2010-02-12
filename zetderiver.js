(function(){
var key = {};
var g = window.Zet = function(fnc){};

g.derive = function(superclass, fnc){
    var opt = {
        factory : superclass
    };

    if(fnc != null){
        opt.factory    = fnc;
        opt.superclass = superclass;
    }

    return derived(opt);
}

function derived(def){
    return function(k){
        var instance = this;

        if(typeof(def.superclass) != "undefined"){
            var super      = new (def.superclass)(key);
            var superScope = super.getProtectedScope();
        }
        
        var scope = (superScope || {
            Zet   : (Zet || {}),
            that  : null
        });

        scope.Zet.Protected = function(proto){
            for(var i in proto){
                scope[i] = proto[i];
            }    
        }

        scope.Zet.Public = function(proto){
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
        
        if(k === key){
            //dealing with subclasses
            console.debug('inheritance');
            instance.getProtectedScope = function(){
                return scope;
            }
        }else if(instance.init){ //normal call
            instance.init.apply(instance,arguments);
        }
    };
}
})();


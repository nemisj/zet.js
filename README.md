
### Declaring classes with Zet.js

Declaration of the class begins with Zet.declare function. Here follows the simple class declaration : 

    Zet.declare('SubClass' , {
        superclass : SuperClass,
        defineBody : function(that){
            
            Zet.public({
                construct : function(name, nickname){
                    Zet.log('SomeClass.construct');    
                    that.inherited(arguments);
                },

                someMethod : function(){
                    Zet.log('SomeClass.someMethod');
                    that._someFlag = true;
                }
            });

        }
    });

Declare function requirers className, superclass and factory function to be passed as arguments. 

Name of the class must be a string. Zet.js supports namespaces, so class name can be a string separated by dots (read more in section "Namespace"). In comparison to class name, superclass variable in declaration must be a valid reference to the object and not a String.

Declaring methods and logic of the class happens inside factory function. Factory function can have different declaration styles. 

To keep code working all private variables should be declared above the public part. I advice to declare private functions also above public part to keep code more readable. 

#### Experimental Zet.js style

In this style, the methods of the class are passed as key-value map to the Zet.public function. This map consists of the method name (the key) and method itself (the value). The previous example is written in such style. 

When this style is used, it also forces developers to declare all private functions and variables above public declaration. Everything what is declared bellow public part will be discarded. 

    Zet.declare('SubClass' , {
        superclass : SuperClass,
        defineBody : function(that){
            
            var privatMethod = function(){
                alert("I'm first private method");
            };

            Zet.public({
                construct : function(name, nickname){
                    Zet.log('SomeClass.construct');    
                    that.inherited(arguments);
                },

                someMethod : function(){
                    Zet.log('SomeClass.someMethod');
                    that._someFlag = true;
                    privatMethod();
                }
            });

            var privateMethod2 = function(){
                 alert("I'm second private method");
            };
        }
    });

This example will work, but the privateMethod2 will be undefined inside the SubClass. 

#### "Module pattern" style

In this style, the same map is used as in previous example, only it should be returned at the end of the factory function.

    Zet.declare('SubClass' , {
        superclass : SuperClass,
        defineBody : function(that){
            
            var privatMethod = function(){
                alert("I'm first private method");
            };

            return {
                construct : function(name, nickname){
                    Zet.log('SomeClass.construct');    
                    that.inherited(arguments);
                },

                someMethod : function(){
                    Zet.log('SomeClass.someMethod');
                    that._someFlag = true;
                    privatMethod();
                }
            };
        }
    });

It's important to notice that such style declaration can bring unseticfied results. If the object literal is returned not at the same line as return statement, but bellow, JavaScript engine automatically will place ";" at the end of return and function will return nothing. Example: 

    return 
    {
        (code);
    }

Such code will return undefined.

#### Functional declaration

Instead of returning or feeding map object to Zet.public, this style does no require map object at all. Every function of the method is assigned to "that" variable inline.

    Zet.declare('SubClass' , {
        superclass : SuperClass,
        defineBody : function(that){
            
            var privatMethod = function(){
                alert("I'm first private method");
            };

            that.construct = function(name, nickname){
                Zet.log('SomeClass.construct');    
                that.inherited(arguments);
            };

            that.someMethod = function(){
                Zet.log('SomeClass.someMethod');
                that._someFlag = true;
                privatMethod();  
            };
        }
    });

### Namespaces

Zet.js supports dot-separated namespaces. This can help when class should be declared inside some hierarchy of objects and not in the global scope.

    Zet.declare("module.submodule.SuperClass", { ...

The above code will create SuperClass declaration inside submodule object, which is a child of module object and module object will belong to the global scope. 

If any of the objects in the namespace is absent, Zet.js will create it at runtime.

Sometimes it can be useful to create anonymous class declaration ( no assigning to the object ). If that the case, then the class name of the Zet.declare function should be omitted. 
It's possible to pass null to the declarator or to skip the argument at all. Both versions will work. 

In such declaration, the Zet.declare will return Class constructor. 

Passing null to the declarator:

    window.SuperClass = Zet.declare(null, { ...

Omitting className argument :

    window.SuperClass = Zet.declare({ ...

Zet.js also offers an helper function for retrieving objects using dot-separated namespaces. It makes it easier to check weather some object exists or not. As usually, small example:

    var SuperClass = Zet.getClass("module.submodule.SuperClass");

getClass will return object which is resides in submodule under key SuperClass.


### Inheritance

Inheritance in Zet.js is quite straight-forward. Constructor of the superclass is passed as key-value argument to the Zet.declare function and any method which was overridden can be called by issuing *that.inherited()*. 

Arguments to the "inherited" function can be passed as an array. If subclass does not change passed arguments, arguments keyword can be used instead of an array.

    that.inherited(["param1","param2","param3"]);

or

    that.inherited(arguments);


### instanceof facility

Due to some limitations in current implementation, native instanceof functionality can't be used with Zet.js classes. For that purpose there is global instanceOf function in Zet.js which will help to achive the same result. It works with "normal" classes, native JavaScript objects and Zet.js classes. 

    Zet([]).instanceOf(Array);  //return true;
    Zet(subClass1).instanceOf(SuperClass); // returns true;
    Zet("").instanceOf(String); // returns true;

### Logger

Zet.log('Hello','World'); will output to the console, if one is available. Otherwise for every log entry it will create new div node and append it to the body. It's possible to change default behavior and implement custom logging facilities. 

    Zet.profile({
        logger : {
            log : function(){
                // do something
             },
             error : function(){	
                 // do something different
             }
        }
    });


### Support for CommonJS Modules 1.0 API ( tested in nodejs )

Zet.js supports CommonJS Modules infrastructure and it can be included as normal CommonJS module, like: 

    var Zet = require('./zet');

Because CommonJS specifies that all functions and objects should be exported through exports variable, small changes are needed for existing code to work.

There are two possibilities. The most easy one is two set global scope point. This can be achived by executing profile function of zet.js at the begin of the js file.

    Zet.profile({
        scope : exports
    });

By calling profile function, the root scope for all classes will be exports. Which means, that all classes will be visible for the includer in the form :

    var module    = require('./somemodule'):
    var someClass =  module.SomeClass(); // intantiate SomeClas;

One piitfall with this approach is the references of superclasss. If superclass is defined like reference to the constructor, the code will break.

Problem:

    Zet.declare('SomeClass' , {
        superclass : SomeSuperClass // <- points to the constructor in global scope, it should be inside the exports
    }); 

To help fixing this, getClass facility can be used.

Solution : (because of the new profiled scope, Zet will return constructor from within exports scope);

    Zet.declare('SomeClass' , {
        superclass : Zet.getClass('SomeSuperClass')
    });


Another possible solution is to use anonymous class declaration and point the constructor to the correct object. To do this, name of the class, should be ommited. For example:

Before : 

    Zet.declare('SomeClass' , {
        defineBody : function(that){
            Zet.public({
                construct : function(name, nickname){
                    Zet.log('SomeClass.construct');    
                }
            });
        }
    });

After : 

    exports.SomeClass =  Zet.declare({
        defineBody : function(that){
            Zet.public({
                construct : function(name, nickname){
                    Zet.log('SomeClass.construct');    
                }
            });
        }
    });

Result for the includer will be the same as in the previous example: 

    var module    = require('./somemodule'):
    var someClass =  module.SomeClass(); // intantiate SomeClas;

Choosing one of the approaches will help to port/write code which will be possible to run on CommonJS compatible framework.

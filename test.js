var scope;
if(typeof(exports) != "undefined"){
    scope = exports;
    var Zet    = require("./zet");
    var logger = require('./zetlog4node');
    Zet.profile({ 
        scope  : scope, //needed for getClass
        logger : logger 
    });
}else{
    scope = window;
}   

scope.Person = Zet.declare({
	defineBody : function(that){
		that._counter   = 'zet_' + new Date().getTime();

        var n = '';
		
		Zet.public({
			construct : function(n){
                Zet.log('superClass.construct');
                name = n;
			},

            getName : function(){
                return name;
            },

            setName : function(n){
                Zet.log('Person.setName',n);
                name = n;
            },

			toString : function(){
				return that._counter;
			}
		});
	}
});

scope.User = Zet.declare( null , {
	superclass : Zet.getClass('Person'),
	defineBody : function(that){

        var nickname = '';

        var setNickname = function(nname){
            nickname = nname; 
        }

		Zet.public({
			construct : function(firstName){
				Zet.log('User.construct', firstName);	
				that.inherited([firstName])
			},

			setFirstName : function(name){
				Zet.log('User.setFirstName');	
				that.setName(name +'_');
			},

            getFirstName : function(){
                return that.getName();
            },

            getNickName : function(){
                return nickname; 
            },
            
            setNickName : function(nname){
                setNickname(nname);
            }
		});
	}
});

Zet.setClass('testUser',function(){
    var u = Zet.getClass('User')('Maks'); //testing constructor inheritance facility
    var name = u.getName();
    if(name != 'Maks'){
        Zet.log('User.test : Name is incorrect');
    }


    u.setFirstName('Maqz'); //testing calling direct super functions
    var firstName = u.getName();
    if(firstName != 'Maqz_'){
        Zet.log('User.test : Firstname is ' + firstName + ' but not Maqz_');
    }

    u.setNickName('SomeNickName'); //testing private scoping
    var nickname = u.getNickName(); 
    if(nickname != 'SomeNickName'){
        Zet.log('User.test :  Nickname is ' + nickname + ' but not SomeNickName');
    }
});

Zet.declare( 'module.Programmer' , {
	superclass : Zet.getClass('User'),
	defineBody : function(that){
		Zet.public({
			construct : function(name, nickname){
				Zet.log('Programmer.construct');	
				that.inherited(arguments);
                that.setNickName(nickname);
			},

            setName : function(name){
                that.inherited([name + '-']);
            },
		});
	}
});

Zet.setClass('testProgrammer', function(){
    //testing namespace and scope
    if(!Zet.getClass('module.Programmer')){
        Zet.error('Programmer.test :  Scope module does not exist');
        return;
    }

    if(typeof(exports) != "undefined"){
        if(!exports.module.Programmer){
            Zet.error('Programmer.test :  Class module.Programmer does not exist');
            return;
        }
    }else{
        if(!module.Programmer){
            Zet.error('Programmer.test :  Class module.Programmer does not exist');
            return;
        }
    }


    var p = Zet.getClass('module.Programmer')('Maqz');

    // testing instanceOf
    if(!(p.instanceOf(Zet.getClass('User')))){
        Zet.error('Programmer.test :  Instance of is broken');
    } 

    if(!(p.instanceOf(Zet.getClass('Person')))){
        Zet.error('Programmer.test :  Instance of is broken for Person');
    } 

    var name = p.getName(); // testing method from the top superclass
    var name2 = p.getFirstName(); //testing method from User superclass
    if((name != 'Maqz') || (name != name2)){
        Zet.error('Programmer.test :  Name is wrong ');
    }

    p.setName('Hello');

    Zet.error('Programmer.test :  Name is  ' + p.getName());

    if(p._counter != p.toString()){
        Zet.log('Shit.test');
    }
});


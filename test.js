Zet.declare('Person', {
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
                name = n;
            },

			toString : function(){
				return that._counter;
			}
		});
	}
});

Zet.declare("User", {
	superclass : Person,
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

function testUser(){
    var u = User('Maks'); //testing constructor inheritance facility
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
}

Zet.declare("module.Programmer", {
	superclass : User,
	defineBody : function(that){
		Zet.public({
			construct : function(name, nickname){
				Zet.log('Programmer.construct');	
				that.inherited(arguments);
                that.setNickName(nickname);
			}
		});
	}
});

function testProgrammer(){
    //testing namespace and scope
    if(!module){
        Zet.error('Programmer.test :  Scope module does not exist');
        return;
    }

    if(!module.Programmer){
        Zet.error('Programmer.test :  Class module.Programmer does not exist');
        return;
    }


    var p = module.Programmer('Maqz');

    // testing instanceOf
    if(!(p.instanceOf(User))){
        Zet.error('Programmer.test :  Instance of is broken');
    } 

    if(!(p.instanceOf(Person))){
        Zet.error('Programmer.test :  Instance of is broken for Person');
    } 

    var name = p.getName(); // testing method from the top superclass
    var name2 = p.getFirstName(); //testing method from User superclass
    if((name != 'Maqz') || (name != name2)){
        Zet.error('Programmer.test :  Name is wrong ');
    }

    Zet.log('Programmer.test :  Name is  ' + name);

    if(p._counter != p.toString()){
        console.debug('Shit');
    }
}


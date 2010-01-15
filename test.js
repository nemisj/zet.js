Zet.declare('namespace.another.superClass', 
{
	defineBody : function(that){

		var name     = 'tab_' + new Date().getTime();
		var lastName = '';
		
        var privateFunction = function(){
			Zet.log('superClass.privateFunction');
		}

		that.publicOwnFunction = function(){
			Zet.log('superClass.publicOwnFunction');	
		}

		Zet.public({
			construct : function(){
				privateFunction();
				that.publicOwnFunction();
			},

			publicFunction : function(){
				Zet.log('superClass.publicFunction');
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
			construct : function(firstName, lastName){
				Zet.log('User.construct', firstName, lastName);	
				that.inherited(arguments)
			},

			publicFunction : function(){
				Zet.log('User.publicFunction');	
				return that.inherited(arguments);
			}
		});
	}
});

Zet.declare("Student", {
	superclass : User,
	defineBody : function(that){
		Zet.public({
			construct : function(){
				Zet.log('Student.construct');	
				that.inherited(arguments)
			},

			publicFunction : function(){
				Zet.log('Student.publicFunction');
				that.inherited(arguments);
			}
		});
	}
});

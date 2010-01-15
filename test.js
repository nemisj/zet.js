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

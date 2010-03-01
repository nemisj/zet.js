var User = $Declare(function(){
    var name = null;

    $Protected({
        middleName : '',
        protectedName : function(){
			alert(that.lastName + ' ' + name + ' ' + middleName);
        }
    });

    $Public({
        init : function(param1, param2){
			alert('User.init:' + param1 + ' ' + param2);

            name = param1;
            middleName = param2 || middleName;
        },

        showMyName : function(){
			showProtectedName();
        }
    });
 });

var Programmer = $Declare(User, function(){

    $Protected({
        protectedName : function(){
			alert('Overriden by Programmer. Exit.');
        }
    });

    $Public({
        init : function(){
            alert('Programmer.init');
			that.inherited(['Ha','x0r'], arguments);
			that.lastName = 'Bork';
        }
    })
});


var test = User('Maks');
test.lastName = 'Nemisj';
test.showMyName();

var prog = Programmer("Yo!");
prog.showMyName();

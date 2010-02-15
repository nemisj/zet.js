var User = $Declare(function(){
    var name = null;

    $Protected({
        middleName : '',
        protectedName : function(){
            alert(name + ' ' + middleName + ' ' + that.lastName);
        }
    });

    $Public({
        init : function(param1,param2){
            name = param1;
            middleName = param2 || middleName;
        },
        bla : function(){
            protectedName();
        },
        showMyName : function(){
            that.bla();
        }
    });
 });

var Programmer = $Declare(User, function(){

    $Protected({
        protectedName : function(){
            alert('Owned');
        }
    });

    $Public({
        init : function(){
            console.debug('Init progger');
            middleName = 'Borked';
			that.inherited(arguments);
        }
    })
});


var test = User('Maks');
test.lastName = 'Nemisj';
test.showMyName();

// var prog = new Programmer();
// prog.showMyName();

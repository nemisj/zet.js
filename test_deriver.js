var User = Zet.derive(function(){
    var name = null;

    Zet.Protected({
        middleName : '',
        protectedName : function(){
            alert(name + ' ' + middleName + ' ' + that.lastName);
        }
    });

    Zet.Public({
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

var Programmer = Zet.derive(User, function(){

    Zet.Protected({
        protectedName : function(){
            alert('Owned');
        }
    });

    Zet.Public({
        init : function(){
            console.debug('Init progger');
            middleName = 'Borked';
        }
    })
});


var test = new User('Maks');
test.lastName = 'Nemisj';
test.showMyName();

// var prog = new Programmer();
// prog.showMyName();

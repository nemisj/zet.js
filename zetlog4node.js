var sys = require('sys');

var logger = exports;

function args2str(args){
    var str = '';
    for(var i=0;i< args.length;i++){
        str += (args[i] + ' ');	
    }

    return str;
}

function getTime(){
    var d = new Date();
    return d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds() + ' ' + d.getDate() + '/' + d.getMonth();
}

logger.log = function(){ 
    sys.puts('[' + getTime() + ']: DEBUG : ' + args2str(arguments));
}

logger.error = function(){
    sys.puts('[' + getTime() + ']: ERROR : ' + args2str(arguments));
}

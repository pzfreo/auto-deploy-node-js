var cluster = require('cluster');  
var os = require('os');

var numCPUs = os.cpus().length;
var express   =    require("express");
var mysql     =    require('mysql');



if (cluster.isMaster) {  
  // Master:
  // Let's fork as many workers as you have CPU cores
  for (var i = 0; i < numCPUs; ++i) {
    cluster.fork();
  }
  
} else {
   var app       =    express();


   var pool      =    mysql.createPool({
	   connectionLimit : 100, //important
	   host     : process.env.DBURL,
	   user     : process.env.DBUSER,
	   password : process.env.DBPW,
	   database : 'blah',
	   debug    :  false
	});
 
	function pooledGet(req,res) {
 
	   pool.getConnection(function(err,connection){
		   if (err) {
			 connection.release();
			 res.json({"code" : 100, "status" : "Error in connection database"});
			 return;
		   }   
 
	
		   connection.query("select * from user order by age limit 5",function(err,rows){
			   connection.release();
			   if(!err) {
				   res.json(rows);
			   }           
		   });
 
		   connection.on('error', function(err) {      
				 res.json({"code" : 100, "status" : "Error in connection database"});
				 return;     
		   });
	  });
	}

   app.get("/",function(req,res){
	   pooledGet(req,res);
	  });


	app.listen(8080);
}

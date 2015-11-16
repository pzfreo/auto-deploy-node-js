var cluster = require('cluster');  
var os = require('os');

var numCPUs = os.cpus().length;
var express   =    require("express");
var mysql     =    require('mysql');





if (cluster.isMaster) {  
  // Master:
  // Let's fork as many workers as you have CPU cores
  console.log(numCPUs);
  for (var i = 0; i < numCPUs; ++i) {
    cluster.fork();
  }
  
} else {

	var app       =    express();

	var pool      =    mysql.createPool({
		connectionLimit : 100, //important
		host     : process.env.DBURL,
		user     : 'root',
		password : process.env.DBPW,
		database : 'blah',
		debug    :  false
	});

	function handle_database(req,res) {
	
		pool.getConnection(function(err,connection){
			if (err) {
			  connection.release();
			  res.json({"code" : 100, "status" : "Error in connection database"});
			  return;
			}   

			console.log('connected as id ' + connection.threadId);
		
			connection.query("select * from user",function(err,rows){
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
		handle_database(req,res);
	});

	app.listen(3000);

}
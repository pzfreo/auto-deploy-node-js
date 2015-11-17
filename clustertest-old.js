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


   app.get("/",function(req,res){
	  var connection = mysql.createConnection({
		host     : process.env.DBURL,
		user     : process.env.DBUSER,
		password : process.env.DBPW,
		database : 'blah'
	  });


   connection.connect(function(err){
   if(!err) {
   } else {
	   console.log("Error connecting database ... \n\n");  
   }
   });

  connection.query('SELECT * from user order by age limit 5', function(err, rows, fields) {
  connection.end();
  if (!err)
    res.json(rows);
  else
    console.log('Error while performing Query.');
  });
  });

	app.listen(8080);
}

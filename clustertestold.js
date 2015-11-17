var express   =    require("express");
var mysql     =    require('mysql');

var app       =    express();

var connection = mysql.createConnection({
  host     : process.env.DBURL,
  user     : process.env.DBUSER,
  password : process.env.DBPW,
  database : 'blah'
});


app.get("/",function(req,res){
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

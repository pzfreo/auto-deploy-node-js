var express   =    require("express");
var app       =    express();

app.get("/",function(req,res){
    data = {a:'1',b:'2'}
    res.json(data);
});

app.listen(8080);

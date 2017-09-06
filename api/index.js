'use strict'

var mongoose = require("mongoose");
var app = require("./app");
var port = process.env.PORT || 3977;





mongoose.Promise = global.Promise;
var promise = mongoose.connect('mongodb://localhost:27017/angular2', (err, res) => {
  if(err){
    throw err;
  }else{
    console.log("=====================");
    console.log("BASE DATOS OK");
    console.log("=====================");

    app.listen(port, function(){
      console.log("Servidor API REST en HTTP://localhost:"+port);
    })
  }
});

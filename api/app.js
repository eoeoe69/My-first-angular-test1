'use strict'

var express = require("express");
var bodyParser = require("body-parser");

var app = express();

//cargar rutas
var user_routes = require("./routes/user");
var client_routes = require("./routes/client");
var consol_routes = require("./routes/consol");
var shipment_routes = require("./routes/shipment");


app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// confirgurar cabeceras http
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");

    next();
});


// rutas base
app.use("/api", user_routes);
app.use("/api", client_routes);
app.use("/api", consol_routes);
app.use("/api", shipment_routes);


app.get("/", function(req, res){
  res.status(200).send({message:"WELCOME"});
});

module.exports = app;

"use strict"

var path = require("path");
var fs = require("fs");
var mongoosePaginate = require("mongoose-pagination");

var Client = require("../models/client");
var Consol = require("../models/consol");
var Shipment = require("../models/shipment");


function getShipment(req, res){
   var shipmentId = req.params.id;

   Shipment.findById(shipmentId).populate({path: "consol"}).exec((err, shipment) => {
      if(err){
         res.status(500).send({message: "Error en la petición"});
      }else{
         if(!shipment){
            res.status(404).send({message: "El shipment no existe!!"});
         }else{
            res.status(200).send({shipment});
         }
      }
   });
}

function getShipments(req, res){
   var consolId = req.params.consol;

   if(!consolId){
      var find = Shipment.find({}).sort("number");
   }else{
      var find = Shipment.find({consol: consolId}).sort("number");
      console.log(consolId);
   }

   find.populate({
      path: "Consol",
      populate: {
         path: "client",
         model: "Client"
      }
   }).exec(function(err, shipments){
      if(err){
         console.log(err);
         res.status(500).send({message: "Error en la petición"});
      }else{
         if(!shipments){
            res.status(404).send({message: "No hay shipments!!"});
         }else{
            res.status(200).send({shipments});
         }
      }
   });

}


function saveShipment(req, res){
   var shipment = new Shipment();

   var params = req.body;
   shipment.number = params.number;
   shipment.mode = params.mode;
   shipment.date_created = shipment.date_created;
   shipment.consol = params.consol;
   shipment.packages = params.packages;
   shipment.file = null;

   shipment.save((err, shipmentStored) => {
      if(err){
         console.log(err);
         res.status(500).send({message: "Error en servidor"});
      }else{
         if(!shipmentStored){
            res.status(404).send({message: "No se ha guardado el shipment"});
         }else{
            res.status(200).send({shipment: shipmentStored});
         }
      }
   });
}

function updateShipment(req, res){
   var shipmentId = req.params.id;
   var update = req.body;

   Shipment.findByIdAndUpdate(shipmentId, update, (err, shipmentUpdated) =>{
      if(err){
         console.log(err);
         res.status(500).send({message: "Error en servidor"});
      }else{
         if(!shipmentUpdated){
            res.status(404).send({message: "No se ha actualizado el shipment"});
         }else{
            res.status(200).send({shipment: shipmentUpdated});
         }
      }
   });
}

function deleteShipment(req, res){
    var shipmentId = req.params.id;

    Shipment.findByIdAndRemove(shipmentId, (err, shipmentRemoved) =>{
      if(err){
         console.log(err);
         res.status(500).send({message: "Error en servidor"});
      }else{
         if(!shipmentRemoved){
            res.status(404).send({message: "No se ha eliminado el shipment"});
         }else{
            res.status(200).send({shipment: shipmentRemoved});
         }
      }
   });
}

function uploadFile(req, res){
    var shipmentId = req.params.id;
    var file_name = "No subido...";

    if(req.files){
        var file_path = req.files.file.path;
        var file_split = file_path.split("\\");
        var file_name = file_split[2];

        var ext_split = file_name.split("\.");
        var file_ext = ext_split[1];
        var stats = fs.statSync(req.files.file.path);
        var fileSizeInBytes = stats["size"]

        if(fileSizeInBytes < 1000000 ){

            Shipment.findByIdAndUpdate(shipmentId, {file: file_name}, (err, shipmentUpdated) => {
                if(!shipmentUpdated){
                    res.status(404).send({message: "No se ha podido actualizar el Shipment"});
                    }else{
                        res.status(200).send({shipment: shipmentUpdated});
                    }
            });
        }else{
            res.status(200).send({message: "Archivo no puede superar los 1MB"});
        }

        console.log(fileSizeInBytes);
    }else{
        res.status(200).send({message: "No has subido ningun archivo..."});
    }
}

function getShipmentFile(req, res){
    var shipmentFile = req.params.shipmentFile;
    var path_file = "./uploads/shipments/"+shipmentFile;
    fs.exists(path_file, function(exists){
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(200).send({message: "No existe el archivo..."});
        }
    });
}


module.exports = {
   getShipment,
   getShipments,
   saveShipment,
   updateShipment,
   deleteShipment,
   uploadFile,
   getShipmentFile


};

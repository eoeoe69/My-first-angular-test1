"use strict"

var path = require("path");
var fs = require("fs");
var mongoosePaginate = require("mongoose-Pagination");

var Client = require("../models/client");
var Consol = require("../models/consol");
var Shipment = require("../models/shipment");



function getConsol(req, res){
    var consolId = req.params.id;

    Consol.findById(consolId).populate({path: "client"}).exec((err, consol) =>{
        if(err){
            res.status(500).send({message: "Error en la petición"});
        }else{
            if(!consol){
                res.status(404).send({message: "El consol no existe"});
            }else{
                res.status(200).send({consol});
            }
        }
    });
}

function getConsols(req, res){
    var clientId = req.params.client;

    if(!clientId){
        //Sacar todos los albums de la bd
        var find = Consol.find({}).sort("mBL");
    } else {
        //Sacar los albums de un artista concreto de la bd
        var find = Consol.find({client: clientId}).sort("date_created");
    }

    find.populate({path: "client"}).exec((err, consols) => {
        if(err){
            res.status(500).send({message: "Error en la petición"});
        }else{
            if(!consols){
                res.status(404).send({message: "No hay consols"});
            }else{
                res.status(200).send({consols});
            }
        }
    })
}


function saveConsol(req, res){
    var consol = new Consol();

    var params = req.body;
    consol.mBL = params.mBL;
    consol.incoterm = params.incoterm;
    consol.mode = params.mode;
    consol.date_created = consol.date_created;
    consol.client = params.client;

    consol.save((err, consolStored) => {
        if(err){
            res.status(500).send({message: "Error en el servidor"});
        }else{
            if(!consolStored){
                res.status(404).send({message: "No se ha guardado el consol"});
            }else{
                res.status(200).send({consol: consolStored});
            }
        }
    })
}

function updateConsol(req, res){
    var consolId = req.params.id;
    var update = req.body;

    Consol.findByIdAndUpdate(consolId, update, (err, consolUpdated) => {
        if(err){
            res.status(500).send({message: "Error al eliminar shipment"});
        }else{
            if(!consolUpdated){
                res.status(404).send({message: "No se ha actualizado el consol porque no existe"});
            }else{
                res.status(200).send({consol: consolUpdated});
            }
        }
    })
}

function deleteConsol(req, res){
    var consolId = req.params.id;
    Consol.findByIdAndRemove(consolId, (err, consolRemoved) => {
        if(err){
            res.status(500).send({message: "Error al eliminar consol"});
        }else{
            if(!consolRemoved){
                res.status(404).send({message: "El consol no ha sido eliminado"});
            }else{

                Shipment.find({consol: consolRemoved._id}).remove((err, shipmentRemoved) => {
                    if(err){
                        res.status(500).send({message: "Error al eliminar shipment"});
                    }else{
                        if(!shipmentRemoved){
                            res.status(404).send({message: "El shipment no ha sido eliminado"});
                        }else{
                            res.status(200).send({consol: consolRemoved});
                          }
                       }
                   });
               }
           }
    });
}

function uploadImage(req, res){
    var consolId = req.params.id;
    var file_name = "No subido...";

    if(req.files){
        var file_path = req.files.image.path;
        var file_split = file_path.split("\\");
        var file_name = file_split[2];

        var ext_split = file_name.split("\.");
        var file_ext = ext_split[1];

        if(file_ext === "png" || file_ext === "jpg" || file_ext === "gif" || file_ext === "pdf" || file_ext === "jpeg"){

            Consol.findByIdAndUpdate(consolId, {image: file_name}, (err, consolUpdated) => {
                if(!consolUpdated){
                    res.status(404).send({message: "No se ha podido actualizar cliente"});
                    }else{
                        res.status(200).send({consol: consolUpdated});
                    }
            });
        }else{
            res.status(200).send({message: "Extensión del archivo no válida"});
        }

        console.log(ext_split);
    }else{
        res.status(200).send({message: "No has subido ninguna imagen..."});
    }
}

function getImageFile(req, res){
    var imageFile = req.params.imageFile;
    var path_file = "./uploads/consols/"+imageFile;
    fs.exists(path_file, function(exists){
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(200).send({message: "No existe la imagen..."});
        }
    });
}


module.exports = {
    getConsol,
    saveConsol,
    getConsols,
    updateConsol,
    deleteConsol,
    uploadImage,
    getImageFile

}

"use strict"

var path = require("path");
var fs = require("fs");
var mongoosePaginate = require("mongoose-Pagination");
var Client = require("../models/client");
var Consol = require("../models/consol");
var Shipment = require("../models/shipment");



function getClient(req, res){
    var clientId = req.params.id;

    Client.findById(clientId, (err, client) => {
        if(err){
            res.status(500).send({message: "Error en la petición"})
        }else{
            if(!client){
                res.status(404).send({message: "El cliente no existe"})
            }else{
                res.status(200).send({client});
            }
        }
    });
}

function getClients(req, res){
    if(req.params.page){
        var page = req.params.page;
    }else{
        var page = 1;
    }

    var itemsPerPage = 6;

    Client.find().sort("name").paginate(page, itemsPerPage, function(err, clients, total){
        if(err){
            res.status(500).send({message: "Error en la petición"});
        }else{
            if(!clients){
                res.status(404).send({message: "No hay clientes"});
            }else{
                return res.status(200).send({
                    total_items: total,
                    clients: clients
                });
            }
        }
    });
}

function saveClient(req, res){
    var client = new Client();

    var params = req.body;
    client.name = params.name;
    client.adress = params.adress;
    client.email = params.email;
    client.phone = params.phone;
    client.image = null;

    client.save((err, clientStored) => {
        if(err){
            res.status(500).send({message: "Error al guardar cliente"});
        }else{
            if(!clientStored){
                res.status(404).send({message: "El cliente no ha sido guardado"});
            }else{
                res.status(200).send({client: clientStored});
            }
        }
    });
}

function updateClient(req, res){
    var clientId = req.params.id;
    var update = req.body;

    Client.findByIdAndUpdate(clientId, update, (err, clientUpdated) => {
        if(err){
            res.status(500).send({message: "Error al guardar cliente"});
        }else{
            if(!clientUpdated){
                res.status(404).send({message: "El cliente no ha sido actializado"});
            }else{
                res.status(200).send({client: clientUpdated});
            }
        }
    });
}

function deleteClient(req,res){
    var clientId = req.params.id;

    Client.findByIdAndRemove(clientId, (err,clientRemoved) =>{
      if(err){
          res.status(500).send({message: "Error al eliminar cliente"});
      }else{
          if(!clientRemoved){
              res.status(404).send({message: "El cliente no ha sido eliminado"});
          }else{
              Consol.find({client: clientRemoved._id}).remove((err, consolRemoved) => {
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
                                      res.status(200).send({client: clientRemoved});
                                  }
                               }
                            });
                         }
                      }
              });
          }
      }
    });
}

function uploadImage(req, res){
    var clientId = req.params.id;
    var file_name = "No subido...";

    if(req.files){
        var file_path = req.files.image.path;
        var file_split = file_path.split("\\");
        var file_name = file_split[2];

        var ext_split = file_name.split("\.");
        var file_ext = ext_split[1];

        if(file_ext === "png" || file_ext === "jpg" || file_ext === "gif" || file_ext === "pdf" || file_ext === "jpeg"){

            Client.findByIdAndUpdate(clientId, {image: file_name}, (err, clientUpdated) => {
                if(!clientUpdated){
                    res.status(404).send({message: "No se ha podido actualizar cliente"});
                    }else{
                        res.status(200).send({client: clientUpdated});
                    }
            });
        }else{
            res.status(200).send({message: "Extensión del archivop no válida"});
        }

        console.log(ext_split);
    }else{
        res.status(200).send({message: "No has subido ninguna imagen..."});
    }
}

function getImageFile(req, res){
    var imageFile = req.params.imageFile;
    var path_file = "./uploads/clients/"+imageFile;
    fs.exists(path_file, function(exists){
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(200).send({message: "No existe la imagen..."});
        }
    });
}

module.exports = {
    getClient,
    saveClient,
    getClients,
    updateClient,
    deleteClient,
    uploadImage,
    getImageFile
};

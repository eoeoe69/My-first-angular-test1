"use strict"

var express = require("express");
var clientController = require("../controllers/client")
var api = express.Router();
var md_auth = require("../middlewares/authenticated");

var multipart = require("connect-multiparty");
var md_upload = multipart({ uploadDir: "./uploads/clients"});

api.get("/client/:id", md_auth.ensureAuth, clientController.getClient);
api.post("/client", md_auth.ensureAuth, clientController.saveClient);
api.get("/clients/:page?", md_auth.ensureAuth, clientController.getClients);
api.put("/client/:id", md_auth.ensureAuth, clientController.updateClient);
api.delete("/client/:id", md_auth.ensureAuth, clientController.deleteClient);
api.post("/upload-image-client/:id", [md_auth.ensureAuth, md_upload], clientController.uploadImage);
api.get("/get-image-client/:imageFile", clientController.getImageFile);

module.exports = api;

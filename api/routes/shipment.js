"use strict"

var express = require("express");
var shipmentController = require("../controllers/shipment")
var api = express.Router();
var md_auth = require("../middlewares/authenticated");

var multipart = require("connect-multiparty");
var md_upload = multipart({ uploadDir: "./uploads/shipments"});

api.get("/shipment/:id", md_auth.ensureAuth, shipmentController.getShipment);
api.post("/shipment", md_auth.ensureAuth, shipmentController.saveShipment);
api.get("/shipments/:consol?", md_auth.ensureAuth, shipmentController.getShipments);
api.put("/shipment/:id", md_auth.ensureAuth, shipmentController.updateShipment);
api.delete("/shipment/:id", md_auth.ensureAuth, shipmentController.deleteShipment);
api.post("/upload-file-shipment/:id", [md_auth.ensureAuth, md_upload], shipmentController.uploadFile);
api.get("/get-file-shipment/:shipmentFile", shipmentController.getShipmentFile);


module.exports = api;

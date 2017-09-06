"use strict"

var express = require("express");
var consolController = require("../controllers/consol")
var api = express.Router();
var md_auth = require("../middlewares/authenticated");

var multipart = require("connect-multiparty");
var md_upload = multipart({ uploadDir: "./uploads/consols"});

api.get("/consol/:id", md_auth.ensureAuth, consolController.getConsol);
api.post("/consol", md_auth.ensureAuth, consolController.saveConsol);
api.get("/consols/:client?", md_auth.ensureAuth, consolController.getConsols);
api.put("/consol/:id", md_auth.ensureAuth, consolController.updateConsol);
api.delete("/consol/:id", md_auth.ensureAuth, consolController.deleteConsol);
api.post("/upload-image-consol/:id", [md_auth.ensureAuth, md_upload], consolController.uploadImage);
api.get("/get-image-consol/:imageFile", consolController.getImageFile);

module.exports = api;

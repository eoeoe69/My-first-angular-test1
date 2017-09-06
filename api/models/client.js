'use strict'

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ClientSchema = Schema({
      name: String,
      adress: String,
      email: String,
      phone: Number,
      image: String
});

module.exports = mongoose.model('Client', ClientSchema);

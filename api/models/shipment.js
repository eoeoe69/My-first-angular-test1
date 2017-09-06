'use strict'

var mongoose = require("mongoose");
var Schema = mongoose.Schema;


var ShipmentSchema = Schema({
      number: String,
      mode: String,
      date_created: { type: Date, default: Date.now },
      packages: String,
      consol: { type: Schema.ObjectId, ref: 'Consol'},
      file: String
});

module.exports = mongoose.model('Shipment', ShipmentSchema);

'use strict'

var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var moment = require("moment");

var new_date = moment(new Date()).format("YYYY/MM/DD");

var ConsolSchema = Schema({
      mBL: String,
      incoterm:String,
      mode: String,
      date_created: { type: Date, default: new_date },
      carrier: String,
      client: { type: Schema.ObjectId, ref: "Client"},
      image: String
});

module.exports = mongoose.model('Consol', ConsolSchema);

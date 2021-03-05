"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const parentsSchema = new Schema({
  familiarName: String,
  cellphone: Number,
  father: String,
  fatherCellphone: Number,
  fatherSchoolGrade: String,
  mother: String,
  motherCellphone: Number,
  motherSchoolGrade: String,
  sons: Number
});

module.exports = mongoose.model("Parent", parentsSchema);
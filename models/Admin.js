var mongoose = require("mongoose");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const AdminsSchema = new mongoose.Schema({
  username:{
    type: String,
    required: true
  },
  password:{
      type:String,
  }
});

AdminsSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Admin', AdminsSchema);

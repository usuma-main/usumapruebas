var mongoose = require("mongoose");
const Parents = require("./Parents");
const Image = require("./Image");

const KidsSchema = new mongoose.Schema({
  name: String,
  lastname: String,
  schoolGrade: String,
  godparent: {
    name: String,
    lastname: String,
    email: String,
    cellphone: String,
    birthday: Date,
    RFC: String,
    subscriptionId: String,
    postalCode: String,
    socialCause: String
  },
  birthday: Date,
  gender: String,
  parents: Parents.schema,
  Hobbies: String,
  Vision: String,
  signUpDate: { type: Date, default: Date.now },
  image: Image.schema,
  noticeOfPrivacy: Boolean,
});

module.exports = mongoose.model('Kid', KidsSchema);

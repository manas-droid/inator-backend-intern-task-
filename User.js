const {Schema, model } = require('mongoose');
const userSchema = new Schema({
  id : Schema.Types.ObjectId,
  username : {type : String , required: true, unique: true},
  email  : {type : String , required: true, unique: true},
  password : {type : String , required: true},
  degree   : {type : String , required: true},
  skills   : [{type : String }],
  experience : {type : String , required: true}
});
module.exports = model('User' , userSchema);

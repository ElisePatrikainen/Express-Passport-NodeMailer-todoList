var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// create User Schema
var User = new Schema({
  email: String, 
  name: String,
  photo: String, 
  someID: String, 
  toDo : Array
});


module.exports = mongoose.model('users', User);
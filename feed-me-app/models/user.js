var mongoose = require('mongoose');
var ComplaintSchema = require('./complaint').schema;

var UserSchema = new mongoose.Schema({
	email: String,
	password: String,
	name: String,
	order: [OrderSchema]
});

var User = mongoose.model('User', UserSchema);
module.exports = User;
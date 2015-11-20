var mongoose = require('mongoose');
var OrderSchema = require('./order').schema;

var UserSchema = new mongoose.Schema({
	email: String,
	password: String,
	name: String,
	order: [OrderSchema]
});

var User = mongoose.model('User', UserSchema);
module.exports = User;
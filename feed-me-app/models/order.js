var mongoose = require('mongoose');


var OrderSchema = new mongoose.Schema({
	restaurant_name: String,
	details: String,
	cuisine: String,
	img_url: String,
	favorite: Boolean,
	create_on: { type: Date, default: Date.now },
	updated_on: { type: Date, default: Date.now }

});

var Order = mongoose.model('Order', OrderSchema);
module.exports = Order;
// var mongoose = require('mongoose'),
// 	User = require('./models/user.js'),
// 	Order = require('./models/order.js');


// mongoose.connect('mongodb://localhost/feed_me', function(err) {
// 	if(err) {
// 		console.log('Connection error: ', err);
// 	} else {
// 		console.log('Connection successful');
// 	}
// });

// // Create and save test user
// var user1 = new User({
// 	email: "test@test.com",
// 	password: "5f4dcc3b5aa765d61d8327deb882cf99",
// 	name: "Fave User",
// 	orders: []
// })

// user1.save(function(err) {
// 	if(err) return handleError(err);
// 	console.log("saved: " + user1);
// });


// // Create and save test orders

// var order1 = new Order({
// 	restaurant_name: "Chop't",
// 	details: "Steak house salad with cesar dressing, no bread",
// 	cuisine: "salad",
// 		img_url: "http://s3-media4.fl.yelpcdn.com/bphoto/hMfr_PHBZpmAEjqXpaNl4w/ls.jpg",
// 	favorite: true
// })

// var order2 = new Order({
// 	restaurant_name: "Chipotle",
// 	details: "Burrito with chicken, pinto beans, white rice, mild salsa, guac",
// 	cuisine: "mexican",
// 	img_url: "http://himetoki.com/wp-content/uploads/2015/07/chipotle.jpg",
// 	favorite: false
// })

// var order3 = new Order({
// 	restaurant_name: "Oxido",
// 	details: "Burrito bowl with pork, pinto beans, brown rice, peppers & onions, salsa, guac",
// 	cuisine: "mexican",
// 	img_url: "http://s3-media2.fl.yelpcdn.com/bphoto/XfOgqhy3UXrZ5WtTg2ne0Q/348s.jpg",
// 	favorite: false
// })


// order1.save(function(err) {
// 	if(err) return handleError(err);
// 	console.log("saved: " + order1);
// });

// order2.save(function(err) {
// 	if(err) return handleError(err);
// 	console.log("saved: " + order2);
// });

// order3.save(function(err) {
// 	if(err) return handleError(err);
// 	console.log("saved: " + order3);
// });


// user1.orders.push(order1);
// user1.orders.push(order2);
// user1.orders.push(order3);
// Thank you Thom Page (github.com/singular000) for the setup starter code!

// DEPENDENCIES

var express      = require('express'),
    mongoose     = require('mongoose'),
    bodyParser   = require('body-parser'),
    md5          = require('md5'),
    cookieParser = require('cookie-parser');

var port         = process.env.PORT || 3000;
var app          = express();

// MIDDLEWARE

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(cookieParser());

// DATABASE

var mongoUri =  process.env.MONGOLAB_URI || 'mongodb://localhost/feed_me';
mongoose.connect(mongoUri);

// LISTENER

app.listen(port);

// MODELS

var User = require('./models/user.js');
var Order = require('./models/order.js');

// SEED
// var seed = require('./seed.js');


// ROUTES

// This route creates the user
app.route('/users')

    .post(function(req, res) {

        var newUser = new User ({
                email: req.body.email,
                password: md5(req.body.password),
                name: req.body.name
            });

        newUser.save(function(err) {

            if (err) {

                console.log(err);

            } else {

                console.log("New user created!");

                res.cookie("loggedInUser", newUser.id);

                // Send all of the user's info except the password.
                res.send(newUser.id, newUser.email, newUser.name, newUser.orders);

            }

        });

    });

// This is the route that the user will see upon logging in.
// It shows all of that user's orders.
app.route('/users/:id/orders')

    .get(function(req, res) {

        User.findById(req.params.id).then(function(user) {
            // Just making sure that we are getting the right user.
            console.log(user);
            // Just making sure that we are getting the user's orders.
            console.log(user.orders);

            res.send(user);

        });

    })
    // This route creates a new order
    .post(function(req,res){

        User.findById(req.params.id).then(function(user) {
            Order.create(req.body).then(function(order) {

                console.log(user);
                console.log(order)
                user.orders.push(order)
                user.save()
                res.send(user);
            });
        });

    });

// Grab single user
app.route('/users/:id')

    .get(function(req,res){
        User.findById(req.params.id).then(function(user) {

            res.send(user)
    });
});



// This route shows the user's single order.
app.get('/users/:id/orders/:order_id', function(req, res) {

    User.findById(req.params.id).then(function(user) {

        // Just making sure that we are getting the right user.
        // console.log(user);

        // Just making sure that we are getting the user's orders.
        // console.log(user.orders);

        // After grabbing all of the user's orders, iterate through them to find the single one.
        user.orders.forEach(function(order) {

            // Compare each order's id to the id entered in in the request's params
            if (order._id == req.params.order_id) {

                // Send that order back to the frontend if there is a match.
                res.send(order);

            }

        });

});

// This route is for editing an order.
app.put('/users/:id/orders/:order_id', function(req, res) {

        Order.findByIdAndUpdate(req.params.order_id, req.body, function(err, order) {

            if (err) {

                console.log(err);

            }


        });

        User.findById(req.params.id).then(function(user) {

            user.orders.forEach(function(order) {

                if (order._id == req.params.order_id) {

                    var index = user.orders.indexOf(order);
                    user.orders.splice(index, 1);
                    user.save();

                    var newOrder = {

                        restaurant_name: req.body.restaurant_name,
                        details: req.body.details,
                        cuisine: req.body.cuisine,
                        img_url: req.body.img_url,
                        favorite: req.body.favorite

                    };

                    user.orders.push(newOrder);

                    user.save();

                    res.send(user);

                }

            });

        });

    });

});

// This route signs in the user.
app.route('/signin')

    .post(function(req, res){

        User.findOne( { email: req.body.email }).then(function(user) {

            if (user.password === md5(req.body.password)) {

                res.cookie("loggedInUser", user.id);

                res.send(user);

            }

        });

    });

// This route delets an order from the user's orders key, and from the orders collection
app.delete('/users/:id/orders/:order_id', function(req, res) {

    Order.remove({ _id: req.params.order_id }, function(err){

        if (err) {

            console.log(err);

        }

    });

    User.findById(req.params.id).then(function(user) {

        user.orders.forEach(function(order) {

            if (order._id == req.params.order_id) {

                console.log(order._id);
                console.log("if statement matched");

                var index = user.orders.indexOf(order);
                user.orders.splice(index, 1);

            }

        });

        user.save();

        res.send(user);

    });

});

// This route is for making a request to Twilio's API
app.route('/twilio/:phone_num/:restaurant_name/:order_details')

    .get(function(req, res) {

        //require the Twilio module and create a REST client
        var client = require('twilio')(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);

        //Send an SMS text message
        client.sendMessage({

            to: req.params.phone_num,
            from: '+19177468848',
            body: 'Hey! Can you get me the ' + req.params.order_details + ' at ' + req.params.restaurant_name + '? Thanks!'

        }, function(err, responseData) { //this function is executed when a response is received from Twilio

                if (!err) { // "err" is an error received during the request, if any

                    // "responseData" is a JavaScript object containing data received from Twilio.
                    // A sample response from sending an SMS message is here (click "JSON" to see how the data appears in JavaScript):
                    // http://www.twilio.com/docs/api/rest/sending-sms#example-1

                    console.log(responseData.from); // outputs the number the text is getting sent from
                    console.log(responseData.body); // outputs the body of the message

                }

                res.send(responseData);

        });

    });

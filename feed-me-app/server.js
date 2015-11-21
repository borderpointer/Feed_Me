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

                res.cookie("signedInUser", newUser.id);

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

            res.send(user.orders);

        });

    });


// This route shows the user's single order.
app.route('/users/:id/orders/:order_id')

    .get(function(req, res) {

        User.findById(req.params.id).then(function(user) {

            // Just making sure that we are getting the right user.
            console.log(user);

            // Just making sure that we are getting the user's orders.
            console.log(user.orders);

            // After grabbing all of the user's orders, iterate through them to find the single one.
            user.orders.forEach(function(order) {

                // Compare each order's id to the id entered in in the request's params
                if (order._id === req.params.order_id) {

                    // Send that order back to the frontend if there is a match.
                    res.send(order);

                }

            });

        });

    });

// This route signs in the user.
app.route('/signin')

    .post(function(req, res){

        User.findOne( { email: req.body.email }).then(function(user) {

            if (user.password === md5(req.body.password)) {

                res.cookie("logged_in_user", user.id);
                console.log("its a match");
                res.send(user);

            }

        });

    });





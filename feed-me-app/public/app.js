var user = null;
var order = null;


$(function() {

    startApp();

});

var startApp = function(data) {

    // setting up landing page css here so that if the user
    // signs out, they still see the same thing as the landing page
    $('body').css("background", "url('img/background-image.jpg') center center no-repeat");

    $('#landing').css({
        "padding-top": "15vh",
        "background-color": "rgba(0,0,0,0)",
        "margin": "0"
    });

    $('#logo').css({
        "text-align": "center",
        "font-weight": "700",
        "letter-spacing": "15px",
        "color": "#fff",
        "display": "block",
        "font-size": "3.5em",
        "border": "8px solid #fff",
        "padding": "30px 20px",
        "margin": "0 auto",
        "width": "35vw"
    });

    $('#tagline').css({
        "text-align": "center",
        "font-weight": "700",
        "letter-spacing": "2px",
        "color": "#fff",
        "font-size": "1.75em",
        "padding": "30px"
    });

    $('header').css({
        "padding": "30px 0 60px 0",
        "text-align": "center"
    });

    $('#tagline').show();

    // If a user is signed in, show different things,
    // else show only sign in and create account links.
    if (Cookies.get('loggedInUser') !== undefined) {

    	console.log(data)

        console.log("logged in user cookie present");
        $('.form').empty();
        $('#header').empty();
        $('#header').append("<a href='#' id = 'signout'>Sign Out</a>");
        invokeSignOut();

       	$.ajax({
       		url: '/users/' +  Cookies.get('loggedInUser'),
       		method: 'GET',
   		}).done(function(data){
   			console.log(data)
   			$('#container').empty();
   			renderMeals(data);
   	});

    } else {

        console.log("no logged in user cookie");

        $('#header').append("<a href='#' id = 'signin'>Sign In</a>");
        $('#header').append("<a href='#' id = 'signup'>Create Account</a>");

        invokeSignInForm();
        invokeSignUpForm();
    }

}

// Start of the signin process

var invokeSignInForm = function() {

    var $signInBtn = $('#signin');

    $signInBtn.click(function() {

        showSignInForm();

    });

}

var showSignInForm = function() {

    // Empty the container before appending anything.
    $('#container').empty();
    $('#signin').hide();
    $('#signup').show();

    var $template = Handlebars.compile($('#log-in-screen').html());

    $('#container').append($template);

    signInUser();

}

var signInUser = function() {

    var $signInSubmit = $('#signin-submit'),
        $email = $('#email-field'),
        $password = $('#password-field');

    $signInSubmit.click(function() {

        console.log("about to sign in user");

        user = {
            email: $email.val(),
            password: $password.val()
        }

        $.post('/signin', user)
        .done(function(data) {

            // When the user is signed in, remove the sign in and sign up links and the respective form rendered, and only show the sign out link.
            $('.form').empty();
            $('#header').empty();
            $('#header').append("<a href='#' id = 'signout'>Sign Out</a>");

            invokeSignOut(data);

            renderMeals(data);

        });

    })

}

// End of signin process


// Start of signup process

var invokeSignUpForm = function() {

    var $signUpBtn = $('#signup');

    $signUpBtn.click(function() {

        showSignUpForm();

    });

}

var showSignUpForm = function() {

    // Empty the container before appending anything.
    $('#container').empty();
    $('#signup').hide();
    $('#signin').show();

    var $template = Handlebars.compile($('#sign-up-screen').html());

    $('#container').append($template);

    signUpUser();

}

var signUpUser = function() {

    var $signUpSubmit = $('#signup-submit'),
        $email = $('#email-field'),
        $name = $('#username-field'),
        $password = $('#password-field'),
        $passwordConfirm = $('#password-confirm-field');

    $signUpSubmit.click(function() {

        // check if password confirmation is same as entered password.

        if ($password.val() !== $passwordConfirm.val()) {

            alert("Your password confirmation does not match!");
            console.log($password.val(), $passwordConfirm.val());

            showSignUpForm();

        } else {

            console.log("about to sign up user");

            user = {
                email: $email.val(),
                name: $name.val(),
                password: $password.val()
            }

            $.post('/users', user)
            .done(function(data) {

                console.log(data);
                alert("signed up successfully!");

                // When the user is signed in, remove the sign in and sign up links and the respective form rendered, and only show the sign out link.
                $('.form').empty();
                $('#header').empty();
                $('#header').append("<a href='#' id = 'signout'>Sign Out</a>");

                invokeSignOut(data);

                renderMeals(data);

            });

        }

    })

}

var invokeSignOut = function(data){

    var $signOut = $('#signout');

    $signOut.click(function() {

        console.log("About to sign out user");

        Cookies.remove("loggedInUser");
        console.log(Cookies.get("loggedInUser"));

        // After signing out, empty the container that contains all of the previous user's orders
        // Also, remove the sign out link.
        $('#container').empty();
        $('#header').empty();

        // Invoke the startApp function to go through the process of signup/sign in all over again.
        startApp(data);

    });

}


var renderMeals = function(data){

    // Remove the background image after sign in
    $('body').css({
        "background": "none",
        "background-color": "#f6f6f6"
    });

    // Make the logo smaller and shift it to the left
    $('#landing').css({
        "background-color": "#333",
        "margin": "0 auto",
        "padding": "15px"
    });

    $('#logo').css({
        "letter-spacing": "7px",
        "font-size": "1em",
        "border": "3px solid #fff",
        "color" : "#fff",
        "padding": "10px 15px",
        "width": "15vw",
        "text-align": "center"
    });

    // Remove tagline
    $('#tagline').hide();

    // Move logout link to the right
    $('header').css({
        "padding": "12px 0 0 0"
    });

    console.log(data);

    var container = $('#container');

    var template = Handlebars.compile($('#main-screen').html());

    container.append(template(data));

    $('#create-new-order').click(function() {

		attachNewOrder();
	})

}



var attachNewOrder = function(){
	$('#container').empty();

	var template = Handlebars.compile($('#new-order-template').html());

	$('#container').append(template);

	$('#new-order-submit').click(function() {

		createNewOrder();
	})
}

var createNewOrder = function(){
	console.log("reached create new order")
	var restName = $('#rest-name').val();
	var details = $('#order-details').val();
	var cuisine = $('#cuisine-type').val();
	var image = $('#order-image').val();
	var favorite = $('#meal-favorite').val();

	var orderData = {
		restaurant_name: restName,
		details: details,
		cuisine: cuisine,
		img_url: image,
		favorite: favorite
	}

	$.ajax({
       url: '/users/' +  Cookies.get('loggedInUser') + '/orders',
       method: 'POST',
       data: orderData
   	}).done(function(data){
   		console.log(data)
   		$('#container').empty();
   		renderMeals(data);
   });

}


// var shareMeal = function() {

//  var id = $(this).parent().attr('data-id')

//  $('#share-button').click(function(){


//  })

// }

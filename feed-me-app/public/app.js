var user = null;
var order = null;


$(function() {

    startApp();

});

var startApp = function(data) {

    // If a user is signed in, show different things,
    // else show only sign in and create account links.
    if (Cookies.get('loggedInUser') !== undefined) {

        console.log("logged in user cookie present");
        $('.form').empty();
        $('#header').empty();
        $('#header').append("<a href='#' id = 'signout'>Sign Out</a>");
        invokeSignOut();

        renderMeals();

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

            console.log(data.name);
            alert("signed in successfully!");

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

    console.log(data);

    var container = $('#container');

    var template = Handlebars.compile($('#main-screen').html());

    container.append(template(data));

}




var attachNewOrder = function(){
	('#container').empty();

	var template = Handlebars.compile($('#new-order-template').html());

	('#container').append(template);

	$('#new-order-submit').click(function() {

		createNewOrder();
	})
}

var createNewOrder = function(){

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
       url: '/users/' +  Cookies.get('loggedInUser') + '/orders/',
       method: 'POST',
       data: orderData
   	}).done(renderMeals);
}


// var shareMeal = function() {

//  var id = $(this).parent().attr('data-id')

//  $('#share-button').click(function(){


//  })

// }

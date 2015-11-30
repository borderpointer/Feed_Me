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
        "font-size": "3em",
        "border": "8px solid #fff",
        "padding": "30px 20px",
        "margin": "0 auto",
        "width": "500px"
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
        "width": "200px",
        "text-align": "center"
    });

    // Remove tagline
    $('#tagline').hide();

    // Move logout link to the right
    $('header').css({
        "padding": "12px 0 0 0"
    });

    console.log(data);


    var $container = $('#container');

    $container.empty();

    var template = Handlebars.compile($('#main-screen').html());

    $container.append(template(data));

    $('.confirmation').hide();

    $('#create-new-order').click(function() {
		attachNewOrder();
	})

    addShareClick();

    addEditForm();

    deleteMeal();

    // If user chooses "favorites", call the corresponding function
    var $filter = $('#filter');

    $filter.change(function () {

        if ($filter.val() === "favorites") {

            renderFavorites();
        }

    });

}

var renderFavorites = function() {

    $.ajax({
       url: '/users/' +  Cookies.get('loggedInUser') + '/orders',
       method: 'GET'
    }).done(function(data){

        var sortedOrders = [];

        data.orders.forEach(function(order) {

            if (order.favorite === true) {

                sortedOrders.push(order);
            }

        });

        var $container = $('#container');

        $container.empty();

        var template = Handlebars.compile($('#fav-screen').html());

        $container.append(template(sortedOrders));

        $('.confirmation').hide();

        $('#create-new-order').click(function() {
            attachNewOrder();
        })

        addShareClick();

        addEditForm();

        deleteMeal();

          // If user chooses "all", call the corresponding function
        var $filter = $('#filter');

        $filter.change(function () {

            if ($filter.val() === "all") {

                renderMeals(data);

            }

        });

   });

}




var attachNewOrder = function(){

	$('#container').empty();

	var template = Handlebars.compile($('#new-order-template').html());

	$('#container').append(template);

	$('#new-order-back-button').click(function(){
       	$.ajax({
       		url: '/users/' +  Cookies.get('loggedInUser'),
       		method: 'GET',
   		}).done(function(data){
   			console.log(data)
   			$('#container').empty();
   			renderMeals(data);
   	});
	})

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
	var favorite = $('#meal-favorite');


    // check if the meal-favorite checkbox is checked, if it is, set favorite to true,
    // else, to false.
    if (favorite.is(":checked")) {

        favorite = true;

    } else {

        favorite = false;
    }

    // check to make sure the favorite is sending the right boolean value
    console.log(favorite);

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


var addShareClick = function() {


    var shareButtons = $('.share-button');

    for(var i = 0; i < shareButtons.length; i++){

        $(shareButtons[i]).click(function(){

            // Trigger shareMeal, which appends the handlebar template
            shareMeal($(this), $(this).parent().attr('data-id'));


        });

    }

}

var shareMeal = function(clicked_button, order_id) {


    // All of this is for showing the share form template
    var $template = Handlebars.compile($('#share-template').html());

    clicked_button.parent().append($template);

    $('.confirmation').hide();

    clicked_button.hide();

    var $shareTemp = $('.share-form');

    // These are the things needed to send a request for email

    var $sendTextButton = $('#share-text-submit');

    var $sendEmailButton = $('#share-email-submit');

    $('#share-cancel').click(function(){

        clicked_button.show();
        $shareTemp.remove();

    });

    $sendEmailButton.click(function() {

        // Grab user's email input
        var $mailTo = $('#share-email').val();

        // Grab order's restaurant name
        var $restaurantName = $(this).parent().parent().find("#main-screen-rest-name").html();

        // grab order's details
        var $orderDetails = $(this).parent().parent().find("#main-screen-details").html();

        window.location.href = "mailto:" + $mailTo + "?subject=" + $restaurantName + "&body=Hey, here's my order details, thanks!%0D%0A%0D%0A" + $orderDetails;

        $(this).parent().parent().find('.confirmation').show();
        $('.share-form').remove();
        clicked_button.show();
    });

    $sendTextButton.click(function() {

        // Grab user's phone number input
        var $textTo = $('#share-text').val();

        // Grab order's restaurant name
        var $restaurantName = $(this).parent().parent().find("#main-screen-rest-name").html();

        // grab order's details
        var $orderDetails = $(this).parent().parent().find("#main-screen-details").html();

        shareViaText($textTo, $restaurantName, $orderDetails, clicked_button);

    });

}

var shareViaText = function(phone_num, restaurant_name, order_details, clicked_button) {

    $.ajax({
        url: '/twilio/' + phone_num + '/' + restaurant_name + '/' + order_details,
        method: 'GET'
    }).done(function() {
        clicked_button.parent().find('.confirmation').show();
        $('.share-form').remove();
        clicked_button.show();
    });
}

var addEditForm = function() {

    var editButtons = $('.edit-button');

    for(var i = 0; i < editButtons.length; i++){

        $(editButtons[i]).click(function(){

            var orderId = $(this).parent().attr('data-id');

            $.ajax({
                url: '/users/' +  Cookies.get('loggedInUser') + '/orders/' + orderId,
                method: 'GET'
            }).done(showEditMealForm);

        });

    }

}

var showEditMealForm = function(data){

    $('#container').empty();

    var template = Handlebars.compile($('#edit-order-template').html());

    $('#container').append(template(data));

    $('#edit-order-back-button').click(function(){
       	$.ajax({
       		url: '/users/' +  Cookies.get('loggedInUser'),
       		method: 'GET',
   		}).done(function(data){
   			console.log(data)
   			$('#container').empty();
   			renderMeals(data);
   	});
	})

    // by default, select the cuisine that it already was set to
    $.each( $('.option'), function( index, option ){

        if (option.value == data.cuisine) {

            $(option).attr('selected', 'selected');
        }

    });

    // check if the order is favorited
    if (data.favorite === true) {
        $('#meal-favorite').attr("checked", "checked");
    }

    $('#edit-order-submit').click(function() {


        editMeal(data._id);
    })

}

var editMeal = function(orderId){

    console.log("reached edit new order");
    console.log(orderId);

    var restName = $('#rest-name').val();
    var details = $('#order-details').val();
    var cuisine = $('#cuisine-type').val();
    var image = $('#order-image').val();
    var favorite = $('#meal-favorite');


    // check if the meal-favorite checkbox is checked, if it is, set favorite to true,
    // else, to false.
    if (favorite.is(":checked")) {

        favorite = true;

    } else {

        favorite = false;
    }

    // check to make sure the favorite is sending the right boolean value
    console.log(favorite);

    var orderData = {
        restaurant_name: restName,
        details: details,
        cuisine: cuisine,
        img_url: image,
        favorite: favorite
    }

    $.ajax({
       url: '/users/' +  Cookies.get('loggedInUser') + '/orders/' + orderId,
       method: 'PUT',
       data: orderData
    }).done(function(data){
        console.log(data)
        $('#container').empty();
        renderMeals(data);
   });

}

var deleteMeal = function(){

    $('.delete-button').click(function(){

        var $orderId = $(this).parent().attr('data-id');

        $.ajax({

            url: "/users/" + Cookies.get('loggedInUser') + "/orders/" + $orderId,
            method: "DELETE"

        }).done(function(data) {
            console.log(data);

            renderMeals(data);

        });

    });

}



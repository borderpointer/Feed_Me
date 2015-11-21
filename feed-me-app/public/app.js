var user = null;
var order = null;


$(function() {

    startApp();

});

var startApp = function() {

    if (Cookies.get('loggedInUser') !== undefined) {

        console.log("cookie present");

    } else {

        console.log("no cookies");

        $('#header').append("<a href='#' id = 'login'>Login</a>");
        $('#header').append("<a href='#' id = 'signup'>Create Account</a>");

        invokeLoginForm();
        //invokeSignupForm();

    }

}

var invokeLoginForm = function() {

    var $loginBtn = $('#login');

    $loginBtn.click(function() {

        showLoginForm();

    });

}

var showLoginForm = function() {

    var $template = Handlebars.compile($('#log-in-screen').html());

    $('#container').append($template);

    loginUser();

}

var loginUser = function() {

}



var renderMeals = function(data){

	var container = $('#container');

	var template = Handlebars.compile($('#main-screen').html());

	container.append(template(data));

}


// var shareMeal = function() {

// 	var id = $(this).parent().attr('data-id')

// 	$('#share-button').click(function(){


// 	})

// }
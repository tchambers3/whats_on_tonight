$(function() {
	// On submit of set form
	$("#register").submit(function(event) {
		// Create url with form input
		var pass = $("#register #password").val()
		var passConfirmation = $("#register #passwordConfirmation").val()
		console.log(pass)
		console.log(passConfirmation)
		if(pass != passConfirmation) { 
			$("#error").html("Error Registering");
			return;
		}
		  $.ajax({
		    url: 'register/'+$("#register #username").val()+'/'+pass,
		    type: 'PUT',
		    success: function(result) {
		    	console.log("result")
		      	$("#return").html(result)
		      	window.location.replace("/login.html");
		      }
		  });
		event.preventDefault();
	})
})
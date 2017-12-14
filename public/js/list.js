function removeShow(identifier) {
	console.log("aadfadsasdf")
	var showName = $(identifier).data('show')
	$.ajax({
    type: "DELETE",
    url: "/list/"+showName,
    success: function(doc)
      {
      	$("#return").html("Show has been Removed");
      	location.reload();
       }
     });
}

$(function() {
	$("#addShow").submit(function(event) {
		// Create url with form input
		var showName = $("#addShow #show").val()
		console.log("here");
		  $.ajax({
		    url: 'addToList/'+showName,
		    type: 'PUT',
		    success: function(result) {
		    	console.log("result")
		      	$("#return").html("Show has been added");
		      	location.reload();
		      }
		  });
		event.preventDefault();
	})
})
$(document).ready(function() {

    // page is now ready, initialize the calendar...
    $('#calendar').fullCalendar({
        // Single day view
        defaultView: 'agendaDay',
        // Get initial shows
        events: function(start, end, timezone, callback) {
	        $.ajax({
	            url: 'shows/',
	            dataType: 'json',
	            data: {
	                // our hypothetical feed requires UNIX timestamps
	                start: start.unix(),
	                end: end.unix()
	            },
	            success: function(doc) {
	                var events = [];
	                for(var i = 0; i < doc.length; i++) {
	                	events.push({
	                		title: doc[i].show.name,
	                		start: doc[i].airtime,
	                		end: doc[i].airdate
	                	})
	                }
	                callback(events);
	            }
	        });
	    }
    })

});

function editList() {
	$.ajax({
    type: "GET",
    url: "/list",
    success: function(doc)
      {
		console.log("List")
       }
     });
}

// Refresh calendar with one of the network filters
function makeShowNetworkCall(network) {
	$.ajax({
    type: "GET",
    url: "/shows/"+network,
    success: function(doc)
      {
		var events = [];
		for(var i = 0; i < doc.length; i++) {
			events.push({
				title: doc[i].show.name,
				start: doc[i].airtime,
				end: doc[i].airdate
			})
		}
	      $('#calendar').fullCalendar('removeEvents');
	      $('#calendar').fullCalendar('addEventSource', events);         
	      $('#calendar').fullCalendar('rerenderEvents' );
       }
     });
}

// Network filter methods
function nbc() {
	makeShowNetworkCall("NBC");
}

function abc() {
	makeShowNetworkCall("ABC");	
}

function cbs() {
	makeShowNetworkCall("CBS");
}

function fox() {
	makeShowNetworkCall("FOX");
}

function others() {
	makeShowNetworkCall("Others");
}

function mine() {
	makeShowNetworkCall("Mine");
}


function dropDownChose() {
	document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {

    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

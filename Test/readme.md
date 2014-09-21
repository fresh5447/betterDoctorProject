
// assume you saved the data-uid in the doctor element when constructing the handlebars template

$(".doctor").on('click', 'button' , function (e) { 
	e.preventDefault();
	var uid = $(this).data("uid");
	$.ajax("api/doctors/"+uid).then(function(doctor) { 
		data = {context: doctor }
		refreshProfile();
	} );

});


// assume you saved the data-condition in each condition element 
$(".condition").on('click', function (e) { 
	e.preventDefault();
	var condition = $(this).data("condition");

	$.ajax("api/condition" , {type: "POST" , data : { c: condition} }).then(function(list) { 
		listOfDoctors = {context: list }; 
		refreshDoctors();
	} );

});
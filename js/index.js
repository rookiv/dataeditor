var opts = {
	lines : 17, // The number of lines to draw
	length : 8, // The length of each line
	width : 8, // The line thickness
	radius : 60, // The radius of the inner circle
	corners : 1, // Corner roundness (0..1)
	rotate : 0, // The rotation offset
	direction : 1, // 1: clockwise, -1: counterclockwise
	color : '#fff', // #rgb or #rrggbb or array of colors
	speed : 0.5, // Rounds per second
	trail : 10, // Afterglow percentage
	shadow : false, // Whether to render a shadow
	hwaccel : false, // Whether to use hardware acceleration
	className : 'spinner', // The CSS class to assign to the spinner
	zIndex : 2e9, // The z-index (defaults to 2000000000)
	top : 'auto', // Top position relative to parent in px
	left : 'auto' // Left position relative to parent in px
};

var checkStatus;

$(function() {
	var target = $(".hello")[0];
	var spinner = new Spinner(opts).spin(target);

	checkStatus = setInterval(getStatus, 500);
});

function getStatus() {
	$.get("/ready", function(data) {
		$(".status").html(data);
		if (data == "Loaded!") {
			checkStatus.clearInterval();
		}
	});
}

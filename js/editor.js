var tabs = {};
var tabMarker = -1;

$(function() {
	read();

	$(".add").click(newTab);
});

function newTab() {
	bootbox.prompt("Enter name of the new tab:", function(result) {
		if (result != undefined && result.trim() != "" && tabs[result] == undefined) {
			addTab(null, result);
		}
	});
}

function addTab(html, tabname) {
	var newTab = $(".workspace-tab-template").clone();
	var newPane = $(".workspace-pane-template").clone();
	var newClose = $(".close-btn-template").clone();

	tabMarker++;

	var linkSettings = newTab.find("a");
	linkSettings.attr("href", "#tab" + tabMarker);
	linkSettings.html("<span class=\"tab-name\">" + tabname + "</span>");
	newPane.attr("id", "tab" + tabMarker);
	if (html) {
		newPane.html(html);
	}

	// Un-template, add actual classes
	newTab.removeClass("workspace-tab-template");
	newTab.addClass("workspace-tab");
	newPane.removeClass("workspace-pane-template");
	newPane.addClass("workspace-pane-content");
	newClose.removeClass("close-btn-template");
	newClose.addClass("close-btn");

	// When close button is clicked
	newClose.click(closeThisTab);

	newTab.find("a").append(newClose);

	$(".workspace").append(newTab);
	$(".workspace").append($(".add"));
	$(".workspace-pane").append(newPane);
	tabs[tabname] = newPane.html();

	// Make sure something is selected
	if ($(".workspace .active").length == 0) {
		$(".workspace-tab:first").addClass("active");
		$(".workspace-pane-content:first").addClass("active");
	}

	// Add event handlers for things in tab
	tabHandler();

	save();
	return newTab;
}

function tabHandler() {
	$(".tab-start").click(getStarted);
}

function closeThisTab() {
	// Remove the tab content panel
	$($(this).parent().attr("href")).remove();
	// Remove tab from array & interface
	delete tabs[$(this).parent().find(".tab-name").html()];
	$(this).parent().parent().remove();
	// Make sure something is selected
	if ($(".workspace .active").length == 0) {
		$(".workspace-tab:first").addClass("active");
		$(".workspace-pane-content:first").addClass("active");
	}

	save();
}

function save() {
	$.post("/save", {
		"tabs" : tabs
	});
}

function read() {
	$.get("/read", function(data) {
		try {
			var saveObj = JSON.parse(data);

			if (data == "undefined") {
				addTab(null, "Home");
			} else {
				$.each(saveObj, function(index, value) {
					addTab(value, index);
				});
			}
		} catch(err) {
			addTab(null, "Home");
		}
	});
}

function getStarted() {
	var content = $(this.parentElement);

}

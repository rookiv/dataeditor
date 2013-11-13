var tabs = new Array();
var tabMarker = -1;

$(function() {
	read();

	// var firstTab = addTab("Hello");
	//
	// firstTab.addClass("active");
	//
	// $("#tab0").addClass("active");

	$(".add").click(newTab);
});

function newTab() {
	addTab("Helo");
}

function addTab(html, tabname) {
	var newTab = $(".workspace-tab-template").clone();
	var newPane = $(".workspace-pane-template").clone();
	var newClose = $(".close-btn-template").clone();

	tabMarker++;

	if (!tabname) {
		var tabname = "Tab " + Math.floor((Math.random() * 100000) + 1);
	}

	var linkSettings = newTab.find("a");
	linkSettings.attr("href", "#tab" + tabMarker);
	linkSettings.html("<span class=\"tab-name\">" + tabname + "</span>");
	newPane.attr("id", "tab" + tabMarker);
	if (!html) {
		newPane.html(tabMarker);
	} else {
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
	tabs.push(newTab);

	// Make sure something is selected
	if ($(".workspace .active").length == 0) {
		$(".workspace-tab:first").addClass("active");
		$(".workspace-pane-content:first").addClass("active");
	}

	save();

	return newTab;
}

function closeThisTab() {
	// Remove the tab content panel
	$($(this).parent().attr("href")).remove();
	// Remove tab from array & interface
	var toRemove = $(this).parent().parent();
	tabs.splice(tabs.indexOf(toRemove), 1);
	toRemove.remove();
	// Make sure something is selected
	if ($(".workspace .active").length == 0) {
		$(".workspace-tab:first").addClass("active");
		$(".workspace-pane-content:first").addClass("active");
	}

	save();
}

function save() {
	var saveObj = {};
	$(tabs).each(function() {
		var tabContent = $(this.find("a").attr("href")).html();
		var tabName = this.find("a .tab-name").html();
		saveObj[tabName] = tabContent;
	});

	$.post("/save", {
		tabs : saveObj
	});
}

function read() {
	$.get("/read", function(data) {
		var saveObj = JSON.parse(data);
		$.each(saveObj, function(index, value) {
			addTab(value, index);
		});
	});
}

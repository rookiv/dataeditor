var tabs = new Array();
var tabMarker = -1;

$(function() {
	var firstTab = addTab({
		data : {
			content : "Hello"
		}
	});

	firstTab.addClass("active");

	$("#tab0").addClass("active");

	$(".add").click({
		content : "Hello"
	}, addTab);
});

function addTab(html) {
	var newTab = $(".workspace-tab-template").clone();
	var newPane = $(".workspace-pane-template").clone();
	var newClose = $(".close-btn-template").clone();

	tabMarker++;

	var linkSettings = newTab.find("a");
	linkSettings.attr("href", "#tab" + tabMarker);
	linkSettings.html("<span class=\"tab-name\">" + "Tab " + tabMarker + "</span>");
	newPane.attr("id", "tab" + tabMarker);
	if (!html || !html.data.content) {
		newPane.html(tabMarker);
	} else {
		newPane.html(html.data.content);
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
	if (!$(".workspace .active").length) {
		$(".workspace-tab:first").addClass("active");
	}

	save();

	return newTab;
}

function closeThisTab() {
	// Remove the tab content panel
	$($(this).parent().attr("href")).remove();
	// Remove tab from array
	tabs.pop($(this).parent().parent());
	// Remove tab from interface
	$(this).parent().parent().remove();
	// Make sure something is selected
	if (!$(".workspace .active").length) {
		$(".workspace-tab:first").addClass("active");
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

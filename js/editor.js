var tabs = new Array();
var tabMarker = -1;

$(function() {
	var firstTab = addTab();
	firstTab.addClass("active");
	$("#tab0").addClass("active");
	$(".add").click(addTab);
	$(".close-btn").click(closeTab);
});

function addTab(html) {
	var newTab = $(".workspace-tab-template").clone();
	var newPane = $(".workspace-pane-template").clone();

	tabMarker++;

	var linkSettings = newTab.find("a");
	linkSettings.attr("href", "#tab" + tabMarker);
	linkSettings.html("Tab " + tabMarker);
	newPane.attr("id", "tab" + tabMarker);
	if (!html) {
		newPane.html(tabMarker);
	} else {
		newPane.html(html);
	}

	newTab.removeClass("workspace-tab-template");
	newTab.addClass("workspace-tab");
	newPane.removeClass("workspace-pane-template");
	newPane.addClass("workspace-pane-content");

	$(".workspace").append(newTab);
	$(".workspace").append($(".add"));
	$(".workspace").append($(".close-btn"));
	$(".workspace-pane").append(newPane);
	tabs.push(newTab);

	return newTab;
}

function closeTab() {
	$($(".workspace .active a").attr("href")).remove();
	$(".workspace .active").remove();
	$(".workspace-tab:first").addClass("active");
	tabs.pop($(".workspace-tab .active"));
}

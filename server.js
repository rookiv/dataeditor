// Modules required: child_process, ejs, express, xml2js

// Where did you install python to?
var pythonPath = "C:/Python27/python.exe";

// Script and data paths
var fbrbPath = __dirname + "/../dist/linux/levels/mp_common/level-00.fbrb";
var dbxPath = __dirname + "/scripts/dbx.py";
var archivePath = __dirname + "/scripts/archive.py";
var objectsPath = __dirname + "/../dist/linux/levels/mp_common/level-00 FbRB";
var weaponPath = objectsPath + "/Objects/Weapons/Handheld";

var spawn = require("child_process").spawn;
var express = require("express");
var app = express();

app.set("views", __dirname + "/views");
app.engine("html", require("ejs").renderFile);

app.use("/css", express.static(__dirname + "/css"));
app.use("/images", express.static(__dirname + "/images"));
app.use("/js", express.static(__dirname + "/js"));
app.use("/scripts", express.static(__dirname + "/scripts"));

// Server starting...
var loading = "Initializing...";
//extract();
readFiles(weaponPath);

app.get("/", function(req, res) {
	res.render("index.html");
});

app.get("/ready", function(req, res) {
	res.end(loading);
});

app.listen(8888);

// Start the unarchiver
function extract() {
	console.log("Starting unarchiver...");

	var unarchive = spawn(pythonPath, [archivePath, fbrbPath]);

	loading = "Extracting mp_common fbrb archive...";

	unarchive.stdout.on("data", function(data) {
		console.log("Output: " + data);
	});

	unarchive.stderr.on("data", function(data) {
		console.log("Error: " + data);
	});

	unarchive.on("close", function(code) {
		console.log("Unarchive complete!");
		loading = "Extraction complete!";
		readFiles(weaponPath);
	});
}

// Convert the dbx files to xml files
function readFiles(objPath) {
	var i = 0;
	readDir(objPath, function(err, files) {
		for (var a in files) {
			if (files[a].endsWith("_firing.dbx") || files[a].endsWith("_Firing.dbx")) {
				loading = "Converting " + files[a];
				var dbxToXml = spawn(pythonPath, [dbxPath, files[a]]);
				i++;

				dbxToXml.stdout.on("data", function(path) {
					i--;
					var fs = require('fs');
					var parseString = require('xml2js').parseString;
					fs.readFile(path.toString().substring(0, path.toString().length - 5) + "xml", function(err, data) {
						parseString(data, {
							trim : true,
							explicitArray : false,
							charkey : "value",
							mergeAttrs : true
						}, function(err, result) {
							// console.log(err);
							console.log(JSON.stringify(result));
						});
					});
				});

				dbxToXml.stderr.on("data", function(data) {
					console.log("Error: " + data);
				});

				dbxToXml.on("close", function(code) {
				});
			}
		}
	});

	// Check if it's over
	var check = setInterval(function() {
		if (i == 0) {
			clearInterval(check);
			loading = "Conversion complete!";
		}
	}, 1000);
}

function reformatJson(json) {
	
}

// Recursively read all files in the directory
function readDir(dir, done) {
	var fs = require("fs");
	var path = require("path");

	var results = [];
	fs.readdir(dir, function(err, list) {
		if (err)
			return done(err);
		var pending = list.length;
		if (!pending)
			return done(null, results);
		list.forEach(function(file) {
			file = path.resolve(dir, file);
			fs.stat(file, function(err, stat) {
				if (stat && stat.isDirectory()) {
					readDir(file, function(err, res) {
						results = results.concat(res);
						if (!--pending)
							done(null, results);
					});
				} else {
					results.push(file);
					if (!--pending)
						done(null, results);
				}
			});
		});
	});
}

String.prototype.endsWith = function(suffix) {
	return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

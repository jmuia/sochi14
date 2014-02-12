var http = require('http');

exports.medalData = function (callback) {
	var options = {
		hostname: ''
	};

	http.get("http://olympics.clearlytech.com/api/v1/medals", function (res) {
		var pageData = "";
		res.on('data', function (chunk) {
			pageData += chunk;
		});

		res.on('end', function() {
			callback(pageData);
		});

	}).on('error', function (e) {
		console.log("Got error: " + e.message);
	});
};
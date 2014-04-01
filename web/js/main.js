(function (App) {
	App.populator('home', function (page) {
		API.medalData(function (response) {
			var res = JSON.parse(response);
			updateData(res, page);
		});

		$(page).find('#refresh').on('click', function (e) {
			e.preventDefault();
			$(page).find('#loader').show();

			API.medalData(function (response) {
				var res = JSON.parse(response);
				$(page).find('#medal-list').empty();
				updateData(res, page);
				$(page).find('#loader').hide();
			});

			return false;
		});


		RequestAd_({
		    // Ad Request Variables
		    s:'5ec821e561be9caeb9eb4d39e3b08f86',
		    m:'live',
		    backfillhtml:'',
		    prependclickcontent:'',
		    requesturl:'http://kik-madserve.herokuapp.com/md.request.php',
		    trackingpixelurl:''
		}, page.querySelector("#banner-container"));
	});

	try {
		App.restore();
	} catch (err) {
		App.load('home');
	}
})(App);

function updateData (json, page) {
	var sorted = [];

	for (var key in json) {
		sorted.push({key:key, rank: json[key].rank});
	}

	sorted.sort(function(x,y) {return x.rank - y.rank });

	for (var i = 0; i < sorted.length; i++) {
		var item = json[sorted[i].key];
		if (item.rank !== 0) {
			$(page).find("#medal-list").append("<tr><td class='rank'>"
				+item.rank+". </td><td>"
				+item.country_name+"</td><td class='medal'>"
				+item.gold_count+"</td><td class='medal'>"
				+item.silver_count+"</td><td class='medal'>"
				+item.bronze_count+"</td><td class='medal total'>"
				+item.medal_count+"</td></tr>");
		}
	}
}
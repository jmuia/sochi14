(function (App) {
	App.populator('home', function (page) {
		API.medalData(function (response) {
			var res = JSON.parse(response);
			var sorted = [];

			for (var key in res) {
				sorted.push({key:key, rank: res[key].rank});
			}
			sorted.sort(function(x,y) {return x.rank - y.rank });


			for (var i = 0; i < sorted.length; i++) {
				var item = res[sorted[i].key];
				if (item.rank !== 0) {
					$(page).find("#medal-list").append("<tr><td class='rank'>"
						+item.rank+". </td><td>"
						+item.country_name+"</td><td class='medal'>"
						+item.gold_count+"</td><td class='medal'>"
						+item.silver_count+"</td><td class='medal'>"
						+item.bronze_count+"</td><td class='medal'>"
						+item.medal_count+"</td></tr>");
				}
			}
		});
	});

	try {
		App.restore();
	} catch (err) {
		App.load('home');
	}
})(App);
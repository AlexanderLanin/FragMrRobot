// Author: Alexander Lanin.
// all rights reserved.


// Always cache ajax requests
$.ajaxSetup({
	cache: true
});

function translateAll(options) {
	"use strict";

	$("[href^='http://www.wowdb.com/']").each(function () {
		var THIS = $(this);

		// translate simple text only, not images etc
		if (THIS.children().length > 0 || THIS.css("background-image") !== "none") {
			return;
		}

		// fetch id
		var t = THIS.attr("href").split("/"),
			id,
			type;

		if (t[3] === "spells") {
			type = "spell";
			id = t[4];
		}
		if (t[3] === "items") {
			type = "item";
			id = t[4];
		}

		if (id === undefined || type === undefined) {
			THIS.attr("translated", "error");
			return;
		}

		if(options.fixLinks) {
			THIS.attr("href", "http://" + options.language + ".wowhead.com/" + type + "=" + id);
		}

		if(options.translateSpellNames == false && type == 'spell') return;
		if(options.translateItemNames == false && type == 'item') return;
		
		// key for cache
		var storageKey = 'cache_' + options.language + '_' + type + '_' + id;

		chrome.storage.local.get(null, function (response) {

			if (response[storageKey]) {
				THIS.text(response[storageKey]);
			} else {
				var originalText = THIS.text();
				var linkUrl = "http://" + options.language + ".wowhead.com/" + type + "=" + id + "&power";

				THIS.text("translating...");
				$.get(linkUrl, {}, function (data) {
					data = data.replace(/(\r\n|\n|\r)/gm, " ");
					var fetchJsonRegex = /name_.*?: '(.*?)',/;
					var match = fetchJsonRegex.exec(data);

					if (match !== null) {
						var translated = match[1].replace(/\\'/g, "'");
						
						THIS.html(translated);

						var obj = {};
						obj[storageKey] = translated;
						chrome.storage.local.set(obj, function () {
							if (chrome.runtime.lastError !== undefined) {
								alert("error caching " + storageKey + " => " + translated + " :: " + chrome.runtime.lastError.message);
							}
						});
					} else {
						THIS.text("Failed: " + originalText);
						THIS.attr("orig", originalText);
					}
				}, "text" ).error (function (xhr, status, error) {
					THIS.text("Error: " + originalText);
					THIS.attr("orig", originalText);
				});
			}
		});
	});

	//$.getScript(chrome.extension.getURL("wowhead.js"));
	//$WowheadPower.init();
}



chrome.storage.sync.get(['language', 'translateIcyVeinsItemNames', 'translateIcyVeinsSpellNames', 'fixLinksIcyVeins'], function(response) {
	"use strict";
	var options = {};
	options.language = response.language || chrome.i18n.getMessage("wowheadPrefix");
	options.translateItemNames = response.translateIcyVeinsItemNames == undefined ? true : response.translateIcyVeinsItemNames;
	options.translateSpellNames = response.translateIcyVeinsSpellNames == undefined ? true : response.translateIcyVeinsSpellNames;
	options.fixLinks = response.fixLinksIcyVeins == undefined ? true : response.fixLinksIcyVeins;
	
	console.log(options);

	translateAll(options);
});


$("body").append("<br>Translations by chrome extension FragMrRobot powered by wowhead<br>");

// Author: Alexander Lanin.
// all rights reserved.


// Always cache ajax requests
$.ajaxSetup({
  cache: true
});
// request language from options
var options = {};

chrome.storage.sync.get(['language', 'translateAskMrRobotItemNames', 'fixLinksAskMrRobot', 'useDictionary'], function(response) {
	options.language = response.language || chrome.i18n.getMessage("wowheadPrefix");
	options.translateItemNames = response.translateAskMrRobotItemNames == undefined ? true : response.translateAskMrRobotItemNames;
	options.fixLinks = response.fixLinksAskMrRobot == undefined ? true : response.fixLinksAskMrRobot;
	options.useDictionary = response.useDictionary == undefined ? (options.language == 'de' || options.language == 'ru') : response.useDictionary;

	translateAll();
});

if (typeof String.prototype.startsWith != 'function') {
  String.prototype.startsWith = function (str){
    return this.slice(0, str.length) == str;
  };
}

if (typeof String.prototype.endsWith != 'function') {
  String.prototype.endsWith = function (str){
    return this.slice(-str.length) == str;
  };
}


function translateAll()
{
	// settings need to be read first
	if(options.language == undefined) return;

	
	// translate stats box
	if(options.useDictionary) {
		$(".wow-stats-table .name div, #panelWeightEditor table.main td[class='lbl']").each(function() {
			var THIS = $(this);

			if(THIS.attr("translated") != undefined) return;

			var orig = THIS.text();
			var text = orig.toLowerCase().replace(" ", "_");
			if(text == "physical_hit")	text = "hit";
			if(text == "critical_strike")text = "crit";
			if(text == "physical_crit")	text = "crit";
			if(text == "melee_haste")	text = "haste";
			if(text == "pvp_resil")		text = "pvp_resilience";
			
			var prefix = "";
			if(text.startsWith("mh_")) { prefix = "MH "; text = text.substr(3); }
			if(text.startsWith("oh_")) { prefix = "OH "; text = text.substr(3); }
			
			THIS.attr('lookup_text', text);

			var translated = chrome.i18n.getMessage(text);
			if(translated != "") {
				THIS.attr("orig", orig);
				THIS.attr("translated", options.language)
				THIS.text(prefix + translated);
			} else {
				THIS.attr("translated", "no translation for: " + text)
			}
		});

		$(".wow-mods-table .reforge div, .wow-mods-table .enchant div").each(function() {
			var THIS = $(this);

			if(THIS.attr("translated") != undefined) return;

			var words = THIS.text().split(" ");
			var text = "";
			
			for(var i in words) {
				var word = words[i];
				var komma = false;
				if(word.indexOf(',') > 0) {
					komma = true;
					word = word.substr(0, word.length - 1);
				}

				if(word == "Exp")	word = "expertise";
				if(word == "Str")	word = "strength";
				if(word == "Int")	word = "intellect";
				if(word == "Stam")	word = "stamina";
				if(word == "Agi")	word = "agility";

				var translated = chrome.i18n.getMessage("short_" + word);

				if(translated) {
					text += translated + (komma ? ", " : " ");
				} else {
					text += words[i] + " ";
				}
			}

			THIS.attr("translated", options.language)
			THIS.text(text);
		});

		
		$("#cboGearFinderCurrency option").each(function() {
			var THIS = $(this);
			
			var translated = chrome.i18n.getMessage(THIS.text().toLowerCase().replace(" ", "_"));
			if(translated != "")
				THIS.text(translated);
		});
	}
	
	if(options.fixLinks) {
		$("a[href^='http://www.wowdb.com/']").each(function(){
			var THIS = $(this);
			
			// each link only once
			if(THIS.attr("translated") != undefined) return;
			
			var href = THIS.attr("href");
			var hrefArr = href.split("/");
			if(hrefArr[3] == 'items') {
				THIS.attr("translated", options.language);
				
				if($(".label1", THIS).length == 0) {
					THIS.after($("<a></a>").attr("href", "http://" + options.language + ".wowhead.com/item=" + hrefArr[4]).text(options.language + ".wowhead"));
					THIS.after(' ');
				} else {
					THIS.attr("href", "http://" + options.language + ".wowhead.com/item=" + hrefArr[4]);
				}
			} else {
				THIS.attr("translated", "link_error");
			}
		});
	}

	if(options.translateItemNames == false) return;

	$("[data-tr-tooltip-id]").each(function(){
		var THIS = $(this);

		// do not translate images
		if(THIS.css("background-image") != "none") {
			return;
		}

		var translateInto = THIS;
		var suffix = "";
		
		if(THIS.children().length > 0) {
			translateInto = $(".name", THIS);
			
			// trinkets section
			if(translateInto.length == 0 && THIS.children().length == 1) {
				translateInto = $("a", THIS);
				if(translateInto.text().indexOf(' (H)'  ) > 0) suffix = ' (H)';
				if(translateInto.text().indexOf(' (LFR)') > 0) suffix = ' (LFR)';
			}
			
			if(translateInto.length == 0) {
				// has children but no name div
				return;
			}
		}

		// translating once is enough
		if(THIS.attr("translated") != undefined)
			return;

		// fetch id
		var tooltipId = THIS.attr("data-tr-tooltip-id");
		var t = tooltipId.split("/");
		if(t[0] != "item") {
			t = tooltipId.split("_");
			if(t[0] == "ench") return;

			if(t[0] != "gem" /*&& t[0] != "ench"*/)
			{
				THIS.attr("translated", "error_type");
				return;
			}
		}

		// mark as work in progress
		THIS.attr("translated", "translating");

		
		// key for cache
		var storageKey = 'cache_' + options.language + '_item_' + t[1];
//		if(t[2] != undefined && (t[2][0] == 'r' && t[2][1] == ':')) {
//			storageKey += "_" + t[2];
//		}
//		if(t[3] != undefined && (t[3][0] == 'r' && t[3][1] == ':')) {
//			storageKey += "_" + t[3];
//		}
//		if(t[4] != undefined && (t[4][0] == 'r' && t[4][1] == ':')) {
//			storageKey += "_" + t[4];
//		}
//		console.log(storageKey + " -> ");

		chrome.storage.local.get(null, function(response) {

			if(response[storageKey])
			{
				var translated = response[storageKey].replace(/\\'/g, "'");
				translateInto.text(translated + suffix);
				THIS.attr("translated", options.language);
			}
			else
			{
				var originalText = translateInto.text();
				translateInto.text("translating...");
				var linkUrl = "http://" + options.language + ".wowhead.com/item=" + t[1] + "&power";
				
//				if(t[2] != undefined && t[2].substring(0, 2) == 'r:') {
//					linkUrl += '&rand=' + t[2].substring(2);
//				}
//				if(t[3] != undefined && t[3].substring(0, 2) == 'r:') {
//					linkUrl += '&rand=' + t[3].substring(2);
//				}
//				if(t[4] != undefined && t[4].substring(0, 2) == 'r:') {
//					linkUrl += '&rand=' + t[4].substring(2);
//				}
//				console.log(linkUrl);
				
				$.get(linkUrl, {}, function(data) {
					data = data.replace(/(\r\n|\n|\r)/gm, " ");
					var fetchJsonRegex = /name_.*?: '(.*?)',/;
					var match = fetchJsonRegex.exec(data);
					
					if(match != null)
					{
						var translated = match[1];
						translated = translated.replace(/\\'/g, "'");

						var obj = {};
						obj[storageKey] = translated;
						chrome.storage.local.set(obj, function() {
							if(chrome.runtime.lastError != undefined)
							{
								alert("error caching " + storageKey + " => " + translated + " :: " + chrome.runtime.lastError.message);
							}
						});
						translateInto.text(translated + suffix);
						THIS.attr("translated", options.language);
					}
					else
					{
						console.log("Translation failed: " + linkUrl);
						translateInto.text("wowhead error");
						THIS.attr("translated", "error_wowhead");
						THIS.attr("orig", originalText);
						
						setTimeout(function() { translateInto.text(originalText); }, 3000);
					}
				}, 'text');
			}
		});
	});
}

var queuedTranslateCall = 0;
$("#panelMainContent").bind("DOMSubtreeModified", function() {
	clearTimeout(queuedTranslateCall);
	queuedTranslateCall = setTimeout(translateAll, 10);
});

$(".tr-footer .tr-footer-links").filter(":last").append("<br><span>Translations by chrome extension FragMrRobot powered by wowhead</span>");

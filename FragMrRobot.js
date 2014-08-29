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

if (typeof String.prototype.contains != 'function') {
  String.prototype.contains = function(str){
    return this.indexOf(str) != -1;
  };
}

function isNumeric(num){
    return !isNaN(num)
}

function translateKey(key, preferShort)
{
	// return chrome.i18n.getMessage(key);

	if(preferShort && translations["short_" + key] != undefined && translations["short_" + key][options.language] != undefined)
	{
		return translations["short_" + key][options.language];
	}
	
	if(translations[key] != undefined && translations[key][options.language] != undefined)
	{
		return translations[key][options.language];
	}
	
	return "";
}

function translateString(string, preferShort)
{
	var words = string.toLowerCase().trim().split(" ");

	var prefix = "";
	var suffix = "";

	if(words[0] == "mh" || words[0] == "oh" || isNumeric(words[0]))
	{
		prefix = string.split(" ")[0] + " ";
		words.splice(0, 1);
	}
	
	if(words[words.length-1] == "rating")
	{
		words.splice(words.length-1, 1);
	}

	if(words[words.length-1] == "(?)")
	{
		suffix = " " + string.split(" ")[words.length-1];
		words.splice(words.length-1, 1);
	}

	var key = words.join('_');
	var translated = translateKey(key, preferShort);
	
	if(translated == "") return "ERROR:" + key;

	return prefix + translated + suffix;
}

function translateSelector(selector, preferShort)
{
	$(selector).each(function() {
		translateElement(this, preferShort);
	});
}

function translateElement(elem, preferShort)
{
	var ELEM = $(elem);
	
	if(ELEM.attr("translated") != undefined) return;

	var orig = ELEM.text();
	
	if(orig == "") return;

	var parts = [orig];
	var sep = "";
	if(orig.contains(" -> " ))  { sep = " -> "; parts = orig.split(sep); }
	if(orig.contains(", "   ))  { sep = ", ";   parts = orig.split(sep); }
	if(orig.contains(" and "))  { sep = ", ";   parts = orig.split(" and "); }
	if(orig.contains(" > "  ))  { sep = " > ";  parts = orig.split(sep); }

	var errors = "";

	for(var i = 0; i != parts.length; i++)
	{
		var translated = translateString(parts[i], preferShort);
		
		if(translated.startsWith("ERROR:"))
		{
			errors += "no translation found for " + translated;
		}
		else
		{
			parts[i] = translated;
		}
	}
	
	var translated = parts.join(sep);

	if(errors != "")
	{
		ELEM.attr("errors", errors);
	}
	
	ELEM.text(translated);
	ELEM.attr("orig", orig);
	ELEM.attr("translated", options.language);
}

function translateWithDictionary()
{
	// Build Beschreibung
	translateSelector("#panelSpecWeightsDesc", true);

	// Rechte Spalte
	translateSelector(".wow-stats-table .name div", false);

	// Edit Weights
	translateSelector("#panelWeightEditor table.main td[class='lbl']", false);
	
	translateSelector(".wow-mods-table .reforge div", true);
	translateSelector(".wow-mods-table .enchant div", true);
	translateSelector("#cboGearFinderCurrency option", true);

	// Reforge bei item betrachtung (zB Gürtel)
	// translateSelector("#panelGearEditorItem .reforge", false);
	// wird scheinbar nachträglich geändert. beim laden steht da "not reforged"
	
	// Vergleich von Verzauberungen
	translateSelector("#panelGearEditorList .ench-enchant", false);

	// Vergleich von Gems (ja die heißen enchant)
	translateSelector("#panelGearEditorList .enchant", false);
	
	// Vergleich von reforges
	translateSelector("#panelGearEditorList .reforge-stat", false);
	
	// Main Hand, Off Hand, Head, Neck, Shoulder, ..., Trinket 2
	translateSelector(".wow-items-table td.slot", true);
}

function fixLinks()
{
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

function translateAll()
{
	// settings need to be read first
	if(options.language == undefined) return;

	if(options.useDictionary)
	{
		translateWithDictionary();
	}
	
	if(options.fixLinks)
	{
		fixLinks();
	}

	if(options.translateItemNames)
	{
		translateItems();
	}
}

function translateItems()
{
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

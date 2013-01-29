// Author: Alexander Lanin.
// all rights reserved.

$(function () {
"use strict";

var checkboxesList = [];


function countProperties(obj) {
	var counter = 0;

	for (var prop in obj) {
		counter++;
	}

	return counter;
}

function updateCacheValues() {
	chrome.storage.local.getBytesInUse(null, function(bytesInUse) {
		$("#cacheSizeUsed").text(Math.round(bytesInUse/1024));

		$( "#cacheSizeProgressbar" ).progressbar({
            value: bytesInUse,
			max: chrome.storage.local.QUOTA_BYTES
        });
	});
	
	chrome.storage.local.get(null, function(items) {
		$("#entriesInCache").text(countProperties(items));
	});
}


function loadOptions () {

	// checkboxes: load default, overwrite if set
	$('[type="checkbox"]').each(function (index, element) {
		$(this).prop('checked', $(this).attr('default') == "true");
	});


	chrome.storage.sync.get('language', function(response) {
		var lang = response.language || chrome.i18n.getMessage("wowheadPrefix");
		$("#lang").val(lang).attr("selected", true);

		// de and ru are fine, enable by default
		if(lang == 'de' || lang == 'ru')
			$("#useDictionary").prop('checked', true);

		chrome.storage.sync.get(checkboxesList, function(response) {
			for(var key in response) {
				$('#' + key).prop('checked', response[key]);
			}
		});
	});
}


$('[type="checkbox"]').each(function (index, element) {
	var CHECKBOX = $(this);

	var ID = CHECKBOX.attr('id');
	CHECKBOX.attr("name", ID);
	CHECKBOX.after($('<label></label>').attr('for', ID).text(CHECKBOX.attr('label')));
	CHECKBOX.after(' ');
	
	checkboxesList.push(ID);
});




// prepare cache tab

$("#cacheSizeTotal").text(chrome.storage.local.QUOTA_BYTES/1024);
$("#clearCache").click(function () {
	chrome.storage.local.clear();
});

chrome.storage.onChanged.addListener(updateCacheValues);
updateCacheValues();

$( "#tabs" ).tabs();


loadOptions();


$('#saveOptions').click(function () {
	var BUTTON = $(this);
	BUTTON.attr('disabled', true);

	chrome.storage.local.clear();
	chrome.storage.sync.set({
		'language': $("#lang").val(),
		'translateAskMrRobotItemNames': $('#translateAskMrRobotItemNames').prop('checked'),
		'translateIcyVeinsItemNames': $('#translateIcyVeinsItemNames').prop('checked'),
		'translateIcyVeinsSpellNames': $('#translateIcyVeinsSpellNames').prop('checked'),
		'useDictionary': $('#useDictionary').prop('checked'),
		'fixLinksIcyVeins': $('#fixLinksIcyVeins').prop('checked'),
		'fixLinksAskMrRobot': $('#fixLinksAskMrRobot').prop('checked')
	}, function() {
		// Notify that we saved.
		var original = BUTTON.text();
		BUTTON.text(BUTTON.attr("onSuccess"));
		setTimeout(function() {
			BUTTON.text(original);
			BUTTON.attr('disabled', false);
		}, 2500);
	});
});

$('#resetOptions').click(function () {
	var BUTTON = $(this);
	BUTTON.attr('disabled', true);

	//chrome.storage.local.clear();
	chrome.storage.sync.clear(function () {
		loadOptions();

		var original = BUTTON.text();
		BUTTON.text(BUTTON.attr("onSuccess"));
		setTimeout(function() {
			BUTTON.text(original);
			BUTTON.attr('disabled', false);
		}, 2500);
	});
});


}); // onload

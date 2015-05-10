/**
 This file is part of FragMrRobot.
 
 FragMrRobot is distributed under The Q Public License Version (QPL-1.0).
 
 You should have received a copy of the License along with this file.
 If not, see http://opensource.org/licenses/QPL-1.0
*/


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
   options.useDictionary = response.useDictionary == undefined ? (options.language == 'de' || options.language == 'ru' || options.language == 'pt') : response.useDictionary;

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

   // then: shopping list
   // Vendor - : drop locations for items
   while(words[0] == "mh" || words[0] == "oh" || words[0] == "then" || words[0] == "vendor" || words[0] == "-" || isNumeric(words[0]))
   {
      prefix += words[0] + " ";
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
   
   if(ELEM.attr("dictionary") != undefined) return;

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
         errors += "no translation found for " + translated + "; ";
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
   ELEM.attr("dictionary", options.language + " via dictionary");
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
   
   // overview page:
   translateSelector(".wgr-enchtext", true);
   
   // at the bottom of the overview page
   translateSelector(".wst-lbl", true);
   
   
   translateSelector("#cboGearFinderCurrency option", true);

   // Reforge bei item betrachtung (zB Gürtel)
   // translateSelector("#panelGearEditorItem .reforge", false);
   // wird scheinbar nachträglich geändert. beim laden steht da "not reforged"
   
   // Vergleich von Verzauberungen
   translateSelector("#panelGearEditorList .ench-enchant", false);

   // Gem comparison -> +Stats
   translateSelector(".wlst-tmtxt", false);

   // Gem comparison -> head, shoulder etc
   translateSelector(".wlst-slotlbl", true);
   
   // Vergleich von reforges
   translateSelector("#panelGearEditorList .reforge-stat", false);
   
   // Main Hand, Off Hand, Head, Neck, Shoulder, ..., Trinket 2
   translateSelector(".wgr-slot", true);
   
   // Drop Locations, especially for "1750 Justice Points"
   translateSelector(".wow-mods-table td.loc div", true);

   // reforges in shopping list
   {
      // Main Hand, Off Hand, Head, Neck, Shoulder, ..., Trinket 2
      translateSelector("#panelShopActionsMain div.slot", false);

      // Reforges
      translateSelector("#panelShopActionsMain div.label-material", false);
   }

   // trinket compare
   translateSelector("#panelTrinketList .stats label", false);
}

/// @param obj: jquery object
/// @returns object with 'type' and 'id'
function getTypeAndId(obj)
{
   obj = $(obj);
   
   var type = "";
   var id = "";

   if(obj.length == 0)
   {
      console.log("getTypeAndId called with empty object");
   }
   else if(obj.is("[data-tr-tooltip-id]"))
   {
      var tooltipId = obj.attr("data-tr-tooltip-id");
      var t = tooltipId.split(tooltipId.contains("/") ? "/" : "_");
      if(t.length >= 2)
      {
         type = t[0];
         id   = t[1];
      }
      else
      {
         obj.attr("error", "has data-tr-tooltip-id, but could not deduce type and id");
      }
   }
   else if(obj.is("[href]"))
   {
      var href = obj.attr("href");
      var hrefArr = href.split("/");

      type = hrefArr[3];
      id = hrefArr[4];
   }
   else
   {
      obj.attr("error", "error detecting type and id");
   }

   // "spell" and not "spells" etc. as this is what we need for wowhead
   if(type.endsWith('s'))
   {
      type = type.substring(0, type.length-1);
   }

   if(type == "gem")
   {
      type = "item";
   }

   return {
      type: type,
      id: id
   }
}

function getWowheadLink(typeAndId)
{
   return "https://" + options.language + ".wowhead.com/" + typeAndId.type + "=" + typeAndId.id;
}

function addWowheadLinkAfterWowdbLink(link)
{
   // each link only once
   if(link.attr("linkfix") != undefined) return;
   
   var obj = getTypeAndId(link);
   var newHref = getWowheadLink(obj);

   switch(obj.type)
   {
      case "item":
         if($(".label1", link).length == 0)
         {
            link.attr("linkfix", options.language + " via linkfix (item, label1)");
            
            link.after($("<a></a>").attr("target", "blank").attr("href", newHref).text(options.language + ".wowhead"));
            link.after(' ');
         }
         else
         {
            link.attr("linkfix", options.language + " via linkfix (item, non-label1)");
            
            link.attr("href", newHref);
         }
         break;
         
      case "spell":
         link.attr("linkfix", options.language + " via linkfix (spell)");
      
         link.after($("<a></a>").attr("target", "blank").attr("href", newHref).text(options.language + ".wowhead"));
         link.after(' ');
         break;
         
      default:
         link.attr("linkfix", "link_error: unknown type: " + obj.type);
   }
}

function fixLinks()
{
   $("a[href^='http://www.wowdb.com/']").each(function() { addWowheadLinkAfterWowdbLink($(this)); });
   $(".cwowdb").css("line-height", "18px");
}

function translateAll()
{
   // settings need to be read first
   if(options.language == undefined)
   {
      return;
   }

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

function backgroundImageFilter()
{
   return $(this).css("background-image") == "none";
}

function translateItems()
{
  // fetch all data-tr-tooltip-id, which are not yet translated are not an image
   $("[data-tr-tooltip-id]")
      .not("[translated]")
      .filter(backgroundImageFilter)
      .each(translateItem);
   
   // translate enchant material on shopping list
   $(".link-container[href]")
      .not("[data-tr-tooltip-id], [translated]")
      .filter(backgroundImageFilter)
      .each(translateItem);

}

function translateItem()
{
   var THIS = $(this);
   var typeAndId = getTypeAndId(THIS);
   
   // attempt to translate enchants in case they link to an spell
   if(typeAndId.type == "ench")
   {
      // find wowdb link in same row
      var wowdbLink = $("a[href^='http://www.wowdb.com/']", THIS.siblings(".cwowdb"));
      if(wowdbLink.length)
      {
         typeAndId = getTypeAndId(wowdbLink);
      }
   }
   
   if(typeAndId.type != "item" && typeAndId.type != "spell")
   {
      THIS.attr("translated", "Error: unsupported type " + typeAndId.type);
      return;
   }

   var translateInto = THIS;
   
   if(THIS.children().length > 0)
   {
      translateInto = $(".wlst-tname", THIS);

      // that's strange, but let's try first link before failing
      if(translateInto.length == 0)
      {
         translateInto = $("a:first-child", THIS);
         THIS.attr("debug", "translating first link");
      }

      if(translateInto.length == 0)
      {
         THIS.attr("translated", "ERROR: element has children but the item itself was not found");
         return;
      }
   }
   
   var suffix = "";
   if(translateInto.text().indexOf(' (H)'  ) > 0) suffix = ' (H)';
   if(translateInto.text().indexOf(' (LFR)') > 0) suffix = ' (LFR)';

   
   // mark as work in progress
   THIS.attr("translated", "translating");

   // key for cache
   var storageKey = 'cache_' + options.language + '_' + typeAndId.type + '_' + typeAndId.id;
   THIS.attr("cacheKey", storageKey);

   chrome.storage.local.get(null, function(response)
   {
      if(response[storageKey])
      {
         var translated = response[storageKey].replace(/\\'/g, "'");
         translateInto.text(translated + suffix);
         THIS.attr("translated", options.language + " via name cache");
         THIS.attr("cached", true);
      }
      else
      {
         var originalText = translateInto.text();
         translateInto.text("translating...");
         var linkUrl = getWowheadLink(typeAndId) + "&power";
         
         $.get(linkUrl, {}, function(data)
         {
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
                     console.log("error caching " + storageKey + " => " + translated + " :: " + chrome.runtime.lastError.message);
                  }
               });
               translateInto.text(translated + suffix);
               THIS.attr("translated", options.language + " via wowhead");
            }
            else
            {
               console.log("Translation failed: " + linkUrl);
               THIS.attr("translated", "error_wowhead");
               THIS.attr("orig", originalText);
               
               // show error and hide it again after 3 seconds
               translateInto.text("wowhead error");
               setTimeout(function() { translateInto.text(originalText); }, 3000);
            }
         }, 'text');
      }
   });
}

var queuedTranslateCall = 0;
$("#panelMainContent").bind("DOMSubtreeModified", function() {
   clearTimeout(queuedTranslateCall);
   queuedTranslateCall = setTimeout(translateAll, 10);
});

$(".tr-footer .tr-footer-links").filter(":last").append("<br><span>Translations by chrome extension FragMrRobot powered by wowhead</span>");

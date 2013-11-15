// From: https://gist.github.com/jonjaques/2897748

var Skyscraper = Skyscraper || (Skyscraper = new Bookmarklet({
	// debug: true, // use debug to bust the cache on your resources
	css: ['http://tomsoderlund.github.io/skyscraper-js' + '/css/skyscraper.css'],
	js: [],
	// jqpath: '/my/jquery.js', // defaults to google cdn-hosted jquery
	ready: function (base) { // use base to expose a public method

		var searchPattern = {
			table: { tagName: null, id: null, classes: null },
			rowTemplate: { tagName: null, id: null, classes: null },
			fields: []
		}


		var setInfoStep = function (stepNr) {
			$('.skyscraper-info-box li').removeClass('active');
			$('.skyscraper-info-box #step-' + stepNr).addClass('active');
		}

		var formatNiceName = function (element) {
			var niceName = element.prop("tagName");
			niceName += '[' + remoteSkyscraperClasses(element.attr('class')) + ']';
			if (element.attr('id'))
				niceName += '(' + element.attr('id') + ')';
			return niceName;
		}

		var remoteSkyscraperClasses = function (classesStr) {
			var classesArray = classesStr.split(' ');
			var returnStr = "";
			for (var c in classesArray) {
				if (classesArray[c].indexOf('skyscraper') === -1) {
					returnStr = classesArray[c] + ' ';
				};
			}
			return returnStr.trim();
		}

		var setSearchPatternProperties = function (element, patternObject) {
			patternObject.tagName = element.prop("tagName").toLowerCase();
			if (element.attr('id'))
				patternObject.id = element.attr('id');
			patternObject.classes = remoteSkyscraperClasses(element.attr('class'));
			//console.log('searchPattern:', searchPattern);
		}

		var smartFind = function (element, patternObject, useId) {
			var searchStr = patternObject.tagName
			if (patternObject.classes)
				searchStr += '.' + patternObject.classes.split(' ')[0];
			if (useId && patternObject.id)
				searchStr += '#' + patternObject.id;
			//console.log('searchPattern:', searchPattern);
			//console.log('smartFind:', searchStr)
			return element.find(searchStr);
		}

		base.init = function () {

			console.log('Skyscraper initializing...');

			$('body').append('<div class="skyscraper-info-box">'
				+ '<h3>Skyscraper</h3>'
				+ '<ol class="skyscraper-list">'
				+ '<li id="step-1">Select the data table: <span class="select-slot" id="skyscraper-select-table">select</span></li>'
				+ '<li id="step-2">Select one data row: <span class="select-slot" id="skyscraper-select-row">select</span></li>'
				+ '<li id="step-3">Select data fields: <span class="select-slot" id="skyscraper-select-fields">select</span></li>'
				+ '<li id="step-4">Click below to begin parsing:</li>'
				+ '</ol>'
				+ '<button type="button" id="skyscraper-start-button">Begin Parsing</button>'
				+ '<textarea id="skyscraper-results"></textarea>'
				+ '<a id="skyscraper-reset" href="#">Reset</a>'
				+ '</div>');

			$('ul').addClass('skyscraper-data-table');
			$('ol').not('.skyscraper-list').addClass('skyscraper-data-table');
			$('table').addClass('skyscraper-data-table');

			// 1. Select Table
			$('.skyscraper-data-table').click(function(event) {
				//event.stopPropagation();
				var element = $(event.target);
				console.log('TABLE:', $(event.target));
				element.addClass('skyscraper-selected');
				element.find('.skyscraper-data-table').off('click');
				element.find('.skyscraper-data-table').removeClass('skyscraper-data-table');
				element.children('li').addClass('skyscraper-data-row');
				element.children('tr').addClass('skyscraper-data-row');
				element.children('tbody').children('tr').addClass('skyscraper-data-row');
				$('#skyscraper-select-table').html(formatNiceName(element));
				setSearchPatternProperties(element, searchPattern.table);
				console.log(searchPattern);
				setInfoStep(2);

				// 2. Select Row Template
				$('.skyscraper-data-row').click(function(event) {
					event.stopPropagation();
					var element = $(event.target);
					console.log('ROW:', element, element.prop("tagName"));
					if (element.prop("tagName") === 'TD') {
						element = element.parent();
					}
					element.parent().children().removeClass('skyscraper-selected');
					element.addClass('skyscraper-selected');
					//$(event.target).parent().off('click', '.skyscraper-data-row');
					element.removeClass('skyscraper-data-row');
					// Remove links
					element.find('*').click(function(e) {
						e.preventDefault();
					});
					element.children().addClass('skyscraper-data-field');
					$('#skyscraper-select-row').html(formatNiceName(element));
					setSearchPatternProperties(element, searchPattern.rowTemplate);
					setInfoStep(3);

				// 3. Select Fields
					$('.skyscraper-data-field').click(function(event) {
						event.stopPropagation();
						var element = $(event.target);
						console.log('FIELD:', event.target);
						//element.parent().children().removeClass('selected');
						element.addClass('skyscraper-selected');
						if ($('#skyscraper-select-fields').html() === 'select') {
							$('#skyscraper-select-fields').html('');
						};
						$('#skyscraper-select-fields').append(formatNiceName(element) + ', ');
						var newField = {};
						setSearchPatternProperties(element, newField);
						searchPattern.fields.push(newField);
						setInfoStep(4);
					});

				});


			});

			$('#skyscraper-start-button').click(function(event) {
				Skyscraper.beginParsing();
			});

			$('#skyscraper-reset').click(function(event) {
				Skyscraper.reset();
			});

			setInfoStep(1);
			
		};//init

		base.reset = function() {
			searchPattern = {
				table: { tagName: null, id: null, classes: null },
				rowTemplate: { tagName: null, id: null, classes: null },
				fields: []
			}
			$('#skyscraper-select-table').html("select");
			$('#skyscraper-select-row').html("select");
			$('#skyscraper-select-fields').html("select");
			$('#skyscraper-results').val('');
			// strip CSS
			//$('body').find('.skyscraper-data-table').removeClass('skyscraper-data-table');
			$('body').find('.skyscraper-data-row').removeClass('skyscraper-data-row');
			$('body').find('.skyscraper-data-field').removeClass('skyscraper-data-field');
			$('body').find('.skyscraper-selected').removeClass('skyscraper-selected');
			setInfoStep(1);
		}

		base.beginParsing = function() {

			var resultStr = '';

			var tableElement = smartFind($('body'), searchPattern.table);
			//console.log('tableElement', tableElement);
			if (tableElement !== null) {
				var rowElements = smartFind(tableElement, searchPattern.rowTemplate, false)
				console.log('rowElements', rowElements.length);
				for (var r = 0; r < rowElements.length; r++) {
					var rowTextStr = '';
					var rowElem = $(rowElements[r]);
					//console.log(rowElements[r]);
					if (searchPattern.fields.length === 0) {
						// List
						rowTextStr = rowElem.text() + ';';
					}
					else {
						// Multi-field table
						for (var f = 0; f < searchPattern.fields.length; f++) {
							var fieldElements = smartFind(rowElem, searchPattern.fields[f], false)
							console.log('fieldElements', fieldElements.length);
							for (var fi = 0; fi < fieldElements.length; fi++) {
								rowTextStr += $(fieldElements[fi]).text() + ';';
							}
						}
					}
					rowTextStr.replace('\n', '\\');
					rowTextStr.replace('\r', '\\');
					console.log('rowTextStr', rowTextStr);
					resultStr += 'ROW;' + (r+1) + ';' + rowTextStr + '\n';
				};
			}
			else {
				resultStr = 'ERROR: Could not find table element.'
			};


			$('#skyscraper-results').val(resultStr);
		};

		base.init();
	}

}));


/**
* jQuery Bookmarklet - version 2.0
* Author(s): Brett Barros, Paul Irish, Jon Jaques
* 
* Original Source: http://latentmotion.com/how-to-create-a-jquery-bookmarklet/
* Modified Source: https://gist.github.com/2897748
*/

function Bookmarklet(options){
// Avoid confusion when setting
// public methods.
var self = this;

// Merges objects. B overwrites A.
function extend(a, b){
	var c = {};
	for (var key in a) { c[key] = a[key]; }
		for (var key in b) { c[key] = b[key]; }
			return c;
	}

	function loadCSS(sheets) {
// Synchronous loop for css files
$.each(sheets, function(r, sheet){
	$('<link>').attr({
		href: (sheet + cachebuster), 
		rel: 'stylesheet'
	}).prependTo('body');
});
}

function loadJS(scripts){
// Check if we've processed all 
// of the JS files (or if there are none).
if (scripts.length === 0) {
	o.ready(self);
	return;
}

// Load the first js file in the array.
$.getScript(scripts[0] + cachebuster, function(){
// asyncronous recursion, courtesy Paul Irish.
loadJS(scripts.slice(1));
});
}

function init(callback) {
	if(!window.jQuery) {
// Create jQuery script element.
var script = document.createElement('script');
script.type = 'text/javascript';
script.src = o.jqpath;
document.body.appendChild(script);

// exit on jQuery load.
script.onload = function(){ callback(); };
script.onreadystatechange = function() {
	if (this.readyState == 'complete') callback();
}
} else {
	callback();
}
}

var defaults = {
	debug: false
	, css: []
	, js: []
	, jqpath: "https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"
}

// If we don't pass options, use the defaults.
, o = extend(defaults, options)

, cachebuster = o.debug ?
('?v=' + (new Date()).getTime()) : '';


// Kick it off.
init(function(){
	loadCSS(o.css);
	loadJS(o.js);
});

};
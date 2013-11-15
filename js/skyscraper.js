// From: https://gist.github.com/jonjaques/2897748

var Skyscraper = Skyscraper || (Skyscraper = new Bookmarklet({
// debug: true, // use debug to bust the cache on your resources
css: ['/css/skyscraper.css'],
js: [],
// jqpath: '/my/jquery.js', // defaults to google cdn-hosted jquery
ready: function(base) { // use base to expose a public method
	base.init = function(){

		$('body').append('<div class="skyscraper-info-box">'
			+ '<h3>Skyscraper</h3>'
			+ '<ol class="skyscraper-list">'
			+ '<li>Select a data table: <span class="select-slot" id="skyscraper-select-table">(select)</span></li>'
			+ '<li>Select a data row: <span class="select-slot" id="skyscraper-select-row">(select)</span></li>'
			+ '<li>Select a data fields: <span class="select-slot" id="skyscraper-select-fields">(select)</span></li>'
			+ '<li>Click here to begin parsing!</li>'
			+ '/<ol>'
			+ '</div>');

		$('ul').not('.skyscraper-list').addClass('skyscraper-data-table');
		$('ol').addClass('skyscraper-data-table');

		$('.skyscraper-data-table').click(function(event) {
			$(event.target).children('li').addClass('skyscraper-data-row');
			$('#skyscraper-select-table').html(event.target.tagName + ': ' + event.target.id);
			console.log(event.target);
		});

		$('.skyscraper-data-row').click(function(event) {
			$('.skyscraper-data-table').unbind('click');
			$('#skyscraper-select-row').html(event.target.tagName + ': ' + event.target.id);
		});

	}

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
$.each(sheets, function(i, sheet){
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
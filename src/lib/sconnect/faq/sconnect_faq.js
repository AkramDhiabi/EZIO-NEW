var HEADER_HEIGHT = 93,
	Browsers = {
		cr: { cls: 'cr', name: 'Chrome' },
		ff: { cls: 'ff', name: 'Firefox' },
		ie: { cls: 'ie', name: 'Internet Explorer' },
		sf: { cls: 'sf', name: 'Safari' }
	},
	OSes = {
		lin: { cls: 'lin', name: 'Linux' },
		mac: { cls: 'mac', name: 'OS X' },
		win: { cls: 'win', name: 'Windows' }
	},
	Browser, OS, UA, sideNav, devdocNav, docContent;

if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function(obj, start) {
		for (var i = (start || 0), j = this.length; i < j; i++) {
			if (this[i] === obj) { return i; }
		}
		return -1;
	};
}

if (!window.console) window.console = {};
if (!window.console.log) window.console.log = function (msg) { alert(msg); };

String.prototype.contains = function(str) {
	var a = this.split(' ');
	return a.indexOf(str) !== -1;
};

$(function() {
	UA = navigator.userAgent.match(/[A-Za-z]*\/[\d\.]*( \(.+?\))*/g);
	for (var i = 0; i < UA.length; i++) {
		if (!Browser) {
			if (UA[i].indexOf("Chrome") !== -1) Browser = Browsers.cr;
			if (UA[i].indexOf("Firefox") !== -1) Browser = Browsers.ff;
			if (UA[i].indexOf("MSIE") !== -1) Browser = Browsers.ie;
			if (UA[i].indexOf("Safari") !== -1) Browser = Browsers.sf;
			if (Browser) Browser.version = Browser.cls === 'ie' ? UA[i].replace(/.+MSIE (.+?);.+/, '$1') : UA[i].substr(UA[i].indexOf('/') + 1);
		}
		if (UA[i].indexOf("Windows NT") !== -1) OS = OSes.win;
		if (UA[i].indexOf("Macintosh") !== -1) OS = OSes.mac;
	}
	/*if (Browser) { $('#browser-' + Browser.cls).addClass('current'); } // highlight current browser
	if (OS) { $('#os-' + OS.cls).addClass('current'); } // highlight current OS*/
	
	try{
	// initialize
	/*$('a', '#header-tabs').each(function() { // set tab to active
		if (this.href ===  window.location.href.replace(window.location.hash, '')) { $(this).parent().addClass('current-tab'); }
	});*/
	
	window.onresize = resizeHeight;
	sideNav = $('#side-nav');
	devdocNav = $('#devdoc-nav');
	docContent = $('#doc-content');
	$('img').one('load', function() {
		var prev = this.previousElementSibling;
		if (prev && prev.className.contains('shadow')) {
			prev.style.height = this.height + 'px';
			prev.style.width = this.width + 'px';
		}
		showScrollToTop();
	}).each(function() { if (this.complete) $(this).load(); });
	
	$('a.toggle-img.click').each(function() {
		$(this).click(function() { toggle(this.parentNode.parentNode, true); });
	});
	$('a[target].click').each(function() {
		$(this).click(function() { showContent(this.target) });
	});
	$('a.click.top').click(scrollToTop);
	
	$('#doc-content').children().hide();
	showContent(window.location.hash || '#welcome');
	
	resizeHeight();
	resizeWidth();
	}catch(e){console.log(e);}
});

function resizeHeight() { try{
	// Get the window height and always resize the doc-content and side-nav divs
	//var windowHeight = ($(window).height() - HEADER_HEIGHT);
	var windowHeight = (window.innerHeight - HEADER_HEIGHT);
	docContent.css({ height: windowHeight + 'px' });
	sideNav.css({ height: windowHeight + 'px' });
	
	// Also resize the 'devdoc-nav' div
	if (devdocNav.length) {
		devdocNav.css({ height: sideNav.css('height') });
	}
	
	// Hide the "Go to top" link if there's no vertical scroll
	showScrollToTop();
}catch(e){console.log(e);}}

function resizeWidth() { try{
	var windowWidth = $(window).width(), sideNavWidth = Math.min(parseInt(sideNav.css('width')), 300);
	sideNav.css({ width: sideNavWidth + 'px' });
	docContent.css({ marginLeft: sideNavWidth + 3 + 'px' });
	
	if (Browser.cls === 'ie' && Browser.version.indexOf('6') !== -1) {
		docContent.css({ width: windowWidth - sideNavWidth - 3 + 'px' }); // necessary in order to for scrollbars to be visible
	}
}catch(e){console.log(e);}}

function scrollToTop() { try{
	docContent[0].scrollTop = 0;
}catch(e){console.log(e);}}

function getSelector(hash) { try{
	var cls = hash.replace('#', '').split('-'), parent = '#devdoc-nav', i, elem;
	for (i = 0; i < cls.length; i++) {
		if (i !== 0) { parent = elem.parent(); }
		elem = $('.' + cls[i], parent);
	}
	return elem;
}catch(e){console.log(e);}}

function select(hash) { try{
	var li = getSelector(hash), ul = li.parent();
	if (hash.indexOf('-') !== -1 || ul.prev().hasClass('dialogs')) ul = ul.parent();
	if (ul.hasClass('toggle-list') && ul.hasClass('closed')) toggle(ul, true);
	$('.selected', '#devdoc-nav').removeClass('selected');
	li.addClass('selected');
}catch(e){console.log(e);}}

function showContent(hash) { try{
	var sub = hash.split('-'), browser = sub.length === 2 ? sub[1] : null, sel = $(browser ? sub[0] : hash);
	
	if (sel.length === 0) {
		hash = '#welcome';
		sel = $(hash);
	}
	
	if (!sel.is(':visible')) {
		$('#doc-content').children().hide();
		sel.show();
		showScrollToTop();
		scrollToTop();
	}
	
	select(hash);
	window.location.hash = hash;
	setTimeout(function() {
		window.location.hash = hash;
	}, 1);
	
	return false;
}catch(e){console.log(e);}}

function showScrollToTop() { try{
	var var1 = parseInt($('.jd-content:visible').parent().css('height')), var2 = parseInt(docContent.css('height')),
		show = var1 > var2;
	$('a.click.top').css({ display: show ? 'inline' : 'none' });
}catch(e){console.log(e);}}

function toggle(obj, slide) { try{
	var ul = $('ul:first', obj), li = ul.parent();
	if (li.hasClass('closed')) {
		if (slide) { ul.slideDown('fast'); }
		else { ul.show(); }
		li.removeClass('closed');
		li.addClass('open');
		$('.toggle-img', li).attr('title', 'Collapse');
	} else {
		ul.slideUp('fast');
		li.removeClass('open');
		li.addClass('closed');
		$('.toggle-img', li).attr('title', 'Expand');
	}
	return false;
}catch(e){console.log(e);}}


function onpageload() {
	
	var version = parseFloat($.browser.version);
	var isOpera = (navigator.userAgent.indexOf('OPR') > -1);
	var isEdge = (navigator.userAgent.indexOf('Edge') > -1);
	var isChrome = (navigator.userAgent.indexOf('Chrome') > -1) && (!isEdge) && (!isOpera);
	var isSafari = (navigator.userAgent.indexOf('Safari') > -1) && (!isChrome) && (!isEdge) && (!isOpera);
	var isOSX10_9 = (navigator.userAgent.indexOf('Mac OS X 10_9') > -1);
	
	if (navigator.platform.indexOf("Mac") > -1)
		$('.win-div').hide();
	else
		$('.osx-div').hide();		
	
	if (($.browser.mozilla) && (version < 40))
		$('.ff40').hide();
	else
		$('.ff39').hide();
	
	if ((isSafari) && ((version < 601) || (isOSX10_9)))
		$('.sf9').hide();
	else
		$('.sf8').hide();
}

window.onload = onpageload;
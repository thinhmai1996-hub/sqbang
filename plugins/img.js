// image v1.0.0
// Copyright by 小雷
// 
( function( $, window, document, undefined ) {

	"use strict";
		var pluginName = "img",
		wh = $(window).height(),
		ww = $(window).width(),
		defaults = {
			type: "cover",
			container: window,
			parallax: 1,
			src: null,
			fixed: false,
			offset: wh+500
		};
		function checkVhVw() {
			var $checker = $("<div id='checkVhVw'></div>").css({opacity: 0,position:"fixed",width: 0,height:"100vh"})
			$("body").append($checker)
			if($checker.height() == wh) return true;
			else return false;
		}
		// The actual plugin constructor
		function Img ( element, options ) {
			this.element = element;
			this.settings = $.extend( {}, defaults, options );
			this._defaults = defaults;
			this._name = pluginName;
			this.init();
		}

		// Avoid Img.prototype conflicts
		$.extend( Img.prototype, {
			init: function() {
				this.initImage();
				this.imgScroll();
			},
			
			addImage: function() {
				this.src = $(this.element).data("src") || this._defaults.src
				if(this.src && $(this.element).children("img").length == 0) {
					$(this.element).append("<img data-src='"+this.src+"'>")
				}else{
					this.src = $(this.element).children("img").data("src")
				}
			},
			initImage: function() {
				if($(this.element).hasClass("img-lazy")) return false;
				var type = $(this.element).data("type") || this._defaults.type;
				var fixed = $(this.element).data("fixed") || this._defaults.fixed;
				var parallax = $(this.element).data("parallax") || this._defaults.parallax;
				var self = this;
				var ew = $(this.element).width()
				this.addImage()
				var src = this.src
				var t = $(window).scrollTop()
				var o = $(this.element).offset().top
				var offset = this._defaults.offset
				var img = $(this.element).children("img")
				var imgContainer = $(this.element)
				if(t > o - offset || t+100 > $("body").outerHeight() - wh || $(this.element).data("load-now") == true) {

					imgContainer.addClass("img-lazy")
					if(type != "parallax"){
						var $img = $("<div class='img-bg img-"+type+"'></div>").css({backgroundImage:"url("+src+")"})
						imgContainer.addClass("img-"+type).append($img)
					}else{
						if(fixed && ww == ew){
							var height = (checkVhVw())?"100vh":wh
							var top = 0
						}else{
							var height = (100 + (100 * parallax)) + "%";
							var top = (-100 * parallax / 2)+"%"
						}
						var $parallax = $("<div class='parallax-bg img-cover'></div>").css({backgroundImage:"url("+src+")",height:height,top: top})
						imgContainer.addClass("img-"+type).append($parallax)
					}
					img.attr("src",src)
					img.on("load",function(){
						
						imgContainer.addClass("img-loaded")
						
					})
				}
			},
			imgScroll: function(){
				var self = this
				var el = $(this.element)
				$(window).on("scroll",function () {
					self.initImage()
					if(!el.children(".parallax-bg").is(":visible")) return false;
					self.getPosition()
				})
			},
			getPosition: function(){
				var el = $(this.element)
				var parallax = $(this.element).data("parallax") || this._defaults.parallax;
				var fixed = $(this.element).data("fixed") || this._defaults.fixed;
				var offset = el.offset().top
				var eh = el.outerHeight()
				var ew = $(this.element).width()
				var scroll = $(window).scrollTop()
				var m = $(window).height() * parallax / 2
				var min = scroll - m - 300
				var max = min + (wh * (1+parallax)) + m + 300
				if(min < offset && max > offset){
					if(fixed && ww == ew){
						var pos = -(offset-scroll)+"px"
					}else{
						var pos = (-(offset-(scroll+((wh-eh)/2))) / m * 100 * parallax  * (eh/wh/2/1.2))+"%"
					}
					if($("html").hasClass("ie9")){
						var translate3d = "translate(0,"+pos+")"
					}else{
						var translate3d = "translate3d(0,"+pos+",0)"
						el.children(".parallax-bg").css({
							"-webkit-transform":translate3d,
							"-moz-transform":translate3d,
							"-ms-transform":translate3d,
							"transform":translate3d,
						})
					}
					
					
				}
			}
		});


		// A really lightweight plugin wrapper around the constructor,
		// preventing against multiple instantiations
		$.fn[ pluginName ] = function( options ) {
			return this.each( function() {
				if ( !$.data( this, "plugin_" + pluginName ) ) {
					$.data( this, "plugin_" +
						pluginName, new Img( this, options ) );
				}
			} );
		};

} )( jQuery, window, document );
initImg = function(){
	$("[data-toggle='img']").img()
};

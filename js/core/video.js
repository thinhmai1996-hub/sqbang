(function(){
	var isMobile = function(){
	    if( navigator.userAgent.match(/Android/i)
	        || navigator.userAgent.match(/webOS/i)
	        || navigator.userAgent.match(/iPhone/i)
	        || navigator.userAgent.match(/iPad/i)
	        || navigator.userAgent.match(/iPod/i)
	        || navigator.userAgent.match(/BlackBerry/i)
	        || navigator.userAgent.match(/Windows Phone/i)
	    ){
	        return true;
	    }else {
	        return false;
	    }
	}
  $(".js-video").each(function(){
      var embed = $('<div class="ratio ratio-16-9"></div>');
      var t = $(this).wrap(embed);       
      var src=$(this).data("video");
      var type=$(this).data("video-type");
      switch(type){
          case'iframe':
              var code = '<iframe src="'+src+'" frameborder=0 allowfullscreen></iframe>';
              break;
          case 'embed':
              var code = '<embed src="'+src+'" allowFullScreen="true" quality="high" width="480" height="400" align="middle" allowScriptAccess="always" type="application/x-shockwave-flash"></embed>';
              break;
          case 'object':
              var code = '<embed src="'+src+'" allowFullScreen="true" quality="high" width="480" height="400" align="middle" allowScriptAccess="always" type="application/x-shockwave-flash"></embed>';
              break;
      }
      if(type!='iframe' && isMobile()){
          code = "<span class='embed-responsive-item text-danger' style='padding: 10px'> <i class='fa fa-exclamation-triangle'></i> 对不起！您看的视频不支持手机。请在PC端查看。</span>"
      }
      $(this).after(code);

  })
})();

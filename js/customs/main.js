var islogin = $('meta[name="islogin"]').length
function loading(state){
  if(state){
    $('#loading').modal({keyboard: false,backdrop: "static"})
  }else{
    $('#loading').modal("hide")
  }
}
if($("[data-toggle='gotop']").length > 0){
  $("[data-toggle='gotop']").click(function(e) {
    e.preventDefault()
    $("html,body").animate({
      scrollTop: 0
    }, 1000);
  });
}
$(window).on('scroll',function(e){
  var t = $(window).scrollTop()
  if(t > $(window).height() * 1.5){
    $('.gotop').addClass('active')
  }else{
    $('.gotop').removeClass('active')
  }
})
function bdmapInit(){
  $("[data-toggle='map']").each(function(){
    var id = $(this).attr("id")
    if(!id) {
      console.log("你还没输入地图ID！(Required ID)","color:red");
      return false;
    }
    var point = $(this).data("point")
    if(!point) {
      console.log("你还没输入标注点！(Required data-point)","color:red");
      return false;
    }
    point = point.split(",");
    var locationImg = $(this).data("location-image") || null;
    var zoom = $(this).data("zoom") || 18;
    var title = $(this).data("title") || "地址：";
    var content = $(this).data("content") || "...";
    var openInfo = $(this).data("info-show") || false;
    $(this).addClass("map-ready");

    var map = new BMap.Map(id);
		map.centerAndZoom(new BMap.Point(point[0],point[1]),zoom);
		map.addControl(new BMap.MapTypeControl({anchor: BMAP_ANCHOR_BOTTOM_RIGHT}));
		var opts = {type: BMAP_NAVIGATION_CONTROL_ZOOM}
		map.addControl(new BMap.NavigationControl(opts));
    var pt = new BMap.Point(point[0],point[1]);
    var info = { 
      title : title,  // 信息窗口标题
    }
    if(!locationImg){
      var marker = new BMap.Marker(pt);
      
    }else{
      var myIcon = new BMap.Icon(locationImg, new BMap.Size(48,92));
      var marker = new BMap.Marker(pt,{icon:myIcon});
      info.offset = new BMap.Size(0,-30);
    }
		
		
    
    var infoWindow = new BMap.InfoWindow(content,info);//设置标注
		marker.addEventListener("click", function(){this.openInfoWindow(infoWindow);});//设置标注
    map.addOverlay(marker);
    if(openInfo) {
      setTimeout(function(){
        marker.openInfoWindow(infoWindow)
      },1000)
    }
    
  })
}

$('[data-toggle="scroll"]').not('.init-scroll').each(function(){
  $(this).addClass('init-scroll')
  $(this).wrapInner('<div class="viewport"><div class="overview"></div></div>')
  $(this).append('<div class="scrollbar"><div class="track"><div class="thumb"></div></div></div>')
  var $scrollbar = $(this);
  $scrollbar.tinyscrollbar();
  $scrollbar.bind('move', function(){
    var scrollbarData = $scrollbar.data("plugin_tinyscrollbar")
    var threshold = 0.9
    var positionCurrent = scrollbarData.contentPosition + scrollbarData.viewportSize
    var positionEnd = scrollbarData.contentSize * threshold
    if (positionCurrent >= positionEnd) {
      $scrollbar.addClass('toend')
    }else{
      $scrollbar.removeClass('toend')
    }
  })
})
var tinysliderData = {}
$('.tinyslider').each(function(){
  var opt = $(this).data()
  var id = $(this).attr('id')
  opt.container = '#'+id
  console.log(opt)
  tinysliderData[id] = tns(opt)
})
$("[data-toggle='img']").img()
// $('body').append('<div id="ajax-loading" class="modal" data-backdrop="static" data-keyboard="false"><div class="modal-dialog modal-dialog-centered modal-sm"><div class="modal-content" style="background: transparent;box-shadow:none;border:0"><div class="modal-body text-center"><i class="spinner"></i></div></div></div></di>')
// $('body').append('<div class="d-none" id="ajax-loader"></div>')
// $( document ).ajaxStart(function() {
//   console.log('start')
//   $('#ajax-loader').removeClass('d-none')
// })
// $( document ).ajaxComplete(function() {
//   console.log('ajax end')
//   $('#ajax-loader').addClass('d-none')
// })
// $("[data-ajax-url]").each(function(){
   
//   var id = '#'+$(this).attr('id')
//   var url = $(this).data('ajax-url')
//   console.log(id,url)
//   $(id).load(url,function(){
//     $(this).trigger('ajax.loaded',function(){})
//   })
//   $(id).on('click','[data-toggle=ajaxlink]',function(e){
//     e.preventDefault()
//     var href = $(this).attr('href')
//     if(!href || href.match(/^#/g)) return false
//     $(id).load(href,function(){
//       $(this).trigger('ajaxlink.loaded',function(){})
//     })
//   })
//   $(id).on('ajax.loaded ajaxlink.loaded',function(){
//     $(this).find('[data-toggle="img"]').img()
//     var slider = $(this).find('.tinyslider')
//     var w = $(this).find('.tinyslider').width()
//     $(this).find('.tinyslider').css('max-width',w)
//     slider.each(function(){
//       var opt = $(this).data()
//       var id = $(this).attr('id')
//       opt.container = '#'+id
//       console.log(opt)
//       tinysliderData[id] = tns(opt)
//     })
//   })
//   $(id).on('click','.pages a',function(e){
//     e.preventDefault()
//     var href = $(this).attr('href')
//     if(!href || href.match(/^#/g)) return false
//     $(id).load(href,function(){
//       $(this).trigger('ajaxpage.loaded',function(){})
//     })
//   })
// })

// var headerID = $('.header').attr('id')
// var nav = $('.navbar .nav').html()
// var hotline = $('.header-hotline-block').html()
// var $usermega = $('.mega-dropdown')
// if($usermega.length) {
//   var usermega_html = $usermega.html()
//   $('body').append('<div id="modal-mobile-user-mega" class="modal modal-mobile-nav fade nav-mobile-user-mega"><div class="modal-dialog"><div class="modal-content">'+usermega_html+'</div></div></div>')
//   $('.user-info-trigger').on('click',function(e){
//     if($(window).width() < 768) {
//       e.preventDefault()
//       $('#modal-mobile-user-mega').modal('show')
//     }
//   })
// }
// $('body').append('<div id="modal-mobile-nav" class="modal modalNav-v5 fade nav-mobile-'+headerID+'"><div class="modal-dialog"><div class="modal-content"><ul class="nav nav-mobile-header-v5">'+nav+'</ul><button class="close" type="button" data-dismiss="modal" aria-label="Close"></button></div></div></div>')
// $('body').append('<div id="modal-mobile-hotline" class="modal modal-mobile-hotline fade hotline-mobile-'+headerID+'"><div class="modal-dialog"><div class="modal-content">'+hotline+'</div></div></div>')
// $('.modal').on('show.bs.modal',function(e){
//   var id = $(this).attr('id')
//   setTimeout(function() {
//     $('.modal-backdrop').last().addClass('backdrop-'+id)
//   }, 10);
// })
// $("#modal-mobile-nav").on('show.bs.modal',function(){
//   $('.navbar-toggle').addClass('active')
// })
// $("#modal-mobile-nav").on('hide.bs.modal',function(){
//   $('.navbar-toggle').removeClass('active')
// })
// if(!$('body').hasClass('index-page')) {
//   var holder = $('.header').clone()
//   holder.addClass('header-clone')
//   $('.header').addClass('header-init')
//   $('.header').after(holder)
//   $(window).on('scroll',function(){
//     var t = $(this).scrollTop()
//     if(t > 500) {
//       $('.header').addClass('header-active')
//     }else{
//       $('.header').removeClass('header-active')
//     }
//   })
// }

var loginFirst = function() {
  notify.error('请先登录',function(){
    window.location.href='/Login?jump='+encodeURIComponent(window.location.href)
  })
}
$(document).on('click','.collect-toggle',function(){
  if(!islogin) return loginFirst()
  var _this = $(this)
  var opt = _this.data()
  var _class = opt.class || 'collect-active'
  var data = {
    id: opt.id,
    table: opt.table
  }
  $.get('/Tools/collection',data,function(e){
    if(opt.count) {
      console.log(e)
      var num = _this.find(opt.count).text()
      if(e.code == 1) _this.find(opt.count).text(Number(num)+1)
      else _this.find(opt.count).text(Number(num)-1)
    }
  },'json')
  _this.toggleClass(_class)
})
$(".toggle-left").on('click', function(){
  $("#left-side").toggleClass('active')
})
$(".js-contact").on('click', function(){
  
  var target = $(this).data('target')
  if(islogin) {
    $(target).modal('show')
  }else{
    loginFirst()
  }
})
function updateCount(){
  var count, $_count = $('.account-box > a[data-msg-count]')
  count = $_count.data('msg-count')
  var result = Number(count)-1
  if(result > 0) {
    $_count.attr('data-msg-count',result)
  } else {
    $_count.removeAttr('data-msg-count')
  } 
  return result
}
$('.js-notify-msg').on('click', function(e){
  var ck = $(e.target).attr('href')
  var _this = $(this)
  console.log(_this.data())
  var unread, $_unread = _this.find('.unread')
  if(_this.hasClass('unread')){
    var $_dropdown = _this.closest('.account-box').children('a')
    _this.removeClass('unread')
    unread = true
  }else if($_unread.length) {
    $_unread.removeClass('unread')
    unread = true
  }
  if(unread){
    var result = updateCount()
    if($('.syssmslist').length) {
      var $_active = _this.closest('.user-content__body').find('.user-tabs .active .notify-num')
      var count = $_active.text()
      var result = Number(count)-1
      if(result > 0) {
        $_active.text(result)
      } else {
        $_active.remove()
      } 
    }
    
    var data = {
      id: _this.data('id')
    }
    $.post('/Member/sms/read',data)
    var count = $(e.relatedTarget).data('msg-count')
  }
  $("#modal-msg").modal('show',this)
})
$("#modal-msg").on('show.bs.modal', function(e){
  console.log(e)
  var content = $(e.relatedTarget).data('content') || $(e.relatedTarget).find('.title').html()
  $(this).find('.modal-body').html(content)
  
})

$(document).ready(function(){
  $("#footer").before('<div class="body-padding"></div>')
  // if($('.banner').length > 0){
  //   $(".header").before('<div class="header-holder"></div>')
  //   $('.main-bg').css('padding-top',0)
  // }
  // $(".header").before('<div class="header-holder"></div>')
  datafoot()
  copyrightPadding()
  changeFooter()
  // changeHeader()
  // affixBottom()
  // $('.nav-header-v3 li.dropdown').on('mouseenter', function(){
  //   var height = $(this).find('.dropdown-box').outerHeight(true)
  //   if($(window).width() > 768){
  //     $('.header-hv-bg').css({'height': height, "opacity": 1})
  //     $('.nav-arrow').addClass('active')
  //   }
  // })
  // $('.nav-header-v3 li.dropdown').on('mouseleave', function(){
  //   if($(window).width() > 768){
  //     $('.header-hv-bg').css({'height': 0, "opacity": 0})
  //     $('.nav-arrow').removeClass('active')
  //   }
  // })
})
$(window).resize(function () {
  copyrightPadding()
  changeFooter()
  // changeHeader()
})

$(window).on('load', function(e){
  $('#footer').addClass('full-load');
  changeFooter()
})

// body padding-bottom
function changeFooter() {
  var footerHeight = $("#footer.full-load").outerHeight(true)
	$(".body-padding").css('height', footerHeight)
}
// header holder
// function changeHeader() {
// 	var headerHeight = $(".header").outerHeight(true)
//   $(".header-holder").css('height', headerHeight)
// }

// footer element count
function datafoot() {
	var lia = $('.foot-tool li').length;
	$('.foot-tool').attr('data-foot', lia);
}

//copyright padding bottom
function copyrightPadding() {
  if($(window).width() < 767) {
    // $('.copyright').css('padding-bottom', '10px')
    var ft_tool_h = $('.foot-tool').outerHeight(true)
    $('.footer .copyright').css('padding-bottom', ft_tool_h + 20)
  }else{
    $('.footer .copyright').removeAttr('style')
  }
}
$(window).scroll(function() {
  t = $(window).scrollTop();
  if( t > 200) {
    $(".gotop").addClass("active");
    if($(window).width()<768)
      $("#right-tool").addClass("active");
    else
      $("#right-tool").removeClass("active");
  }else{
    $(".gotop").removeClass("active");
    $("#right-tool").removeClass("active");
  }
});

$('.bdshare').html('')
$('.bdshare').share({sites:['wechat','weibo','qq','qzone'],image:$(".news-detail-content img:first").prop("src")||""})

$(function(){
  var linkList = $('.page-tit .link-list').html();
  var chosenTit = $('.page-tit .link-list li:nth-child(1) a').text();

  var template = '<div class="dropdown show link-list-mobile"><a class="link-list-chosen" href="javascript:;" role="button" id="linkListMobile" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span>%chosenTit%</span><i class="iconfont icon-arrowdown"></i></a><div class="dropdown-menu dropdown-menu-right" aria-labelledby="linkListMobile"><ul class="dropdown-menu-list">%linkList%</ul></div></div>';

  template = template.replace('%chosenTit%', chosenTit).replace('%linkList%', linkList);
  $('#mobileLinkList').append(template);
})
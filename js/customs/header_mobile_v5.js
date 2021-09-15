// var drop = $('.nav-mobile-header-v5 .drop')
// $.each(drop, function(e){
//   $(this).prepend("<a href='javascript:;' class='btn-drop'></a>")
// })
// $(document).on('click', '.btn-drop', function(){
//   $(this).parent().siblings('li').find('.btn-drop.active').click()
//   var drop_menu = $(this).siblings('.drop-menu')
//   var li_h = drop_menu.prop('scrollHeight')
//   $(this).toggleClass('active')
//   drop_menu.toggleClass('active')
//   drop_menu.css("height", li_h+'px')
//   if(!$(this).hasClass('active')){
//     setTimeout(function(){
//       drop_menu.css("height", 0)
//     },1)
//   }
// })
// $('.drop-menu').on('transitionend webkitTransitionEnd oTransitionEnd', function () {
//   if($(this).hasClass('active')){
//     $(this).css("height", "auto")
//   }else{
//     $(this).find('.btn-drop.active').click()
//   }
// });
// $('#modal-mobile-nav').on('hide.bs.modal', function(e) {
//   $(this).find('.btn-drop.active').click();
// });
// $(window).on('resize',function(){
//   $('#modal-mobile-nav').modal('hide')
// })

function changeHeader() {
  var headerHeight = $('.header-custom').outerHeight();
  var topMenu = $('.header-top').outerHeight();
  if($('.idx-banner').length == 0) {
    $('.header-holder').css('height', headerHeight);
  } else {
    $(".header-custom").css({'top': topMenu, 'bottom': 'auto'}).addClass('header-index')
  }
}
$(window).on("scroll", function(){
  var t = $(window).scrollTop()
  if( t > 150 ){
    $(".header-custom").addClass("header-active")
  }else{
    $(".header-custom").removeClass("header-active")
  }
})
$(window).on('load',function(){
  var wrap = $('.header-wrap').outerWidth()
  var sub = $('.nav-header-custom .drop-level-2 .drop-menu')
  var lm = $(window).width()
  sub.each(function(){
    var r_sub = $(this).offset().left + $(this).outerWidth()
    var cr_l = lm - r_sub
    if(r_sub > $(window).width())
      $(this).addClass('left-side')
    //- if (cr_l < 0)
    //-   $(this).css("left",cr_l+'px')
  })
})

var el = {
  headerClass: $('.header').data('mobile') ? $('.header').data('mobile') : $('.header').attr('id'),
  mobileSearch: $('.header').data('search') ? $('.header-search').html() : '',
  nav: $('.header .nav').html(),
}

$(".header-custom").before("<div class='header-holder'></div>")
changeHeader()
modalMobile();
controlModal();

$(window).on('resize', function(e){
  if($(window).width() > 992) {
    $('.modal').modal('hide')
  }
  changeHeader()
})

function modalMobile() {
  
  var navContent, hotlineContent, dropMenuList;
  
  navContent = '<div id="modal-mobile-nav" class="modal modal-mobile modal-mobile-nav fade nav-mobile-%headerClass%" role="dialog" aria-hidden="true"><div class="modal-dialog" role="document"><div class="modal-content"><div class="mobile-search">%mobileSearch%</div><ul class="nav">%nav%</ul></div></div></div>';
  navContent = navContent.replace('%headerClass%', el.headerClass).replace('%nav%', el.nav).replace('%mobileSearch%', el.mobileSearch);
  
  $('body').append(navContent);

  dropMenuList = $('#modal-mobile-nav .drop');
  dropMenuList.each(function(e) {
    $(this).prepend('<a class="btn-drop" href="javascript:;"></a>');
  })
}

function controlModal() {
  $('#modal-mobile-nav').on('show.bs.modal', function(e) {
    var id = $('.header').data('mobile') ? $('.header').data('mobile') : $('.header').attr('id');
    $('body').addClass('modal-open-'+id);
  });

  $('#modal-mobile-nav').on('hide.bs.modal', function(e) {
    var id = $('.header').data('mobile') ? $('.header').data('mobile') : $('.header').attr('id');
    $('body').removeClass('modal-open-'+id);
    $(this).find('.btn-drop.active').click();
    $('.navbar-toggle').removeClass('active');
  });

  $('.modal').on('show.bs.modal',function(e){
    var id = $(this).attr('id');
    setTimeout(function() {
    
      $('.modal-backdrop').last().addClass('backdrop-'+id);
    }, 10);
  });

  $(document).on("click",".modal-backdrop", function() {
    $('.modal-mobile-nav').modal('hide');
  })

  $('.modal-mobile-nav').on('click', '.btn-drop', function(e) {
    var parentEl, dropMenu, dropMenuHeight;

    parentEl = $(this).parent();
    dropMenu = $(this).siblings('.drop-menu');
    dropMenuHeight = dropMenu.prop('scrollHeight');

    parentEl.siblings('li').find('.btn-drop.active').click();
  
    $(this).toggleClass('active')
    // parentEl.toggleClass('active');
    dropMenu.toggleClass('active');
    dropMenu.css('height', dropMenuHeight+'px');
    if(!$(this).hasClass('active')) {
      setTimeout(function() {
        dropMenu.css('height', 0);
      }, 1)
    }
  })
  
  $('.drop-menu').on('transitionend webkitTransitionEnd oTransitionEnd', function(e) {
    if($(this).hasClass('active')) {
      $(this).css('height', 'auto');
    } else {
      $(this).find('.btn-drop.active').click()
    }
  })
}

$('.search-grp > .icon').on('click',function(){
  $(this).find('i').toggleClass('active')
  $('.header-search').toggleClass('active')
})
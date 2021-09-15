$(document).ready(() => {
    var u = $('.header_slide_inner')
    var d = $('.header_slide')
    function p() {
        $('body').removeClass('openHeaderSlide'), u.hide().removeClass('toggle'), d.slideUp();
    }
    $('.header_menu').on('click', function(e){
        e.preventDefault()
        $('body').hasClass('openHeaderSlide') ? p() : ($('body').addClass('openHeaderSlide'),
        u.show().addClass('toggle'),
        d.slideDown())
    })

    $('.header-v5').on('click', '.search-toggle', function(e) {
        var selector = $(this).data('selector')
        $(selector).toggleClass('show').find('.search-input').focus()
        $(this).toggleClass('active')
        e.preventDefault()
    })
});




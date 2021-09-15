// ajaxPagination v1.0.0
// Copyright by 小雷
(function ( $ ) {
    $.fn.ajaxPagination = function( options ) {
    
        if(this.length == 0) return false;
        var op = $.extend({
            spinner: "<i class='ajax-spinner'></i>",
            loadingText: "加载中...",
            completeText: "无更多内容",
            button: false,
            scrollContainer: false,
            offset: 200,
            afterLoad: function(){
    
            }
    
        }, options );
    
        var loadingText = op.spinner+(this.data("loading-text")?this.data("loading-text"):op.loadingText)
        var completeText = (this.data("complete-text"))?this.data("complete-text"):op.completeText
        var button = (this.data("button"))?this.data("button"):op.button
        var offset = (this.data("offset"))?this.data("offset"):op.offset
        if($("#ajax-tmp").length == 0) $("body").append($("<div id='ajax-tmp'></div>").hide())
        var total = this.data("total")
        var $list = this
        var id = $(this).attr("id")
        if(!button) $list.after("<div class='ajax-pagination'><div class='ajax-load-container'></div></div>");
        if(!button){
            $load = $list.next(".ajax-pagination")
        } else {
            $load = $(button)
            var button_text = $load.html()
            $load.addClass("ajax-pagination ajax-pagination-btn").html("<span class='ajax-load-container'></span><span class='ajax-load-btn-txt'>"+button_text+"</span>")
        }
        
        $loadContainer = $load.find(".ajax-load-container")
        // function lazyInit(){
        //     lazy = new LazyLoad({
        //         elements_selector: ".masonry-lazy",
        //         callback_set: function(e){
        //             $(e).parent().addClass("masonry-lazy-loading")
        //         },
        //         callback_load: function(e){
        //             $(e).parent().removeClass("masonry-lazy-loading")
        //             $list.masonry("layout")
        //         },callback_error: function(e){
        //             $(e).parent().removeClass("masonry-lazy-loading").addClass("masonry-lazy-error")
        //             $list.masonry("layout")
        //         }
        //         // class_loaded: ".masonry-lazy-loaded",
        //         // class_loading: ".masonry-lazy-loading",
        //         // class_loading: ".masonry-lazy-error",
        //     })
        // }
        if($list.hasClass("masonry-list")){
            $list.masonry({itemSelector: '.masonry-item'})
            $('.masonry-lazy').img()
        }
        function loadAjax(url){
            if(!$list.data("next-url")) return false;
            if($list.data("back") == true){
                var tgurl = $list.data("next-url")
                var tit = $("title").text()
                window.history.pushState({url: tgurl+"&load=1"}, tit, tgurl+"&load=1");
            }
            $("#ajax-tmp").load(url+" #"+id, function (data) {
                var html = $("#ajax-tmp").find("#"+id).html()
                var url = $("#ajax-tmp").find("#"+id).data("next-url")
                if($list.hasClass("masonry-list")){
                    var $items = $(html)
                    $list.append($items).masonry( 'appended', $items );
                    $('.masonry-lazy').not('.img-lazy').img()
                }else{
                    $list.append(html)
                    if($list.data("lazy") == true) $list.find("[data-toggle='img']").img()
                }
                $list.data("next-url",url)
                $load.removeClass("ajax-loading")
                if($.isFunction(op.afterLoad)) op.afterLoad
                isComplete();
            })
        }
        console.log(button)
        function isComplete(){
            var count = $list.children().length
            console.log(count+"---"+total)
            if(count >= total){
                $load.addClass("ajax-complete")
                $loadContainer.html(completeText.replace("%total%",total))
                return true
            }else{
                return false
            }
        }
        
        if(!button){
            var scrollContainer = (!op.scrollContainer)?window:op.scrollContainer
            function scrollUpdate(self){
                if(isComplete()) return false
                if(!$list.data("next-url")) return false;
                var t = self.scrollTop()
                var o = $load.offset().top
                if($load.hasClass("ajax-loading") || $load.hasClass("ajax-complete")) return;
                if(t > o - offset - $(window).height()){
                    var url = $list.data("next-url")
                    console.log("load")
                    $load.addClass("ajax-loading")
                    $loadContainer.html(loadingText)
                    loadAjax(url)
                }
            }
            $(scrollContainer).on("scroll",function () {
                var self = $(this)
                scrollUpdate(self)
            })
            scrollUpdate($(scrollContainer))
        }else{
            $load.on("click",function (e) {
                e.preventDefault();
                if(isComplete()) return false
                
                var url = $list.data("next-url")
                console.log("load")
                $load.addClass("ajax-loading")
                $loadContainer.html(loadingText)
                loadAjax(url)
            })
        }
        isComplete();
        return this;
    };
    $("[data-toggle='ajaxPagination']").ajaxPagination();
}(jQuery));

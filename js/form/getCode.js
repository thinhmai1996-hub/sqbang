// ajaxPagination v1.0.0
// Copyright by 小雷
(function ( $ ) {
  $.fn.getCode = function( options ) {
    var btn = this;
    var $data = this.data();
    var opt = $.extend({
      targetMobile: $data.targetMobile || "",
      //targetCode: $data.targetCode || "",
      time: $data.time || 60,
      url: $data.url || "",
      captcha: $data.captcha || false,
      captchaImg: $data.captchaImg || "",
      captchaParam: $data.captchaParam || "code",
    }, options );
    
    $(opt.targetMobile).on("input keyup",function() {
      var mobile = $(this).val()
      if(/^0?1[34578]\d{9}$/.test(mobile)){
        btn.prop("disabled",false)
      }else{
        btn.prop("disabled",true)
      }
    })

    function getCode(data,dialog){
      $.ajax({
        url: opt.url,
        data: data,
        type: "POST",
        dataType: "json",
        error: function(r,s){
          var error = "<b>"+r.status+"</b> "+r.statusText;
          notify.error(error)
        },
        success: function (e) {
          if(e.code == 1){
            var success = notify.alert('<div class="alert alert-success mb-0" role="alert">'+e.msg+'</div>', function(){})
            setTimeout(function () {
              success.modal('hide')
            },2000)
            var w = btn.outerWidth()
            var title = btn.html()
            btn.css("width",w)
            btn.prop("disabled", true)
            setTimeout(function () {
              dialog.modal("hide")
              var time = opt.time
              var wait = setInterval(function () {
                btn.html(time);
                if(time == 0){
                  clearInterval(wait);
                  btn.prop("disabled", false)
                  btn.html(title)
                }
                time--;
              },1000)
            },800)
          }else{
            var alert = notify.alert('<div class="alert alert-danger mb-0" role="alert">'+e.msg+'</div>', function(){
              if(e.code == 2){
                // var src = $(".notify-captcha .captcha-img").attr("src")
                // $(".notify-captcha .captcha-img").removeAttr("src")
                $(".notify-captcha .form-group").addClass("has-error")
                $(".notify-captcha input").val("")
                setTimeout(function() {
                  $(".notify-captcha input").focus()
                }, 500);
                
              }
            })
          }
        }
      })
    }

    btn.on("click",function(){
      var captchaValid = false
      if(opt.captcha == true){
        var dialog = notify.dialog({
          message: 
            '<h4 class="text-center">图片验证码</h4>'+
            '<p class="notify-desc text-center">请输入图片验证码，获取手机验证码。</p>'+
            '<div class="form-group row mb-0">'+
              '<div class="col">'+
                '<input class="form-control captcha-input" type="text" name="captcha" placeholder="请输入验证码" maxlength="4" required>'+
              '</div>'+
              '<div class="col-auto pl-0"><img data-toggle="captcha" data-src="'+opt.captchaImg+'" src="'+opt.captchaImg+'" height="35" width="100"></div>'+
            '</div>'
          ,
          closeButton: false,
          onEscape: false,
          className:"notify-captcha",
          buttons: {
            
            sendCode: {
              label: "发送验证码",
              className: 'btn-send btn-ok btn-primary',
              diasbled: true,
              
              callback: function(e){
                if(!captchaValid) {
                  $(".notify-captcha input").focus()
                  $(".notify-captcha .form-group").addClass("has-error")
                  return false;
                }
                var codeData = {}
                if(opt.targetMobile) codeData[$(opt.targetMobile).attr("name")] = $(opt.targetMobile).val()
                codeData[opt.captchaParam] = $(".notify-captcha input").val()
                getCode(codeData,dialog)
                
                return false; 
              }
            },
            cancel: {
              label: "取消",
              className: 'btn-cancel btn-default',
              callback: function(){
                  
              }
            },
          }
        })
      } else {
        var codeData = {}
        codeData[$(opt.targetMobile).attr("name")] = $(opt.targetMobile).val()
        getCode(codeData)
      }
      // $(".notify-captcha .captcha-img").on("click",function () {
      //   var captcha = $(this).find("img")
      //   var src = captcha.attr("src")
      //   captcha.removeAttr("src").attr("src",src)
      // })
      $(".notify-captcha .captcha-input").on("input keyup",function () {
        var v = $(this).val()
        if(v.length == 4){
          $(this).closest(".form-group").removeClass("has-error")
          captchaValid = true
        }else{
          $(this).closest(".form-group").addClass("has-error")
          captchaValid = false
        }
      })
    })
  };
  if($("[data-toggle='getCode']").length > 0) $("[data-toggle='getCode']").getCode();
}(jQuery));
      
if($.validator){
  $.validator.addMethod("tel", function(value, element) {
    value = value.split('-').join('');
        value = value.split(' ').join('');
    return this.optional(element) || /^(\+86)?0?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/.test(value) || /^([0-9]{3,4})?[0-9]{7,8}$/.test(value) ||  /^(\+86)?(400)[0-9]{7}$/.test(value) || /^(\+86)([0-9]{2,3})?[0-9]{7,8}$/.test(value);
  }, "电话格式不对");
  $.validator.addMethod("mobile", function(value, element) {
    return this.optional(element) || /^0?1[3456789]\d{9}$/.test(value);
  }, "手机号格式有误")
  $.validator.addMethod("hanzi", function(value, element) {
    return this.optional(element) || /^[\u4e00-\u9fa5]+$/.test(value);
  }, "您输入的字符串有非汉字字符")
  $.validator.addMethod("cardid", function(value, element) {
    return this.optional(element) || /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/.test(value);
  }, "请填写正确的身份证")
  $.validator.addMethod("qqnumber", function(value, element) {
    return this.optional(element) || /^[1-9]\d{4,11}$/i.test(value);
  }, "QQ号格式不对");
  $.validator.addClassRules({
    mobile: { mobile: true },
    tel: { tel: true },
    qqnumber: { qqnumber: true },
    cardid: { cardid: true },
    hanzi: { hanzi: true },
  });
}
$.extend($.validator.messages, {
  required: "必填字段",
  remote: "请修正该字段",
  email: "请输入正确格式的电子邮件",
  url: "请输入合法的网址",
  date: "请输入合法的日期",
  dateISO: "请输入合法的日期 (ISO).",
  number: "请输入合法的数字",
  digits: "只能输入整数",
  creditcard: "请输入合法的信用卡号",
  equalTo: "请再次输入相同的值",
  accept: "请输入拥有合法后缀名的字符串",
  maxlength: $.validator.format("长度最多是{0}的字符串"),
  minlength: $.validator.format("长度最少是{0}的字符串"),
  rangelength: $.validator.format("长度介于{0}和{1}之间的字符串"),
  range: $.validator.format("请输入一个介于{0}和{1}之间的值"),
  max: $.validator.format("请输入一个最大为{0}的值"),
  min: $.validator.format("请输入一个最小为{0}的值"),
});
window.alertText = {
  error: function(text){
    return '<div class="alert alert-danger mb-0" role="alert">'+text+'</div>';
  },
  success: function(text){
    return '<div class="alert alert-success mb-0" role="alert">'+text+'</div>';
  },
  warning: function(text){
    return '<div class="alert alert-warning mb-0" role="alert">'+text+'</div>';
  }
}
window.notify.error = function(msg,callback){
  var msg = alertText.error(msg)
  notify.alert({className: 'noitfy-error', message:msg,callback:function(){
    if($.isFunction(callback)) callback.call(this)
  }})
}
window.notify.success = function(msg,callback){
  var msg = alertText.success(msg)
  notify.alert({className: 'noitfy-success', message:msg,callback:function(){
    if($.isFunction(callback)) callback.call(this)
  }})
}
$(function(){
  $("[data-toggle='validate'],[data-toggle='ajaxForm']").each(function(){
    var myForm = $(this)
    myForm.validate({
      errorElement: 'span', //default input error message container
      errorClass: 'msg-error', // default input error message class
      focusInvalid: false, // do not focus the last invalid input
      ignore: "", // validate all fields including form hidden input
      errorPlacement: function (error, element) { // render error placement for each input type
        var icon = $(element).closest('.form-group').find(".help-block").text(error.text());
        
        // if($(element).attr("id")=="phone"){
        //   $("#getcode").prop("disabled",true);
        // }
      },

      invalidHandler: function (event, validator) { //display error alert on form submit   
          // success.hide();
          // error.show();
          myForm.data("validate",false);
          console.log("error")
      },
      highlight: function (element) { // hightlight error inputs
        $(element)
              .closest('.form-group').removeClass("has-success").addClass('has-error'); // set error class to the control group
      },

      unhighlight: function (element) { // revert the change done by hightlight
          $(element)
              .closest('.form-group').removeClass('has-error'); // set error class to the control group
      },

      success: function (label, element) {
          $(element)
              .closest('.form-group').removeClass('has-error').addClass("has-success"); // set success class to the control group
          var icon = $(element).closest('.form-group').find(".help-block").text("");             
          // if($(element).attr("id")=="phone"){
          //   $("#getcode").prop("disabled",false);
          // }
      },

      submitHandler: function (form) {
          // success.show();
          // error.hide();
          myForm.data("validate", true);
          if (myForm.data("toggle") != "ajaxForm") {
              form[0].submit(); // submit the form
          }
      }
    })
    
  })
  
  // ajax Submit
  function autoRedirect(url,time,modal){
    var i = time
    var auto = setInterval(function(){
      console.log(i)
      i--
      if(url != "close") modal.find(".notify-auto strong").text(i)
      if(i == 1 && url != "close") window.location.href = url;
      if(url == "close" && i == 1) modal.modal('hide');
      if(i == 0) clearInterval(auto);
      
    },1000)
  }

  $(document).on("click","[data-toggle='captcha']",function(){
    var id = $(this).data("target")
    var d = new Date()
    var str = d.getTime()
    console.log("click")
    if(id){
      var captcha = $(id)
    }else{
      var captcha = $(this)
    }
    
    var src = captcha.attr("src")
    var srcSplit = src.split("?")
    if(srcSplit.length > 1){
      src = srcSplit[0]
    }
    captcha.attr("src",src+"?v"+str)
  })

  $("[data-confirm]").on("click",function(){
    var msg = $(this).data("msg")
    var btn = $(this)
    var confirm = $(this).data("confirm")
    notify.confirm(alertText.warning(msg), function (result) {
      if($.isFunction(window[confirm])) window[confirm](btn,result)
    })
  })
  $("[data-toggle='ajaxForm']").each(function(){
    var formHtml = $(this).data("formHTML", $(this).html())
    var form = $(this)
    $(this).on("submit",function(e){
      e.preventDefault()
      var method = $(this).attr("method") || "POST"
      var valid = $(this).data("validate")
      var alert = $(this).data("alert") || true
      var $btn = $(this).find("[type='submit']")
      var callback = $(this).data("callback")
      var autoRedirectMsg = ""
      if(valid) {
        btnState($btn,true)
        var mform = $(this)
        $(this).ajaxSubmit({
          type: method,
          dataType: "json",
          error: function(r,s){
            btnState($btn,false)
            var error = "<b>"+r.status+"</b> "+r.statusText;
            notify.error(error);
          },
          success: function(r,s,a){
            var captcha = mform.find("[data-toggle='captcha']")
            if(captcha.length) captcha.trigger("click")
            btnState($btn,false)
            if(!$.isFunction(window[callback])) {
              callback = false
            }else{
              window[callback](r,s,a)
              return false;
            }
            if(r.autoRedirect && r.redirectUrl){
              autoRedirectMsg = "<div class='mt-3 notify-auto msg'><strong>"+r.autoRedirect+"</strong>秒后自动跳转。</div>"
            }
            var notifyCallback = function(){
              if(r.redirectUrl){
                window.location.href = r.redirectUrl
              }else{
                form.html(form.data("formHTML"))
              }
            }
            if(alert === true && callback == false){
              if(r.code === 1){

                var modal = notify.alert({
                  message: alertText.success(r.msg)+autoRedirectMsg,
                  className: 'noitfy-success',
                  callback: notifyCallback
                })
              }else{
                var modal = notify.alert({
                  message: alertText.error(r.msg)+autoRedirectMsg,
                  className: 'noitfy-error',
                })
              }
            }
            modal.one("shown.bs.modal",function(){
              if(r.autoRedirect && r.redirectUrl){
                autoRedirect(r.redirectUrl,r.autoRedirect,modal)
              }
              if(r.autoClose) autoRedirect("close",r.autoClose,modal)
            })
          }
        })
      }
      
    })
  })
})
function btnState(el,loading){
  if(loading == true){
    var loadingTxt = el.data("loading-text") || "<i class='spinner spinner-sm'></i> 提交中..."
    el.attr("data-title",el.html())
    el.prop("disabled",true).html(loadingTxt)
  }else{
    el.prop("disabled",false).html(el.data("title"))
  }
}

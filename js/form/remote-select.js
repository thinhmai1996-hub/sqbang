(function ( $ ) {
  $.fn.remoteSelect = function( options ) {
    if(this.length == 0) return false;
    var op = $.extend({
      url: false,
      dependTargets: false,
      dependParamsName: false,
      jsSelect: false,
      tokens:false,
      valueKey: false,
      name:false,
    }, options );

    function updateSelect(data){
      if(typeof data != "object") return false
      $.each(data,function(k,v){
        var tokens = op.tokens
        var value = op.valueKey
        var name = op.name
        console.log(value)
        $.each(v,function (kk,vv) {
          tokens = tokens.replace("["+kk+"]",vv)
          value = value.replace("["+kk+"]",vv)
          name = name.replace("["+kk+"]",vv)
        })
        var selected = $select.data('value')
        $select.append("<option data-tokens='"+tokens.toLowerCase()+"' value='"+value+"'>"+name+"</option>")
        if(k+1 == data.length){
          setTimeout(function(){
            $select.selectpicker("refresh")
            $select.selectpicker("val",selected)
            $loader.addClass("d-none")
          }, 20);
        }
      })
    }

    if(op.jsSelect && $.fn.selectpicker) {
      var $select = this
      var title = this.attr("title")
      var $loader = $("<div class='js-select-loader'><i class='spinner'></i></div>")
      if($select.next(".js-select-loader").length == 0) $select.after($loader)
      console.log(op.dependTargets)
      if(!op.dependTargets){
        console.log(op)
        $.ajax({
          url: op.url,
          type: "GET",
          dataType: "json",
          success: function (data) {
            updateSelect(data)
          }
        })
      }else{
        var depend = op.dependTargets.split(",")
        console.log(depend)
        var paramsName = op.dependParamsName.split(",")
        var dataParams = {}
        $loader.addClass("d-none")
        $.each(depend,function(k,v){
          $(v).on("change",function(){
            var vv = $(this).val()
            if(!vv) return false
            dataParams[paramsName[k]] = vv
            $loader.removeClass("d-none")
            $select.html("")
            $.ajax({
              url: op.url,
              type: "GET",
              data: dataParams,
              success: function (data) {
                updateSelect(data)
              }
            })
          }).change()
        })
        
      }
    }else{
      console.log("请添加js-select plugin后再试试")
    }
  }
}(jQuery));
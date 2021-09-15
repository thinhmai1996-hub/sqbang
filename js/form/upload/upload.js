// 上传代码
var uploadUrl = '/Files/upload'
var oss_sig = '/Addons/AliyunOSS/AliyunOSS/oss_sig/'
var oss_host = 'http://bbctopcs.oss-cn-beijing.aliyuncs.com'
var oss_sign_data = {}
var signing = false
var now = false
var expire = 0
var delay = 10
var resend
function send_request(name,cb)
{
  console.log('send request')
  $("#ajax-loader").removeClass('d-none')
  var now = Date.parse(new Date()) / 1000;
  if(signing) {
    console.log('signing')
    getCacheRequest(name,cb)
    return false
  }else if(oss_sign_data[name]){
    if(oss_sign_data[name].expire && oss_sign_data[name].expire > now){
      console.log('oss_sig_cache')
      getCacheRequest(name,cb)
      return false
    }
    
  }
  signing = true
  console.log('oss_sig')
  $.ajax({
    url: oss_sig+'?paramName='+name,
    type: 'post',
    dataType: 'json',
    global: false,
    success: function(e) {
      signing = false
      if(e.code == 1) {
        oss_sign_data[name] = e.result
        cb(e.result)
      }else{
        notify.error('OSS签名错误！')
      }
    }
  })
}

function getCacheRequest (name,cb) {
  var itv
  itv = setInterval(function() {
    var now = Date.parse(new Date()) / 1000;
    if(oss_sign_data[name].expire && oss_sign_data[name].expire > now) {
      clearInterval(itv)
      cb(oss_sign_data[name])
    }else if(oss_sign_data[name].expire){
      oss_sign_data[name] = false
      if(!signing) send_request(name,cb)
    }
  }, 10);
}
function saveUpImage (name, target) {
  setTimeout(function(){
    if (typeof(Storage) !== "undefined") {
      var sname = window.location.href
      var data = {}
      data[name] = $(target).html()
      data = JSON.stringify(data)
      localStorage.setItem(sname, data);
    }
  }, 200);
}
function createFileValue(opt) {
  // data.files = []
  for (var k in opt.files) {
    console.log(opt.files[k])
    opt.files[k].value = opt.files[k].id
    opt.files[k].url = opt.files[k].filepath
    opt.files[k].paramName = opt.name
    opt.files[k].deleteType = 'POST'
    opt.files[k].deleteUrl = '/Files/delete?id='+opt.files[k].id
  }
  return tmpl(opt.tpl,opt)
}

function random_string(len) {
　　len = len || 32;
　　var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';   
　　var maxPos = chars.length;
　　var pwd = '';
　　for (i = 0; i < len; i++) {
  　　pwd += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}

function get_suffix(filename) {
  pos = filename.lastIndexOf('.')
  suffix = ''
  if (pos != -1) {
      suffix = filename.substring(pos)
  }
  return suffix;
}

var uploadedFiles = [];
function initUpImage () {
  if($('[data-toggle="upImage"]').length > 0){
    $('[data-toggle="upImage"]').not('.init-upimage').each(function(){
      $(this).addClass('init-upimage')
      var s = $(this)
      var parent = s.parent()
      var count = $(this).data('count-target')
      var sortable = $(this).data('sortable') || true
      var hidden = parent.find('input[type="hidden"]')
      var required = hidden.prop('required')
      var edittitle = $(this).data('edit-title')
      var url = $(this).data('url') || uploadUrl
      var target = $(this).data('target')
      var name = $(this).data('name')
      var width = $(this).data('width') || 78
      var height = $(this).data('height') || 78
      var multiple = $(this).prop('multiple')
      var max = $(this).data('max')
      var maxMessage = $(this).data('message') || '已超过最大文件数'
      var error = 0
      var uploadTpl = $(this).data('upload-tpl')
      var downloadTpl = $(this).data('download-tpl')
      var autoUpload = $(this).data('auto-upload') || true
      var model_id = $(this).data('model-id')
      var type = $(this).data('upload-type') || 1
      // if (typeof(Storage) !== "undefined" && !multiple) {
      //   var sname = window.location.href
      //   // localStorage.removeItem(sname);
      //   var val = localStorage.getItem(sname);
      //   if(val) {
      //     val = JSON.parse(val)
      //     $(target).html(val[name])
      //   } 
      // }
      var uploadTemplateId = uploadTpl || 'template-upload'
      var downloadTemplateId = downloadTpl || 'template-download'
      // if(sortable){
      //   uploadTemplateId = uploadTpl || 'template-upload2'
      //   downloadTemplateId = downloadTpl || 'template-download2'
      // }
      function checkImage(hidden){
        console.log(hidden);
        if(count) {
          $(count).text($(target).children().not('.order-last').length)
        }
        if(!required) return false
        if($(target).find('.img-preview').length>0){
          hidden.removeAttr('required')
        }else{
          hidden.attr('required',true)
        }
        
      }
      setTimeout(function(){
        checkImage(hidden)
      },400)
      $(this).fileupload({
        url: url,
        multiple: multiple,
        sortable: sortable,
        edittitle: edittitle,
        dataType: 'json',
        autoUpload: autoUpload,
        paramName: 'fileup[]',
        acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
        maxFileSize: 5242880,
        maxNumberOfFiles: max,
        formData: function(){
          var fdata = [
            {name:'name',value:name},
            {name:'width',value:width},
            {name:'height',value:height},
            {name:'type',value:Number(type)}
          ]
          if(model_id) fdata.push({name:'model_id',value:model_id})
          return fdata;
        },
        disableImageResize: /Android(?!.*Chrome)|Opera/
            .test(window.navigator.userAgent),
        previewMaxWidth: width,
        previewMaxHeight: height,
        previewCrop: true,
        previewCanvas: false,
        filesContainer: target,
        messages: {
          maxNumberOfFiles: maxMessage,
        },
        uploadTemplateId:uploadTemplateId,
        downloadTemplateId:downloadTemplateId
      }).on('fileuploaddestroyed', function(e,data){
        $("#ajax-loader").addClass('d-none')
        if(data.id){
          var idx = uploadedFiles.indexOf(data.id)
          if(idx !== -1) uploadedFiles.splice(idx,1)
        }
        console.log(uploadedFiles)
        if(!multiple) s.removeClass('d-none')
        if($(target).find('.img-preview').length == 0 && required) $(this).prev().prop('required',true)
        setTimeout(function(){
          checkImage(hidden)
        },100)
      }).on('fileuploadadded', function(e,data){
        data.context.addClass('noerror')
        if(!multiple) s.addClass('d-none')
        setTimeout(function(){
          checkImage(hidden)
        },100)
      }).on('fileuploaddone', function(e,data){
        uploadedFiles.push(Number(data._response.result.files[0].id))
        $("#ajax-loader").addClass('d-none')
        setTimeout(function(){
          checkImage(hidden)
        },100)
        if(sortable) {
          $(target).sortable({handle: 'span.btn-move'})
        } 
      }).on('fileuploadafteradded', function(){
        if($(target).children().length > max && !error) {
          error = 1
        } else {
          error = 0
        }
        if(error) {
          notify.error(maxMessage, function(){
            $(target).find('.template-upload:not(.noerror)').remove()
            error = 0
          })
        }
        setTimeout(function(){
          checkImage(hidden)
        },100)
        if(sortable) {
          $(target).sortable({handle: 'span.btn-move'})
        } 
      })
      var value = $(this).data('value')
      if(value) {
        var filedata = value
        
        var files = []
        if (!multiple) {
          files[0] = filedata
          files[0].type = type
        } else {
          files = filedata
          for (var a in files){
            files[a].type = type
          }
        }
        var opt = {
          options: {
            sortable: sortable,
            edittitle: edittitle,
            multiple: multiple,
          },
          name: name,
          tpl: downloadTemplateId,
          files: files
        }
        var valuehtml = createFileValue(opt)
        $(target).append(valuehtml)
        if(sortable) {
          $(target).sortable({handle: 'span.btn-move'})
        }
      }
      
    })
  }
  if($('[data-toggle="upFiles"]').length > 0){
    $('[data-toggle="upFiles"]').not('.init-upfiles').each(function(){
      $(this).addClass('init-upfiles')
      var s = $(this)
      var parent = s.parent()
      var count = $(this).data('count-target')
      var sortable = $(this).data('sortable')
      var name = $(this).data('name')
      var hidden = parent.find('input[type="hidden"]')
      if(!hidden.length) hidden = $("#"+name.replace('[]','')+'-required')
      var required = hidden.prop('required')
      var url = $(this).data('url') || uploadUrl
      var target = $(this).data('target')
      var multiple = $(this).prop('multiple') || true
      var max = $(this).data('max')
      var maxMessage = $(this).data('message') || '已超过最大文件数'
      var uploadTpl = $(this).data('upload-tpl')
      var downloadTpl = $(this).data('download-tpl')
      var autoUpload = $(this).data('auto-upload') || true
      var error = 0
      var type = $(this).data('upload-type') || 1
      var cb = $(this).data('callback')
      var delcb = $(this).data('destroy-callback')
      var maxFileSize = 5242880
      if(type == 3) {
        autoUpload = false
        maxFileSize = 2242880000
        // url = oss_host
      }
      // if (typeof(Storage) !== "undefined" && !multiple) {
      //   var sname = window.location.href
      //   // localStorage.removeItem(sname);
      //   var val = localStorage.getItem(sname);
      //   if(val) {
      //     val = JSON.parse(val)
      //     $(target).html(val[name])
      //   } 
      // }
      var uploadTemplateId = uploadTpl || 'template-upload-file'
      var downloadTemplateId = downloadTpl || 'template-download-file'
      function checkImage(hidden){
        console.log(hidden);
        if(count) {
          $(count).text($(target).children().length)
        }
        if(!required) return false
        if($(target).find('.input-group').length>0 || $(target).find('.file-control').length>0){
          hidden.removeAttr('required')
        }else{
          hidden.attr('required',true)
        }
        
      }
      setTimeout(function(){
        checkImage(hidden)
      },400)
      $(this).fileupload({
        url: url,
        dataType: 'json',
        autoUpload: autoUpload,
        paramName: 'fileup[]',
        maxFileSize: maxFileSize,
        maxNumberOfFiles: max,
        formData: function(){
          return [
            {name:'name',value:name},
            {name:'type',value:type}
          ]
        },
        filesContainer: target,
        messages: {
          maxNumberOfFiles: maxMessage,
        },
        uploadTemplateId:uploadTemplateId,
        downloadTemplateId:downloadTemplateId
      }).on('fileuploaddestroyed', function(){
        if(!multiple) s.removeClass('d-none')
        if(max == 1) {
          parent.removeClass('d-none')
        }
        if(delcb) {
          try {
            window[delcb]()
          } catch (error) {
            console.error(error)
          }
        }
        saveUpImage(name,target)
        setTimeout(function(){
          checkImage(hidden)
        },100)
      }).on('fileuploadadded', function(e,data){
        if(max == 1) {
          parent.addClass('d-none')
          console.log(parent.attr('class'),'class')
        } 
        data.context.addClass('noerror')
        if(!multiple) s.addClass('d-none')
        if(type == 3) {
          // var file = filedata
          // data.submit()
          send_request(name,function(res){
            console.log('up')
            var d = new Date()
            data.paramName = 'file'
            data.url = res.host
            var ext = get_suffix(data.files[0].name).toLowerCase()
            var filetype = {image:['jpg','png','jpeg','gif'],video:['mp4','ogv']}
            var type = 'files'
            if(filetype['image'].indexOf(ext) !== -1) {
              type = 'image'
            }else if(filetype['video'].indexOf(ext) !== -1) {
              type = 'video'
            }
            var filename = data.files[0].name.split('.').slice(0, -1).join('.').replace(/[\s&\/\\#,+()$~%.'":*?<>{}]/g, '_').toLowerCase() + ext
            console.log(filename)
            var key = res.dir + type + '/' + random_string(6) + '__' + filename 
            data.formData = function() {
              var sign_data = [
                {name:'name',value:data.files[0].name},
                {name:'key',value:key},
                {name:'policy',value:res.policy},
                {name:'OSSAccessKeyId',value:res.accessid},
                {name:'success_action_status',value:200},
                {name:'callback',value:res.callback},
                {name:'signature',value:res.signature},
              ]
              return sign_data
            }
            // var i = 0
            // var itv2 = setInterval(function() {
            //   i++
              // var input = $(target+' .template-upload').length
              // console.log(input,filedata,'-----------------',file,i,'===============')
              // if(input == filedata.originalFiles.length) {
            // console.log('clear')
            // if(data.files[0].error) {
            //   console.log(data.files[0].error,'error')
            // }else{
            var jqXHR = data.submit().fail(function (jqXHR, textStatus, errorThrown){console.log(jqXHR, textStatus, errorThrown)})
            .done(function(jqXHR, textStatus, errorThrown){
              
              if(cb) {
                try {
                  window[cb](jqXHR, textStatus, errorThrown)
                } catch (error) {
                  console.error(error)
                }
              }
            })
            // setTimeout(function() {
            //   if(data.context.find('.progress-bar').width() < 1 && !data.files.error){
            //     console.log('timeout')
            //     var jqXHR = data.submit().fail(function (jqXHR, textStatus, errorThrown){console.log(jqXHR, textStatus, errorThrown)})
            //   }
            // }, 1000);
            // }
              // }
            // }, 10);
            
   
          })
          
        }
        setTimeout(function(){
          checkImage(hidden)
        },100)
      }).on('fileuploaddone', function(e,data){
        $("#ajax-loader").addClass('d-none')
        s.prev().prop('required',false)
        saveUpImage(name,target)
        setTimeout(function(){
          checkImage(hidden)
        },100)
        if(sortable) {
          $(target).sortable()
        }
        console.log('done',cb)
      }).on('fileuploadafteradded', function(e,filedata){
       
        setTimeout(function(){
          checkImage(hidden)
        },100)
      })
      var value = $(this).data('value')
      if(value) {
        var filedata = value
        
        var files = []
        if (!multiple) {
          files[0] = filedata
          files[0].type = type
        } else {
          files = filedata
          for (var a in files){
            files[a].type = type
          }
        }
        var opt = {
          options: {
            sortable: sortable,
            multiple: multiple,
          },
          name: name,
          tpl: downloadTemplateId,
          files: files
        }
        var valuehtml = createFileValue(opt)
        $(target).append(valuehtml)
      }
    })
  }
}
$(function () {
  'use strict';
  initUpImage()
  
  $(document).on('change','.upfile-type input',function(e){
    var id = $(this).data('target')
    var pr = $(id).parent()
    var $img = pr.find('.one-image-holder').not(id)
    $img.find('input').prop('disabled',true)
    $img.removeClass('active')
    $(id).addClass('active')
    $(id).find('input').prop('disabled',false)
  })
});

$(document).on('click','[data-delete-file]',function(e){
  var filebrowse = $(this).closest('.template-browse')
  var filecon = filebrowse.parent()
  var required = filecon.data('required')
  var max = filecon.data('max')
  var filetype = filecon.data('filetype')
  var name = filecon.data('name')
  filebrowse.remove()
  var count = filecon.children('.template-browse').length
  console.log(required)
  if(required == true && count == 0) {
    filecon.append('<input class="hidden-required" name="'+name+'" type="hidden" data-msg-required="'+filecon.data('msg-required')+'" required>')
  }
  console.log(count)
  if(max>1 && filetype == 2) {
    $("#"+name+"-count").text(count)
  }
  if(max == 1 && count == 0) {
    $("#"+name+"-browse").removeClass('d-none')
  }
})
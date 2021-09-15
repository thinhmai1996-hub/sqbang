var bbcOpts = {};
// function BBC(opts){
//   var wopts = window.bbcOpts
//   this.opts = {
//     beforeInit: opts.beforeInit || false,
//     afterInit: opts.afterInit || false,
//   };
//   this.plugins = {
//     owl: wopts.owl || false,
//     img: wopts.img || false
//   }
//   this.pluginsInit = function() {
//     var plugins = this.plugins
//     $.each(plugins, function (e,v) {
//       if($.isFunction(v)) plugins[e]()
//     })
//   };
//   this.init = function() {
//     if($.isFunction(this.opts.beforeInit)) this.opts.beforeInit()
//     this.pluginsInit()
//     if($.isFunction(this.opts.afterInit)) this.opts.afterInit()
//   }
//   this.init()
// };
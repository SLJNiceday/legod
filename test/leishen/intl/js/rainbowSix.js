(function(e){function t(t){for(var o,i,l=t[0],c=t[1],u=t[2],d=0,p=[];d<l.length;d++)i=l[d],r[i]&&p.push(r[i][0]),r[i]=0;for(o in c)Object.prototype.hasOwnProperty.call(c,o)&&(e[o]=c[o]);s&&s(t);while(p.length)p.shift()();return a.push.apply(a,u||[]),n()}function n(){for(var e,t=0;t<a.length;t++){for(var n=a[t],o=!0,l=1;l<n.length;l++){var c=n[l];0!==r[c]&&(o=!1)}o&&(a.splice(t--,1),e=i(i.s=n[0]))}return e}var o={},r={rainbowSix:0},a=[];function i(t){if(o[t])return o[t].exports;var n=o[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,i),n.l=!0,n.exports}i.m=e,i.c=o,i.d=function(e,t,n){i.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},i.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,t){if(1&t&&(e=i(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)i.d(n,o,function(t){return e[t]}.bind(null,o));return n},i.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="";var l=window["webpackJsonp"]=window["webpackJsonp"]||[],c=l.push.bind(l);l.push=t,l=l.slice();for(var u=0;u<l.length;u++)t(l[u]);var s=c;a.push([20,"chunk-vendors","chunk-common"]),n()})({20:function(e,t,n){e.exports=n("d205")},d205:function(e,t,n){"use strict";n.r(t);n("cadf"),n("551c"),n("f751"),n("097d");var o=n("9ab4"),r=(n("d16e"),n("76ca"),n("ac2b"),n("db4d"),n("60a3")),a=n("aaaf"),i=n("b444"),l=n("360e"),c=n("b9c5"),u=n("3435"),s=n("ebb9"),d=n("255e"),p=n("1831"),f=n("a925"),w=n("9347");r["c"].use(f["a"]),r["c"].config.productionTip=!1;c["a"].getInstace(w["a"].REGION_CODE_1,w["a"].ZH_CN);var h=u["a"].getInstance();h.init();var b=new f["a"](h),g=function(e){function t(){var t=null!==e&&e.apply(this,arguments)||this;return t.webParam=c["a"].getInstace(),t.windowsDownloadUrl="",t.macDownloadUrl="",t.webBaseURL=s["a"].getWebBaseUrl(),t.http=new p["a"],t.adlink="",t.adSrc="",t.adshow=0,t}return o["c"](t,e),t.prototype.created=function(){this.imageHeadUrl=s["a"].getImgBaseUrl(),this.setBaseUrl(s["a"].getBaseUrl()),this.getDownloadUrl()},t.prototype.closeAd=function(){},t.prototype.onChangeLanguage=function(e){h.changeLanguage(e),b.locale=h.locale,s["a"].log("切换语言:"+h.locale)},t.prototype.setBaseUrl=function(e){this.http.setBaseUrl(e)},t.prototype.logined=function(){},t.prototype.logout=function(){},t.prototype.getDownloadUrl=function(){return o["a"](this,void 0,void 0,function(){var e,t;return o["d"](this,function(n){switch(n.label){case 0:return[4,d["a"].getInstance().download(!0)];case 1:return e=n.sent(),t=e.leigod.down_platform[this.webParam.from],this.windowsDownloadUrl=t.windows.download_url,this.macDownloadUrl=t.mac.download_url,[2]}})})},t=o["b"]([Object(r["a"])({components:{"head-nav":a["a"],"foot-nav":i["a"],"download-box":l["a"]}})],t),t}(r["c"]);new g({i18n:b}).$mount("#app")}});
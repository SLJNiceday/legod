(function(e){function t(t){for(var o,l,c=t[0],i=t[1],u=t[2],d=0,p=[];d<c.length;d++)l=c[d],r[l]&&p.push(r[l][0]),r[l]=0;for(o in i)Object.prototype.hasOwnProperty.call(i,o)&&(e[o]=i[o]);s&&s(t);while(p.length)p.shift()();return a.push.apply(a,u||[]),n()}function n(){for(var e,t=0;t<a.length;t++){for(var n=a[t],o=!0,c=1;c<n.length;c++){var i=n[c];0!==r[i]&&(o=!1)}o&&(a.splice(t--,1),e=l(l.s=n[0]))}return e}var o={},r={gta5:0},a=[];function l(t){if(o[t])return o[t].exports;var n=o[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,l),n.l=!0,n.exports}l.m=e,l.c=o,l.d=function(e,t,n){l.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},l.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},l.t=function(e,t){if(1&t&&(e=l(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(l.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)l.d(n,o,function(t){return e[t]}.bind(null,o));return n},l.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return l.d(t,"a",t),t},l.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},l.p="";var c=window["webpackJsonp"]=window["webpackJsonp"]||[],i=c.push.bind(c);c.push=t,c=c.slice();for(var u=0;u<c.length;u++)t(c[u]);var s=i;a.push([8,"chunk-vendors","chunk-common"]),n()})({8:function(e,t,n){e.exports=n("f47b")},f47b:function(e,t,n){"use strict";n.r(t);n("cadf"),n("551c"),n("f751"),n("097d");var o=n("9ab4"),r=(n("d16e"),n("76ca"),n("ac2b"),n("db4d"),n("60a3")),a=n("aaaf"),l=n("b444"),c=n("360e"),i=n("b9c5"),u=n("3435"),s=n("ebb9"),d=n("255e"),p=n("1831"),f=n("a925"),b=n("9347");r["c"].use(f["a"]),r["c"].config.productionTip=!1;i["a"].getInstace(b["a"].REGION_CODE_1,b["a"].ZH_CN);var g=u["a"].getInstance();g.init();var h=new f["a"](g),w=function(e){function t(){var t=null!==e&&e.apply(this,arguments)||this;return t.webParam=i["a"].getInstace(),t.windowsDownloadUrl="",t.macDownloadUrl="",t.webBaseURL=s["a"].getWebBaseUrl(),t.http=new p["a"],t.adlink="",t.adSrc="",t.adshow=0,t}return o["c"](t,e),t.prototype.created=function(){this.imageHeadUrl=s["a"].getImgBaseUrl(),this.setBaseUrl(s["a"].getBaseUrl()),this.getDownloadUrl()},t.prototype.closeAd=function(){},t.prototype.onChangeLanguage=function(e){g.changeLanguage(e),h.locale=g.locale,s["a"].log("切换语言:"+g.locale)},t.prototype.setBaseUrl=function(e){this.http.setBaseUrl(e)},t.prototype.logined=function(){},t.prototype.logout=function(){},t.prototype.getDownloadUrl=function(){return o["a"](this,void 0,void 0,function(){var e,t;return o["d"](this,function(n){switch(n.label){case 0:return[4,d["a"].getInstance().download(!0)];case 1:return e=n.sent(),t=e.leigod.down_platform[this.webParam.from],this.windowsDownloadUrl=t.windows.download_url,this.macDownloadUrl=t.mac.download_url,[2]}})})},t=o["b"]([Object(r["a"])({components:{"head-nav":a["a"],"foot-nav":l["a"],"download-box":c["a"]}})],t),t}(r["c"]);new w({i18n:h}).$mount("#app")}});
(function(n){function e(e){for(var t,l,c=e[0],i=e[1],u=e[2],p=0,s=[];p<c.length;p++)l=c[p],r[l]&&s.push(r[l][0]),r[l]=0;for(t in i)Object.prototype.hasOwnProperty.call(i,t)&&(n[t]=i[t]);f&&f(e);while(s.length)s.shift()();return a.push.apply(a,u||[]),o()}function o(){for(var n,e=0;e<a.length;e++){for(var o=a[e],t=!0,c=1;c<o.length;c++){var i=o[c];0!==r[i]&&(t=!1)}t&&(a.splice(e--,1),n=l(l.s=o[0]))}return n}var t={},r={cancelPause:0},a=[];function l(e){if(t[e])return t[e].exports;var o=t[e]={i:e,l:!1,exports:{}};return n[e].call(o.exports,o,o.exports,l),o.l=!0,o.exports}l.m=n,l.c=t,l.d=function(n,e,o){l.o(n,e)||Object.defineProperty(n,e,{enumerable:!0,get:o})},l.r=function(n){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(n,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(n,"__esModule",{value:!0})},l.t=function(n,e){if(1&e&&(n=l(n)),8&e)return n;if(4&e&&"object"===typeof n&&n&&n.__esModule)return n;var o=Object.create(null);if(l.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:n}),2&e&&"string"!=typeof n)for(var t in n)l.d(o,t,function(e){return n[e]}.bind(null,t));return o},l.n=function(n){var e=n&&n.__esModule?function(){return n["default"]}:function(){return n};return l.d(e,"a",e),e},l.o=function(n,e){return Object.prototype.hasOwnProperty.call(n,e)},l.p="";var c=window["webpackJsonp"]=window["webpackJsonp"]||[],i=c.push.bind(c);c.push=e,c=c.slice();for(var u=0;u<c.length;u++)e(c[u]);var f=i;a.push([5,"chunk-vendors","chunk-common"]),o()})({5:function(n,e,o){n.exports=o("86b4")},"86b4":function(n,e,o){"use strict";o.r(e);o("cadf"),o("551c"),o("f751"),o("097d");var t=o("9ab4"),r=(o("76ca"),o("db4d"),o("60a3")),a=o("aaaf"),l=o("1189"),c=o("360e"),i=o("a925"),u=o("b9c5"),f=o("3435"),p=o("ebb9"),s=o("255e"),d=o("9347");r["c"].config.productionTip=!1,r["c"].use(i["a"]);u["a"].getInstace(d["a"].REGION_CODE_1,d["a"].ZH_CN);var w=f["a"].getInstance();w.init();var b=new i["a"](w),g=function(n){function e(){var e=null!==n&&n.apply(this,arguments)||this;return e.webParam=u["a"].getInstace(),e.windowsDownloadUrl="",e.macDownloadUrl="",e.webBaseURL=p["a"].getWebBaseUrl(),e.joinleftfix=0,e}return t["c"](e,n),e.prototype.created=function(){this.getDownloadUrl()},e.prototype.mounted=function(){var n=this;window.onscroll=function(){n.pageScroll(835)}},e.prototype.pageScroll=function(n){var e=d["a"].scroll().top;this.joinleftfix=e<n?0:1},e.prototype.onChangeLanguage=function(n){w.changeLanguage(n),b.locale=w.locale,p["a"].log("切换语言:"+w.locale)},e.prototype.getDownloadUrl=function(){return t["a"](this,void 0,void 0,function(){var n,e;return t["d"](this,function(o){switch(o.label){case 0:return[4,s["a"].getInstance().download(!0)];case 1:return n=o.sent(),e=n.leigod.down_platform[this.webParam.from],this.windowsDownloadUrl=e.windows.download_url,this.macDownloadUrl=e.mac.download_url,[2]}})})},e.prototype.logined=function(){},e.prototype.logout=function(){},e=t["b"]([Object(r["a"])({components:{"head-nav":a["a"],"foot-nav":l["a"],"download-box":c["a"]}})],e),e}(r["c"]);new g({i18n:b}).$mount("#app")}});
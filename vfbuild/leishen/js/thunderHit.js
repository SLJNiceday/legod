(function(n){function e(e){for(var o,c,u=e[0],i=e[1],l=e[2],f=0,p=[];f<u.length;f++)c=u[f],r[c]&&p.push(r[c][0]),r[c]=0;for(o in i)Object.prototype.hasOwnProperty.call(i,o)&&(n[o]=i[o]);d&&d(e);while(p.length)p.shift()();return a.push.apply(a,l||[]),t()}function t(){for(var n,e=0;e<a.length;e++){for(var t=a[e],o=!0,u=1;u<t.length;u++){var i=t[u];0!==r[i]&&(o=!1)}o&&(a.splice(e--,1),n=c(c.s=t[0]))}return n}var o={},r={thunderHit:0},a=[];function c(e){if(o[e])return o[e].exports;var t=o[e]={i:e,l:!1,exports:{}};return n[e].call(t.exports,t,t.exports,c),t.l=!0,t.exports}c.m=n,c.c=o,c.d=function(n,e,t){c.o(n,e)||Object.defineProperty(n,e,{enumerable:!0,get:t})},c.r=function(n){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(n,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(n,"__esModule",{value:!0})},c.t=function(n,e){if(1&e&&(n=c(n)),8&e)return n;if(4&e&&"object"===typeof n&&n&&n.__esModule)return n;var t=Object.create(null);if(c.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:n}),2&e&&"string"!=typeof n)for(var o in n)c.d(t,o,function(e){return n[e]}.bind(null,o));return t},c.n=function(n){var e=n&&n.__esModule?function(){return n["default"]}:function(){return n};return c.d(e,"a",e),e},c.o=function(n,e){return Object.prototype.hasOwnProperty.call(n,e)},c.p="";var u=window["webpackJsonp"]=window["webpackJsonp"]||[],i=u.push.bind(u);u.push=e,u=u.slice();for(var l=0;l<u.length;l++)e(u[l]);var d=i;a.push([29,"chunk-vendors","chunk-common"]),t()})({29:function(n,e,t){n.exports=t("d2ec")},d2ec:function(n,e,t){"use strict";t.r(e);t("cadf"),t("551c"),t("f751"),t("097d");var o=t("9ab4"),r=(t("d16e"),t("76ca"),t("db4d"),t("60a3")),a=t("aaaf"),c=t("b444"),u=t("360e"),i=t("a925"),l=t("b9c5"),d=t("3435"),f=t("ebb9"),p=t("255e"),s=t("9347");r["c"].config.productionTip=!1,r["c"].use(i["a"]);l["a"].getInstace(s["a"].REGION_CODE_1,s["a"].ZH_CN);var w=d["a"].getInstance();w.init();var b=new i["a"](w),g=function(n){function e(){var e=null!==n&&n.apply(this,arguments)||this;return e.webParam=l["a"].getInstace(),e.windowsDownloadUrl="",e.macDownloadUrl="",e.webBaseURL=f["a"].getWebBaseUrl(),e}return o["c"](e,n),e.prototype.created=function(){this.getDownloadUrl()},e.prototype.onChangeLanguage=function(n){w.changeLanguage(n),b.locale=w.locale,f["a"].log("切换语言:"+w.locale)},e.prototype.getDownloadUrl=function(){return o["a"](this,void 0,void 0,function(){var n,e;return o["d"](this,function(t){switch(t.label){case 0:return[4,p["a"].getInstance().download(!0)];case 1:return n=t.sent(),e=n.leigod.down_platform[this.webParam.from],this.windowsDownloadUrl=e.windows.download_url,this.macDownloadUrl=e.mac.download_url,[2]}})})},e.prototype.logined=function(){},e.prototype.logout=function(){},e=o["b"]([Object(r["a"])({components:{"head-nav":a["a"],"foot-nav":c["a"],"download-box":u["a"]}})],e),e}(r["c"]);new g({i18n:b}).$mount("#app")}});
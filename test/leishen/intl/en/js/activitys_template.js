(function(e){function n(n){for(var r,c,u=n[0],i=n[1],l=n[2],p=0,s=[];p<u.length;p++)c=u[p],o[c]&&s.push(o[c][0]),o[c]=0;for(r in i)Object.prototype.hasOwnProperty.call(i,r)&&(e[r]=i[r]);f&&f(n);while(s.length)s.shift()();return a.push.apply(a,l||[]),t()}function t(){for(var e,n=0;n<a.length;n++){for(var t=a[n],r=!0,u=1;u<t.length;u++){var i=t[u];0!==o[i]&&(r=!1)}r&&(a.splice(n--,1),e=c(c.s=t[0]))}return e}var r={},o={activitys_template:0},a=[];function c(n){if(r[n])return r[n].exports;var t=r[n]={i:n,l:!1,exports:{}};return e[n].call(t.exports,t,t.exports,c),t.l=!0,t.exports}c.m=e,c.c=r,c.d=function(e,n,t){c.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:t})},c.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},c.t=function(e,n){if(1&n&&(e=c(e)),8&n)return e;if(4&n&&"object"===typeof e&&e&&e.__esModule)return e;var t=Object.create(null);if(c.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var r in e)c.d(t,r,function(n){return e[n]}.bind(null,r));return t},c.n=function(e){var n=e&&e.__esModule?function(){return e["default"]}:function(){return e};return c.d(n,"a",n),n},c.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},c.p="";var u=window["webpackJsonp"]=window["webpackJsonp"]||[],i=u.push.bind(u);u.push=n,u=u.slice();for(var l=0;l<u.length;l++)n(u[l]);var f=i;a.push([2,"chunk-vendors","chunk-common"]),t()})({2:function(e,n,t){e.exports=t("68a8")},"68a8":function(e,n,t){"use strict";t.r(n);t("cadf"),t("551c"),t("f751"),t("097d");var r=t("9ab4"),o=(t("76ca"),t("db4d"),t("60a3")),a=t("aaaf"),c=t("1189"),u=t("360e"),i=t("a925"),l=t("b9c5"),f=t("3435"),p=t("ebb9"),s=t("d939");o["c"].config.productionTip=!1,o["c"].use(i["a"]);l["a"].getInstace();var d=f["a"].getInstance();d.init();var b=new i["a"](d),v=function(e){function n(){var n=null!==e&&e.apply(this,arguments)||this;return n.webParam=l["a"].getInstace(),n}return r["c"](n,e),n.prototype.onChangeLanguage=function(e){d.changeLanguage(e),b.locale=d.locale,p["a"].log("切换语言:"+d.locale)},n.prototype.gotoActivity=function(){s["a"].backActivity()},n=r["b"]([Object(o["a"])({components:{"head-nav":a["a"],"foot-nav":c["a"],"download-box":u["a"]}})],n),n}(o["c"]);new v({i18n:b}).$mount("#app")}});
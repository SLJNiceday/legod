(function(e){function t(t){for(var o,i,c=t[0],u=t[1],l=t[2],d=0,p=[];d<c.length;d++)i=c[d],r[i]&&p.push(r[i][0]),r[i]=0;for(o in u)Object.prototype.hasOwnProperty.call(u,o)&&(e[o]=u[o]);s&&s(t);while(p.length)p.shift()();return a.push.apply(a,l||[]),n()}function n(){for(var e,t=0;t<a.length;t++){for(var n=a[t],o=!0,c=1;c<n.length;c++){var u=n[c];0!==r[u]&&(o=!1)}o&&(a.splice(t--,1),e=i(i.s=n[0]))}return e}var o={},r={wow:0},a=[];function i(t){if(o[t])return o[t].exports;var n=o[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,i),n.l=!0,n.exports}i.m=e,i.c=o,i.d=function(e,t,n){i.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},i.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,t){if(1&t&&(e=i(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)i.d(n,o,function(t){return e[t]}.bind(null,o));return n},i.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="";var c=window["webpackJsonp"]=window["webpackJsonp"]||[],u=c.push.bind(c);c.push=t,c=c.slice();for(var l=0;l<c.length;l++)t(c[l]);var s=u;a.push([32,"chunk-vendors","chunk-common"]),n()})({32:function(e,t,n){e.exports=n("fcd9")},fcd9:function(e,t,n){"use strict";n.r(t);n("cadf"),n("551c"),n("f751"),n("097d");var o=n("9ab4"),r=(n("d16e"),n("76ca"),n("ac2b"),n("db4d"),n("60a3")),a=n("aaaf"),i=n("b444"),c=n("360e"),u=n("b9c5"),l=n("3435"),s=n("ebb9"),d=n("255e"),p=n("7d83"),f=n("1831"),h=n("a925"),g=n("9347");r["c"].use(h["a"]),r["c"].config.productionTip=!1;u["a"].getInstace(g["a"].REGION_CODE_1,g["a"].ZH_CN);var w=l["a"].getInstance();w.init();var b=new h["a"](w),v=function(e){function t(){var t=null!==e&&e.apply(this,arguments)||this;return t.webParam=u["a"].getInstace(),t.windowsDownloadUrl="",t.macDownloadUrl="",t.webBaseURL=s["a"].getWebBaseUrl(),t.http=new f["a"],t.adlink="",t.adSrc="",t.adshow=0,t.is_day=!0,t.mario_cursor_show=!0,t}return o["c"](t,e),t.prototype.created=function(){this.imageHeadUrl=s["a"].getImgBaseUrl(),this.setBaseUrl(s["a"].getBaseUrl()),this.getDownloadUrl()},t.prototype.onChangeLanguage=function(e){w.changeLanguage(e),b.locale=w.locale,s["a"].log("切换语言:"+w.locale)},t.prototype.setBaseUrl=function(e){this.http.setBaseUrl(e)},t.prototype.logined=function(){},t.prototype.logout=function(){},t.prototype.getDownloadUrl=function(){return o["a"](this,void 0,void 0,function(){var e,t;return o["d"](this,function(n){switch(n.label){case 0:return[4,d["a"].getInstance().download(!0)];case 1:return e=n.sent(),t=e.leigod.down_platform[this.webParam.from],this.windowsDownloadUrl=t.windows.download_url,this.macDownloadUrl=t.mac.download_url,[2]}})})},t.prototype.getAd=function(e){return o["a"](this,void 0,void 0,function(){var t,n,r,a;return o["d"](this,function(o){switch(o.label){case 0:return o.trys.push([0,2,,3]),t=f["a"].URL_AD,n=p["a"].getRegionCodes(),r={group:e,region_codes:n},[4,this.http.get(t,r)];case 1:return a=o.sent(),a.code==f["a"].HTTP_SUCCESS_NET_CODE&&(this.adlink=a.data[0].url,this.adSrc=this.imageHeadUrl+a.data[0].img_url),[3,3];case 2:return o.sent(),[3,3];case 3:return[2]}})})},t.prototype.closeAd=function(){this.adshow=1},t=o["b"]([Object(r["a"])({components:{"head-nav":a["a"],"foot-nav":i["a"],"download-box":c["a"]}})],t),t}(r["c"]);window.mario=new v({i18n:b}).$mount("#app")}});
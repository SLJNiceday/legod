(function(e){function n(n){for(var o,a,c=n[0],u=n[1],l=n[2],d=0,p=[];d<c.length;d++)a=c[d],r[a]&&p.push(r[a][0]),r[a]=0;for(o in u)Object.prototype.hasOwnProperty.call(u,o)&&(e[o]=u[o]);s&&s(n);while(p.length)p.shift()();return i.push.apply(i,l||[]),t()}function t(){for(var e,n=0;n<i.length;n++){for(var t=i[n],o=!0,c=1;c<t.length;c++){var u=t[c];0!==r[u]&&(o=!1)}o&&(i.splice(n--,1),e=a(a.s=t[0]))}return e}var o={},r={activitys_mario:0},i=[];function a(n){if(o[n])return o[n].exports;var t=o[n]={i:n,l:!1,exports:{}};return e[n].call(t.exports,t,t.exports,a),t.l=!0,t.exports}a.m=e,a.c=o,a.d=function(e,n,t){a.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:t})},a.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},a.t=function(e,n){if(1&n&&(e=a(e)),8&n)return e;if(4&n&&"object"===typeof e&&e&&e.__esModule)return e;var t=Object.create(null);if(a.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var o in e)a.d(t,o,function(n){return e[n]}.bind(null,o));return t},a.n=function(e){var n=e&&e.__esModule?function(){return e["default"]}:function(){return e};return a.d(n,"a",n),n},a.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},a.p="/";var c=window["webpackJsonp"]=window["webpackJsonp"]||[],u=c.push.bind(c);c.push=n,c=c.slice();for(var l=0;l<c.length;l++)n(c[l]);var s=u;i.push([9,"chunk-vendors","chunk-common"]),t()})({"12c5":function(e,n,t){},"1a91":function(e,n,t){"use strict";t.r(n);t("4917"),t("ac1e");var o=t("543e"),r=(t("cadf"),t("551c"),t("f751"),t("097d"),t("9ab4")),i=(t("eb65"),t("12c5"),t("db4d"),t("60a3")),a=t("a925"),c=t("1396"),u=t("9347"),l=t("dfdf"),s=t("7278"),d=t("a123"),p=t("255e"),f=t("1157"),w=t.n(f);i["c"].config.productionTip=!1,i["c"].use(o["a"]),i["c"].use(a["a"]);l["a"].getInstace(u["a"].REGION_CODE_1,u["a"].ZH_CN);var h=c["a"].getInstance();h.init();var g=new a["a"](h),v=function(e){function n(){var n=null!==e&&e.apply(this,arguments)||this;return n.appParam=l["a"].getInstace(),n.downUrl="",n.winDownUrl="",n}return r["c"](n,e),n.prototype.created=function(){this.getDownloadUrl()},n.prototype.goDetail=function(e){switch(e){case 0:window.location.href="https://www.leigod.com/notice/51264.html";break;case 1:window.location.href="https://www.leigod.com/notice/51265.html";break;case 2:window.location.href="https://www.leigod.com/notice/51263.html";break;case 3:window.location.href="https://www.leigod.com/notice/51266.html";break}},n.prototype.gotoRecharge=function(){var e="platform="+this.appParam.platform;d["a"].gotoRecharge(e)},n.prototype.getDownloadUrl=function(){return r["a"](this,void 0,void 0,function(){var e;return r["d"](this,function(n){switch(n.label){case 0:return[4,p["a"].getInstance().download(!0)];case 1:return e=n.sent(),this.downUrl=e.leigod.android.download_url,this.winDownUrl=e.leigod.windows.download_url,this.checkType(),[2]}})})},n.prototype.checkType=function(){var e=this;w()(function(){var n=window.navigator.userAgent.toLowerCase(),t=navigator.userAgent,o=(t.indexOf("Android")>-1||t.indexOf("Linux"),!!t.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/));"micromessenger"==n.match(/MicroMessenger/i)?(w()("#downBtn").click(function(){w()(".shadow").show()}),w()(".shadow").click(function(){w()(this).hide()})):o?w()("#downBtn").click(function(e){e.preventDefault(),window.open("itms-apps://itunes.apple.com/WebObjects/MZStore.woa/wa/viewSoftware?id=1403370767")}):w()("#downBtn").click(function(n){n.preventDefault(),window.open(e.downUrl)})})},n=r["b"]([Object(i["a"])({components:{loading:s["a"]}})],n),n}(i["c"]);new v({i18n:g}).$mount("#app")},9:function(e,n,t){e.exports=t("1a91")}});
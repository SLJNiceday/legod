(function(t){function o(o){for(var r,s,i=o[0],c=o[1],p=o[2],u=0,f=[];u<i.length;u++)s=i[u],n[s]&&f.push(n[s][0]),n[s]=0;for(r in c)Object.prototype.hasOwnProperty.call(c,r)&&(t[r]=c[r]);l&&l(o);while(f.length)f.shift()();return a.push.apply(a,p||[]),e()}function e(){for(var t,o=0;o<a.length;o++){for(var e=a[o],r=!0,i=1;i<e.length;i++){var c=e[i];0!==n[c]&&(r=!1)}r&&(a.splice(o--,1),t=s(s.s=e[0]))}return t}var r={},n={mario:0},a=[];function s(o){if(r[o])return r[o].exports;var e=r[o]={i:o,l:!1,exports:{}};return t[o].call(e.exports,e,e.exports,s),e.l=!0,e.exports}s.m=t,s.c=r,s.d=function(t,o,e){s.o(t,o)||Object.defineProperty(t,o,{enumerable:!0,get:e})},s.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},s.t=function(t,o){if(1&o&&(t=s(t)),8&o)return t;if(4&o&&"object"===typeof t&&t&&t.__esModule)return t;var e=Object.create(null);if(s.r(e),Object.defineProperty(e,"default",{enumerable:!0,value:t}),2&o&&"string"!=typeof t)for(var r in t)s.d(e,r,function(o){return t[o]}.bind(null,r));return e},s.n=function(t){var o=t&&t.__esModule?function(){return t["default"]}:function(){return t};return s.d(o,"a",o),o},s.o=function(t,o){return Object.prototype.hasOwnProperty.call(t,o)},s.p="";var i=window["webpackJsonp"]=window["webpackJsonp"]||[],c=i.push.bind(i);i.push=o,i=i.slice();for(var p=0;p<i.length;p++)o(i[p]);var l=c;a.push([20,"chunk-vendors","chunk-common"]),e()})({20:function(t,o,e){t.exports=e("b9f4")},b9f4:function(t,o,e){"use strict";e.r(o);e("cadf"),e("551c"),e("f751"),e("097d");var r=e("9ab4"),n=(e("d16e"),e("76ca"),e("ac2b"),e("db4d"),e("60a3")),a=e("aaaf"),s=e("b444"),i=e("360e"),c=e("b9c5"),p=e("3435"),l=e("ebb9"),u=e("255e"),f=e("7d83"),v=e("1831"),m=e("a925"),d=e("9347"),h=e("1157"),w=e.n(h);n["c"].use(m["a"]),n["c"].config.productionTip=!1;c["a"].getInstace(d["a"].REGION_CODE_1,d["a"].ZH_CN);var g=p["a"].getInstance();g.init();var b=new m["a"](g),y=function(t){function o(){var o=null!==t&&t.apply(this,arguments)||this;return o.webParam=c["a"].getInstace(),o.windowsDownloadUrl="",o.macDownloadUrl="",o.webBaseURL=l["a"].getWebBaseUrl(),o.http=new v["a"],o.adlink="",o.adSrc="",o.adshow=0,o.is_day=!0,o.mario_cursor_show=!0,o}return r["c"](o,t),o.prototype.created=function(){this.imageHeadUrl=l["a"].getImgBaseUrl(),this.setBaseUrl(l["a"].getBaseUrl()),this.getDownloadUrl(),d["a"].checkIsMobile()},o.prototype.mounted=function(){var t=w()("#mario_move"),o=w()("#mario_mogu");this.marioMoveStart(t,o),this.marioBoomGif(),this.marioBoomMove(),this.marioCursorGif()},o.prototype.goDetail=function(t){switch(t){case 0:window.open("https://www.leigod.com/notice/51264.html");break;case 1:window.open("https://www.leigod.com/notice/51265.html");break;case 2:window.open("https://www.leigod.com/notice/51263.html");break;case 3:window.open("https://www.leigod.com/notice/51266.html");break}},o.prototype.marioMoveStart=function(t,o){var e=this,r=setInterval(function(){var n=parseInt(w()(t).css("margin-left"));w()(t).css("margin-left",n+7+"px"),n+8>-125&&(w()(t).css("margin-left","-125px"),clearInterval(r),e.marioMoveOne(t,o))},30)},o.prototype.marioMoveOne=function(t,o){var e=this,r=setInterval(function(){var n=parseInt(w()(t).css("bottom"));w()(t).css("bottom",n+7+"px"),n+6>=-211&&(w()(t).css("bottom","-211px"),w()("#mario_btn_move").addClass("mario_btn_move"),clearInterval(r),e.marioMoveTwo(t,o),setTimeout(function(){w()(o).css("display","block"),e.marioMoguMoveStart(o)},300))},15)},o.prototype.marioMoveTwo=function(t,o){var e=this,r=setInterval(function(){var n=parseInt(w()(t).css("bottom"));w()(t).css("bottom",n-7+"px"),n-6<=-266&&(w()(t).css("bottom","-266px"),clearInterval(r),e.marioMoveEnd(t,o))},15)},o.prototype.marioMoveEnd=function(t,o){var e=this,r=setInterval(function(){var n=parseInt(w()(t).css("margin-left"));w()(t).css("margin-left",n+9+"px"),n+8>=920&&(clearInterval(r),setTimeout(function(){w()(t).css("margin-left","-1025px"),w()("#mario_btn_move").removeClass("mario_btn_move"),e.marioMoveStart(t,o)},5e3))},30)},o.prototype.marioMoguMoveStart=function(t){var o=this,e=setInterval(function(){var r=parseInt(w()(t).css("top"));w()(t).css("top",r-8+"px"),r-8<=315&&(w()(t).css("top","315px"),clearInterval(e),o.marioMoguMoveTwo(t))},30)},o.prototype.marioMoguMoveTwo=function(t){var o=this,e=setInterval(function(){var r=parseInt(w()(t).css("left"));w()(t).css("left",r+6+"px"),r+6>=1050&&(clearInterval(e),o.marioMoguMoveThree(t))},30)},o.prototype.marioMoguMoveThree=function(t){var o=setInterval(function(){var e=parseInt(w()(t).css("top")),r=parseInt(w()(t).css("left"));e<685&&w()(t).css("top",e+12+"px"),w()(t).css("left",r+6+"px"),e+12>=685&&w()(t).css("top","685px"),r+6>=1910&&(w()(t).css("top","405px"),w()(t).css("left","890px"),w()(t).css("display","none"),clearInterval(o))},30)},o.prototype.marioSunMove=function(t,o){var e=this;this.mario_cursor_show=!1;var r=setInterval(function(){var n=parseInt(w()(t).css("left")),a=parseInt(w()(t).css("top"));w()(t).css("left",n+12+"px"),w()(t).css("top",a-11+"px"),n+12>=448&&(w()(t).css("left","-310px"),w()(t).css("top","350px"),clearInterval(r),o(),e.marioSunMoveTwo(t))},30)},o.prototype.marioSunMoveTwo=function(t){var o=this,e=setInterval(function(){var r=parseInt(w()(t).css("left")),n=parseInt(w()(t).css("top"));w()(t).css("left",r+12+"px"),w()(t).css("top",n-11+"px"),r+12>=50&&(clearInterval(e),o.mario_cursor_show=!0)},30)},o.prototype.marioCursorGif=function(){var t=w()(".mario_cursor_move"),o=0;setInterval(function(){o++,o>17&&(o=0),t.css("margin-left",-250*o+"px")},30)},o.prototype.marioBoomGif=function(){var t=w()(".mario_boom_move"),o=0;setInterval(function(){o++,o>34&&(o=0),t.css("margin-left",-200*o+"px")},30)},o.prototype.marioBoomMove=function(){var t=w()(".mario_boom");setInterval(function(){var o=parseInt(t.css("right")),e=parseInt(t.css("top"));t.css("right",o+5+"px"),t.css("top",e-1+"px"),e-1<=0&&(t.css("right","0px"),t.css("top","600px"))},20)},o.prototype.onChangeLanguage=function(t){g.changeLanguage(t),b.locale=g.locale,l["a"].log("切换语言:"+g.locale)},o.prototype.changeDayOrNight=function(){var t=this,o=w()("#sun_moon");this.marioSunMove(o,function(){t.is_day=!t.is_day})},o.prototype.setBaseUrl=function(t){this.http.setBaseUrl(t)},o.prototype.logined=function(){},o.prototype.logout=function(){},o.prototype.getDownloadUrl=function(){return r["a"](this,void 0,void 0,function(){var t,o;return r["d"](this,function(e){switch(e.label){case 0:return[4,u["a"].getInstance().download(!0)];case 1:return t=e.sent(),o=t.leigod.down_platform[this.webParam.from],this.windowsDownloadUrl=o.windows.download_url,this.macDownloadUrl=o.mac.download_url,[2]}})})},o.prototype.getAd=function(t){return r["a"](this,void 0,void 0,function(){var o,e,n,a;return r["d"](this,function(r){switch(r.label){case 0:return r.trys.push([0,2,,3]),o=v["a"].URL_AD,e=f["a"].getRegionCodes(),n={group:t,region_codes:e},[4,this.http.get(o,n)];case 1:return a=r.sent(),a.code==v["a"].HTTP_SUCCESS_NET_CODE&&(this.adlink=a.data[0].url,this.adSrc=this.imageHeadUrl+a.data[0].img_url),[3,3];case 2:return r.sent(),[3,3];case 3:return[2]}})})},o.prototype.closeAd=function(){this.adshow=1},o=r["b"]([Object(n["a"])({components:{"head-nav":a["a"],"foot-nav":s["a"],"download-box":i["a"]}})],o),o}(n["c"]);window.mario=new y({i18n:b}).$mount("#app")}});
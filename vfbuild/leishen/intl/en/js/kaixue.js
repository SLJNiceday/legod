(function(e){function t(t){for(var o,i,c=t[0],s=t[1],u=t[2],p=0,f=[];p<c.length;p++)i=c[p],a[i]&&f.push(a[i][0]),a[i]=0;for(o in s)Object.prototype.hasOwnProperty.call(s,o)&&(e[o]=s[o]);l&&l(t);while(f.length)f.shift()();return r.push.apply(r,u||[]),n()}function n(){for(var e,t=0;t<r.length;t++){for(var n=r[t],o=!0,c=1;c<n.length;c++){var s=n[c];0!==a[s]&&(o=!1)}o&&(r.splice(t--,1),e=i(i.s=n[0]))}return e}var o={},a={kaixue:0},r=[];function i(t){if(o[t])return o[t].exports;var n=o[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,i),n.l=!0,n.exports}i.m=e,i.c=o,i.d=function(e,t,n){i.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},i.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,t){if(1&t&&(e=i(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)i.d(n,o,function(t){return e[t]}.bind(null,o));return n},i.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="";var c=window["webpackJsonp"]=window["webpackJsonp"]||[],s=c.push.bind(c);c.push=t,c=c.slice();for(var u=0;u<c.length;u++)t(c[u]);var l=s;r.push([14,"chunk-vendors","chunk-common"]),n()})({14:function(e,t,n){e.exports=n("c9ab")},c9ab:function(e,t,n){"use strict";n.r(t);n("a7cc"),n("450d");var o=n("df33"),a=n.n(o),r=(n("cadf"),n("551c"),n("f751"),n("097d"),n("9ab4")),i=(n("76ca"),n("abfe"),n("db4d"),n("60a3")),c=n("aaaf"),s=n("1189"),u=n("a925"),l=n("b9c5"),p=n("3435"),f=n("ebb9"),g=n("9347"),d=n("7d83"),h=n("0a56"),v=n("d939"),b=n("2e54");i["c"].config.productionTip=!1;var y=f["a"].getMobWebBaseUrl()+"/kaixue.html";v["a"].checkMobile(y),i["c"].use(u["a"]);l["a"].getInstace(g["a"].REGION_CODE_1,g["a"].ZH_CN);var _=p["a"].getInstance();_.init();var k=new u["a"](_),w=function(e){function t(){var t=null!==e&&e.apply(this,arguments)||this;return t.activity_id=177,t.activity_json=b["a"].getInstace("pc",t.activity_id),t.webParam=l["a"].getInstace(),t}return r["c"](t,e),t.prototype.created=function(){this.activityJson=this.activity_json,this.imageHeadUrl=f["a"].getImgBaseUrl(),this.account_token=d["a"].getUserToken().account_token,this.setBaseUrl(f["a"].getBaseUrl()),this.getActivityId(),this.getActivityDetail(),this.getReferActivitys(),""==this.account_token&&(this.refer_code="请先登录!",this.refer_code_link="请先登录!")},t.prototype.mounted=function(){var e=this;window.onscroll=function(){e.pageScroll(887)},this.luck.init("prize",".kx_prize"),this.getAwardList();var t=this;setInterval(function(){t.clock=Object.assign({},t.getClock(t.activity_json.endtime))},1e3)},t.prototype.generateRefercodeLink=function(e){this.refer_code_link=f["a"].getUserBaseUrl()+"/"+v["a"].HTML_NAME_REGISTER+"?refer_code="+e},t.prototype.gotoLogin=function(){v["a"].webGotoUser(f["a"].getUserBaseUrl(),v["a"].HTML_NAME_LOGIN,"to=https://www.leigod.com/kaixue&page=1")},t.prototype.gotoRecharge=function(){v["a"].webGotoUser(f["a"].getUserBaseUrl(),v["a"].HTML_NAME_USER,"page=1")},t.prototype.gotoDuijiang=function(e){void 0===e&&(e=0),3!=e&&v["a"].webGotoUser(f["a"].getUserBaseUrl(),v["a"].HTML_NAME_USER,"page=7")},t.prototype.tokenExpired=function(e){void 0===e&&(e=null),d["a"].loginOut(),this.account_token="",this.userInfo=null,this.$refs.head.checkLogin()},t.prototype.onChangeLanguage=function(e){_.changeLanguage(e),k.locale=_.locale,this.webParam.language=e},t=r["b"]([Object(i["a"])({components:{"head-nav":c["a"],"foot-nav":s["a"],"el-dialog":a.a}})],t),t}(h["a"]);new w({i18n:k}).$mount("#app")}});
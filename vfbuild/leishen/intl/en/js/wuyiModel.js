(function(t){function e(e){for(var n,r,s=e[0],c=e[1],u=e[2],d=0,f=[];d<s.length;d++)r=s[d],o[r]&&f.push(o[r][0]),o[r]=0;for(n in c)Object.prototype.hasOwnProperty.call(c,n)&&(t[n]=c[n]);h&&h(e);while(f.length)f.shift()();return a.push.apply(a,u||[]),i()}function i(){for(var t,e=0;e<a.length;e++){for(var i=a[e],n=!0,s=1;s<i.length;s++){var c=i[s];0!==o[c]&&(n=!1)}n&&(a.splice(e--,1),t=r(r.s=i[0]))}return t}var n={},o={wuyiModel:0},a=[];function r(e){if(n[e])return n[e].exports;var i=n[e]={i:e,l:!1,exports:{}};return t[e].call(i.exports,i,i.exports,r),i.l=!0,i.exports}r.m=t,r.c=n,r.d=function(t,e,i){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:i})},r.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var i=Object.create(null);if(r.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var n in t)r.d(i,n,function(e){return t[e]}.bind(null,n));return i},r.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="";var s=window["webpackJsonp"]=window["webpackJsonp"]||[],c=s.push.bind(s);s.push=e,s=s.slice();for(var u=0;u<s.length;u++)e(s[u]);var h=c;a.push([34,"chunk-vendors","chunk-common"]),i()})({34:function(t,e,i){t.exports=i("8411")},8411:function(t,e,i){"use strict";i.r(e);i("a7cc"),i("450d");var n=i("df33"),o=i.n(n),a=(i("7514"),i("be4f"),i("896a")),r=i.n(a),s=(i("cadf"),i("551c"),i("f751"),i("097d"),i("9ab4")),c=(i("d16e"),i("76ca"),i("bf03"),i("db4d"),i("60a3")),u=i("aaaf"),h=i("1189"),d=i("360e"),f=i("a2d8"),l=i("caf4"),p=i("a925"),g=i("b9c5"),_=i("3435"),v=i("ebb9"),y=i("9347"),b=i("7d83"),k=i("0a56"),L=i("d939"),w=i("2e54"),m=i("1157"),I=i.n(m),U=i("1831"),x=i("3c6c");c["c"].config.productionTip=!1,c["c"].use(r.a),c["c"].use(p["a"]);g["a"].getInstace(y["a"].REGION_CODE_1,y["a"].ZH_CN);var T=_["a"].getInstance();T.init();var P=new p["a"](T),E=function(t){function e(){var e=null!==t&&t.apply(this,arguments)||this;return e.activity_id=193,e.activity_json=w["a"].getInstace("pc",e.activity_id),e.webParam=g["a"].getInstace(),e.package_index=1,e.isLoading=!1,e.chooseinfo=new x["p"],e.PriceList=new x["n"],e.priceList1=new x["n"],e.priceList2=new x["n"],e}return s["c"](e,t),e.prototype.created=function(){this.priceList1.price_id=7,this.priceList1.price_num="49元",this.priceList1.price_title="800",this.priceList2.price_id=10,this.priceList2.price_num="279元",this.priceList2.price_title="9000",this.activityJson=this.activity_json,this.imageHeadUrl=v["a"].getImgBaseUrl(),this.account_token=b["a"].getUserToken().account_token,this.chooseinfo=b["a"].getUserInfo(),this.setBaseUrl(v["a"].getBaseUrl()),this.getActivityId(),this.getActivityDetail(),this.getReferActivitys(),this.changePackageIndex(1),this.getUserInfo(),""==this.account_token&&(this.refer_code="请先登录!",this.refer_code_link="请先登录!"),y["a"].checkIsMobile()},e.prototype.mounted=function(){return s["a"](this,void 0,void 0,function(){var t,e,i=this;return s["d"](this,function(n){return window.onscroll=function(){i.pageScroll(942)},t=(new Date).getTime(),e=new Date(this.activity_json.endtime).getTime(),t>=e&&(this.dialog_msg="活动已过期!",this.dialog_error=!0),this.getAwardList(),[2]})})},e.prototype.logined=function(){this.getUserInfo(),this.account_token=b["a"].getUserToken().account_token,this.getActivityDetail(),this.getReferActivitys()},e.prototype.logout=function(){this.getUserInfo(),this.account_token=b["a"].getUserToken().account_token,this.aCount=0,this.refer_code="请先登录!",this.refer_code_link="请先登录!"},e.prototype.changePackageIndex=function(t){this.package_index=t,0===t?this.PriceList=this.priceList1:1===t&&(this.PriceList=this.priceList2)},e.prototype.getUserInfo=function(){return s["a"](this,void 0,void 0,function(){var t,e,i,n;return s["d"](this,function(o){switch(o.label){case 0:return o.trys.push([0,4,,5]),this.isLoading=!0,t=y["a"].getUrlParam("account_token")||b["a"].getUserToken().account_token,""!=t?[3,1]:(this.tokenExpired(),[3,3]);case 1:return e=U["a"].URL_USER_INFO,i={account_token:t},n=this,[4,this.http.post(e,i)];case 2:n.backData=o.sent(),this.isLoading=!1,this.backData.code==U["a"].HTTP_SUCCESS_NET_CODE?(this.$refs.headnav.isRealLogin=!0,this.userInfo=this.backData.data,x["p"].getUserName(this.userInfo),x["p"].getUserAvatar(this.userInfo),x["p"].updateUserInfo(this.userInfo),this.$refs.headnav.checkLogin(),this.$refs.to_recharge.getUserinfoSuccess()):this.backData.code==U["a"].HTTP_TOKEN_EXPIRE?(this.tokenExpired(),this.$refs.headnav.isLogin=!1):(this.$refs.headnav.isLogin=!1,this.getUserinfoFail(this.backData)),o.label=3;case 3:return[3,5];case 4:return o.sent(),[3,5];case 5:return[2]}})})},e.prototype.getUserinfoFail=function(t){this.tokenExpired()},e.prototype.initAwardList=function(){this.awardList.length<=4||I()(function(){setInterval(function(){var t=I()("#jilu_box");t.animate({marginTop:"-30px"},400,function(){t.find("li").eq(0).appendTo(t),t.find("li").eq(0).appendTo(t),t.css("margin-top","0")})},2e3)})},e.prototype.generateRefercodeLink=function(t){this.refer_code_link=v["a"].getUserBaseUrl()+"/"+L["a"].HTML_NAME_REGISTER+"?refer_code="+t},e.prototype.gotoInvite=function(){this.onCloseRecharge(),window.location.href="#step1"},e.prototype.gotoLogin=function(){this.dialog_no_login=!1,I()("body").removeClass("body_fixed"),""!=this.account_token&&null!=this.account_token||this.$refs.headnav.toLogin()},e.prototype.gotoRecharge=function(){return s["a"](this,void 0,void 0,function(){return s["d"](this,function(t){switch(t.label){case 0:return""!=this.account_token&&null!=this.account_token?[3,1]:(I()("body").removeClass("body_fixed"),this.dialog_no_login=!0,[3,3]);case 1:return this.$refs.to_recharge.payDialogVisible=!0,[4,this.$refs.to_recharge.tryPay(this.PriceList)];case 2:t.sent(),t.label=3;case 3:return[2]}})})},e.prototype.gotoDuijiang=function(t){void 0===t&&(t=0),""==this.account_token||null==this.account_token?(I()("body").addClass("body_fixed"),this.dialog_no_login=!0):3!=t&&(this.$refs.activeRecordList.recordDialogVisible=!0,this.$refs.activeRecordList.initA())},e.prototype.tokenExpired=function(t){void 0===t&&(t=null),b["a"].loginOut(),this.account_token="",this.userInfo=null,this.$refs.headnav.checkLogin()},e.prototype.onChangeLanguage=function(t){T.changeLanguage(t),P.locale=T.locale,this.webParam.language=t},e=s["b"]([Object(c["a"])({components:{"head-nav":u["a"],"foot-nav":h["a"],"recharge-dialog":f["a"],"record-dialog":l["a"],"el-dialog":o.a,"download-box":d["a"]}})],e),e}(k["a"]);new E({i18n:P}).$mount("#app")}});
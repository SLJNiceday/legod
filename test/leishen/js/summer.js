(function(t){function e(e){for(var i,r,s=e[0],c=e[1],u=e[2],_=0,l=[];_<s.length;_++)r=s[_],o[r]&&l.push(o[r][0]),o[r]=0;for(i in c)Object.prototype.hasOwnProperty.call(c,i)&&(t[i]=c[i]);h&&h(e);while(l.length)l.shift()();return a.push.apply(a,u||[]),n()}function n(){for(var t,e=0;e<a.length;e++){for(var n=a[e],i=!0,s=1;s<n.length;s++){var c=n[s];0!==o[c]&&(i=!1)}i&&(a.splice(e--,1),t=r(r.s=n[0]))}return t}var i={},o={summer:0},a=[];function r(e){if(i[e])return i[e].exports;var n=i[e]={i:e,l:!1,exports:{}};return t[e].call(n.exports,n,n.exports,r),n.l=!0,n.exports}r.m=t,r.c=i,r.d=function(t,e,n){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},r.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var i in t)r.d(n,i,function(e){return t[e]}.bind(null,i));return n},r.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="";var s=window["webpackJsonp"]=window["webpackJsonp"]||[],c=s.push.bind(s);s.push=e,s=s.slice();for(var u=0;u<s.length;u++)e(s[u]);var h=c;a.push([24,"chunk-vendors","chunk-common"]),n()})({24:function(t,e,n){t.exports=n("37d9")},"2e8f":function(t,e,n){},"37d9":function(t,e,n){"use strict";n.r(e);n("a7cc"),n("450d");var i=n("df33"),o=n.n(i),a=(n("7514"),n("55dd"),n("6b54"),n("ac6a"),n("be4f"),n("896a")),r=n.n(a),s=(n("46a1"),n("e5f2")),c=n.n(s),u=(n("cadf"),n("551c"),n("f751"),n("097d"),n("9ab4")),h=(n("d16e"),n("76ca"),n("2e8f"),n("db4d"),n("60a3")),_=n("aaaf"),l=n("1189"),g=n("360e"),d=n("a2d8"),f=n("caf4"),p=n("a925"),k=n("b9c5"),m=n("3435"),v=n("ebb9"),b=n("9347"),w=n("7d83"),y=n("0a56"),T=n("b311"),I=n.n(T),L=n("2e54"),x=n("1157"),U=n.n(x),D=n("1831"),E=n("3c6c"),P=n("255e");h["c"].config.productionTip=!1,h["c"].prototype.$notify=c.a,h["c"].use(r.a),h["c"].use(p["a"]);k["a"].getInstace(b["a"].REGION_CODE_1,b["a"].ZH_CN);var O=m["a"].getInstance();O.init();var S=new p["a"](O),R=function(t){function e(){var e=null!==t&&t.apply(this,arguments)||this;return e.activity_id=203,e.activity_json=L["a"].getInstace("pc",e.activity_id),e.webParam=k["a"].getInstace(),e.package_index=1,e.isLoading=!1,e.up_btn_show_timer=null,e.default_awardList=[],e.summer_weibo_show=!0,e.summer_weixin_show=!0,e.summer_weibo_dialog=!1,e.summer_weixin_dialog=!1,e.count_min=10,e.weibo_guanzhu_is_show=!0,e.weixin_guanzhu_is_show=!0,e}return u["c"](e,t),e.prototype.created=function(){return u["a"](this,void 0,void 0,function(){return u["d"](this,function(t){switch(t.label){case 0:return this.activityJson=this.activity_json,this.imageHeadUrl=v["a"].getImgBaseUrl(),this.account_token=w["a"].getUserToken().account_token,this.setBaseUrl(v["a"].getBaseUrl()),this.getActivityId(),this.getActivityDetail(),[4,this.getUserInfo()];case 1:return t.sent(),this.getGuanzhuStatus(),""==this.account_token&&(this.refer_code="",this.refer_code_link=""),b["a"].checkIsMobile(),[2]}})})},e.prototype.mounted=function(){return u["a"](this,void 0,void 0,function(){var t=this;return u["d"](this,function(e){return window.onscroll=function(){t.pageScroll(942)},this.luck.init("prize",".summer_choujiang_li"),this.getAwardList(),[2]})})},e.prototype.logined=function(){return u["a"](this,void 0,void 0,function(){return u["d"](this,function(t){switch(t.label){case 0:return[4,this.getUserInfo()];case 1:return t.sent(),this.account_token=w["a"].getUserToken().account_token,this.getActivityDetail(),[4,this.$refs.to_recharge.getUserDiscount()];case 2:return t.sent(),[4,this.$refs.to_recharge.getUserPackage()];case 3:return t.sent(),[2]}})})},e.prototype.logout=function(){this.account_token=w["a"].getUserToken().account_token,this.aCount=0,this.refer_code="请先登录!",this.refer_code_link="请先登录!"},e.prototype.clickWeibo=function(){var t=this;if(""!=this.account_token&&null!=this.account_token){this.summer_weibo_dialog=!0;var e=setInterval(function(){t.count_min--,0==t.count_min&&(t.weibo_guanzhu_is_show=!1,t.count_min=10,clearInterval(e))},1e3)}else this.gotoLogin()},e.prototype.clickWeixin=function(){var t=this;if(""!=this.account_token&&null!=this.account_token){this.summer_weixin_dialog=!0;var e=setInterval(function(){t.count_min--,0==t.count_min&&(t.weixin_guanzhu_is_show=!1,t.count_min=10,clearInterval(e))},1e3)}else this.gotoLogin()},e.prototype.closeGuanzhu=function(){this.summer_weixin_dialog=!1,this.summer_weibo_dialog=!1},e.prototype.getGuanzhuStatus=function(){return u["a"](this,void 0,void 0,function(){var t,e,n,i,o=this;return u["d"](this,function(a){switch(a.label){case 0:return t=b["a"].getUrlParam("account_token")||w["a"].getUserToken().account_token,e=D["a"].URL_ATTENTION_ISJOIN,n={account_token:t},i=this,[4,this.http.post(e,n)];case 1:return i.backData=a.sent(),this.backData.code==D["a"].HTTP_SUCCESS_NET_CODE?this.backData.data.length>0?(this.summer_weibo_show=!1,this.summer_weixin_show=!1,this.backData.data.forEach(function(t){switch(t.type){case 1:o.summer_weibo_show=!0;case 2:o.summer_weixin_show=!0}})):(this.summer_weibo_show=!1,this.summer_weixin_show=!1):this.backData.code==D["a"].HTTP_TOKEN_EXPIRE&&this.tokenExpired(this.backData.msg),[2]}})})},e.prototype.getGuanzhuPrize=function(t){return u["a"](this,void 0,void 0,function(){var e,n,i,o;return u["d"](this,function(a){switch(a.label){case 0:return this.closeGuanzhu(),e=b["a"].getUrlParam("account_token")||w["a"].getUserToken().account_token,n=D["a"].URL_ATTENTION_JOIN,i={account_token:e,type:t,activity_id:206},o=this,[4,this.http.post(n,i)];case 1:return o.backData=a.sent(),this.backData.code==D["a"].HTTP_SUCCESS_NET_CODE?(console.log(this.backData),this.dialog_error=!0,this.dialog_msg="领取成功",1==t?this.summer_weibo_show=!1:2==t&&(this.summer_weixin_show=!1)):this.backData.code==D["a"].HTTP_TOKEN_EXPIRE&&this.tokenExpired(this.backData.msg),[2]}})})},e.prototype.getPriceList=function(){return u["a"](this,void 0,void 0,function(){var t,e;return u["d"](this,function(n){switch(n.label){case 0:return t=w["a"].getLanguage().toString(),[4,P["a"].getInstance().getRechargeJson(v["a"].getWebBaseUrl())];case 1:return e=n.sent(),this.priceList=e["1__"+t].price,this.priceList.sort(function(t,e){return e.price_is_recommend-t.price_is_recommend}),[2]}})})},e.prototype.changePackageIndex=function(t){this.package_index=t},e.prototype.getUserInfo=function(){return u["a"](this,void 0,void 0,function(){var t,e,n,i;return u["d"](this,function(o){switch(o.label){case 0:return o.trys.push([0,4,,5]),this.isLoading=!0,t=b["a"].getUrlParam("account_token")||w["a"].getUserToken().account_token,""!=t?[3,1]:[2];case 1:return e=D["a"].URL_USER_INFO,n={account_token:t},i=this,[4,this.http.post(e,n)];case 2:i.backData=o.sent(),this.isLoading=!1,this.backData.code==D["a"].HTTP_SUCCESS_NET_CODE?(this.$refs.headnav.isRealLogin=!0,this.userInfo=this.backData.data,E["o"].getUserName(this.userInfo),E["o"].getUserAvatar(this.userInfo),E["o"].updateUserInfo(this.userInfo),this.$refs.headnav.checkLogin()):this.backData.code==D["a"].HTTP_TOKEN_EXPIRE?(this.tokenExpired(this.backData.msg),this.$refs.headnav.isLogin=!1):(this.$refs.headnav.isLogin=!1,this.getUserinfoFail(this.backData)),o.label=3;case 3:return[3,5];case 4:return o.sent(),[3,5];case 5:return[2]}})})},e.prototype.getUserinfoFail=function(t){this.tokenExpired(t.msg)},e.prototype.initAwardList=function(){this.awardList.length<=6||U()(function(){setInterval(function(){var t=U()("#jilu_box");t.animate({marginTop:"-50px"},400,function(){t.find("li").eq(0).appendTo(t),t.css("margin-top","0")})},2e3)})},e.prototype.clickReverse=function(t){this.isBengin||(this.kp_index=t,this.onClickDraw())},e.prototype.generateRefercodeLink=function(t){this.refer_code_link=b["a"].getOrigin()+"/leigod/kapai.html?refer_code="+t+"#recharge"},e.prototype.copyRefercodeLink=function(){if(""!=this.account_token){var t=this,e=new I.a("#copyRefercodeLink",{text:function(){return t.refer_code_link}});e.on("success",function(e){e.clearSelection(),t.dialog_error=!0,t.dialog_msg="邀请链接已复制到剪切板！快去邀请好友充值获取时长卡吧！"})}else this.gotoLogin()},e.prototype.gotoInvite=function(){this.onCloseRecharge(),this.gotoRecharge()},e.prototype.gotoLogin=function(){this.dialog_no_login=!1,U()("body").removeClass("body_fixed"),""!=this.account_token&&null!=this.account_token||this.$refs.headnav.toLogin()},e.prototype.gotoRecharge=function(){""==this.account_token||null==this.account_token?this.gotoLogin():(this.$refs.to_recharge.onChoosePrice(0),this.$refs.to_recharge.buyDefaultPrice())},e.prototype.gotoDuijiang=function(t){void 0===t&&(t=0),this.closeDialog(),""==this.account_token||null==this.account_token?this.gotoLogin():3!=t&&(this.$refs.activeRecordList.recordDialogVisible=!0,this.$refs.activeRecordList.initA())},e.prototype.tokenExpired=function(t){void 0===t&&(t=null),w["a"].loginOut(),this.account_token="",this.userInfo=null,this.$refs.headnav.checkLogin()},e.prototype.onChangeLanguage=function(t){O.changeLanguage(t),S.locale=O.locale,this.webParam.language=t},e=u["b"]([Object(h["a"])({components:{"head-nav":_["a"],"foot-nav":l["a"],"recharge-dialog":d["a"],"record-dialog":f["a"],"el-dialog":o.a,"download-box":g["a"]}})],e),e}(y["a"]);new R({i18n:S}).$mount("#app")}});
(function(t){function e(e){for(var o,r,a=e[0],c=e[1],u=e[2],d=0,_=[];d<a.length;d++)r=a[d],n[r]&&_.push(n[r][0]),n[r]=0;for(o in c)Object.prototype.hasOwnProperty.call(c,o)&&(t[o]=c[o]);h&&h(e);while(_.length)_.shift()();return s.push.apply(s,u||[]),i()}function i(){for(var t,e=0;e<s.length;e++){for(var i=s[e],o=!0,a=1;a<i.length;a++){var c=i[a];0!==n[c]&&(o=!1)}o&&(s.splice(e--,1),t=r(r.s=i[0]))}return t}var o={},n={activitys_summer:0},s=[];function r(e){if(o[e])return o[e].exports;var i=o[e]={i:e,l:!1,exports:{}};return t[e].call(i.exports,i,i.exports,r),i.l=!0,i.exports}r.m=t,r.c=o,r.d=function(t,e,i){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:i})},r.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var i=Object.create(null);if(r.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)r.d(i,o,function(e){return t[e]}.bind(null,o));return i},r.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="/";var a=window["webpackJsonp"]=window["webpackJsonp"]||[],c=a.push.bind(a);a.push=e,a=a.slice();for(var u=0;u<a.length;u++)e(a[u]);var h=c;s.push([15,"chunk-vendors","chunk-common"]),i()})({15:function(t,e,i){t.exports=i("eda8")},ba2a:function(t,e,i){},eda8:function(t,e,i){"use strict";i.r(e);i("55dd"),i("4917"),i("386d"),i("ac6a"),i("e7e5");var o=i("d399"),n=(i("8a58"),i("e41f")),s=(i("cadf"),i("551c"),i("f751"),i("097d"),i("9ab4")),r=(i("ba2a"),i("db4d"),i("60a3")),a=i("a925"),c=i("1157"),u=i.n(c),h=i("b311"),d=i.n(h),_=i("1396"),g=i("82f5"),f=i("9347"),l=i("7d83"),p=i("0a56"),w=i("2e54"),m=i("dfdf"),k=i("1831"),y=i("3c6c"),b=i("38e7"),v=i("c2e8"),D=i("955a"),T=i("ce89"),U=i("879b");r["c"].use(n["a"]),r["c"].use(o["a"]),r["c"].config.productionTip=!1,r["c"].use(a["a"]);var E=m["a"].getInstace(f["a"].REGION_CODE_1,f["a"].ZH_CN),I=_["a"].getInstance();I.init();var L=new a["a"](I),P=function(t){function e(){var e=null!==t&&t.apply(this,arguments)||this;return e.activity_id=213,e.isLoading=!1,e.activity_json=w["a"].getInstace("mobile",e.activity_id),e.appParam=m["a"].getInstace(),e.chooseinfo=new y["w"],e.choosePriceInfo=new y["r"],e.showType=1,e.show_dialog=!1,e.show_reward=!1,e.show_recharge=!1,e.userDiscountList=[],e.userDiscount="",e.summer_weibo_show=!0,e.summer_weixin_show=!0,e.summer_weibo_dialog=!1,e.summer_weixin_dialog=!1,e.count_min=10,e.weibo_guanzhu_is_show=!0,e.weixin_guanzhu_is_show=!0,e}return s["c"](e,t),e.prototype.created=function(){return s["a"](this,void 0,void 0,function(){return s["d"](this,function(t){switch(t.label){case 0:return this.activityJson=this.activity_json,this.imageHeadUrl=g["a"].getImgBaseUrl(),this.chooseinfo=l["a"].getUserInfo(),this.account_token=l["a"].getUserToken().account_token,""==this.account_token&&(this.refer_code="请先登录!",this.refer_code_link="请先登录!"),this.getActivityId(),this.setBaseUrl(g["a"].getBaseUrl()),this.checkEnvironment(),this.getActivityDetail(),this.getAwardList(),this.getReferActivitys(),[4,this.getUserInfo()];case 1:return t.sent(),this.getGuanzhuStatus(),this.getUserDiscount(),this.$refs.to_recharge.init(),[2]}})})},e.prototype.mounted=function(){this.luck.init("prize",".summer_choujiang_li")},e.prototype.clickWeibo=function(){var t=this;if(""!=this.account_token&&null!=this.account_token){if(0==this.userInfo.is_pay_user)return this.dialog_msg="当前活动仅限雷神超级会员参与！",void(this.dialog_error=!0);this.summer_weibo_dialog=!0;var e=setInterval(function(){t.count_min--,0==t.count_min&&(t.weibo_guanzhu_is_show=!1,t.count_min=10,clearInterval(e))},1e3)}else this.gotoLogin()},e.prototype.clickWeixin=function(){var t=this;if(""!=this.account_token&&null!=this.account_token){if(0==this.userInfo.is_pay_user)return this.dialog_msg="当前活动仅限雷神超级会员参与！",void(this.dialog_error=!0);this.summer_weixin_dialog=!0;var e=setInterval(function(){t.count_min--,0==t.count_min&&(t.weixin_guanzhu_is_show=!1,t.count_min=10,clearInterval(e))},1e3)}else this.gotoLogin()},e.prototype.closeGuanzhu=function(){this.summer_weixin_dialog=!1,this.summer_weibo_dialog=!1},e.prototype.getGuanzhuStatus=function(){return s["a"](this,void 0,void 0,function(){var t,e,i,o,n=this;return s["d"](this,function(s){switch(s.label){case 0:return t=f["a"].getUrlParam("account_token")||l["a"].getUserToken().account_token,e=k["a"].URL_ATTENTION_ISJOIN,i={account_token:t},o=this,[4,this.http.post(e,i)];case 1:return o.backData=s.sent(),this.backData.code==k["a"].HTTP_SUCCESS_NET_CODE?this.backData.data.length>0?(this.summer_weibo_show=!1,this.summer_weixin_show=!1,this.backData.data.forEach(function(t){switch(t.type){case 1:n.summer_weibo_show=!0;break;case 2:n.summer_weixin_show=!0;break}})):(this.summer_weibo_show=!1,this.summer_weixin_show=!1):this.backData.code==k["a"].HTTP_TOKEN_EXPIRE&&this.tokenExpired(this.backData.msg),[2]}})})},e.prototype.getGuanzhuPrize=function(t){return s["a"](this,void 0,void 0,function(){var e,i,o,n;return s["d"](this,function(s){switch(s.label){case 0:return this.closeGuanzhu(),e=f["a"].getUrlParam("account_token")||l["a"].getUserToken().account_token,i=k["a"].URL_ATTENTION_JOIN,o={account_token:e,type:t,activity_id:this.activity_id},n=this,[4,this.http.post(i,o)];case 1:return n.backData=s.sent(),this.backData.code==k["a"].HTTP_SUCCESS_NET_CODE?(console.log(this.backData),this.dialog_error=!0,this.dialog_msg="领取成功",1==t?this.summer_weibo_show=!1:2==t&&(this.summer_weixin_show=!1)):this.backData.code==k["a"].HTTP_TOKEN_EXPIRE&&this.tokenExpired(this.backData.msg),[2]}})})},e.prototype.getAwardListSuccess=function(){this.initAwardList()},Object.defineProperty(e.prototype,"activComponent",{get:function(){switch(this.showType){case 1:return"login-dialog";case 2:return"register-dialog";case 3:return"forget-dialog"}},enumerable:!0,configurable:!0}),e.prototype.toLogin=function(){this.showType=1},e.prototype.toRegister=function(){this.showType=2},e.prototype.toForgetPwd=function(){this.showType=3},e.prototype.alreadyLogin=function(t){0==t&&(this.show_dialog=!1,window.location.href=window.location.href+"?"+window.location.search+"&"+100*Math.random())},e.prototype.checkEnvironment=function(){u()(function(){var t=navigator.userAgent,e=(t.indexOf("Android")>-1||t.indexOf("Adr"),t.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),window.navigator.userAgent.toLowerCase());"micromessenger"==e.match(/MicroMessenger/i)&&(E.platform=4)})},e.prototype.getUserInfo=function(){return s["a"](this,void 0,void 0,function(){var t,e,i,o;return s["d"](this,function(n){switch(n.label){case 0:return n.trys.push([0,4,,5]),this.isLoading=!0,t=f["a"].getUrlParam("account_token")||l["a"].getUserToken().account_token,""!=t?[3,1]:(this.tokenExpired(),[3,3]);case 1:return e=k["a"].URL_USER_INFO,i={account_token:t},o=this,[4,this.http.post(e,i)];case 2:o.backData=n.sent(),this.isLoading=!1,this.backData.code==k["a"].HTTP_SUCCESS_NET_CODE?(this.userInfo=this.backData.data,y["w"].getUserName(this.userInfo),y["w"].getUserAvatar(this.userInfo),y["w"].updateUserInfo(this.userInfo),this.checkisBinbMobile(this.userInfo,"app")):this.backData.code==k["a"].HTTP_TOKEN_EXPIRE?this.tokenExpired():this.getUserinfoFail(this.backData),n.label=3;case 3:return[3,5];case 4:return n.sent(),[3,5];case 5:return[2]}})})},e.prototype.getUserinfoFail=function(t){this.tokenExpired()},e.prototype.clickReverse=function(t){this.isBengin||(this.kp_index=t,this.onClickDraw())},e.prototype.onClickDraw=function(){if(!this.isBengin)if(""!=this.account_token){if(this.aCount<=0)return u()("body").addClass("body_fixed"),void(this.dialog_recharge=!0);this.isBengin=!0,this.onDraw(0,1e3)}else this.gotoLogin()},e.prototype.getUserDiscount=function(){return s["a"](this,void 0,void 0,function(){var t,e,i,o;return s["d"](this,function(n){switch(n.label){case 0:return this.isLoading=!0,t=l["a"].getUserToken().account_token,e=k["a"].URL_USER_DISCOUNT,i={account_token:t,region_code:l["a"].getRegionCodes()},o=this,[4,this.http.post(e,i)];case 1:return o.backData=n.sent(),this.isLoading=!1,this.backData.code==k["a"].HTTP_SUCCESS_NET_CODE?(this.userDiscountList=this.backData.data,this.userDiscountList=this.userDiscountList.sort(function(t,e){var i=t.discount_value,o=e.discount_value;return o-i}),this.getUserDiscountSuccess()):this.backData.code==k["a"].HTTP_TOKEN_EXPIRE?this.tokenExpired():this.getUserDiscountError(),[2]}})})},e.prototype.getUserDiscountSuccess=function(){this.userDiscountList.length>0&&(this.userDiscount=this.userDiscountList[0].discount_code)},e.prototype.getUserDiscountError=function(){},e.prototype.gotoRecharge=function(){return s["a"](this,void 0,void 0,function(){var t;return s["d"](this,function(e){return t=f["a"].getUrlParam("account_token")||l["a"].getUserToken().account_token,""==t?(this.gotoLogin(),[2]):0==this.userInfo.is_switch_package&&"0"==this.$refs.to_recharge.packageList[this.$refs.to_recharge.czTypeIndex].include_region_codes?(o["a"].fail("此活动只针对于雷神超级会员，海外会员不在此活动范围内！"),[2,!1]):(4!=this.appParam.platform?(this.dialog_recharge=!1,this.show_recharge=!this.show_recharge,u()("body").removeClass("body_fixed"),this.choosePriceInfo=this.$refs.to_recharge.priceList[0],this.$refs.to_recharge.getUserPackageSuccess()):4===this.appParam.platform&&this.$refs.to_recharge.buyDefaultPrice(),[2])})})},e.prototype.paySuccess=function(){return s["a"](this,void 0,void 0,function(){return s["d"](this,function(t){switch(t.label){case 0:return this.getActivityDetail(),[4,this.getUserInfo()];case 1:return t.sent(),this.$refs.to_recharge.init(),[2]}})})},e.prototype.gotoInvite=function(){this.onCloseRecharge(),window.location.href="#step1"},e.prototype.generateRefercodeLink=function(t){this.refer_code_link=g["a"].getWebBaseUrl()+"/leigod/kapai.html?refer_code="+t},e.prototype.copyRefercodeLink=function(){if(""!=this.account_token){var t=this,e=new d.a("#copyRefercodeLink",{text:function(){return t.refer_code_link}});e.on("success",function(e){e.clearSelection(),t.dialog_error=!0,t.dialog_msg="邀请链接已复制到剪切板！快去邀请好友充值获取时长卡吧！"})}else this.gotoLogin()},e.prototype.gotoRecord=function(){""!=this.account_token?(this.dialog_win=!1,this.show_reward=!0,this.$refs.to_reward.loadList()):this.gotoLogin()},e.prototype.closeReward=function(){this.show_reward=!1},e.prototype.gotoLogin=function(){this.show_dialog=!0,this.dialog_no_login=!1,u()("body").removeClass("body_fixed")},e.prototype.tokenExpired=function(t){void 0===t&&(t=null),l["a"].loginOut(),this.account_token="",this.userInfo=null,this.refer_code="请先登录!",this.refer_code_link="请先登录!"},e=s["b"]([Object(r["a"])({components:{"login-dialog":b["a"],"register-dialog":v["a"],"forget-dialog":D["a"],"recharge-dialog":T["a"],"reward-dialog":U["a"]}})],e),e}(p["a"]);new P({i18n:L}).$mount("#app")}});
(function(e){function t(t){for(var i,a,s=t[0],c=t[1],h=t[2],d=0,g=[];d<s.length;d++)a=s[d],n[a]&&g.push(n[a][0]),n[a]=0;for(i in c)Object.prototype.hasOwnProperty.call(c,i)&&(e[i]=c[i]);u&&u(t);while(g.length)g.shift()();return r.push.apply(r,h||[]),o()}function o(){for(var e,t=0;t<r.length;t++){for(var o=r[t],i=!0,s=1;s<o.length;s++){var c=o[s];0!==n[c]&&(i=!1)}i&&(r.splice(t--,1),e=a(a.s=o[0]))}return e}var i={},n={activitys_kapaiModel:0},r=[];function a(t){if(i[t])return i[t].exports;var o=i[t]={i:t,l:!1,exports:{}};return e[t].call(o.exports,o,o.exports,a),o.l=!0,o.exports}a.m=e,a.c=i,a.d=function(e,t,o){a.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},a.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},a.t=function(e,t){if(1&t&&(e=a(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(a.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)a.d(o,i,function(t){return e[t]}.bind(null,i));return o},a.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return a.d(t,"a",t),t},a.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},a.p="/";var s=window["webpackJsonp"]=window["webpackJsonp"]||[],c=s.push.bind(s);s.push=t,s=s.slice();for(var h=0;h<s.length;h++)t(s[h]);var u=c;r.push([6,"chunk-vendors","chunk-common"]),o()})({"3f09":function(e,t,o){"use strict";o.r(t);o("55dd"),o("6b54"),o("4917"),o("e7e5");var i=o("d399"),n=(o("8a58"),o("e41f")),r=(o("cadf"),o("551c"),o("f751"),o("097d"),o("9ab4")),a=(o("4394"),o("db4d"),o("60a3")),s=o("a925"),c=o("1157"),h=o.n(c),u=o("b311"),d=o.n(u),g=o("1396"),f=o("82f5"),l=o("9347"),p=o("7d83"),_=o("0a56"),m=o("2e54"),y=o("dfdf"),v=o("1831"),w=o("3c6c"),b=o("255e"),k=o("38e7"),T=o("c2e8"),I=o("955a"),U=o("ce89"),P=o("879b");a["c"].use(n["a"]),a["c"].use(i["a"]),a["c"].config.productionTip=!1,a["c"].use(s["a"]);var M=y["a"].getInstace(l["a"].REGION_CODE_1,l["a"].ZH_CN),O=g["a"].getInstance();O.init();var x=new s["a"](O),D=function(e){function t(){var t=null!==e&&e.apply(this,arguments)||this;return t.activity_id=200,t.isLoading=!1,t.activity_json=m["a"].getInstace("mobile",t.activity_id),t.appParam=y["a"].getInstace(),t.chooseinfo=new w["w"],t.choosePriceInfo=new w["r"],t.showType=1,t.show_dialog=!1,t.show_reward=!1,t.show_recharge=!1,t.pay_user_num=0,t.game_num01=1800,t.game_num02=1800,t.game_num03=1800,t}return r["c"](t,e),t.prototype.created=function(){this.activityJson=this.activity_json,this.imageHeadUrl=f["a"].getImgBaseUrl(),this.chooseinfo=p["a"].getUserInfo(),this.account_token=p["a"].getUserToken().account_token,""==this.account_token&&(this.refer_code="请先登录!",this.refer_code_link="请先登录!"),this.getActivityId(),this.setBaseUrl(f["a"].getBaseUrl()),this.checkEnvironment(),this.getPriceList(),this.getActivityDetail(),this.getReferActivitys(),this.getUserInfo()},Object.defineProperty(t.prototype,"activComponent",{get:function(){switch(this.showType){case 1:return"login-dialog";case 2:return"register-dialog";case 3:return"forget-dialog"}},enumerable:!0,configurable:!0}),t.prototype.toLogin=function(){this.showType=1},t.prototype.toRegister=function(){this.showType=2},t.prototype.toForgetPwd=function(){this.showType=3},t.prototype.alreadyLogin=function(e){0==e&&(this.show_dialog=!1,window.location.reload())},t.prototype.getActivityDetailSuccess=function(e){var t=this,o=(new Date).getTime(),i=!0;o>new Date(l["a"].formateTime(e.end_time)).getTime()&&(o=new Date(l["a"].formateTime(e.end_time)).getTime(),i=!1),o<new Date(l["a"].formateTime(e.start_time)).getTime()&&(o=new Date(l["a"].formateTime(e.start_time)).getTime(),i=!1);var n=new Date(l["a"].formateTime(e.start_time)).getTime();this.pay_user_num=Math.floor((o-n)/1e4)+Math.floor(20*Math.random()+180),this.game_num01=1200-Math.floor((o-n)/102e4)+Math.round(10*Math.random()),this.game_num02=this.game_num01+Math.round(10*(2*Math.random()-1)),this.game_num03=this.game_num01+Math.round(10*(2*Math.random()-1)),this.game_num01<=0&&(this.game_num01=0),this.game_num02<=0&&(this.game_num02=0),this.game_num03<=0&&(this.game_num03=0),i&&setInterval(function(){t.pay_user_num+=1+Math.round(Math.random())},15e3)},t.prototype.checkEnvironment=function(){h()(function(){var e=navigator.userAgent,t=(e.indexOf("Android")>-1||e.indexOf("Adr"),e.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),window.navigator.userAgent.toLowerCase());"micromessenger"==t.match(/MicroMessenger/i)&&(M.platform=4)})},t.prototype.getPriceList=function(){return r["a"](this,void 0,void 0,function(){var e,t;return r["d"](this,function(o){switch(o.label){case 0:return e=p["a"].getLanguage().toString(),[4,b["a"].getInstance().getRechargeJson(f["a"].getWebBaseUrl())];case 1:return t=o.sent(),this.priceList=t[this.appParam.region_code+"__"+e].price,this.priceList.sort(function(e,t){return t.price_is_recommend-e.price_is_recommend}),this.choosePriceInfo=this.priceList[0],[2]}})})},t.prototype.getUserInfo=function(){return r["a"](this,void 0,void 0,function(){var e,t,o,i;return r["d"](this,function(n){switch(n.label){case 0:return n.trys.push([0,4,,5]),this.isLoading=!0,e=l["a"].getUrlParam("account_token")||p["a"].getUserToken().account_token,""!=e?[3,1]:(this.tokenExpired(),[3,3]);case 1:return t=v["a"].URL_USER_INFO,o={account_token:e},i=this,[4,this.http.post(t,o)];case 2:i.backData=n.sent(),this.isLoading=!1,this.backData.code==v["a"].HTTP_SUCCESS_NET_CODE?(this.userInfo=this.backData.data,w["w"].getUserName(this.userInfo),w["w"].getUserAvatar(this.userInfo),w["w"].updateUserInfo(this.userInfo),this.checkisBinbMobile(this.userInfo,"app")):this.backData.code==v["a"].HTTP_TOKEN_EXPIRE?this.tokenExpired():this.getUserinfoFail(this.backData),n.label=3;case 3:return[3,5];case 4:return n.sent(),[3,5];case 5:return[2]}})})},t.prototype.getUserinfoFail=function(e){this.tokenExpired()},t.prototype.clickReverse=function(e){this.isBengin||(this.kp_index=e,this.onClickDraw())},t.prototype.onClickDraw=function(){if(!this.isBengin){if(""==this.account_token)return h()("body").addClass("body_fixed"),void(this.dialog_no_login=!0);if(this.aCount<=0)return h()("body").addClass("body_fixed"),void(this.dialog_recharge=!0);this.isBengin=!0,this.onDraw(0,1e3)}},t.prototype.gotoRecharge=function(e){return r["a"](this,void 0,void 0,function(){var t;return r["d"](this,function(o){switch(o.label){case 0:return t=l["a"].getUrlParam("account_token")||p["a"].getUserToken().account_token,""!=t?[3,1]:(this.dialog_no_login=!0,[2]);case 1:return[4,this.$refs.to_recharge.getUserInfo()];case 2:o.sent(),this.choosePriceInfo=e,4!=this.appParam.platform?(this.dialog_recharge=!1,this.show_recharge=!this.show_recharge,h()("body").removeClass("body_fixed")):4===this.appParam.platform&&this.$refs.to_recharge.defaultPay(e),o.label=3;case 3:return[2]}})})},t.prototype.gotoInvite=function(){this.onCloseRecharge(),window.location.href="#step1"},t.prototype.generateRefercodeLink=function(e){this.refer_code_link=f["a"].getWebBaseUrl()+"/leigod/kapai.html?refer_code="+e},t.prototype.copyRefercodeLink=function(){if(""!=this.account_token){var e=this,t=new d.a("#copyRefercodeLink",{text:function(){return e.refer_code_link}});t.on("success",function(t){t.clearSelection(),e.dialog_error=!0,e.dialog_msg="邀请链接已复制到剪切板！快去邀请好友充值获取时长卡吧！"})}else this.dialog_no_login=!0},t.prototype.gotoRecord=function(){""!=this.account_token?(this.show_reward=!0,this.$refs.to_reward.loadList()):this.dialog_no_login=!0},t.prototype.gotoLogin=function(){this.show_dialog=!0,this.dialog_no_login=!1,h()("body").removeClass("body_fixed")},t.prototype.tokenExpired=function(e){void 0===e&&(e=null),p["a"].loginOut(),this.account_token="",this.userInfo=null,this.refer_code="请先登录!",this.refer_code_link="请先登录!"},t=r["b"]([Object(a["a"])({components:{"login-dialog":k["a"],"register-dialog":T["a"],"forget-dialog":I["a"],"recharge-dialog":U["a"],"reward-dialog":P["a"]}})],t),t}(_["a"]);new D({i18n:x}).$mount("#app")},6:function(e,t,o){e.exports=o("3f09")}});
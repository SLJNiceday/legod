(function(e){function t(t){for(var i,r,s=t[0],c=t[1],d=t[2],g=0,u=[];g<s.length;g++)r=s[g],n[r]&&u.push(n[r][0]),n[r]=0;for(i in c)Object.prototype.hasOwnProperty.call(c,i)&&(e[i]=c[i]);l&&l(t);while(u.length)u.shift()();return a.push.apply(a,d||[]),o()}function o(){for(var e,t=0;t<a.length;t++){for(var o=a[t],i=!0,s=1;s<o.length;s++){var c=o[s];0!==n[c]&&(i=!1)}i&&(a.splice(t--,1),e=r(r.s=o[0]))}return e}var i={},n={chunjie:0},a=[];function r(t){if(i[t])return i[t].exports;var o=i[t]={i:t,l:!1,exports:{}};return e[t].call(o.exports,o,o.exports,r),o.l=!0,o.exports}r.m=e,r.c=i,r.d=function(e,t,o){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},r.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(r.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)r.d(o,i,function(t){return e[t]}.bind(null,i));return o},r.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="";var s=window["webpackJsonp"]=window["webpackJsonp"]||[],c=s.push.bind(s);s.push=t,s=s.slice();for(var d=0;d<s.length;d++)t(s[d]);var l=c;a.push([6,"chunk-vendors","chunk-common"]),o()})({6:function(e,t,o){e.exports=o("bceb")},bceb:function(e,t,o){"use strict";o.r(t);o("a7cc"),o("450d");var i=o("df33"),n=o.n(i),a=(o("7514"),o("cadf"),o("551c"),o("f751"),o("097d"),o("9ab4")),r=(o("76ca"),o("db4d"),o("60a3")),s=o("1157"),c=o.n(s),d=o("aaaf"),l=o("1189"),g=o("a925"),u=o("b9c5"),p=o("3435"),f=o("ebb9"),h=o("9347"),_=o("7d83"),y=o("0a56"),b=o("d939"),v=o("b311"),m=o.n(v),w=o("a306");r["c"].config.productionTip=!1;var k=f["a"].getMobWebBaseUrl()+"/chunjie.html";b["a"].checkMobile(k),r["c"].use(g["a"]);u["a"].getInstace(h["a"].REGION_CODE_1,h["a"].ZH_CN);var x=p["a"].getInstance();x.init();var L=new g["a"](x),C=function(e){function t(){var t=null!==e&&e.apply(this,arguments)||this;return t.activity_id=174,t.endtime="2019-02-21 15:30:00",t.activity_type=8,t.webParam=u["a"].getInstace(),t.dialog_award=!1,t.dialog_guize=!1,t.dialog_no_login=!1,t.dialog_recharge=!1,t.dialog_copy_ref_link=!1,t.dialog_copy_ref=!1,t.dialog_error=!1,t.dialog_win=!1,t.tabIndex=0,t.refer_code_link="邀请链接",t.prize_name="",t.prize_img="",t.prize_id=-1,t.clock=new w["k"],t.sina_link="https://weibo.com/p/1006066443936086/manage?from=page_100606&mod=TAB#place",t.dialog_msg="",t}return a["c"](t,e),t.prototype.onChangeLanguage=function(e){x.changeLanguage(e),L.locale=x.locale,this.webParam.language=e},t.prototype.mounted=function(){this.getAwardList();var e=this;setInterval(function(){e.clock=Object.assign({},e.getClock(e.endtime))},1e3)},t.prototype.created=function(){this.imageHeadUrl=f["a"].getImgBaseUrl(),this.account_token=_["a"].getUserToken().account_token,this.setBaseUrl(f["a"].getBaseUrl()),this.getActivityId(),this.getActivityDetail(),this.getReferActivitys(),this.getReferList(this.activity_type),this.getActiveRecordList(),""==this.account_token&&(this.refer_code="请先登录!",this.refer_code_link="请先登录!")},t.prototype.changeTabPage=function(e){this.tabIndex=e,1==this.tabIndex&&this.getActiveRecordList()},t.prototype.onClickDraw=function(){if(this.dialog_win=!1,!this.isBengin){if(""==this.account_token)return c()("body").addClass("body_fixed"),void(this.dialog_no_login=!0);if(this.aCount<=0)return c()("body").addClass("body_fixed"),void(this.dialog_recharge=!0);this.isBengin=!0,this.onDraw(0,1e3)}},t.prototype.onDrawWin=function(e){this.points=e.data.points,this.isBengin=!1,this.isWin=!0,this.dialog_win=!0,this.prize_name=e.data.title,this.prize_id=e.data.present_id,this.getActivityCount(),this.getActiveRecordList()},t.prototype.onDrawLose=function(e){this.isBengin=!1,this.isWin=!1,this.dialog_error=!0,this.dialog_msg=e.msg,this.points=e.data.points,this.getActivityCount()},t.prototype.clickFudai=function(e){return""==this.account_token?(c()("body").addClass("body_fixed"),void(this.dialog_no_login=!0)):this.points<e?(c()("body").addClass("body_fixed"),void(this.dialog_recharge=!0)):void 0},t.prototype.continueDraw=function(){this.isBengin=!1,this.isWin=!1,this.dialog_win=!1,this.dialog_msg=""},t.prototype.gotoLogin=function(){b["a"].webGotoUser(f["a"].getUserBaseUrl(),b["a"].HTML_NAME_LOGIN)},t.prototype.gotoRecharge=function(){b["a"].webGotoUser(f["a"].getUserBaseUrl(),b["a"].HTML_NAME_USER,"page=1")},t.prototype.gotoDuijiang=function(e){void 0===e&&(e=0),3!=e&&b["a"].webGotoUser(f["a"].getUserBaseUrl(),b["a"].HTML_NAME_USER,"page=7")},t.prototype.onCloseRecharge=function(){this.dialog_recharge=!1,c()("body").removeClass("body_fixed")},t.prototype.onCloseNologin=function(){this.dialog_no_login=!1,c()("body").removeClass("body_fixed")},t.prototype.closeDialog=function(){this.dialog_msg="",this.dialog_error=!1,c()("body").removeClass("body_fixed")},t.prototype.generateRefercodeLink=function(e){this.refer_code_link=f["a"].getUserBaseUrl()+"/"+b["a"].HTML_NAME_REGISTER+"?refer_code="+e},t.prototype.copyRefercodeLink=function(){if(c()("body").addClass("body_fixed"),""!=this.account_token){var e=this,t=new m.a("#copyRefercodeLink",{text:function(){return c()("#spanCopyRefercodeLink").text()}});t.on("success",function(t){t.clearSelection(),e.dialog_error=!0,e.dialog_msg="邀请链接已复制到剪切板！快去邀请好友注册充值送点亮福袋吧！"})}else this.dialog_no_login=!0},t.prototype.copyRefercode=function(){if(c()("body").addClass("body_fixed"),""!=this.account_token){var e=this,t=new m.a("#copyRefercode",{text:function(){return e.refer_code}});t.on("success",function(t){t.clearSelection(),e.dialog_error=!0,e.dialog_msg="邀请码已复制到剪切板！快去邀请好友注册充值送点亮福袋吧！"})}else this.dialog_no_login=!0},t.prototype.tokenExpired=function(e){void 0===e&&(e=null),_["a"].loginOut(),this.account_token="",this.userInfo=null,this.$refs.head.checkLogin()},t.prototype.getAwardListSuccess=function(){this.initAwardList()},t.prototype.initAwardList=function(){this.awardList.length<=2||c()(function(){setInterval(function(){var e=c()("#jilu_box");e.animate({},400,function(){e.find("li").eq(0).detach().appendTo(e),e.find("li").eq(0).detach().appendTo(e)})},2e3)})},t=a["b"]([Object(r["a"])({components:{"head-nav":d["a"],"foot-nav":l["a"],"el-dialog":n.a}})],t),t}(y["a"]);new C({i18n:L}).$mount("#app")}});
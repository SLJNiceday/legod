(function(t){function i(i){for(var e,r,s=i[0],c=i[1],h=i[2],_=0,g=[];_<s.length;_++)r=s[_],a[r]&&g.push(a[r][0]),a[r]=0;for(e in c)Object.prototype.hasOwnProperty.call(c,e)&&(t[e]=c[e]);p&&p(i);while(g.length)g.shift()();return n.push.apply(n,h||[]),o()}function o(){for(var t,i=0;i<n.length;i++){for(var o=n[i],e=!0,s=1;s<o.length;s++){var c=o[s];0!==a[c]&&(e=!1)}e&&(n.splice(i--,1),t=r(r.s=o[0]))}return t}var e={},a={activitys_version5_0:0},n=[];function r(i){if(e[i])return e[i].exports;var o=e[i]={i:i,l:!1,exports:{}};return t[i].call(o.exports,o,o.exports,r),o.l=!0,o.exports}r.m=t,r.c=e,r.d=function(t,i,o){r.o(t,i)||Object.defineProperty(t,i,{enumerable:!0,get:o})},r.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,i){if(1&i&&(t=r(t)),8&i)return t;if(4&i&&"object"===typeof t&&t&&t.__esModule)return t;var o=Object.create(null);if(r.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:t}),2&i&&"string"!=typeof t)for(var e in t)r.d(o,e,function(i){return t[i]}.bind(null,e));return o},r.n=function(t){var i=t&&t.__esModule?function(){return t["default"]}:function(){return t};return r.d(i,"a",i),i},r.o=function(t,i){return Object.prototype.hasOwnProperty.call(t,i)},r.p="/";var s=window["webpackJsonp"]=window["webpackJsonp"]||[],c=s.push.bind(s);s.push=i,s=s.slice();for(var h=0;h<s.length;h++)i(s[h]);var p=c;n.push([16,"chunk-vendors","chunk-common"]),o()})({16:function(t,i,o){t.exports=o("1b7b")},"1b7b":function(t,i,o){"use strict";o.r(i);o("ac1e");var e=o("543e"),a=(o("cadf"),o("551c"),o("f751"),o("097d"),o("9ab4")),n=(o("eb65"),o("9e10"),o("db4d"),o("60a3")),r=o("a925"),s=o("1396"),c=o("82f5"),h=o("9347"),p=o("7d83"),_=o("0a56"),g=o("2e54"),u=o("dfdf"),l=o("a123"),d=o("d939"),f=o("a306"),w=o("1831"),y=o("7278");n["c"].config.productionTip=!1,n["c"].use(e["a"]),n["c"].use(r["a"]);var v=u["a"].getInstace(h["a"].REGION_CODE_1,h["a"].ZH_CN),b=s["a"].getInstance();b.init();var m=new r["a"](b),D=function(t){function i(){var i=null!==t&&t.apply(this,arguments)||this;return i.activity_id=187,i.activity_json=g["a"].getInstace("mobile",i.activity_id),i.appParam=u["a"].getInstace(),i.activityDetails_two=null,i.points_two=0,i.aCount_two=0,i.activity_id_two=188,i.awardListTwo=[],i.dialog_prize_bag=!1,i.dialog_prize_bag_msg="",i.dialog_recharge_getbag=!1,i}return a["c"](i,t),i.prototype.created=function(){this.activityJson=this.activity_json,this.imageHeadUrl=c["a"].getImgBaseUrl(),this.account_token=p["a"].getUserToken().account_token,this.setBaseUrl(c["a"].getBaseUrl()),this.getActivityId(),this.getActivityDetail(),this.getActivityTwoDetail(),this.getReferActivitys(),""==this.account_token&&(this.refer_code="请先登录!",this.refer_code_link="请先登录!")},i.prototype.mounted=function(){var t=this;window.onscroll=function(){t.pageScroll(835)}},i.prototype.getGoldPrizeBag=function(){""!=this.account_token?this.aCount_two>=1?(this.dialog_prize_bag_msg="一个黄金红包，赶紧去拆开红包吧！",this.dialog_prize_bag=!0):this.dialog_recharge_getbag=!0:this.dialog_no_login=!0},i.prototype.getPrizebag=function(){""!=this.account_token?this.aCount>=1?(this.dialog_prize_bag_msg="一个普通红包，赶紧去拆开红包吧！",this.dialog_prize_bag=!0):this.dialog_recharge_getbag=!0:this.dialog_no_login=!0},i.prototype.closeRechargeGetBagDialog=function(){this.dialog_recharge_getbag=!1},i.prototype.closePrizeBagDialog=function(){this.dialog_prize_bag=!1,this.dialog_prize_bag_msg="";var t=document.querySelector("#version_roll");t.scrollIntoView()},i.prototype.onClickDrawTwo=function(){this.isBengin||(""!=this.account_token?this.aCount_two<=0?this.dialog_recharge=!0:(this.isBengin=!0,this.isWin=!0,this.onDrawTwo(1e3,1e3)):this.dialog_no_login=!0)},i.prototype.onDrawTwo=function(t,i){return void 0===t&&(t=0),void 0===i&&(i=0),a["a"](this,void 0,void 0,function(){var o,e,n,r,s;return a["d"](this,function(a){switch(a.label){case 0:return o=w["a"].URL_ACTIVITY_DRAW,e=this.account_token,n=new f["b"],n.activity_id=this.activity_id_two,n.account_token=e,r=this,[4,this.http.post(o,n)];case 1:return r.backData=a.sent(),s=this,this.backData.code==w["a"].HTTP_SUCCESS_NET_CODE?(this.awardInfo=this.backData.data,setTimeout(function(){s.onDrawWinTwo(s.backData)},t)):this.backData.code==w["a"].HTTP_TOKEN_EXPIRE?this.tokenExpired():setTimeout(function(){s.onDrawLoseTwo(s.backData)},i),[2]}})})},i.prototype.onDrawWin=function(t){this.isBengin=!1,this.dialog_win=!0,this.prize_name=t.data.title,this.prize_id=t.data.present_id,this.points=t.data.points,this.getActivityCount(),this.getActiveRecordList()},i.prototype.onDrawLose=function(t){this.isBengin=!1,this.isWin=!1,this.dialog_error=!0,this.dialog_msg=t.msg,this.points=t.data.points,this.getActivityCount()},i.prototype.onDrawWinTwo=function(t){this.isBengin=!1,this.dialog_win=!0,this.prize_name=t.data.title,this.prize_id=t.data.present_id,this.points_two=t.data.points,this.aCount_two=Math.floor(this.points_two/this.activityDetails_two.fee)},i.prototype.onDrawLoseTwo=function(t){this.isBengin=!1,this.isWin=!1,this.dialog_error=!0,this.dialog_msg=t.msg,this.points_two=t.data.points,this.aCount_two=Math.floor(this.points_two/this.activityDetails_two.fee)},i.prototype.generateRefercodeLink=function(t){this.refer_code_link=c["a"].getUserBaseUrl()+"/"+d["a"].HTML_NAME_REGISTER+"?refer_code="+t},i.prototype.getActivityTwoDetail=function(){return a["a"](this,void 0,void 0,function(){var t,i,o;return a["d"](this,function(e){switch(e.label){case 0:return""==this.account_token?[2]:0==this.activity_id_two?[2]:(t=w["a"].URL_ACTIVITY_DETAIL+this.activity_id_two,i=new f["a"],i.type=1,i.id=this.activity_id_two,i.plat_type=1,i.region_code=p["a"].getRegionCodes(),i.account_token=this.account_token,o=this,[4,this.http.get(t,i)]);case 1:return o.backData=e.sent(),this.backData.code==w["a"].HTTP_SUCCESS_NET_CODE?(this.activityDetails_two=this.backData.data.detail,this.points_two=this.backData.data.points,this.aCount_two=Math.floor(this.points_two/this.activityDetails_two.fee)):this.backData.code==w["a"].HTTP_TOKEN_EXPIRE&&this.tokenExpired(),[2]}})})},i.prototype.gotoDuijiang=function(){var t="platform="+v.platform+"&pageIndex=5";l["a"].gotoCenter(t)},i.prototype.gotoLogin=function(){var t="platform="+this.appParam.platform;l["a"].gotoLogin(t)},i.prototype.gotoRecharge=function(){var t="platform="+this.appParam.platform;l["a"].gotoRecharge(t)},i.prototype.tokenExpired=function(t){void 0===t&&(t=null),p["a"].loginOut(),this.account_token="",this.userInfo=null},i.prototype.onChangeLanguage=function(t){b.changeLanguage(t),m.locale=b.locale,this.appParam.language=t},i=a["b"]([Object(n["a"])({components:{loading:y["a"]}})],i),i}(_["a"]);new D({i18n:m}).$mount("#app")},"9e10":function(t,i,o){}});
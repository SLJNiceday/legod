(function(t){function e(e){for(var a,n,c=e[0],r=e[1],g=e[2],p=0,_=[];p<c.length;p++)n=c[p],s[n]&&_.push(s[n][0]),s[n]=0;for(a in r)Object.prototype.hasOwnProperty.call(r,a)&&(t[a]=r[a]);h&&h(e);while(_.length)_.shift()();return o.push.apply(o,g||[]),i()}function i(){for(var t,e=0;e<o.length;e++){for(var i=o[e],a=!0,c=1;c<i.length;c++){var r=i[c];0!==s[r]&&(a=!1)}a&&(o.splice(e--,1),t=n(n.s=i[0]))}return t}var a={},s={forgetpwd:0},o=[];function n(e){if(a[e])return a[e].exports;var i=a[e]={i:e,l:!1,exports:{}};return t[e].call(i.exports,i,i.exports,n),i.l=!0,i.exports}n.m=t,n.c=a,n.d=function(t,e,i){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:i})},n.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var i=Object.create(null);if(n.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var a in t)n.d(i,a,function(e){return t[e]}.bind(null,a));return i},n.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="/";var c=window["webpackJsonp"]=window["webpackJsonp"]||[],r=c.push.bind(c);c.push=e,c=c.slice();for(var g=0;g<c.length;g++)e(c[g]);var h=r;o.push([1,"chunk-vendors","chunk-common"]),i()})({1:function(t,e,i){t.exports=i("3fa6")},"3fa6":function(t,e,i){"use strict";i.r(e);i("6b54"),i("be4f"),i("450d");var a=i("896a"),s=i.n(a),o=(i("016f"),i("486c")),n=i.n(o),c=(i("6611"),i("e772")),r=i.n(c),g=(i("1f1a"),i("4e4b")),h=i.n(g),p=(i("46a1"),i("e5f2")),_=i.n(p),T=(i("cadf"),i("551c"),i("f751"),i("097d"),i("9ab4")),E=(i("76ca"),i("db4d"),i("60a3")),d=i("abf2"),u=i("a925"),l=i("4dfd"),m=i("1831"),f=i("3c6c"),O=i("9127"),I=i("9d9a"),C=i("7d83"),R=function(t){function e(){var e=null!==t&&t.apply(this,arguments)||this;return e.http=new m["a"],e.checkUserValue=0,e}return T["c"](e,t),e.prototype.onPhoneFindPassword=function(){var t=m["a"].URL_AUTH_RETRIEVE,e=new f["r"];e.phone=this.phone,e.password=O["Md5"].hashStr(this.phonePassword).toString(),e.country_code=this.countryCode,e.smscode=this.smscode,e.smscode_key=this.smsCapchaM.smscode_key,e.checkcode=this.imgCaptchaCode,e.checkcode_key=this.imgCaptchaM.key,this.onRetrieve(t,e)},e.prototype.onEmailFindPassword=function(){var t=m["a"].URL_AUTH_RETRIEVE,e=new f["i"];e.email=this.email,e.password=O["Md5"].hashStr(this.emailPassword).toString(),e.mailcode=this.emailcode,e.mailcode_key=this.emailCapchaM.emailcode_key,e.checkcode=this.imgCaptchaCode,e.checkcode_key=this.imgCaptchaM.key,this.onRetrieve(t,e)},e.prototype.onRetrieve=function(t,e){return T["a"](this,void 0,void 0,function(){var i;return T["d"](this,function(a){switch(a.label){case 0:return this.isLoading=!0,this.loadingMsg=I["a"].getTipsMsg(I["a"].KEY_LOADING),i=this,[4,this.http.post(t,e)];case 1:return i.backData=a.sent(),this.backData.code==m["a"].HTTP_SUCCESS_NET_CODE?(this.isLoading=!1,localStorage.removeItem(C["a"].STORAGES_PHONE),localStorage.removeItem(C["a"].STORAGES_EMAIL),localStorage.removeItem(C["a"].STORAGES_PHONE_PW),localStorage.removeItem(C["a"].STORAGES_EMAIL_PW),localStorage.removeItem(C["a"].STORAGES_PW),this.onFindPwdSuccess()):(this.isLoading=!1,this.onFindPwdFaild(this.backData),this.isimgVerification=1,this.onGetCaptcha()),[2]}})})},e.prototype.onFindPwdSuccess=function(){},e.prototype.onFindPwdFaild=function(t){},e.prototype.FindUserIsExist=function(t){return T["a"](this,void 0,void 0,function(){var e,i,a,s;return T["d"](this,function(o){switch(o.label){case 0:return e=m["a"].URL_USER_CHECK_PSW_ISEXIST,i={account:t},a=this,[4,this.http.post(e,i)];case 1:return a.backData=o.sent(),this.backData.code==m["a"].HTTP_SUCCESS_NET_CODE?(s=this.backData.data,[2,s.is_exist]):[2]}})})},e=T["b"]([E["a"]],e),e}(l["a"]),M=i("9453"),y=i("b971"),P=i("9347"),w=i("d939"),S=i("dfdf"),N=i("5f2d"),Y=i("a306"),F=i("255e");E["c"].prototype.$notify=_.a,E["c"].use(h.a),E["c"].use(r.a),E["c"].use(n.a),E["c"].use(s.a),E["c"].config.productionTip=!1;var v=M["a"].getSuserBaseUrl()+"/"+w["a"].HTML_NAME_FORGETPWD;w["a"].checkLowBrowser(v),E["c"].use(u["a"]);S["a"].getInstace(P["a"].REGION_CODE_1,P["a"].ZH_CN);var b=N["a"].getInstance();b.init();var A=new u["a"](b),D=function(t){function e(){var e=null!==t&&t.apply(this,arguments)||this;return e.webParam=S["a"].getInstace(),e.activityInfo=new Y["a"],e.bannerImg="",e.activeLink="",e.imageHeadUrl="",e}return T["c"](e,t),e.prototype.created=function(){return T["a"](this,void 0,void 0,function(){return T["d"](this,function(t){switch(t.label){case 0:return this.setBaseUrl(M["a"].getBaseUrl()),this.changeResignType(2),this.imageHeadUrl=M["a"].getImgBaseUrl(),this.getDownloadUrl(),this.init(),[4,this.getAreaCodeInfoList(M["a"].getWebBaseUrl())];case 1:return t.sent(),[2]}})})},e.prototype.changeResignType=function(t){this.onChangeRegisterType(t)},e.prototype.getActivityInfo=function(){return T["a"](this,void 0,void 0,function(){var t,e,i,a;return T["d"](this,function(s){switch(s.label){case 0:return t=m["a"].URL_ACTIVITY_PICTURE_LIST,e=new Y["b"],e.plat_type=1,e.region_code=this.webParam.region_code,i=this,[4,this.http.post(t,e)];case 1:return i.backData=s.sent(),this.backData.code==m["a"].HTTP_SUCCESS_NET_CODE&&(a=this.backData.data,this.activityInfo=a[0],this.activityInfo&&(this.bannerImg=this.activityInfo.imgs.filter(function(t,e){return 0==t.key})[0].img_url),""!=this.bannerImg&&(this.bannerImg=this.imageHeadUrl+this.bannerImg)),[2]}})})},e.prototype.getDownloadUrl=function(){return T["a"](this,void 0,void 0,function(){var t,e,i;return T["d"](this,function(a){switch(a.label){case 0:return[4,F["a"].getInstance().download(!0)];case 1:return t=a.sent(),e=C["a"].getRegionCodes(),i=C["a"].getLanguage(),this.bannerImg=t.leigod[e][i].index_news.img_url,this.activeLink=t.leigod[e][i].index_news.new_url,[2]}})})},e.prototype.onChangeLanguage=function(t){b.changeLanguage(t),A.locale=b.locale,this.webParam.language=t},e.prototype.goHome=function(){w["a"].userGotoWeb(M["a"].getWebBaseUrl(),w["a"].HTML_NAME_INDEX)},e.prototype.goLogin=function(){w["a"].wapJump(M["a"].getUserBaseUrl(),w["a"].HTML_NAME_LOGIN)},e.prototype.goActivityDetail=function(t){1==t.url_type?window.open(t.url):w["a"].userGotoWeb(M["a"].getWebBaseUrl(),w["a"].HTML_NAME_DETAILS_ACTIVITY+t.id+".html")},e.prototype.onSelectCountryCode=function(t){var e=this;this.country_code_list.map(function(i){for(var a=0;a<i.options.length;a++)t==i.options[a].code&&(e.country_code=Object.assign({},i.options[a]),e.countryCode=t.toString())})},e.prototype.getCaptcha=function(){this.onGetCaptcha()},e.prototype.onSmsCode=function(){var t=!0,e="";this.smsCountDownNum>0?this.$notify({title:I["a"].getTipsMsg(I["a"].KEY_NOTIF_ERROR_TITLE),message:I["a"].getTipsMsg(I["a"].KEY_WAITING),type:"warning"}):("86"==this.countryCode&&!y["a"].checkPhone(this.phone)&&t&&(e=I["a"].getTipsMsg(I["a"].KEY_NOTIF_PHONE_ERROR),t=!1,""==this.phone&&(e=I["a"].getTipsMsg(I["a"].KEY_NOTIF_PHONE_EMPTY),t=!1)),1==this.isimgVerification&&!y["a"].checkimgVerificatioCode(this.imgCaptchaCode)&&t&&(e=I["a"].getTipsMsg(I["a"].KEY_NOTIF_IMGCAPTCHACODE_ERROR),t=!1,""==this.imgCaptchaCode&&(e=I["a"].getTipsMsg(I["a"].KEY_NOTIF_IMGCAPTCHACODE_EMPTY),t=!1)),t?this.onGetSmscode(0,1):this.$notify({title:I["a"].getTipsMsg(I["a"].KEY_NOTIF_ERROR_TITLE),message:e,type:"warning"}))},e.prototype.onVoiceCode=function(){var t=!0,e="";"86"==this.countryCode&&!y["a"].checkPhone(this.phone)&&t&&(e=I["a"].getTipsMsg(I["a"].KEY_NOTIF_PHONE_ERROR),t=!1,""==this.phone&&(e=I["a"].getTipsMsg(I["a"].KEY_NOTIF_PHONE_EMPTY),t=!1)),1==this.isimgVerification&&!y["a"].checkimgVerificatioCode(this.imgCaptchaCode)&&t&&(e=I["a"].getTipsMsg(I["a"].KEY_NOTIF_IMGCAPTCHACODE_ERROR),t=!1,""==this.imgCaptchaCode&&(e=I["a"].getTipsMsg(I["a"].KEY_NOTIF_IMGCAPTCHACODE_EMPTY),t=!1)),t?this.onGetSmscode(1,1):this.$notify({title:I["a"].getTipsMsg(I["a"].KEY_NOTIF_ERROR_TITLE),message:e,type:"warning"})},e.prototype.onGetSmscodeSuccess=function(){this.$notify({title:I["a"].getTipsMsg(I["a"].KEY_NOTIF_SUCCESS_TITLE),message:I["a"].getTipsMsg(I["a"].KEY_NOTIF_SMS),type:"success"}),this.smsCountDownNum=60;var t=this;P["a"].countDown(this.smsCountDownNum,1,function(e){t.smsCountDownNum=e})},e.prototype.onGetSmscodeFaild=function(t){this.$notify({title:I["a"].getTipsMsg(I["a"].KEY_NOTIF_ERROR_TITLE),message:t.msg,type:"warning"})},e.prototype.onEmailCode=function(){var t=!0,e="";this.smsCountDownNum>0?this.$notify({title:I["a"].getTipsMsg(I["a"].KEY_NOTIF_ERROR_TITLE),message:I["a"].getTipsMsg(I["a"].KEY_WAITING),type:"warning"}):(!y["a"].checkEmail(this.email)&&t&&(e=I["a"].getTipsMsg(I["a"].KEY_NOTIF_EMAIL_ERROR),t=!1,""==this.email&&(e=I["a"].getTipsMsg(I["a"].KEY_NOTIF_EMAIL_EMPTY),t=!1)),1==this.isimgVerification&&!y["a"].checkimgVerificatioCode(this.imgCaptchaCode)&&t&&(e=I["a"].getTipsMsg(I["a"].KEY_NOTIF_IMGCAPTCHACODE_ERROR),t=!1,""==this.imgCaptchaCode&&(e=I["a"].getTipsMsg(I["a"].KEY_NOTIF_IMGCAPTCHACODE_EMPTY),t=!1)),t?this.onGetEmailcode(1):this.$notify({title:I["a"].getTipsMsg(I["a"].KEY_NOTIF_ERROR_TITLE),message:e,type:"warning"}))},e.prototype.onGetEmailcodeSuccess=function(){this.$notify({title:I["a"].getTipsMsg(I["a"].KEY_NOTIF_SUCCESS_TITLE),message:I["a"].getTipsMsg(I["a"].KEY_NOTIF_EMAIL),type:"success"}),this.emailCountDownNum=60;var t=this;P["a"].countDown(this.emailCountDownNum,1,function(e){t.emailCountDownNum=e})},e.prototype.onGetEmailcodeFaild=function(t){this.$notify({title:I["a"].getTipsMsg(I["a"].KEY_NOTIF_ERROR_TITLE),message:t.msg,type:"warning"})},e.prototype.clickFindPassword=function(){switch(this.resignType){case 2:this.onClickPhoneReg();break;case 3:this.onClickEmailReg();break}},e.prototype.onClickPhoneReg=function(){var t=!0,e="";"86"==this.countryCode&&!y["a"].checkPhone(this.phone)&&t&&(e=I["a"].getTipsMsg(I["a"].KEY_NOTIF_PHONE_ERROR),t=!1,""==this.phone&&(e=I["a"].getTipsMsg(I["a"].KEY_NOTIF_PHONE_EMPTY),t=!1)),1==this.isimgVerification&&!y["a"].checkimgVerificatioCode(this.imgCaptchaCode)&&t&&(e=I["a"].getTipsMsg(I["a"].KEY_NOTIF_IMGCAPTCHACODE_ERROR),t=!1,""==this.imgCaptchaCode&&(e=I["a"].getTipsMsg(I["a"].KEY_NOTIF_IMGCAPTCHACODE_EMPTY),t=!1)),!y["a"].checkSmscode(this.smscode)&&t&&(e=I["a"].getTipsMsg(I["a"].KEY_NOTIF_SMSCODE_ERROR),t=!1,""==this.smscode&&(e=I["a"].getTipsMsg(I["a"].KEY_NOTIF_SMSCODE_EMPTY),t=!1)),!y["a"].checkPwd(this.phonePassword)&&t&&(e=I["a"].getTipsMsg(I["a"].KEY_NOTIF_PASSWORD_ERROR),t=!1,""==this.phonePassword&&(e=I["a"].getTipsMsg(I["a"].KEY_NOTIF_PASSWORD_EMPTY),t=!1)),!y["a"].checkPwdTwo(this.phonePasswordTwo,this.phonePassword)&&t&&(e=I["a"].getTipsMsg(I["a"].KEY_NOTIF_PASSWORDTWO_ERROR),t=!1,""==this.phonePasswordTwo&&(e=I["a"].getTipsMsg(I["a"].KEY_NOTIF_PASSWORD_EMPTY),t=!1)),t?this.onPhoneFindPassword():this.$notify({title:I["a"].getTipsMsg(I["a"].KEY_NOTIF_ERROR_TITLE),message:e,type:"warning"})},e.prototype.onClickEmailReg=function(){var t=!0,e="";!y["a"].checkEmail(this.email)&&t&&(e=I["a"].getTipsMsg(I["a"].KEY_NOTIF_EMAIL_ERROR),t=!1,""==this.email&&(e=I["a"].getTipsMsg(I["a"].KEY_NOTIF_EMAIL_EMPTY),t=!1)),1==this.isimgVerification&&!y["a"].checkimgVerificatioCode(this.imgCaptchaCode)&&t&&(e=I["a"].getTipsMsg(I["a"].KEY_NOTIF_IMGCAPTCHACODE_ERROR),t=!1,""==this.imgCaptchaCode&&(e=I["a"].getTipsMsg(I["a"].KEY_NOTIF_IMGCAPTCHACODE_EMPTY),t=!1)),!y["a"].checkSmscode(this.emailcode)&&t&&(e=I["a"].getTipsMsg(I["a"].KEY_NOTIF_EMAILCODE_ERROR),t=!1,""==this.emailcode&&(e=I["a"].getTipsMsg(I["a"].KEY_NOTIF_EMAILCODE_EMPTY),t=!1)),!y["a"].checkPwd(this.emailPassword)&&t&&(e=I["a"].getTipsMsg(I["a"].KEY_NOTIF_PASSWORD_ERROR),t=!1,""==this.emailPassword&&(e=I["a"].getTipsMsg(I["a"].KEY_NOTIF_PASSWORD_EMPTY),t=!1)),!y["a"].checkPwdTwo(this.emailPasswordTwo,this.emailPassword)&&t&&(e=I["a"].getTipsMsg(I["a"].KEY_NOTIF_PASSWORDTWO_ERROR),t=!1,""==this.emailPasswordTwo&&(e=I["a"].getTipsMsg(I["a"].KEY_NOTIF_PASSWORD_EMPTY),t=!1)),t?this.onEmailFindPassword():this.$notify({title:I["a"].getTipsMsg(I["a"].KEY_NOTIF_ERROR_TITLE),message:e,type:"warning"})},e.prototype.onFindPwdSuccess=function(){this.$notify({title:I["a"].getTipsMsg(I["a"].KEY_NOTIF_SUCCESS_TITLE),message:I["a"].getTipsMsg(I["a"].KEY_NOTIF_FINDPWD),type:"success"});var t=this;setTimeout(function(){t.isLoading=!1,w["a"].wapJump(M["a"].getUserBaseUrl(),w["a"].HTML_NAME_LOGIN)},1500)},e.prototype.onFindPwdFaild=function(t){this.$notify({title:I["a"].getTipsMsg(I["a"].KEY_NOTIF_ERROR_TITLE),message:t.msg,type:"warning"})},e=T["b"]([Object(E["a"])({components:{"foot-nav-two":d["a"]}})],e),e}(R);new D({i18n:A}).$mount("#app")}});
(function(t){function e(e){for(var a,n,r=e[0],g=e[1],c=e[2],p=0,T=[];p<r.length;p++)n=r[p],s[n]&&T.push(s[n][0]),s[n]=0;for(a in g)Object.prototype.hasOwnProperty.call(g,a)&&(t[a]=g[a]);h&&h(e);while(T.length)T.shift()();return o.push.apply(o,c||[]),i()}function i(){for(var t,e=0;e<o.length;e++){for(var i=o[e],a=!0,r=1;r<i.length;r++){var g=i[r];0!==s[g]&&(a=!1)}a&&(o.splice(e--,1),t=n(n.s=i[0]))}return t}var a={},s={register:0},o=[];function n(e){if(a[e])return a[e].exports;var i=a[e]={i:e,l:!1,exports:{}};return t[e].call(i.exports,i,i.exports,n),i.l=!0,i.exports}n.m=t,n.c=a,n.d=function(t,e,i){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:i})},n.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var i=Object.create(null);if(n.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var a in t)n.d(i,a,function(e){return t[e]}.bind(null,a));return i},n.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="/";var r=window["webpackJsonp"]=window["webpackJsonp"]||[],g=r.push.bind(r);r.push=e,r=r.slice();for(var c=0;c<r.length;c++)e(r[c]);var h=g;o.push([4,"chunk-vendors","chunk-common"]),i()})({"165c":function(t,e,i){"use strict";i.r(e);i("6b54"),i("c5f6"),i("be4f"),i("450d");var a=i("896a"),s=i.n(a),o=(i("016f"),i("486c")),n=i.n(o),r=(i("6611"),i("e772")),g=i.n(r),c=(i("1f1a"),i("4e4b")),h=i.n(c),p=(i("46a1"),i("e5f2")),T=i.n(p),_=(i("cadf"),i("551c"),i("f751"),i("097d"),i("9ab4")),E=(i("76ca"),i("db4d"),i("60a3")),u=i("abf2"),d=i("a925"),l=i("4dfd"),O=i("9453"),f=i("9d9a"),m=i("b971"),I=i("9347"),R=i("3c6c"),C=i("1831"),M=i("7d83"),y=i("d939"),N=i("9127"),w=i("255e"),P=i("dfdf"),Y=i("5f2d"),S=i("a306");E["c"].prototype.$notify=T.a,E["c"].use(h.a),E["c"].use(g.a),E["c"].use(n.a),E["c"].use(s.a),E["c"].use(d["a"]);P["a"].getInstace(I["a"].REGION_CODE_1,I["a"].ZH_CN);var b=Y["a"].getInstance();b.init();var A=new d["a"](b),F=function(t){function e(){var e=null!==t&&t.apply(this,arguments)||this;return e.webParam=P["a"].getInstace(),e.activityInfo=new S["a"],e.bannerImg="",e.activeLink="",e.imageHeadUrl="",e.voiceShow=!1,e}return _["c"](e,t),e.prototype.onChangeLanguage=function(t){b.changeLanguage(t),A.locale=b.locale,this.webParam.language=t},e.prototype.created=function(){O["a"].log("注册log"),this.setBaseUrl(O["a"].getBaseUrl()),this.changeResignType(0),this.getDownloadUrl(),this.imageHeadUrl=O["a"].getImgBaseUrl(),this.init()},e.prototype.init=function(){this.referCode=I["a"].getUrlParam("refer_code"),this.getAreaCodeInfoList(O["a"].getWebBaseUrl()),this.onGetPackage(1)},e.prototype.getDownloadUrl=function(){return _["a"](this,void 0,void 0,function(){var t,e,i,a;return _["d"](this,function(s){switch(s.label){case 0:return[4,w["a"].getInstance().download(!0)];case 1:return t=s.sent(),e=M["a"].getRegionCodes(),i=M["a"].getLanguage(),null!=t&&(a=t.leigod[e].register,this.isShowEmail=Number(a.is_email),this.bannerImg=t.leigod[e][i].index_news.img_url,this.activeLink=t.leigod[e][i].index_news.new_url),[2]}})})},e.prototype.getActivityInfo=function(){return _["a"](this,void 0,void 0,function(){var t,e,i,a;return _["d"](this,function(s){switch(s.label){case 0:return t=C["a"].URL_ACTIVITY_PICTURE_LIST,e=new S["b"],e.region_code=this.webParam.region_code,e.plat_type=1,i=this,[4,this.http.post(t,e)];case 1:return i.backData=s.sent(),this.backData.code==C["a"].HTTP_SUCCESS_NET_CODE&&(a=this.backData.data,this.activityInfo=a[0],this.activityInfo&&(this.bannerImg=this.activityInfo.imgs.filter(function(t,e){return 0==t.key})[0].img_url),""!=this.bannerImg&&(this.bannerImg=this.imageHeadUrl+this.bannerImg)),[2]}})})},e.prototype.goHome=function(){y["a"].userGotoWeb(O["a"].getWebBaseUrl(),y["a"].HTML_NAME_INDEX)},e.prototype.goUserServer=function(){y["a"].userGotoWeb(O["a"].getWebBaseUrl(),y["a"].HTML_NAME_USERSERVER)},e.prototype.goLogin=function(){y["a"].wapJump(O["a"].getUserBaseUrl(),y["a"].HTML_NAME_LOGIN)},e.prototype.goActivityDetail=function(t){1==t.url_type?window.open(t.url):y["a"].userGotoWeb(O["a"].getWebBaseUrl(),y["a"].HTML_NAME_DETAILS_ACTIVITY+t.id+".html")},e.prototype.changeResignType=function(t){this.onChangeRegisterType(t),this.agreementChceked=!1},e.prototype.onSelectCountryCode=function(t){var e=this;this.country_code_list.map(function(i){for(var a=0;a<i.options.length;a++)t==i.options[a].code&&(e.country_code=Object.assign({},i.options[a]),e.countryCode=t.toString())})},e.prototype.getCaptcha=function(){this.onGetCaptcha()},e.prototype.onSmsCode=function(){var t=!0,e="";this.smsCountDownNum>0?this.$notify({title:f["a"].getTipsMsg(f["a"].KEY_NOTIF_ERROR_TITLE),message:f["a"].getTipsMsg(f["a"].KEY_WAITING),type:"warning"}):("86"==this.countryCode&&!m["a"].checkPhone(this.phone)&&t&&(e=f["a"].getTipsMsg(f["a"].KEY_NOTIF_PHONE_ERROR),t=!1,""==this.phone&&(e=f["a"].getTipsMsg(f["a"].KEY_NOTIF_PHONE_EMPTY),t=!1)),1==this.isimgVerification&&!m["a"].checkimgVerificatioCode(this.imgCaptchaCode)&&t&&(e=f["a"].getTipsMsg(f["a"].KEY_NOTIF_IMGCAPTCHACODE_ERROR),t=!1,""==this.imgCaptchaCode&&(e=f["a"].getTipsMsg(f["a"].KEY_NOTIF_IMGCAPTCHACODE_EMPTY),t=!1)),t?this.onGetSmscode(0,2):this.$notify({title:f["a"].getTipsMsg(f["a"].KEY_NOTIF_ERROR_TITLE),message:e,type:"warning"}))},e.prototype.onGetSmscodeSuccess=function(){this.voiceShow=!0,this.$notify({title:f["a"].getTipsMsg(f["a"].KEY_NOTIF_SUCCESS_TITLE),message:f["a"].getTipsMsg(f["a"].KEY_NOTIF_SMS),type:"success"}),this.smsCountDownNum=60;var t=this;I["a"].countDown(this.smsCountDownNum,1,function(e){t.smsCountDownNum=e})},e.prototype.onGetSmscodeFaild=function(t){this.$notify({title:f["a"].getTipsMsg(f["a"].KEY_NOTIF_ERROR_TITLE),message:t.msg,type:"warning"})},e.prototype.onEmailCode=function(){var t=!0,e="";this.smsCountDownNum>0?this.$notify({title:f["a"].getTipsMsg(f["a"].KEY_NOTIF_ERROR_TITLE),message:f["a"].getTipsMsg(f["a"].KEY_WAITING),type:"warning"}):(!m["a"].checkEmail(this.email)&&t&&(e=f["a"].getTipsMsg(f["a"].KEY_NOTIF_EMAIL_ERROR),t=!1,""==this.email&&(e=f["a"].getTipsMsg(f["a"].KEY_NOTIF_EMAIL_EMPTY),t=!1)),1==this.isimgVerification&&!m["a"].checkimgVerificatioCode(this.imgCaptchaCode)&&t&&(e=f["a"].getTipsMsg(f["a"].KEY_NOTIF_IMGCAPTCHACODE_ERROR),t=!1,""==this.imgCaptchaCode&&(e=f["a"].getTipsMsg(f["a"].KEY_NOTIF_IMGCAPTCHACODE_EMPTY),t=!1)),t?this.onGetEmailcode(2):this.$notify({title:f["a"].getTipsMsg(f["a"].KEY_NOTIF_ERROR_TITLE),message:e,type:"warning"}))},e.prototype.onGetEmailcodeSuccess=function(){this.$notify({title:f["a"].getTipsMsg(f["a"].KEY_NOTIF_SUCCESS_TITLE),message:f["a"].getTipsMsg(f["a"].KEY_NOTIF_EMAIL),type:"success"}),this.emailCountDownNum=60;var t=this;I["a"].countDown(this.emailCountDownNum,1,function(e){t.emailCountDownNum=e})},e.prototype.onGetEmailcodeFaild=function(t){this.$notify({title:f["a"].getTipsMsg(f["a"].KEY_NOTIF_ERROR_TITLE),message:t.msg,type:"warning"})},e.prototype.onVoiceCode=function(){var t=!0,e="";"86"==this.countryCode&&!m["a"].checkPhone(this.phone)&&t&&(e=f["a"].getTipsMsg(f["a"].KEY_NOTIF_PHONE_ERROR),t=!1,""==this.phone&&(e=f["a"].getTipsMsg(f["a"].KEY_NOTIF_PHONE_EMPTY),t=!1)),1==this.isimgVerification&&!m["a"].checkimgVerificatioCode(this.imgCaptchaCode)&&t&&(e=f["a"].getTipsMsg(f["a"].KEY_NOTIF_IMGCAPTCHACODE_ERROR),t=!1,""==this.imgCaptchaCode&&(e=f["a"].getTipsMsg(f["a"].KEY_NOTIF_IMGCAPTCHACODE_EMPTY),t=!1)),t?this.onGetSmscode(1,2):this.$notify({title:f["a"].getTipsMsg(f["a"].KEY_NOTIF_ERROR_TITLE),message:e,type:"warning"})},e.prototype.clickRegister=function(){switch(this.resignType){case 0:this.onClickPhoneReg();break;case 1:this.onClickEmailReg();break}},e.prototype.onClickPhoneReg=function(){var t=!0,e="";"86"==this.countryCode&&!m["a"].checkPhone(this.phone)&&t&&(e=f["a"].getTipsMsg(f["a"].KEY_NOTIF_PHONE_ERROR),t=!1,""==this.phone&&(e=f["a"].getTipsMsg(f["a"].KEY_NOTIF_PHONE_EMPTY),t=!1)),1==this.isimgVerification&&!m["a"].checkimgVerificatioCode(this.imgCaptchaCode)&&t&&(e=f["a"].getTipsMsg(f["a"].KEY_NOTIF_IMGCAPTCHACODE_ERROR),t=!1,""==this.imgCaptchaCode&&(e=f["a"].getTipsMsg(f["a"].KEY_NOTIF_IMGCAPTCHACODE_EMPTY),t=!1)),!m["a"].checkSmscode(this.smscode)&&t&&(e=f["a"].getTipsMsg(f["a"].KEY_NOTIF_SMSCODE_ERROR),t=!1,""==this.smscode&&(e=f["a"].getTipsMsg(f["a"].KEY_NOTIF_SMSCODE_EMPTY),t=!1)),!m["a"].checkPwd(this.phonePassword)&&t&&(e=f["a"].getTipsMsg(f["a"].KEY_NOTIF_PASSWORD_ERROR),t=!1,""==this.phonePassword&&(e=f["a"].getTipsMsg(f["a"].KEY_NOTIF_PASSWORD_EMPTY),t=!1)),!m["a"].checkPwdTwo(this.phonePasswordTwo,this.phonePassword)&&t&&(e=f["a"].getTipsMsg(f["a"].KEY_NOTIF_PASSWORDTWO_ERROR),t=!1,""==this.phonePasswordTwo&&(e=f["a"].getTipsMsg(f["a"].KEY_NOTIF_PASSWORD_EMPTY),t=!1)),!this.agreementChceked&&t&&(e=f["a"].getTipsMsg(f["a"].KEY_NOTIF_READAGREEMENT),t=!1),t?this.onPhoneRegister():this.$notify({title:f["a"].getTipsMsg(f["a"].KEY_NOTIF_ERROR_TITLE),message:e,type:"warning"})},e.prototype.onClickEmailReg=function(){var t=!0,e="";!m["a"].checkEmail(this.email)&&t&&(e=f["a"].getTipsMsg(f["a"].KEY_NOTIF_EMAIL_ERROR),t=!1,""==this.email&&(e=f["a"].getTipsMsg(f["a"].KEY_NOTIF_EMAIL_EMPTY),t=!1)),1==this.isimgVerification&&!m["a"].checkimgVerificatioCode(this.imgCaptchaCode)&&t&&(e=f["a"].getTipsMsg(f["a"].KEY_NOTIF_IMGCAPTCHACODE_ERROR),t=!1,""==this.imgCaptchaCode&&(e=f["a"].getTipsMsg(f["a"].KEY_NOTIF_IMGCAPTCHACODE_EMPTY),t=!1)),!m["a"].checkSmscode(this.emailcode)&&t&&(e=f["a"].getTipsMsg(f["a"].KEY_NOTIF_EMAILCODE_ERROR),t=!1,""==this.emailcode&&(e=f["a"].getTipsMsg(f["a"].KEY_NOTIF_EMAILCODE_EMPTY),t=!1)),!m["a"].checkPwd(this.emailPassword)&&t&&(e=f["a"].getTipsMsg(f["a"].KEY_NOTIF_PASSWORD_ERROR),t=!1,""==this.phonePassword&&(e=f["a"].getTipsMsg(f["a"].KEY_NOTIF_PASSWORD_EMPTY),t=!1)),!m["a"].checkPwdTwo(this.emailPasswordTwo,this.emailPassword)&&t&&(e=f["a"].getTipsMsg(f["a"].KEY_NOTIF_PASSWORDTWO_ERROR),t=!1,""==this.phonePasswordTwo&&(e=f["a"].getTipsMsg(f["a"].KEY_NOTIF_PASSWORD_EMPTY),t=!1)),!this.agreementChceked&&t&&(e=f["a"].getTipsMsg(f["a"].KEY_NOTIF_READAGREEMENT),t=!1),t?this.onEmaillRegister():this.$notify({title:f["a"].getTipsMsg(f["a"].KEY_NOTIF_ERROR_TITLE),message:e,type:"warning"})},e.prototype.onRegisterSuccess=function(){switch(this.notifTitle=f["a"].getTipsMsg(f["a"].KEY_NOTIF_SUCCESS_TITLE),this.notifType="success",this.notifMessage=f["a"].getTipsMsg(f["a"].KEY_NOTIF_REGISTER),this.notifCount++,this.isLoading=!0,this.loadingMsg=f["a"].getTipsMsg(f["a"].KEY_NOTIF_AUTO_LOGIN),this.resignType){case 0:this.autoLogin(this.phone,this.phonePassword);break;case 1:this.autoLogin(this.email,this.emailPassword);break}},e.prototype.autoLogin=function(t,e){return _["a"](this,void 0,void 0,function(){var i,a,s,o;return _["d"](this,function(n){switch(n.label){case 0:return i=new R["l"],i.username=t,i.password=N["Md5"].hashStr(e).toString(),i.country_code=this.countryCode,i.src_channel=M["a"].getSrcChannel(),a=C["a"].URL_AUTH_LOGIN,s=this,[4,this.http.post(a,i)];case 1:return s.backData=n.sent(),this.isLoading=!1,this.backData.code==C["a"].HTTP_SUCCESS_NET_CODE&&(o=this.backData.data,M["a"].addUserToken(o.login_info),M["a"].addUserInfo(o.user_info),y["a"].wapJump(O["a"].getUserBaseUrl(),y["a"].HTML_NAME_USER)),[2]}})})},e.prototype.onRegisterFaild=function(t){this.$notify({title:f["a"].getTipsMsg(f["a"].KEY_NOTIF_ERROR_TITLE),message:t.msg,type:"warning"})},e=_["b"]([Object(E["a"])({components:{"foot-nav-two":u["a"]}})],e),e}(l["a"]);new F({i18n:A}).$mount("#app")},4:function(t,e,i){t.exports=i("165c")}});
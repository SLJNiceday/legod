<template>
    <div class="dialog_box" v-loading="isLoading">
        <div class="clear_fix login_tab_box">
            <div class="f_left login_tab_item" @click="changeResignType(0)"
                 :class="{'login_tab_active': resignType == 0}" :style="{width:(isShowEmail?'50%':'100%')}">
<!--                手机注册-->
                <span class="txt">{{$t("public.share38")}}</span>
                <i class="tag"></i>
            </div>
            <div v-show="isShowEmail" class="f_right login_tab_item" @click="changeResignType(1)"
                 :class="{'login_tab_active': resignType == 1}">
<!--                邮箱注册-->
                <span class="txt">{{$t("public.share39")}}</span>
                <i class="tag"></i>
            </div>
        </div>
        <!--手机-->
        <div v-show="resignType == 0">
            <div class="mar_t30 public_enter_ipt">
                <div class="f_left select_box login_select_box"  style="background:#f6f6f6;margin-left: -10px;" id="phoneCodePart">
                    <el-select @change="onSelectCountryCode" v-model="country_code.code"
                               placeholder="" style="width:100%;" >
                        <div slot="prefix"><img :src="country_code.ico" style="margin-top:10px;" alt=""> </div>
                        <el-option-group
                                v-for="group in country_code_list"
                                :key="group.label"
                                :label="group.label">
                            <el-option v-for="(val,index) in group.options" :key="index"
                                       :value="val.code" :label="'+'+val.code">
                                <img :src="val.ico" alt="">
                                <span style="color:#666;margin-left:6px;">{{val.name}}</span>
                            </el-option>
                        </el-option-group>
                    </el-select>
                </div>
                <div class="f_left">|</div>
<!--                手机号-->
                <input class="f_left transparent_ipt" type="text" v-model="phone" :placeholder="$t('public.share2')">
            </div>
            <!--图形验证码-->
            <div class="mar_t15" style="position: relative;" v-show="isimgVerification">
<!--                placeholder="图形验证码"-->
                <input class="public_enter_ipt" v-model="imgCaptchaCode" type="text" :placeholder="$t('public.share5')">
                <div class="img_code_box smscodesend" style="margin-right:0px;width:80px;" @click="getCaptcha">
                    <img :src="imgCaptchaM.img" class="img_filter" alt="">
                </div>
            </div>
            <div class="mar_t15" style="position: relative;">
<!--                placeholder="短信验证码"-->
                <input class="public_enter_ipt" type="text" v-model="smscode" :placeholder="$t('public.share48')">
                <div class="img_code_box smscodesend" style="text-align: right;margin-top:2px;">
                    <a @click="onSmsCode" style="display: none;" v-show="smsCountDownNum <= 0">{{$t("public.share6")}}</a>
                    <span style="display: none; color: #D8D8D8;margin:0 6px;" v-show="smsCountDownNum <= 0 && voiceShow">|</span>
                    <a @click="onVoiceCode" style="display: none;" v-show="smsCountDownNum <= 0 && voiceShow">{{$t("public.share7")}}</a>
                    <span style="display: none;margin-right: 10px;color: #666666;" v-show="smsCountDownNum > 0">{{smsCountDownNum}}s</span>
                </div>
            </div>
<!--            placeholder="密码 (6-20位数字+字母组合)"-->
            <input class="mar_t15 public_enter_ipt" v-model="phonePassword" type="password" :placeholder="$t('public.share40')">
            <input class="mar_t15 public_enter_ipt" v-model="phonePasswordTwo" type="password" :placeholder="$t('public.share41')">
        </div>
        <!--邮箱-->
        <div v-show="resignType == 1">
<!--            placeholder="邮箱号"-->
            <input class="mar_t30 public_enter_ipt" type="text" v-model="email" :placeholder="$t('public.share63')" >
            <!--图形验证码-->
            <div class="mar_t15" style="position: relative;" v-show="isimgVerification">
<!--                placeholder="图形验证码"-->
                <input class="public_enter_ipt" v-model="imgCaptchaCode" type="text" :placeholder="$t('public.share5')">
                <div class="img_code_box smscodesend" style="margin-right:0px;width:80px;" @click="getCaptcha">
                    <img :src="imgCaptchaM.img" class="img_filter" alt="">
                </div>
            </div>
            <div class="mar_t15" style="position: relative;">
<!--                placeholder="邮箱验证码"-->
                <input class="public_enter_ipt" v-model="emailcode" type="text" :placeholder="$t('public.share49')">
                <div class="img_code_box smscodesend" style="justify-content: flex-end;text-align: right;">
                    <a style="display: none;margin-right: 8px;" @click="onEmailCode" v-show="emailCountDownNum <= 0">{{$t("public.share42")}}</a>
                    <span style="display: none;margin-right: 10px;" v-show="emailCountDownNum > 0">{{emailCountDownNum}}s</span>
                </div>
            </div>
<!--            placeholder="密码 (6-20位数字+字母组合)"-->
            <input class="mar_t15 public_enter_ipt" v-model="emailPassword" type="password" :placeholder="$t('public.share40')">
            <input class="mar_t15 public_enter_ipt" v-model="emailPasswordTwo" type="password" :placeholder="$t('public.share41')">
        </div>
        <div id="payzhekou">
            <div class="mar_t10 clear_fix" style="height: 40px;">
                <!--            推荐码 (选填)-->
                <div class="f_left mar_t10">
                    <van-checkbox style="display:inline-block;" v-model="checkReferCode" shape="square" checked-color="#ffd33e">{{$t('public.share59')}}</van-checkbox>
                </div>
                <input class="f_right public_enter_ipt" v-model="referCode" v-show="checkReferCode" style="width: 180px;" type="text">
            </div>
            <div class="mar_t10" style="text-align: left;">
                <van-checkbox style="display:inline-block;" v-model="agreementChceked" shape="square" checked-color="#ffd33e">{{$t('public.share43')}}</van-checkbox>
                <a @click="goUserServer" style="color: #35a2d6;margin-top:-12px;">{{$t("public.share44")}}</a>
            </div>
        </div>
        <div class="mar_t20 public_enter_btn" :class="{notAgreementChceked:!agreementChceked}" @click="clickRegister">
            {{$t("public.share45")}}
        </div>
        <div class="mar_t15 text_center" >
<!--            已有雷神账号，去登陆-->
            <a class="public_white_btn" @click="toLogin">{{$t("public.share46")+$t("public.share47")}}</a>
        </div>
    </div>
</template>
<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {Loading, Notification, Option, Select, OptionGroup} from 'element-ui';
    import {RegisterProxy} from '@/ts/proxy/RegisterProxy';
    import GlobalConfig from '../global.config';
    import {TipsMsgUtil} from '@/ts/utils/TipsMsgUtil';
    import CheckUtil from '@/ts/utils/CheckUtil';
    import Util from '@/ts/utils/Util';
    import {LoginModel, LoginRequestModel} from '@/ts/models/UserModel';
    import HttpClient from '@/ts/net/HttpClient';
    import LocalStorageUtil from '@/ts/utils/LocalStorageUtil';
    import {Md5} from "ts-md5";
    import ConfigUtil from '@/ts/utils/ConfigUtil';

    import {Checkbox, CheckboxGroup } from 'vant';
    import JumpWebUtil from "@/ts/utils/JumpWebUtil";
    Vue.use(Checkbox);
    Vue.use(CheckboxGroup);
    Vue.prototype.$notify = Notification;
    Vue.use(Select);
    Vue.use(Option);
    Vue.use(OptionGroup);
    Vue.use(Loading);

    @Component
    export default class Register extends RegisterProxy {
        public created() {
            this.setBaseUrl(GlobalConfig.getBaseUrl());
            this.changeResignType(0);
            //读取配置文件
            this.getDownloadUrl();
            this.init();
        }

        public async init() {
            this.referCode = Util.getUrlParam('refer_code');
            this.checkReferCode=(this.referCode!='')
            // await this.getAreaCodeInfoList(GlobalConfig.getWebBaseUrl());
            this.onGetPackage(1);
        }

        /**
         * 获取配置文件
         * @param url
         */
        public async getDownloadUrl() {
            const jsonConfig = await ConfigUtil.getInstance().download(true);
            const region_code = LocalStorageUtil.getRegionCodes();
            const language = LocalStorageUtil.getLanguage();
            if (jsonConfig != null) {
                const regConfig = jsonConfig.leigod[region_code].register;
                this.isShowEmail = Number(regConfig.is_email);
            }
        }
        /**
         * 从个人中心跳转到官网
         * @param webHost 在global.config中配置
         * @htmlName html名称
         * @param param ?后面带的参数(不要带?，多个参数用&连接)
         * TODO... /0 /cn 默认目录不一样，需要修改
         */
        public userGotoWeb(webHost: string, htmlName: string, param: string = '') {
            //
            const region_code = LocalStorageUtil.getRegionCodes();
            switch (region_code) {
                case Util.REGION_CODE_0:
                    webHost = webHost + '/intl';
                    break;
                case Util.REGION_CODE_1:
                    break;
            }
            //
            const language = LocalStorageUtil.getLanguage();
            switch (language) {
                case Util.EN:
                    webHost = webHost + '/en';
                    break;
                case Util.ZH_CN:
                    break;
            }
            let url = webHost + '/' + htmlName;
            let search = window.location.search;
            search = '';
            if (search == null || search == '') {
                if (param != '') url = url + '?' + param;
            } else {
                url = url + search;
                if (param != '') url = url + '&' + param;
            }
            // window.location.href = url;
            window.open(url,'_blank')
        }

        /**
         * 跳转会员服务条款
         */
        public goUserServer() {
            this.userGotoWeb(GlobalConfig.getWebBaseUrl(), JumpWebUtil.HTML_NAME_USERSERVER);
        }

        /**
         * 跳转到登录
         */
        public toLogin() {
            this.$emit('tologin')
        }



        /**
         * 切换注册方式
         */
        public changeResignType(type: number) {
            this.onChangeRegisterType(type);
            this.agreementChceked = false;
        }

        /**
         * 改变手机区号
         */
        public onSelectCountryCode(val:number) {
            this.country_code_list.map(item=>{
                for(let qq=0;qq<item.options.length;qq++){
                    if(val==item.options[qq].code){
                        this.country_code=Object.assign({},item.options[qq]);
                        this.countryCode=val.toString()
                    }
                }
            })
        }

        /**
         * 获取图形验证码
         */
        public getCaptcha() {
            //TODO...需要验证输入
            this.onGetCaptcha();
        }

        /**
         * 获取短信验证码
         */
        public onSmsCode() {
            let flag = true;
            let tipMsg = '';
            //防止连续点击
            if (this.smsCountDownNum > 0) {
                this.$notify({
                    title: TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_ERROR_TITLE),
                    message: TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_WAITING),
                    type: 'warning'
                });
                return;
            }
            if (this.countryCode == '86') {
                //验证手机号
                if (!CheckUtil.checkPhone(this.phone) && flag) {
                    tipMsg = TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_PHONE_ERROR);
                    flag = false;
                    if (this.phone == "") {
                        tipMsg = TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_PHONE_EMPTY);
                        flag = false;
                    }
                }
            }

            //验证图形验证码
            if (this.isimgVerification == 1) {
                if (!CheckUtil.checkimgVerificatioCode(this.imgCaptchaCode) && flag) {
                    tipMsg = TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_IMGCAPTCHACODE_ERROR);
                    flag = false;
                    if (this.imgCaptchaCode == "") {
                        tipMsg = TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_IMGCAPTCHACODE_EMPTY);
                        flag = false;
                    }
                }
            }

            if (!flag) {
                this.$notify({
                    title: TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_ERROR_TITLE),
                    message: tipMsg,
                    type: 'warning'
                });
                return;
            }
            this.onGetSmscode(0, 2);
        }

        /**
         * 获取短信验证码成功
         * TODO... 此方法可以重写，处理短信获取成功后的ui逻辑
         */
        onGetSmscodeSuccess() {
            this.voiceShow = true;
            this.$notify({
                title: TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_SUCCESS_TITLE),
                message: TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_SMS),
                type: 'success'
            });
            //倒计时
            this.smsCountDownNum = 60;
            const sefl = this;
            Util.countDown(this.smsCountDownNum, 1, (n: number) => {
                sefl.smsCountDownNum = n;
            });
        }

        /**
         * 获取短信验证码失败
         */
        onGetSmscodeFaild(data: any) {
            this.$notify({
                title: TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_ERROR_TITLE),
                message: data.msg,
                type: 'warning'
            });
        }

        /**
         * 获取邮件
         */
        public onEmailCode() {
            let flag = true;
            let tipMsg = '';
            //防止连续点击
            if (this.smsCountDownNum > 0) {
                this.$notify({
                    title: TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_ERROR_TITLE),
                    message: TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_WAITING),
                    type: 'warning'
                });
                return;
            }
            //验证邮箱
            if (!CheckUtil.checkEmail(this.email) && flag) {
                tipMsg = TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_EMAIL_ERROR);
                flag = false;
                if (this.email == "") {
                    tipMsg = TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_EMAIL_EMPTY);
                    flag = false;
                }
            }

            //验证图形验证码
            if (this.isimgVerification == 1) {
                if (!CheckUtil.checkimgVerificatioCode(this.imgCaptchaCode) && flag) {
                    tipMsg = TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_IMGCAPTCHACODE_ERROR);
                    flag = false;
                    if (this.imgCaptchaCode == "") {
                        tipMsg = TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_IMGCAPTCHACODE_EMPTY);
                        flag = false;
                    }
                }
            }

            if (!flag) {
                this.$notify({
                    title: TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_ERROR_TITLE),
                    message: tipMsg,
                    type: 'warning'
                });
                return;
            }
            this.onGetEmailcode(2);
        }

        /**
         * 获取邮箱验证码成功
         * TODO... 此方法可以重写，处理邮件发送成功后的ui逻辑
         */
        onGetEmailcodeSuccess() {
            this.$notify({
                title: TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_SUCCESS_TITLE),
                message: TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_EMAIL),
                type: 'success'
            });
            //倒计时
            this.emailCountDownNum = 60;
            const sefl = this;
            Util.countDown(this.emailCountDownNum, 1, (n: number) => {
                sefl.emailCountDownNum = n;
            });
        }

        /**
         * 获取邮箱验证码失败
         * TODO... 此方法可以重写，处理邮件获取失败后的ui逻辑
         */
        onGetEmailcodeFaild(data: any) {
            // 错误返回
            this.$notify({
                title: TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_ERROR_TITLE),
                message: data.msg,
                type: 'warning'
            });
        }

        /**
         * 获取语音
         */
        public onVoiceCode() {
            let flag = true;
            let tipMsg = '';
            if (this.countryCode == '86') {
                //验证手机号
                if (!CheckUtil.checkPhone(this.phone) && flag) {
                    tipMsg = TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_PHONE_ERROR);
                    flag = false;
                    if (this.phone == "") {
                        tipMsg = TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_PHONE_EMPTY);
                        flag = false;
                    }
                }
            }

            //验证图形验证码
            if (this.isimgVerification == 1) {
                if (!CheckUtil.checkimgVerificatioCode(this.imgCaptchaCode) && flag) {
                    tipMsg = TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_IMGCAPTCHACODE_ERROR);
                    flag = false;
                    if (this.imgCaptchaCode == "") {
                        tipMsg = TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_IMGCAPTCHACODE_EMPTY);
                        flag = false;
                    }
                }
            }

            if (!flag) {
                this.$notify({
                    title: TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_ERROR_TITLE),
                    message: tipMsg,
                    type: 'warning'
                });
                return;
            }
            this.onGetSmscode(1, 2);
        }

        /**
         * 点击注册
         */
        public clickRegister() {
            if(!this.checkReferCode){
                this.referCode=''
            }
            switch (this.resignType) {
                case 0:
                    this.onClickPhoneReg();
                    break;
                case 1:
                    this.onClickEmailReg();
                    break;
            }
        }

        /**
         * 手机注册
         */
        onClickPhoneReg() {
            let flag = true;
            let tipMsg = '';
            if (this.countryCode == '86') {
                //验证手机号
                if (!CheckUtil.checkPhone(this.phone) && flag) {
                    tipMsg = TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_PHONE_ERROR);
                    flag = false;
                    if (this.phone == "") {
                        tipMsg = TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_PHONE_EMPTY);
                        flag = false;
                    }
                }
            }
            //验证图形验证码
            if (this.isimgVerification == 1) {
                if (!CheckUtil.checkimgVerificatioCode(this.imgCaptchaCode) && flag) {
                    tipMsg = TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_IMGCAPTCHACODE_ERROR);
                    flag = false;
                    if (this.imgCaptchaCode == "") {
                        tipMsg = TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_IMGCAPTCHACODE_EMPTY);
                        flag = false;
                    }
                }
            }

            //验证短信验证码
            if (!CheckUtil.checkSmscode(this.smscode) && flag) {
                tipMsg = TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_SMSCODE_ERROR);
                flag = false;
                if (this.smscode == "") {
                    tipMsg = TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_SMSCODE_EMPTY);
                    flag = false;
                }
            }

            //验证密码
            if (!CheckUtil.checkPwd(this.phonePassword) && flag) {
                tipMsg = TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_PASSWORD_ERROR);
                flag = false;
                if (this.phonePassword == "") {
                    tipMsg = TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_PASSWORD_EMPTY);
                    flag = false;
                }
            }

            //验证确认密码
            if (!CheckUtil.checkPwdTwo(this.phonePasswordTwo, this.phonePassword) && flag) {
                tipMsg = TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_PASSWORDTWO_ERROR);
                flag = false;
                if (this.phonePasswordTwo == "") {
                    tipMsg = TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_PASSWORD_EMPTY);
                    flag = false;
                }
            }

            //用户协议
            if (!this.agreementChceked && flag) {
                tipMsg = TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_READAGREEMENT);
                flag = false;
            }

            if (!flag) {
                this.$notify({
                    title: TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_ERROR_TITLE),
                    message: tipMsg,
                    type: 'warning'
                });
                return;
            }

            this.onPhoneRegister();
        }

        /**
         * 邮箱注册
         */
        onClickEmailReg() {
            let flag = true;
            let tipMsg = '';
            //验证邮箱
            if (!CheckUtil.checkEmail(this.email) && flag) {
                tipMsg = TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_EMAIL_ERROR);
                flag = false;
                if (this.email == "") {
                    tipMsg = TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_EMAIL_EMPTY);
                    flag = false;
                }
            }

            //验证图形验证码
            if (this.isimgVerification == 1) {
                if (!CheckUtil.checkimgVerificatioCode(this.imgCaptchaCode) && flag) {
                    tipMsg = TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_IMGCAPTCHACODE_ERROR);
                    flag = false;
                    if (this.imgCaptchaCode == "") {
                        tipMsg = TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_IMGCAPTCHACODE_EMPTY);
                        flag = false;
                    }
                }
            }

            //验证邮箱验证码
            if (!CheckUtil.checkSmscode(this.emailcode) && flag) {
                tipMsg = TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_EMAILCODE_ERROR);
                flag = false;
                if (this.emailcode == "") {
                    tipMsg = TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_EMAILCODE_EMPTY);
                    flag = false;
                }
            }

            //验证密码
            if (!CheckUtil.checkPwd(this.emailPassword) && flag) {
                tipMsg = TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_PASSWORD_ERROR);
                flag = false;
                if (this.emailPassword == "") {
                    tipMsg = TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_PASSWORD_EMPTY);
                    flag = false;
                }
            }

            //验证确认密码
            if (!CheckUtil.checkPwdTwo(this.emailPasswordTwo, this.emailPassword) && flag) {
                tipMsg = TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_PASSWORDTWO_ERROR);
                flag = false;
                if (this.emailPasswordTwo == "") {
                    tipMsg = TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_PASSWORD_EMPTY);
                    flag = false;
                }
            }

            //验证用户协议是否勾选
            if (!this.agreementChceked && flag) {
                tipMsg = TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_READAGREEMENT);
                flag = false;
            }

            if (!flag) {
                this.$notify({
                    title: TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_ERROR_TITLE),
                    message: tipMsg,
                    type: 'warning'
                });
                return;
            }

            this.onEmaillRegister();
        }

        /**
         * 注册成功
         */
        public onRegisterSuccess() {
            this.notifTitle = TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_SUCCESS_TITLE);
            this.notifType = "success";
            this.notifMessage = TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_REGISTER);
            this.notifCount++;
            this.$notify({
                title:this.notifTitle.toString(),
                message:this.notifMessage.toString(),
                type:"success"
            })
            this.loadingMsg = TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_AUTO_LOGIN);
            switch (this.resignType) {
                case 0:
                    this.autoLogin(this.phone, this.phonePassword);
                    break;
                case 1:
                    this.autoLogin(this.email, this.emailPassword);
                    break;
            }
        }

        /**
         * 自动登录
         */
        public async autoLogin(phone, password) {
            let param = new LoginRequestModel();
            param.username = phone;
            param.password = Md5.hashStr(password).toString();
            param.country_code = this.countryCode;
            param.src_channel = LocalStorageUtil.getSrcChannel();

            const url = HttpClient.URL_AUTH_LOGIN;
            this.isLoading=true
            this.backData = await this.http.post<LoginModel>(url, param);
            this.isLoading = false;
            if (this.backData.code == HttpClient.HTTP_SUCCESS_NET_CODE) {
                const loginM: LoginModel = this.backData.data;
                LocalStorageUtil.addUserToken(loginM.login_info);
                LocalStorageUtil.addUserInfo(loginM.user_info);
                this.$notify({
                    title: TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_SUCCESS_TITLE),
                    message: TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_LOGIN),
                    type: 'success'
                });
                this.$emit('logined')
            } else {
                this.$emit('toLogin')
            }
        }

        /**
         * 注册失败
         */
        public onRegisterFaild(data: any) {
            // 错误返回
            this.$notify({
                title: TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_ERROR_TITLE),
                message: data.msg,
                type: 'warning'
            });
        }
    }

</script>

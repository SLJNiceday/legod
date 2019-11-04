<template>
    <div class="dialog_box" v-loading="isLoading">
        <div class="clear_fix login_tab_box">
            <div class="f_left login_tab_item" @click="changeResignType(2)"
                 :class="{'login_tab_active': resignType == 2}">
                <!--                    手机重置-->
                <span class="txt">{{$t("public.share50")}}</span>
                <i class="tag"></i>
            </div>
            <div class="f_right login_tab_item" @click="changeResignType(3)"
                 :class="{'login_tab_active': resignType == 3}">
                <!--                    邮箱重置-->
                <span class="txt">{{$t("public.share51")}}</span>
                <i class="tag"></i>
            </div>
        </div>
        <!--手机-->
        <div style="display: none;" v-show="resignType == 2">
            <div class="mar_t30 public_enter_ipt">
                <div class="f_left select_box login_select_box" style="background:#f6f6f6;margin-left: -10px;" id="phoneCodePart">
                    <el-select @change="onSelectCountryCode" v-model="country_code.code"
                               placeholder="" style="width:100%;" >
                        <div slot="prefix"><img :src="country_code.ico" style="margin-top:10px;" class="select_box__img" alt=""> </div>
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
                <!--                    placeholder="手机号"-->
                <input class="f_left transparent_ipt" type="text" v-model="phone" :placeholder="$t('public.share2')">
            </div>
            <!--图形验证码-->
            <div class="mar_t15" style="position: relative;" v-show="isimgVerification">
                <!--                    placeholder="图形验证码"-->
                <input class="public_enter_ipt" v-model="imgCaptchaCode" type="text" :placeholder="$t('public.share5')">
                <div class="img_code_box smscodesend" style="margin-right:0px;width: 80px;" @click="getCaptcha">
                    <img :src="imgCaptchaM.img" class="img_filter" alt="">
                </div>
            </div>
            <div class="mar_t15" style="position: relative;">
                <!--                    placeholder="短信验证码"-->
                <input class="public_enter_ipt" type="text" v-model="smscode" :placeholder="$t('public.share48')">
                <div class="img_code_box smscodesend" style="text-align: right;">

                    <a class="web_protocol_font" v-show="smsCountDownNum <= 0" @click="onSmsCode">{{$t("public.share6")}}</a>
                    <span class="list_font smscodesend__seperate"
                          v-show="smsCountDownNum <= 0 && voiceShow">|</span>
                    <a class="web_protocol_font" v-show="smsCountDownNum <= 0 && voiceShow"
                       @click="onVoiceCode">{{$t("public.share7")}}</a>

                    <span style="display: none;margin-right: 10px;"
                          v-show="smsCountDownNum > 0">({{smsCountDownNum}}s)</span>
                </div>
            </div>
            <!--                placeholder="密码 (6-20位数字+字母组合)"-->
            <input class="mar_t15 public_enter_ipt" type="password" v-model="phonePassword"
                   :placeholder="$t('public.share40')">
            <input class="mar_t15 public_enter_ipt" type="password" v-model="phonePasswordTwo"
                   :placeholder="$t('public.share41')">
        </div>
        <!--邮箱-->
        <div style="display: none;" v-show="resignType == 3">
            <!--                placeholder="邮箱号"-->
            <input class="mar_t30 public_enter_ipt" type="text" v-model="email" :placeholder="$t('public.share3')">
            <div class="mar_t15" style="position: relative;" v-show="isimgVerification">
                <input v-model="imgCaptchaCode" class="public_enter_ipt" type="text"
                       :placeholder="$t('public.share5')">
                <div class="img_code_box smscodesend" style="width: 80px;" @click="getCaptcha">
                    <img :src="imgCaptchaM.img" class="img_filter" alt="">
                </div>
            </div>
            <div class="mar_t15" style="position: relative;">
                <input class="public_enter_ipt" v-model="emailcode" type="text"
                       :placeholder="$t('public.share49')">
                <div class="img_code_box smscodesend" style="justify-content: flex-end;text-align: right;">
                    <a class="web_protocol_font" @click="onEmailCode" v-show="emailCountDownNum <= 0">{{$t("public.share42")}}</a>
                    <span style="display: none;margin-right: 10px;" v-show="emailCountDownNum > 0">({{emailCountDownNum}}s)</span>
                </div>
            </div>
            <!--                placeholder="密码 (6-20位数字+字母组合)"-->
            <input class="mar_t15 public_enter_ipt" type="password" v-model="emailPassword"
                   :placeholder="$t('public.share40')">
            <input class="mar_t15 public_enter_ipt" type="password" v-model="emailPasswordTwo"
                   :placeholder="$t('public.share41')">
        </div>
        <!--            重置密码-->
        <div class="mar_t20 public_enter_btn" @click="clickFindPassword">
            {{$t("public.share52")}}
        </div>
        <div class="mar_t15 text_center">
            <!--                返回登录-->
            <a class="public_white_btn" @click="toLogin"> {{$t("public.share53")}}</a>
        </div>
    </div>
</template>
<script lang="ts">
    import '@/assets/less/leishen.less';
    import 'babel-polyfill';
    import {Vue, Component} from 'vue-property-decorator';
    import {Loading, Notification, Option, Select, OptionGroup} from 'element-ui';
    import {FindpwdProxy} from '@/ts/proxy/FindpwdProxy';
    import GlobalConfig from '../global.config';
    import {TipsMsgUtil} from '@/ts/utils/TipsMsgUtil';
    import CheckUtil from '@/ts/utils/CheckUtil';
    import Util from '@/ts/utils/Util';

    Vue.prototype.$notify = Notification;
    Vue.use(Select);
    Vue.use(Option);
    Vue.use(OptionGroup);
    Vue.use(Loading);
    Vue.config.productionTip = false;
    @Component
    export default class ForgetPwd extends FindpwdProxy {
        public async created() {
            this.setBaseUrl(GlobalConfig.getBaseUrl());
            this.changeResignType(2);
            this.init();
            // await this.getAreaCodeInfoList(GlobalConfig.getWebBaseUrl());
        }

        /**
         * 切换找回密码方式
         */
        public changeResignType(type: number) {
            this.onChangeRegisterType(type);
        }

        public toLogin() {
            this.$emit('tologin')
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
            this.onGetCaptcha();
        }

        /**
         * 跳转到登陆
         */
        goLogin() {
            this.$emit('tologin')
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
                    if (this.phone == '') {
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
                    if (this.imgCaptchaCode == '') {
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
            this.onGetSmscode(0, 1);
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
                    if (this.phone == '') {
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
                    if (this.imgCaptchaCode == '') {
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
            this.onGetSmscode(1, 1);
        }

        /**
         * 获取短信验证码成功
         * TODO... 此方法可以重写，处理短信获取成功后的ui逻辑
         */
        onGetSmscodeSuccess() {
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
                if (this.email == '') {
                    tipMsg = TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_EMAIL_EMPTY);
                    flag = false;
                }
            }

            //验证图形验证码
            if (this.isimgVerification == 1) {
                if (!CheckUtil.checkimgVerificatioCode(this.imgCaptchaCode) && flag) {
                    tipMsg = TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_IMGCAPTCHACODE_ERROR);
                    flag = false;
                    if (this.imgCaptchaCode == '') {
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
            this.onGetEmailcode(1);
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
         * 点击重置密码
         */
        public clickFindPassword() {
            switch (this.resignType) {
                case 2:
                    this.onClickPhoneReg();
                    break;
                case 3:
                    this.onClickEmailReg();
                    break;
            }
        }

        /**
         * 手机找回密码
         */
        onClickPhoneReg() {
            let flag = true;
            let tipMsg = '';
            if (this.countryCode == '86') {
                //验证手机号
                if (!CheckUtil.checkPhone(this.phone) && flag) {
                    tipMsg = TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_PHONE_ERROR);
                    flag = false;
                    if (this.phone == '') {
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
                    if (this.imgCaptchaCode == '') {
                        tipMsg = TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_IMGCAPTCHACODE_EMPTY);
                        flag = false;
                    }
                }
            }

            //验证短信验证码
            if (!CheckUtil.checkSmscode(this.smscode) && flag) {
                tipMsg = TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_SMSCODE_ERROR);
                flag = false;
                if (this.smscode == '') {
                    tipMsg = TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_SMSCODE_EMPTY);
                    flag = false;
                }
            }

            //验证密码
            if (!CheckUtil.checkPwd(this.phonePassword) && flag) {
                tipMsg = TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_PASSWORD_ERROR);
                flag = false;
                if (this.phonePassword == '') {
                    tipMsg = TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_PASSWORD_EMPTY);
                    flag = false;
                }
            }

            //验证确认密码
            if (!CheckUtil.checkPwdTwo(this.phonePasswordTwo, this.phonePassword) && flag) {
                tipMsg = TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_PASSWORDTWO_ERROR);
                flag = false;
                if (this.phonePasswordTwo == '') {
                    tipMsg = TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_PASSWORD_EMPTY);
                    flag = false;
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
            this.onPhoneFindPassword();
        }

        /**
         * 邮箱找回密码
         */
        onClickEmailReg() {
            let flag = true;
            let tipMsg = '';
            //验证邮箱
            if (!CheckUtil.checkEmail(this.email) && flag) {
                tipMsg = TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_EMAIL_ERROR);
                flag = false;
                if (this.email == '') {
                    tipMsg = TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_EMAIL_EMPTY);
                    flag = false;
                }
            }

            //验证图形验证码
            if (this.isimgVerification == 1) {
                if (!CheckUtil.checkimgVerificatioCode(this.imgCaptchaCode) && flag) {
                    tipMsg = TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_IMGCAPTCHACODE_ERROR);
                    flag = false;
                    if (this.imgCaptchaCode == '') {
                        tipMsg = TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_IMGCAPTCHACODE_EMPTY);
                        flag = false;
                    }
                }
            }

            //验证邮箱验证码
            if (!CheckUtil.checkSmscode(this.emailcode) && flag) {
                tipMsg = TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_EMAILCODE_ERROR);
                flag = false;
                if (this.emailcode == '') {
                    tipMsg = TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_EMAILCODE_EMPTY);
                    flag = false;
                }
            }

            //验证密码
            if (!CheckUtil.checkPwd(this.emailPassword) && flag) {
                tipMsg = TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_PASSWORD_ERROR);
                flag = false;
                if (this.emailPassword == '') {
                    tipMsg = TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_PASSWORD_EMPTY);
                    flag = false;
                }
            }

            //验证确认密码
            if (!CheckUtil.checkPwdTwo(this.emailPasswordTwo, this.emailPassword) && flag) {
                tipMsg = TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_PASSWORDTWO_ERROR);
                flag = false;
                if (this.emailPasswordTwo == '') {
                    tipMsg = TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_PASSWORD_EMPTY);
                    flag = false;
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

            this.onEmailFindPassword();
        }

        /**
         * 密码找回成功
         */
        onFindPwdSuccess() {
            this.$notify({
                title: TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_SUCCESS_TITLE),
                message: TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_FINDPWD),
                type: 'success'
            });
            this.goLogin()
        }

        /**
         * 密码找回失败
         */
        onFindPwdFaild(data: any) {
            // 错误返回
            this.$notify({
                title: TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_ERROR_TITLE),
                message: data.msg,
                type: 'warning'
            });
        }
    }
</script>

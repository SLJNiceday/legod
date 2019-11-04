import '@/assets/less/leishen.less';
import "babel-polyfill";
import {Vue, Component} from 'vue-property-decorator';
import VueI18n from "vue-i18n";
import {Notification, Select, Option, Loading, OptionGroup} from 'element-ui';
import {RegisterProxy} from '@/ts/proxy/RegisterProxy';
import GlobalConfig from './global.config';
import {TipsMsgUtil} from '@/ts/utils/TipsMsgUtil';
import CheckUtil from '@/ts/utils/CheckUtil';
import Util from '@/ts/utils/Util';
import {LoginModel, SendVerificationCodeRequestModel} from '@/ts/models/UserModel';
import LocalStorageUtil from '@/ts/utils/LocalStorageUtil';
import JumpWebUtil from '@/ts/utils/JumpWebUtil';
import AppParamModel from "@/ts/models/AppModel";
import {LsLanguage} from "@/pages/leishen_user/util/LsLanguage";
import ConfigUtil from '@/ts/utils/ConfigUtil';
import {Checkbox, CheckboxGroup} from 'vant';

Vue.use(Checkbox);
Vue.use(CheckboxGroup);
Vue.prototype.$notify = Notification;
Vue.use(Select);
Vue.use(Option);
Vue.use(OptionGroup);
Vue.use(Loading);


//语言包
Vue.use(VueI18n);
const webParam = AppParamModel.getInstace(Util.REGION_CODE_1, Util.ZH_CN);
let lang = LsLanguage.getInstance();
lang.init();
const i18n = new VueI18n(lang);

@Component
class BindMobile extends RegisterProxy {
    public webParam = AppParamModel.getInstace(); // 浏览器参数
    public bindUrlType: string = '';

    /**
     * 切换语言
     */
    public onChangeLanguage(ln: string) {
        lang.changeLanguage(ln);
        i18n.locale = lang.locale;
        this.webParam.language = ln;
        // GlobalConfig.log('切换语言:' + lang.locale);
    }

    public created() {
        this.setBaseUrl(GlobalConfig.getBaseUrl());
        this.getDownloadUrl();
        this.changeResignType(4);
        this.token = LocalStorageUtil.getUserToken().account_token;
        this.bindUrlType = LocalStorageUtil.getthreeBindSource();
        this.init();
    }

    public init(): void {
        this.referCode = Util.getUrlParam('refer_code');
        // this.getAreaCodeList();
        this.getAreaCodeInfoList(GlobalConfig.getWebBaseUrl());
        this.onGetPackage(1);
    }

    /**
     * 切换注册方式
     */
    public changeResignType(type: number) {
        this.onChangeRegisterType(type);
        this.agreementChceked = false;
    }

    /**
     * 获取配置文件
     * @param url
     */
    public async getDownloadUrl() {
        const jsonConfig = await ConfigUtil.getInstance().download(true);
        const region_code = LocalStorageUtil.getRegionCodes();
        if (jsonConfig != null) {
            const regConfig = jsonConfig.leigod[region_code].register;
            this.isShowEmail = Number(regConfig.is_email);
        }
    }

    /**
     * 跳转会员服务条款
     */
    public goUserServer() {
        this.userGotoWeb(GlobalConfig.getWebBaseUrl(), JumpWebUtil.HTML_NAME_USERSERVER);
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
        window.open(url, '_blank')
    }

    /**
     * 跳转首页
     */
    public goHome() {
        JumpWebUtil.userGotoWeb(GlobalConfig.getWebBaseUrl(), JumpWebUtil.HTML_NAME_INDEX);
    }

    /**
     * 改变手机区号
     */
    public onSelectCountryCode(val: number) {
        this.country_code_list.map(item => {
            for (let qq = 0; qq < item.options.length; qq++) {
                if (val == item.options[qq].code) {
                    this.country_code = Object.assign({}, item.options[qq])
                    this.countryCode = val.toString()
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
        this.onGetSmscode(0, 3);
    }

    /**
     * 获取短信验证码成功
     * TODO... 此方法可以重写，处理短信获取成功后的ui逻辑
     */
    onGetSmscodeSuccess() {
        this.$notify({
            title: TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_SUCCESS_TITLE),
            message: TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_SMS),
            type: 'warning'
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
        this.onGetEmailcode(3);
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
     * 发送已登录账号验证码
     */
    public sendVerifyCode() {
        let param = new SendVerificationCodeRequestModel();
        param.account_token = this.token;
        this.onSendVerification(param);
    }

    /**
     * 发送已登录账号验证码成功
     */
    onSendVerificationSuccess(data: any) {
        this.verify_key = data.data.verify_key;
        this.$notify({
            title: TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_SUCCESS_TITLE),
            message: TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_SMS),
            type: 'success'
        });
        //倒计时
        this.verifyCountDownNum = 60;
        const sefl = this;
        Util.countDown(this.verifyCountDownNum, 1, (n: number) => {
            sefl.verifyCountDownNum = n;
        });
    }

    /**
     * 发送已登录账号验证码失败
     */
    onSendVerificationFaild(data: any) {
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
        this.onGetSmscode(1, 3);
    }

    /**
     * 点击绑定(未登录状态)
     */
    public clickRegister() {
        if(!this.checkReferCode){
            this.referCode=''
        }
        switch (this.resignType) {
            case 4:
                this.onClickBindPhone();
                break;
            case 5:
                this.onClickEmailReg();
                break;
        }
    }

    /**
     * 绑定已登录账号
     */
    public bindDefaultAccount() {
        let tipMsg = '';
        //验证短信验证码
        if (!CheckUtil.checkSmscode(this.verify_code)) {
            tipMsg = TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_SMSCODE_ERROR);
            if (this.smscode == "") {
                tipMsg = TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_SMSCODE_EMPTY);
            }
            this.$notify({
                title: TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_ERROR_TITLE),
                message: tipMsg,
                type: 'warning'
            });
            return;
        }

        this.onBindDefaultAccount('', "4")
    }

    /**
     * 绑定手机
     */
    onClickBindPhone() {
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
        if (this.bind_status == '4' && !CheckUtil.checkPwd(this.phonePassword) && flag) {
            tipMsg = TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_PASSWORD_ERROR);
            flag = false;
            if (this.phonePassword == "") {
                tipMsg = TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_PASSWORD_EMPTY);
                flag = false;
            }
        }

        //用户协议
        if (this.bind_status == '4' && !this.agreementChceked && flag) {
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

        this.onBindPhone('', '4');
    }

    /**
     * 绑定邮箱
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
        if (this.bind_status == '4' && !CheckUtil.checkPwd(this.emailPassword) && flag) {
            tipMsg = TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_PASSWORD_ERROR);
            flag = false;
            if (this.phonePassword == "") {
                tipMsg = TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_PASSWORD_EMPTY);
                flag = false;
            }
        }

        //验证用户协议是否勾选
        if (this.bind_status == '4' && !this.agreementChceked && flag) {
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

        this.onBindEmail('', '4');
    }

    /**
     * 绑定成功
     */
    public onBindingSuccess(data: any) {
        let tipMsg = '';
        if (this.bindUrlType == '0') {
            tipMsg = TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_BINDING);
        } else {
            if (this.resignType == 4) {
                tipMsg = TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_BINDING_MOBILE);
            } else if (this.resignType == 5) {
                tipMsg = TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_BINDING_EMAIL);
            }
        }
        this.$notify({
            title: TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_SUCCESS_TITLE),
            message: tipMsg,
            type: 'success'
        });
        const loginM: LoginModel = data.data;
        LocalStorageUtil.addUserToken(loginM.login_info);
        LocalStorageUtil.addUserInfo(loginM.user_info);
        // 自动登录
        // this.isLoading = true;
        this.loadingMsg = TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_AUTO_LOGIN);
        if (window.name == 'leigod_three_login') {
            setTimeout(() => {
                if (this.bindUrlType == '0') {
                    //如果是用户中心跳转过来的，刷新用户状态
                    // @ts-ignore
                    window.opener.getThirdBindState()
                    window.close();
                } else {
                    window.opener.location.reload()
                    // window.opener.loginSuccess()
                    window.close();
                }
            },500)
        } else {
            setTimeout(() => {
                JumpWebUtil.wapJump(GlobalConfig.getUserBaseUrl(), JumpWebUtil.HTML_NAME_USER);
            }, 1000);
        }
    }

    /**
     * 注册失败
     */
    public onBindingFaild(data: any) {
        // 错误返回
        this.$notify({
            title: TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_ERROR_TITLE),
            message: data.msg,
            type: 'warning'
        });
    }
}

new BindMobile({
    i18n
}).$mount('#app');

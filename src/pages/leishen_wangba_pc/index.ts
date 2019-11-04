import {Vue, Component} from "vue-property-decorator";
import 'babel-polyfill';
import './less/pc.less';
import Util from "@/ts/utils/Util";
import {PcProxy} from "@/ts/netbar/api/PcProxy";
import {
    PCWxCheckloginRequestModel,
    PCWxloginRequestModel,
    SubuserSendBindSmsRequestModel, SubuserSendBindTelRequestModel
} from "@/ts/netbar/model/WxLoginModel";
import GlobalConfig from "./global_config";
import CheckUtil from "@/ts/utils/CheckUtil";
import {TipsMsgUtil} from "@/ts/utils/TipsMsgUtil";
import {Loading} from 'element-ui'
import LocalStorageUtil from "@/ts/netbar/utils/LocalStorageUtil";

Vue.use(Loading);

@Component
class Index extends PcProxy {
    public wangba_pattern: string | number = Util.getUrlParam('wangba_pattern') || 2; //1 扫码付费直接加速模式   2扫码付费绑定手机号然后加速  3全部隐藏
    public showBindMobile: string | number = Util.getUrlParam('showBindMobile') || 0;//显示绑定手机号弹窗  0 不显示 1显示
    public qrCode: string = '';//登录二维码
    public scene_str: string = '';//请求序列号
    private timer = null;//定时器
    private userid = Number(Util.getUrlParam('userid'));
    public SubuserSendBindSmsParam = new SubuserSendBindSmsRequestModel();//获取短信验证码需要的参数

    async created() {
        this.setBaseUrl(GlobalConfig.getBaseUrl());
        await this.init()
    }

    /**
     * 页面初始化
     */
    public async init() {
        let params = new PCWxloginRequestModel();
        params.userid = this.userid;
        if (this.showBindMobile == 0) {
            await this.getLoginScan(params);
        } else {
            this.onGetCaptcha();
        }
    }


    /**
     * 关闭弹窗
     * @param wangba_pattern 关闭第哪个模式的弹窗
     */
    closedialog() {
        //判断是绑定手机页面就回到登录二维码页面 并重新生成二维码
        if (this.wangba_pattern == 2 && this.showBindMobile == 1) {
            this.showBindMobile = 0;
            this.getLoginScan({userid: this.userid});
        } else {

        }
    }

    /**
     * 获取登录码成功
     * @param d
     */
    async getLoginScanSuccess(d) {
        this.qrCode = d.qrcodeUrl;
        this.scene_str = d.scene_str;
        let params = new PCWxCheckloginRequestModel();
        params.scene_str = d.scene_str;
        this.timer = setInterval(() => {
            this.checkoutLoginScan(params)
        }, 3000)
    }

    /**
     * 获取登录码失败
     * @param d
     */
    async getLoginScanFail(d) {
        Util.ShowToast(d.msg)
    }

    /**
     * 检查扫码登录结果成功
     * @param d
     */
    async checkoutLoginScanSuccess(d) {
        LocalStorageUtil.setCookie(LocalStorageUtil.STORAGES_SUB_USERID,d.subuserid);
        clearInterval(this.timer);
        window.location.href = d.redirect;
    }

    /**
     * 检查扫码登录结果失败
     * @param d
     */
    async checkoutLoginScanFail(d) {
        clearInterval(this.timer);
        Util.ShowToast(d.msg + ',请重试');
        await this.getLoginScan({userid: this.userid});
    }

    /**
     * 发送短信验证码
     */
    public sendsms() {
        //验证手机号
        if (!CheckUtil.checkPhone(this.phone)) {
            if (this.phone == "") {
                this.notifMessage = TipsMsgUtil.getTipsMsg(
                    TipsMsgUtil.KEY_NOTIF_PHONE_EMPTY
                );
                Util.ShowToast(this.notifMessage);
                return false;
            }
            this.notifMessage = TipsMsgUtil.getTipsMsg(
                TipsMsgUtil.KEY_NOTIF_PHONE_ERROR
            );
            Util.ShowToast(this.notifMessage);
            return false;
        }

        //验证图形验证码
        if (!CheckUtil.checkimgVerificatioCode(this.checkcode)) {
            if (this.checkcode == "") {
                this.notifMessage = TipsMsgUtil.getTipsMsg(
                    TipsMsgUtil.KEY_NOTIF_IMGCAPTCHACODE_EMPTY
                );
                Util.ShowToast(this.notifMessage);
                return false;
            }
            this.notifMessage = TipsMsgUtil.getTipsMsg(
                TipsMsgUtil.KEY_NOTIF_IMGCAPTCHACODE_ERROR
            );
            Util.ShowToast(this.notifMessage);
            return false;
        }
        this.SubuserSendBindSmsParam.key = this.imgCaptchaKey;
        this.SubuserSendBindSmsParam.tel = this.phone;
        this.SubuserSendBindSmsParam.bindcode = this.checkcode;
        this.subuserSendBindSms(this.SubuserSendBindSmsParam);
    }

    /**
     * 短信获取成功
     *
     * dcode: 1 已发送
     2 获取操作太频繁
     3 手机格式错误
     4 短信平台错误
     5 需要登录
     6 手机号已占用
     9 图像验证码错误
     10 帐号不存在
     */
    async subuserSendBindSmsSuccess(d) {
        // 倒计时
        this.smsCountDownNum = 60;
        const sefl = this;
        Util.countDown(this.smsCountDownNum, 1, (n: number) => {
            sefl.smsCountDownNum = n;
        });
    }

    /**
     * 短信获取失败
     * @param d
     */
    async subuserSendBindSmsFail(d) {
        Util.ShowToast(d.msg, 3000);
        setTimeout(() => {
            this.onGetCaptcha();
        }, 500);
    }

    /**
     * 子账号绑定手机号
     */
    bindTel() {
        let param = new SubuserSendBindTelRequestModel();
        param.key = this.imgCaptchaKey;
        param.smscode = this.smscode;
        param.subuserid = Number(Util.getUrlParam(LocalStorageUtil.STORAGES_SUB_USERID));
        param.userid = this.userid;
        param.tel = this.phone;
        param.password=this.password;

        //验证手机号
        if (!CheckUtil.checkPhone(this.phone)) {
            if (this.phone == "") {
                this.notifMessage = TipsMsgUtil.getTipsMsg(
                    TipsMsgUtil.KEY_NOTIF_PHONE_EMPTY
                );
                Util.ShowToast(this.notifMessage);
                return false;
            }
            this.notifMessage = TipsMsgUtil.getTipsMsg(
                TipsMsgUtil.KEY_NOTIF_PHONE_ERROR
            );
            Util.ShowToast(this.notifMessage);
            return false;
        }

        //验证图形验证码
        if (!CheckUtil.checkimgVerificatioCode(this.checkcode)) {
            if (this.checkcode == "") {
                this.notifMessage = TipsMsgUtil.getTipsMsg(
                    TipsMsgUtil.KEY_NOTIF_IMGCAPTCHACODE_EMPTY
                );
                Util.ShowToast(this.notifMessage);
                return false;
            }
            this.notifMessage = TipsMsgUtil.getTipsMsg(
                TipsMsgUtil.KEY_NOTIF_IMGCAPTCHACODE_ERROR
            );
            Util.ShowToast(this.notifMessage);
            return false;
        }

        //验证短信验证码
        if (!CheckUtil.checkSmscode(this.smscode)) {
            if (this.smscode == "") {
                this.notifMessage = TipsMsgUtil.getTipsMsg(
                    TipsMsgUtil.KEY_NOTIF_SMSCODE_EMPTY
                );
                Util.ShowToast(this.notifMessage);
                return false;
            }
            this.notifMessage = TipsMsgUtil.getTipsMsg(
                TipsMsgUtil.KEY_NOTIF_SMSCODE_ERROR
            );
            Util.ShowToast(this.notifMessage);
            return false;
        }

        //验证密码
        if (!CheckUtil.checkPwd(this.password)) {
            if (this.password == "") {
                this.notifMessage = TipsMsgUtil.getTipsMsg(
                    TipsMsgUtil.KEY_NOTIF_PASSWORD_EMPTY
                );
                Util.ShowToast(this.notifMessage);
                return false;
            }
            this.notifMessage = TipsMsgUtil.getTipsMsg(
                TipsMsgUtil.KEY_NOTIF_PASSWORD_ERROR
            );
            Util.ShowToast(this.notifMessage);
            return false;
        }

        this.subuserSendBindTel(param)
    }

    /**
     * 子账号绑定手机号成功
     * @param d
     */
    async subuserSendBindTelSuccess(d) {
        window.location.href = d.redirect;
    }

    /**
     * 子账号绑定手机号失败
     * @param d
     */
    async subuserSendBindTelFail(d) {
        Util.ShowToast(d.msg);
        setTimeout(() => {
            this.onGetCaptcha();
        }, 500);
    }

}

new Index().$mount('#app');
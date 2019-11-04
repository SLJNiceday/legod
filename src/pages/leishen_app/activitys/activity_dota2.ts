import '@/assets/less/leishen_app.less';
import './assets/less/activity_dota2.less';
import 'babel-polyfill';
import $ from "jquery";
import {Component, Vue} from 'vue-property-decorator';
import VueI18n from 'vue-i18n';
import {LsLanguage} from '../util/LsLanguage';
import GlobalConfig from '../global.config';
import Util from '@/ts/utils/Util';
import LocalStorageUtil from "@/ts/utils/LocalStorageUtil";
import ActivityProxyV2 from "@/ts/proxy/ActivityProxyV2";
import ActivityFactory from "@/ts/factory/activity.factory";
import AppParamModel from "@/ts/models/AppModel";
import ConfigUtil from "@/ts/utils/ConfigUtil";
import JumpWebUtil from "@/ts/utils/JumpWebUtil";
import HttpClient from "@/ts/net/HttpClient";
import {PriceList, UserDiscountList, UserInfo, UserRechargeInfo} from "@/ts/models/UserModel";
import LoginDialog from "@/pages/leishen_app/activitys/components/LoginDialog";
import RegisterDialog from "@/pages/leishen_app/activitys/components/RegisterDialog";
import ForgetDialog from "@/pages/leishen_app/activitys/components/ForgetDialog";
import RechargeDialog from "@/pages/leishen_app/activitys/components/RechargeDialogV2";
import RewardDialog from "@/pages/leishen_app/activitys/components/RewardDialog";

import {Popup, Toast} from "vant";
import {ActivityPackageRequestModel, ActivityModel} from "@/ts/models/NewsModel";

Vue.use(Popup);
Vue.use(Toast);

Vue.config.productionTip = false;

//语言包
Vue.use(VueI18n);
const appParam: AppParamModel = AppParamModel.getInstace(Util.REGION_CODE_1, Util.ZH_CN);
let lang = LsLanguage.getInstance();
lang.init();
const i18n = new VueI18n(lang);

@Component({
    components: {
        "login-dialog": LoginDialog,
        "register-dialog": RegisterDialog,
        "forget-dialog": ForgetDialog,
        "recharge-dialog": RechargeDialog,
        "reward-dialog": RewardDialog
    }
})
class activityModel extends ActivityProxyV2 {

    public choosePriceInfo = new PriceList();

    public activity_id = 220;
    public activity_json = ActivityFactory.getInstace('mobile', this.activity_id);
    public appParam = AppParamModel.getInstace(); // 浏览器参数

    public showType: number = 1;//组件显示次序，1登录 2注册 3忘记密码
    public show_dialog: boolean = false;//登录、注册、忘记密码弹框
    public show_reward: boolean = false;//兑奖弹窗
    public show_recharge: boolean = false;//支付弹窗
    public userDiscountList: Array<UserDiscountList> = [];//请求回的全部折扣码列表
    public userDiscount: string = '';
    public activityPackageId: number = 0;
    public canbuyTwice:boolean=true;
    public async created() {
        this.imageHeadUrl = GlobalConfig.getImgBaseUrl();//图片根地址获取
        this.setBaseUrl(GlobalConfig.getBaseUrl());//设置请求的根地址
        this.checkEnvironment();//获取当前设备环境，分为Android、iOS、微信公众号
        this.getUserInfo('app');//初始化获取用户信息，用于用户充值
        this.getActivityDetail();//获取活动详情，一个是获取活动是否过期信息，一个是获取参与本次活动所需要的最低积分
        this.getActivityPackage(HttpClient.URL_ACTIVITY_SPECIAL_PACKAGE); //获取活动的套餐信息
    }

    public mounted() {
        this.getAwardList();
    }

    /**
     * 成功获取用户信息
     */
    getUserinfoSuccess() {
        this.getActivityDetail();
        (this.$refs.to_recharge as any).init()
    }

    /**
     * 成功获取用户活动信息,如果未开始，或者已经结束，给出相应的提示
     */
    getActivityDetailSuccess(data: ActivityModel) {
        if (!this.isKaishi || this.isJieshu) {
            Toast.fail(this.dialog_msg)
        }
    }

    /**
     * 成功获取套餐
     */
    getActivityPackageSuccess(packageData: UserRechargeInfo) {
        this.activityPackageId = packageData.package_id;
        let tempPrice = packageData.price.sort((a, b) => {
            return b.price_is_recommend - a.price_is_recommend
        })
        this.priceList = tempPrice.slice(0)
    }

    /**
     * 设置登录注册忘记密码各组件的名字
     */
    get activComponent() {
        switch (this.showType) {
            case 1:
                return 'login-dialog';
                break;
            case 2:
                return 'register-dialog';
                break;
            case 3:
                return 'forget-dialog';
                break;
        }
    }

    /**
     * 跳转到登录界面
     */
    public gotoLogin() {
        this.show_dialog = true;
        this.showType = 1;
    }

    /**
     * 跳转到注册界面
     */
    public toRegister() {
        this.showType = 2;
    }

    /**
     * 跳转到忘记密码界面
     */
    public toForgetPwd() {
        this.showType = 3;
    }

    /**
     * 前往活动记录+去兑奖
     */
    public gotoRecord() {
        if (!Util.easyIsLogined()) {
            //提示登录
            this.gotoLogin();
            return;
        } else {
            this.dialog_win = false;
            this.show_reward = true;
            (this.$refs.to_reward as any).loadList();
        }
    }

    public onCloseRecharge() {
        this.dialog_recharge = false;
        window.location.href = "#recharge";
        $('body').removeClass('body_fixed');
    }


    /**
     * 关闭活动记录弹窗
     */
    public closeReward() {
        this.show_reward = false;
    }

    /**
     * 用户不能参与活动的提示
     */
    cannotBuy() {
        this.isValidUser = false;
        Toast.fail(this.tipinvalidUser)
    }

    /**
     * 默认充值
     */
    public async gotoRecharge(data: PriceList) {
        // let token = Util.getUrlParam("account_token") || LocalStorageUtil.getUserToken().account_token;
        if (!Util.easyIsLogined()) {
            //提示登录
            this.gotoLogin();
            return;
        } else {
            if (!this.canClick()) {
                this.dialog_error = true;
                this.dialog_msg = this.activity_ErrorTip;
            } else {
                this.choosePriceInfo = Object.assign({}, data);
                this.dialog_recharge = false;
                this.show_recharge = !this.show_recharge;//打开支付，并未开始支付
                if (this.appParam.platform != 4) {
                    (this.$refs.to_recharge as any).initPop() //初始化折扣码的信息
                } else if (this.appParam.platform === 4) {
                    //  如果是微信环境，直接调用子组件的原生微信支付方法
                    (this.$refs.to_recharge as any).wxinitPop();
                }
            }
        }
    }

    public async paySuccess() {
        this.getActivityDetail();//获取活动详情，一个是获取活动是否过期信息，一个是获取参与本次活动所需要的最低积分
        if(this.canbuyTwice){
            (this.$refs.to_recharge as any).getUserDiscount()
        }
    }

    /**
     * 登录成功，父组件事件
     * @param data
     */
    public alreadyLogin() {
        // 关闭登录弹窗
        this.show_dialog = false;
        this.needtoCheck = false
        this.getUserInfo('app');
        this.getActivityDetail();
    }

    /**
     * 检测当前页面环境，微信，手机浏览器（Android+iOS）
     */
    public checkEnvironment() {
        const self = this;
        $(function () {
            var u = navigator.userAgent;
            var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1; //android终端
            var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
            var ua = window.navigator.userAgent.toLowerCase();
            // @ts-ignore
            if (ua.match(/MicroMessenger/i) == "micromessenger") {
                //微信环境
                appParam.platform = 4;
            } else if (isAndroid) {
            } else if (isiOS) {
            }
        });
    }


    /**
     * 获取用户信息失败
     */
    public getUserinfoFail(data) {
        this.tokenExpired();
    }

    /**
     * 初始化中奖列表名单
     */
    public initAwardList() {
        if (this.awardList.length <= 7) return;
        $(function () {
            setInterval(function () {
                var $ul = $("#jilu_box");
                $ul.animate({
                    marginTop: "-52px"
                }, 400, function () {
                    $ul.find("li").eq(0).appendTo($ul);
                    $ul.css("margin-top", "0")
                })
            }, 2000);
        });
    }

    /**
     * token过期
     * @param param
     */
    public tokenExpired(): void {
        LocalStorageUtil.loginOut();
    }

    /**
     * 切换语言
     */
    public onChangeLanguage(ln: string) {
        lang.changeLanguage(ln);
        i18n.locale = lang.locale;
        this.appParam.language = ln;
    }

}

new activityModel({i18n}).$mount('#app')

import '@/assets/less/leishen_app.less';
import './assets/less/shujia.less';
import 'babel-polyfill';
import $ from "jquery";
import {Component, Vue} from 'vue-property-decorator';
import VueI18n from 'vue-i18n';
import {LsLanguage} from '../util/LsLanguage';
import GlobalConfig from '../global.config';
import Util from '@/ts/utils/Util';
import LocalStorageUtil from "@/ts/utils/LocalStorageUtil";
import ActivityProxy from "@/ts/proxy/ActivityProxy";
import ActivityFactory from "@/ts/factory/activity.factory";
import AppParamModel from "@/ts/models/AppModel";
import ConfigUtil from "@/ts/utils/ConfigUtil";
import JumpWebUtil from "@/ts/utils/JumpWebUtil";
import HttpClient from "@/ts/net/HttpClient";
import {PriceList, UserDiscountList, UserInfo} from "@/ts/models/UserModel";
import LoginDialog from "@/pages/leishen_app/activitys/components/LoginDialog";
import RegisterDialog from "@/pages/leishen_app/activitys/components/RegisterDialog";
import ForgetDialog from "@/pages/leishen_app/activitys/components/ForgetDialog";
import RechargeDialog from "@/pages/leishen_app/activitys/components/RechargeDialog";
import RewardDialog from "@/pages/leishen_app/activitys/components/RewardDialog";

import {Popup, Toast} from "vant";
import {ActivityPackageRequestModel} from "@/ts/models/NewsModel";

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
class activityModel extends ActivityProxy {

    public chooseinfo = new UserInfo();//传递的用户信息
    public choosePriceInfo = new PriceList();

    public activity_id = 216;
    public activity_json = ActivityFactory.getInstace('mobile', this.activity_id);
    public appParam = AppParamModel.getInstace(); // 浏览器参数

    public showType: number = 1;//组件显示次序，1登录 2注册 3忘记密码
    public show_dialog: boolean = false;//登录、注册、忘记密码弹框
    public show_reward: boolean = false;//兑奖弹窗
    public show_recharge: boolean = false;//支付弹窗
    public userDiscountList: Array<UserDiscountList> = [];//请求回的全部折扣码列表
    public userDiscount: string = '';
    public activityPackage = [];
    public activityPackageId: number = 0;

    public async created() {
        this.activityJson = this.activity_json;//读取活动配置，获取配置对象
        this.imageHeadUrl = GlobalConfig.getImgBaseUrl();//图片根地址获取
        this.chooseinfo = LocalStorageUtil.getUserInfo();//获取用户登录成功后的具体信息
        this.account_token = LocalStorageUtil.getUserToken().account_token;//获取用户token
        this.getActivityId();//获取活动ID
        this.setBaseUrl(GlobalConfig.getBaseUrl());//设置请求的根地址
        this.checkEnvironment();//获取当前设备环境，分为Android、iOS、微信公众号
        // this.getPriceList();//获取套餐列表信息
        this.getSpeicalPackage();//获取套餐列表信息
        this.getActivityDetail();//获取活动详情，一个是获取活动是否过期信息，一个是获取参与本次活动所需要的最低积分
        this.getAwardList();
        this.getReferActivitys();//获取对参与本活动的用户对应生成唯一的推荐码，包含推荐链接（推荐注册和充值）
        await this.getUserInfo();//初始化获取用户信息，用于用户充值
        if(this.account_token) this.getUserDiscount();
    }

    public mounted() {
        window.onscroll = () => {
            this.pageScroll(835);
        };
        this.luck.init('prize', '.app-present_cell');
        this.getAwardList();
        const that = this;
        setInterval(function () {
            that.clock = Object.assign({}, that.getClock(that.activity_json.endtime));
        }, 1000)
    }

    /**
     * 用户生成推荐码
     * @param {string} refer_code
     */
    public generateRefercodeLink(refer_code: string) {
        this.refer_code_link = GlobalConfig.getUserBaseUrl() + '/' + JumpWebUtil.HTML_NAME_REGISTER + '?refer_code=' + refer_code;
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
        if (this.account_token == '') {
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
     * 获取用户套餐折扣信息
     */
    public async getUserDiscount() {
        this.isLoading = true;
        const token = LocalStorageUtil.getUserToken().account_token;
        let url = HttpClient.URL_USER_DISCOUNT;
        let param = {
            account_token: token,
            region_code: LocalStorageUtil.getRegionCodes()
        };
        this.backData = await this.http.post<Array<UserDiscountList>>(url, param);
        this.isLoading = false;
        if (this.backData.code == HttpClient.HTTP_SUCCESS_NET_CODE) {
            this.userDiscountList = this.backData.data;
            this.userDiscountList = this.userDiscountList.sort((a, b) => {
                let value1 = a.discount_value;
                let value2 = b.discount_value;
                return value2 - value1;
            });
            this.getUserDiscountSuccess();
        } else if (this.backData.code == HttpClient.HTTP_TOKEN_EXPIRE) {
            this.tokenExpired();
        } else {
            this.getUserDiscountError();
        }
    }

    /**
     * 获取优惠券成功
     * TODO... 需重写此方法
     */
    public getUserDiscountSuccess() {
    }

    /**
     * 获取优惠券失败
     * TODO... 需重写此方法
     */
    public getUserDiscountError() {
    }

    /**
     * 默认充值
     */
    public async gotoRecharge(data: PriceList) {
        let token = Util.getUrlParam("account_token") || LocalStorageUtil.getUserToken().account_token;
        if (token == '') {
            //提示登录
            this.gotoLogin();
            return;
        } else {
            //筛选可用折扣码
            this.userDiscount = '';
            for(let qq=0;qq<this.userDiscountList.length;qq++){
                if(this.userDiscountList[qq].price_ids.indexOf(data.price_id) != -1){
                    this.userDiscount = this.userDiscountList[qq].discount_code;
                    break;
                }
            }
            (this.$refs.to_recharge as any).commonzhekou = this.userDiscount;//传入折扣码
            (this.$refs.to_recharge as any).choosetaocanid = this.activityPackageId;//传入套餐id
            (this.$refs.to_recharge as any).activity_buy_type = 618;
            this.choosePriceInfo = data;
            if (this.appParam.platform != 4) {
                this.dialog_recharge = false;
                this.show_recharge = !this.show_recharge;//打开支付，并未开始支付
                $('body').removeClass('body_fixed');
            } else if (this.appParam.platform === 4) {
                //  如果是微信环境，直接调用子组件的原生微信支付方法
                (this.$refs.to_recharge as any).defaultPackageBuy(data);
            }
        }
    }

    public async paySuccess() {
        this.getActivityDetail();//获取活动详情，一个是获取活动是否过期信息，一个是获取参与本次活动所需要的最低积分
        await this.getUserInfo();
        (this.$refs.to_recharge as any).init();
    }

    /**
     * 登录成功，父组件事件
     * @param data
     */
    public alreadyLogin(data) {
        if (data == 0) {
            // 关闭登录弹窗
            this.show_dialog = false;
            //需要重新刷新页面，重新获取用户信息，以及对应的活动积分
            // document.execCommand("Refresh");
            window.location.href = window.location.href + '?' + window.location.search + '&' + 100*Math.random();
        }
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
     * 获取用户信息
     */
    public async getUserInfo() {
        try {
            this.isLoading = true;
            let token = Util.getUrlParam("account_token") || LocalStorageUtil.getUserToken().account_token;
            if (token == "") {
                this.tokenExpired()
            } else {
                const url = HttpClient.URL_USER_INFO;
                const param = {
                    account_token: token
                };
                this.backData = await this.http.post<UserInfo>(url, param);
                this.isLoading = false;
                if (this.backData.code == HttpClient.HTTP_SUCCESS_NET_CODE) {
                    this.userInfo = this.backData.data;
                    UserInfo.getUserName(this.userInfo);
                    UserInfo.getUserAvatar(this.userInfo);
                    UserInfo.updateUserInfo(this.userInfo);
                    this.checkisBinbMobile(this.userInfo, 'app')
                } else if (this.backData.code == HttpClient.HTTP_TOKEN_EXPIRE) {
                    this.tokenExpired();
                } else {
                    this.getUserinfoFail(this.backData);
                }
            }
        } catch (e) {

        }
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
        if (this.awardList.length <= 3) return;
        $(function () {
            setInterval(function () {
                var $ul = $("#jilu_box");
                $ul.animate({
                    marginTop: "-20px"
                }, 400, function () {
                    $ul.find("li").eq(0).appendTo($ul);
                    $ul.css("margin-top", "0")
                })
            }, 2000);
        });
    }

    /**
     * 点击抽奖
     */
    public onClickDraw() {
        if (this.isBengin) return;
        if (this.account_token == "") {
            //提示登录
            this.gotoLogin();
            return;
        }
        if (this.aCount <= 0) {
            //提示次数不足
            $("body").addClass("body_fixed");
            this.dialog_recharge = true;
            return;
        }
        this.isBengin = true;
        this.onDraw(0, 1000);
    }

    public roll() {
        this.luck.times += 1;
        this.luck.roll();
        if (this.luck.times > this.luck.cycle + 10 && this.luck.prize == this.luck.index) {
            clearTimeout(this.luck.timer);
            this.luck.prize = -1;
            this.luck.times = 0;
            const that = this;
            setTimeout(function () {
                $('body').addClass('body_fixed');
                that.isBengin = false;
                that.dialog_win = true;
                that.dialog_msg = that.awardInfo.title;
                that.prize_name = that.awardInfo.title;
            }, 500);
        } else {
            if (this.luck.times < this.luck.cycle) {
                this.luck.speed -= 10;
            } else if (this.luck.times == this.luck.cycle) {
                var index = 4;
                switch (this.awardInfo.present_id) {
                    case 99:
                        index = 0;
                        break;
                    case 100:
                        index = 1;
                        break;
                    case 101:
                        index = 2;
                        break;
                    case 102:
                        index = 3;
                        break;
                    case 103:
                        index = 4;
                        break;
                    case 104:
                        index = 5;
                        break;
                    default:
                        break;
                }
                this.luck.prize = index;//最终中奖位置
            } else {
                if ((this.luck.times > this.luck.cycle + 10 && this.luck.prize == 0 && this.luck.index == 7) || this.luck.prize == this.luck.index + 1) {
                    this.luck.speed += 110;
                } else {
                    this.luck.speed += 20;
                }
            }
            if (this.luck.speed < 40) {
                this.luck.speed = 40;
            }
            ;

            this.luck.timer = setTimeout(this.roll, this.luck.speed);
        }
        return false;
    }

    /**
     * 获取活动套餐
     */
    public async getPriceList() {
        let lang = LocalStorageUtil.getLanguage().toString();
        let pacakgeJson = await ConfigUtil.getInstance().getRechargeJson(GlobalConfig.getWebBaseUrl());
        this.activityPackage = pacakgeJson[this.appParam.region_code + '__' + lang].price;
        this.activityPackage.sort((itemA, itemB) => {
            return itemB.price_is_recommend - itemA.price_is_recommend;
        });
    }

    public async getSpeicalPackage(){
        let url = HttpClient.URL_ACTIVITY_SPECIAL_PACKAGE;
        let param = new ActivityPackageRequestModel();
        param.activity_id = this.activity_id;
        param.lang = LocalStorageUtil.getLanguage();
        param.region_code = LocalStorageUtil.getRegionCodes();
        param.account_token = this.account_token;
        this.backData = await this.http.get(url, param);
        if (this.backData.code == HttpClient.HTTP_SUCCESS_NET_CODE) {
            this.activityPackageId = this.backData.data[0].package_id;
            this.activityPackage = this.backData.data[0].price;
            this.activityPackage.sort((itemA, itemB) => {
                return itemB.price_is_recommend - itemA.price_is_recommend;
            });
        } else if (this.backData.code == HttpClient.HTTP_TOKEN_EXPIRE) {
            this.tokenExpired();
        }
    }

    /**
     * token过期
     * @param param
     */
    public tokenExpired(param: string = null): void {
        LocalStorageUtil.loginOut();
        this.account_token = '';
        this.userInfo = null;
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

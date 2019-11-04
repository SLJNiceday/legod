import './assets/less/sms.less';
import 'babel-polyfill';
import {Component, Vue} from 'vue-property-decorator';
import $ from 'jquery';
import VueAwesomeSwiper from 'vue-awesome-swiper';
import {swiper, swiperSlide} from 'vue-awesome-swiper';
import 'swiper/dist/css/swiper.css';
import GlobalConfig from '../global.config';
import Util from '@/ts/utils/Util';
import VueI18n from "vue-i18n";
import LocalStorageUtil from "@/ts/utils/LocalStorageUtil";
import ActivityProxy from "@/ts/proxy/ActivityProxy";
import AppParamModel from "@/ts/models/AppModel";
import ConfigUtil from "@/ts/utils/ConfigUtil";
import {LsLanguage} from "@/pages/leishen_app/util/LsLanguage";
import {PriceList, UserInfo} from "@/ts/models/UserModel";
import LoginDialog from "./components/LoginDialog";
import RegisterDialog from "./components/RegisterDialog";
import ForgetDialog from "./components/ForgetDialog";
import RechargeDialog from "./components/RechargeDialog";
import RewardDialog from "./components/RewardDialog";
import {Popup, Toast} from "vant";
import HttpClient from "@/ts/net/HttpClient";

Vue.use(Popup);
Vue.use(Toast);
Vue.use(VueAwesomeSwiper);
Vue.config.productionTip = false;

//语言包
Vue.use(VueI18n);
let lang = LsLanguage.getInstance();
lang.initNoRefresh();
const i18n = new VueI18n(lang);
const appParam: AppParamModel = AppParamModel.getInstace(Util.REGION_CODE_1, Util.ZH_CN);

@Component({
    components: {
        "login-dialog": LoginDialog,
        "register-dialog": RegisterDialog,
        "forget-dialog": ForgetDialog,
        "recharge-dialog": RechargeDialog,
        "reward-dialog": RewardDialog,
        "swiper": swiper,
        "swiperSlide": swiperSlide
    }
})
class activityModel extends ActivityProxy {
    public appParam = AppParamModel.getInstace(); // 浏览器参数
    public region_code: number = LocalStorageUtil.getRegionCodes(); //地区:1 国内 0 国际
    public choosePriceInfo = new PriceList();
    public priceIndex: number = 0; //价格index
    public common_zhekou: string = '';//折扣码
    public real_pay_price: string = '0';//折扣后的价格
    public youhui_price: string = '0';// 折扣金额
    public choose_package_id: number = 0;//选中的package_ID
    public choose_price_id: number = 0;//选中的package_ID
    public getuserInfo: UserInfo = new UserInfo();
    public commonDiscount = {
        discount_price: 0,
        discount_type: 0
    };//返回的折扣码信息，包括discount_type和discount_price
    public discout_rate: number = 0;//折扣比例
    public discount_num: number = 0;//折扣实际金额
    public zhekou_type: boolean = true;//true折扣比例， false折扣实际金额
    public isGetDiscount: boolean = false;//对请求折扣码接口节流
    //  新增参数
    public isLoading: boolean = false; //loading
    public show_dialog: boolean = false;//登录弹框
    public showType: number = 1;//组件显示次序，1登录 2注册 3忘记密码
    public show_recharge: boolean = false;//支付弹窗
    public show_reward: boolean = false;//兑奖弹窗

    //swiper配置项
    public swiperOption: object = {
        width: 200,
        height: 200,
        autoplay: {
            disableOnInteraction: false,
            reverseDirection: false,
            stopOnLastSlide: false,
            delay: 2000,
        },
        direction: 'vertical',
        effect: 'fade',
        fadeEffect: {
            crossFade: true,
        }
    };

    /**
     * 页面初始加载
     */
    public created() {
        this.setBaseUrl(GlobalConfig.getBaseUrl());
        this.common_zhekou = Util.getUrlParam("discount_code");
        this.checkEnvironment();//获取当前设备环境
        this.getPriceList();
        this.getUserInfo();
    }

    /**
     * 设置混合组件的名字，对应显示不同组件
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
    public toLogin() {
        this.showType = 1;
        this.show_dialog = true;
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
     * 获取活动套餐
     */
    public async getPriceList() {
        let lang = LocalStorageUtil.getLanguage().toString();
        let pacakgeJson = await ConfigUtil.getInstance().getRechargeJson(GlobalConfig.getWebBaseUrl());
        this.choose_package_id = pacakgeJson[this.appParam.region_code + '__' + lang].package_id;//给当前页面的package_id赋值
        this.priceList = pacakgeJson[this.appParam.region_code + '__' + lang].price;
        // this.priceList.reverse();
        this.priceList.sort((itemA, itemB) => {
            return itemB.price_is_recommend - itemA.price_is_recommend;
        });
        let curPriceList = this.priceList[0];
        this.ChoosePrice(curPriceList, 0);
    }

    /**
     * 选择套餐类型，点击页面相关套餐赋值传参
     */
    public async ChoosePrice(item: PriceList, type: number) {
        this.priceIndex = type;
        this.choosePriceInfo = item;
        this.choose_price_id = item.price_id;
        let priceNum = item.price_num;
        await this.getDiscountInvoice();
        this.youhui_price = (this.zhekou_type ? Number(priceNum)  * this.discout_rate : this.discount_num).toFixed(2);
        if (priceNum <= this.youhui_price) {//如果返回的优惠价格大于套餐价格，就全都置为零
            this.real_pay_price = '0.00';
            this.youhui_price = '0.00';
        } else {
            this.real_pay_price = (Number(priceNum) - Number(this.youhui_price)).toFixed(2);
        }
    }

    /**
     * 获取折扣码信息，登录与未登录
     */
    public async getDiscountInvoice() {
        if (this.isGetDiscount || this.common_zhekou == '') return;//请求节流
        this.isLoading = true;
        const url = HttpClient.URL_USER_DISCOUNT_INVOICE;
        const token = LocalStorageUtil.getUserToken().account_token;
        let params = {
            account_token: token,
            package_id: this.choose_package_id,
            price_id: this.choose_price_id,
            discount_code: this.common_zhekou
        };
        this.backData = await this.http.post(url, params);
        this.isLoading = false;
        if (this.backData.code == HttpClient.HTTP_SUCCESS_NET_CODE) {
            this.commonDiscount = this.backData.data;
            if (this.commonDiscount.discount_type == 0) {//等于0代表对原金额按百分比进行折扣
                this.zhekou_type = true;//0
                this.discout_rate = Number(this.commonDiscount.discount_price) / 100;
            } else if (this.commonDiscount.discount_type == 1) {//等于1代表在原金额基础上减扣的实际金额
                this.zhekou_type = false;//1
                this.discount_num = Number(this.commonDiscount.discount_price) / 100;
            }
            this.isGetDiscount = true;
        } else if (this.backData.code == HttpClient.HTTP_TOKEN_EXPIRE) {
            this.tokenExpired();
        } else {
            Toast(this.backData.msg);
            this.common_zhekou = '';
        }
    }

    /**
     * 登录成功，父组件事件
     * @param data
     */
    public async alreadyLogin(data) {
        if (data == 0) {
            // 关闭登录弹窗
            this.show_dialog = false;
            //需要重新获取用户信息，重新获取用户信息
            await (this.$refs.to_recharge as any).getUserInfo();
            await this.getDiscountInvoice();
        }
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
                    this.checkisBinbMobile(this.userInfo,'app')
                    // (this.$refs.to_recharge as any).getUserinfoSuccess();//登录成功获取用户套餐
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
     * 默认充值
     */
    public async gotoRecharge() {
        let token = Util.getUrlParam("account_token") || LocalStorageUtil.getUserToken().account_token;
        if (token == '') {
            //提示登录
            this.show_dialog = true;
            return;
        } else {
            await (this.$refs.to_recharge as any).getUserInfo();
            //  如果不是微信环境，直接走原先的移动端充值逻辑
            if (this.appParam.platform != 4) {
                this.dialog_recharge = false;
                this.show_recharge = !this.show_recharge;//打开支付，并未开始支付
                $('body').removeClass('body_fixed');
            } else if (this.appParam.platform === 4) {
                //  如果是微信环境，直接调用子组件的原生微信支付方法
                (this.$refs.to_recharge as any).defaultPay(this.choosePriceInfo);
            }
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
}

new activityModel({i18n}).$mount('#app')

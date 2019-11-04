import "@/assets/less/leishen_app.less";
import "leigod-lib-flexible";
import "babel-polyfill";
import {Component, Vue, Prop} from "vue-property-decorator";
import AppParamModel from "@/ts/models/AppModel";
import GlobalConfig from "../../global.config";
import HttpClient from "@/ts/net/HttpClient";
import {
    UserInfo,
    PayRequestModel,
    PayModel,
    UserRechargeInfo,
    PriceList,
    UserDiscountList
} from "@/ts/models/UserModel";
import {
    Dialog,
    Popup,
    Toast,
    Field,
    CellGroup,
    Swipe,
    SwipeItem,
    Lazyload,
    Loading,
    Row,
    Col,
    Button
} from "vant";
import {IdataModel} from "@/ts/models/IdataModel";
import LocalStorageUtil from "@/ts/utils/LocalStorageUtil";
import {ExtrnalFactory} from "@/ts/factory/ExtrnalFactory";
import Util from "@/ts/utils/Util";
import {TipsMsgUtil} from "@/ts/utils/TipsMsgUtil";

Vue.use(Popup);
Vue.use(Toast);
Vue.use(Dialog);
Vue.use(Field);
Vue.use(CellGroup);
Vue.use(Swipe);
Vue.use(SwipeItem);
Vue.use(Loading);
Vue.config.productionTip = false;
Vue.use(Lazyload);
Vue.use(Row).use(Col);
Vue.use(Button);

Vue.config.productionTip = false;

const appParam: AppParamModel = AppParamModel.getInstace(
    Util.REGION_CODE_1,
    Util.ZH_CN
);

@Component({})
export default class RechargeDialog extends Vue {
    public userDiscountList: Array<UserDiscountList> = [];//请求回的全部折扣码列表
    public discountList = []; //经过筛选的用户的折扣码
    public discount_code: string = ''//用户最终选择的折扣码
    public payType: number = 1; //支付类型 1微信 2支付宝 3qq支付 5paypal  12银联支付
    public payObj: PayModel = new PayModel(); //buy接口返回的数据
    public discountshow: boolean = false; //控制是否显示折扣码
    public zhekouTitle: string = ''//传递到后台的折扣编码-对应的title
    public zheCode: string = '' //传递到后台的折扣编码
    public fullscreen: string = ''//控制弹出框的高度
    //是否是非微信环境下，默认是false,不是微信环境-需要让用户选择支付方式;是true-即是微信的支付，如果有折扣码，唤起折扣码选择，否则直接支付
    public isWeixin: boolean = false;
    //  父组件传递的用户选中购买的套餐、价格信息
    @Prop() public choosepriceinfo: PriceList; //页面传递的购买价格的套餐-的价格列表
    @Prop() public package_id: number; //页面传递的购买价格的套餐-id
    @Prop() public page_zhekou: string; //页面传递的折扣码，根据页面的href的参数
    public http = new HttpClient();
    public appParam = AppParamModel.getInstace(); // 浏览器参数
    public backData: IdataModel<any> | undefined;
    public apiPackage=new UserRechargeInfo()
    public created() {
        this.setBaseUrl(GlobalConfig.getBaseUrl());
        this.fullscreen = document.body.clientHeight + 'px'
    }

    /**
     * 设置数据请求相关接口BASEURL的方法，初始化时调用
     * @param url
     */
    public setBaseUrl(url: string): void {
        this.http.setBaseUrl(url);
    }

    /**
     * 初始化，判断用户是否可以购买套餐
     * @param url
     */
    public async init() {
        let canbuy = await this.getUserPackage();
        if (canbuy) {
            this.getUserDiscount()
        } else {
            this.$emit('cannotbuy')
        }
    }

    /**
     * 用户在点击活动页面的购买的时候，初始化的值
     * @param url
     */
    public initPop() {
        this.discountshow = false;
        this.$nextTick(() => {
            this.filterDisount();
            if (this.discountList.length == 0) {
                if(this.page_zhekou){
                    this.zheCode = this.page_zhekou;
                    this.zhekouTitle = this.page_zhekou;
                }else{
                    //如果用户没有私有折扣码
                    this.zheCode = '';
                    this.zhekouTitle = '';
                }
            } else {
                this.zheCode = this.discountList[0].discount_code;
                this.zhekouTitle = this.discountList[0].title;
            }
        })

    }

    /**
     * 用户在点击活动页面的购买的时候，如果是微信环境，调用这个方法初始化的值
     * @param url
     */
    public wxinitPop() {
        this.isWeixin = true;
        this.discountshow = false;
        this.$nextTick(() => {
            this.filterDisount();
            if (this.discountList.length == 0) {
                if(this.page_zhekou){
                    this.zheCode = this.page_zhekou;
                    this.zhekouTitle = this.page_zhekou;
                }else{
                    //如果用户没有私有折扣码
                    this.zheCode = '';
                    this.zhekouTitle = '';
                }
            } else {
                this.zheCode = this.discountList[0].discount_code;
                this.zhekouTitle = this.discountList[0].title;
            }
        })
    }

    /**
     * 获取用户套餐折扣信息
     */
    public async getUserDiscount() {
        const token = LocalStorageUtil.getUserToken().account_token;
        let url = HttpClient.URL_USER_DISCOUNT;
        let param = {
            account_token: token,
            region_code: LocalStorageUtil.getRegionCodes()
        };
        this.backData = await this.http.post<Array<UserDiscountList>>(url, param);
        if (this.backData.code == HttpClient.HTTP_SUCCESS_NET_CODE) {
            this.userDiscountList = this.backData.data;
        } else if (this.backData.code == HttpClient.HTTP_TOKEN_EXPIRE) {
            // this.tokenExpired();
        } else {
            // this.getUserDiscountError();
        }
    }

    /**
     * 获取用户的套餐信息,在用户登录成功以后，才可以调用
     * 返回true-代表可以购买
     * 返回false-代表不可以购买
     */
    /**
     * 根据用户所有的折扣列表,
     * 只有用户登录了以后，才可以调用
     */
    public filterDisount() {
        this.discountList = [];
        this.userDiscountList.map(useritem => {
            if (useritem.price_ids.length > 0) {
                for (let qq = 0; qq < useritem.price_ids.length; qq++) {
                    if (useritem.price_ids[qq] == this.choosepriceinfo.price_id) {
                        this.discountList.push({
                            discount_code: useritem.discount_code,
                            title: useritem.title,
                            discount_value: useritem.discount_value,
                            discount_type: useritem.discount_type,
                            expired_time: useritem.expired_time
                        })
                    }
                }
            }
        });
        if (this.discountList.length > 0) {
            this.discountList.sort((itemA, itemB) => {
                return itemB.discount_value - itemA.discount_value
            })
        }
    }

    /**
     * 点击折扣码，之后弹出选择或者输入折扣码的弹框
     */
    showZhekou() {
        this.discountshow = true
    }

    /**
     * 不使用优惠券
     */
    public clearDiscount() {
        this.discountshow = false;
        this.zheCode = '';
        this.zhekouTitle = '';
    }

    /**
     * 点击折扣码上的删除按钮的时候，清空折扣码
     */
    deleteDiscount() {
        this.zheCode = '';
        this.zhekouTitle = '';
    }

    /**
     * 选择优惠券
     */
    public checkDiscount(item: any) {
        this.discountshow = false;
        this.zheCode = item.discount_code;
        this.zhekouTitle = item.title;
    }

    /**
     * 确认优惠券
     */
    confirmZhekou() {
        if (this.discountList.length > 0) {
            let findable = false
            for (let qq = 0; qq < this.discountList.length; qq++) {
                if (this.discountList[qq].title == this.zhekouTitle) {
                    findable = true
                }
            }
            if (!findable) {
                //如果既有共有折扣码，又有私有折扣码,用户选择输入共有折扣码
                this.zheCode = this.zhekouTitle
            }
        } else {
            //如果用户选择手动输入折扣码，就以用户输入的为准
            this.zheCode = this.zhekouTitle
        }
        this.discountshow = false
    }

    /**
     * 点击优惠券最顶部的，返回按钮
     */
    onClickBack() {
        this.discountshow = false;
    }

    /**
     * 获取用户的套餐信息,在用户登录成功以后，才可以调用
     * 返回true-代表可以购买
     * 返回false-代表不可以购买
     */
    public async getUserPackage() {
        const token = LocalStorageUtil.getUserToken().account_token;
        let url = HttpClient.URL_USER_PACKAGE;
        let param = {
            account_token: token,
            region_code: LocalStorageUtil.getRegionCodes()
        };
        let backData = await this.http.post<Array<UserRechargeInfo>>(url, param);
        if (backData.code == HttpClient.HTTP_SUCCESS_NET_CODE) {
            let userinfo = LocalStorageUtil.getUserInfo();
            let packageList = backData.data as Array<UserRechargeInfo>;
            let region_code = '1'
            for (let i = 0; i < packageList.length; i++) {
                if (packageList[i].package_id == userinfo.package_id) {
                    if(packageList[i].include_region_codes=='1'){
                        this.apiPackage=Object.assign({},packageList[i])
                    }
                    region_code = packageList[i].include_region_codes;
                    break
                }
            }
            if (userinfo.is_switch_package == 1) {
                return true
            } else if (region_code == '1') {
                return true
            } else {
                return false
            }
        } else {
            return true
        }
    }

    /**
     * 选择支付方式,开始支付-这个是非微信环境调用的方法
     */
    public onChooseAndPay(type: number) {
        this.payType = type;
        this.onPay(this.appParam.platform + 1, 2);
    }

    /**
     * 微信环境下的支付
     */
    public weixinBuy() {
        this.payType = 6;//设置为微信公众号的支付
        this.onPay(this.appParam.platform + 1, 2);
    }

    /**
     * from 订单来源 0官网 1PC客户端 2IOS客户端 3Android客户端 4Apple 5注册赠送订单  6mac客户端 7微信公众号(备注：转换后的值)
     * plan 支付返回的二维码显示方式 1官网二维码 2移动端需要的二维码 3官网pc端支付宝打开的控制台页面
     * 请求支付
     */
    public async onPay(from: number = 0, plan: number = 1) {
        let that = this;
        const url = HttpClient.URL_USER_PACKAGE_BUY;
        const token = LocalStorageUtil.getUserToken().account_token;
        let refer_code = Util.getUrlParam('refer_code');
        let param = new PayRequestModel();
        param.account_token = token;
        param.invoice_from = param.switchFrom(from);
        param.package_id = this.package_id;
        param.pay_type = this.payType;
        param.price_id = this.choosepriceinfo.price_id;
        param.pay_plat = plan;
        param.src_channel = LocalStorageUtil.getSrcChannel();
        param.os_type = localStorage.getItem(LocalStorageUtil.STORAGES_OS_TYPE);
        if (refer_code) {
            param.refer_code = refer_code;
        }
        if (this.zheCode != "") {
            param.discount_code = this.zheCode;
        }
        this.backData = await this.http.post<PayModel>(url, param);
        this.payObj.pay_url = '';// 置空原先取消支付生成的URL，避免干扰后续支付请求
        if (this.backData.code == HttpClient.HTTP_SUCCESS_NET_CODE) {
            this.payObj = this.backData.data;
            this.onBeginpaySuccess();
        } else if (this.backData.code == HttpClient.HTTP_TOKEN_EXPIRE) {
            this.tokenExpired();
        } else if (this.backData.code == HttpClient.HTTP_ERROR_WX_NOBIND) {
            this.onBeginpayError('系统检测到您未绑定公众号，将自动为您跳转至登录页进行绑定...');
            setTimeout(function () {
                that.gotologin();
            }, 2000)
        } else {
            this.onBeginpayError(this.backData.msg);
        }
    }

    /**
     * 请求支付成功
     */
    public onBeginpaySuccess() {
        if (this.appParam.platform === 4) {
            this.initWxConfig(this.payObj.pay_url);
        } else {
            const factory = ExtrnalFactory.getInstance().getFactory(this.appParam.platform);
            window.location.href = this.payObj.pay_url;
        }
    }

    /**
     * 请求支付失败
     */
    public onBeginpayError(msg: string) {
        Toast.fail(msg);
    }

    /**
     * 初始化微信jsSDK
     */
    public async initWxConfig(payObj: any) {
        const url = HttpClient.URL_WAP_WX_SIGN;
        const param = {};
        this.backData = await this.http.post<UserInfo>(url, param);
        let data = this.backData.data;
        if (!data.appId) {
            Toast('微信服务器繁忙，请稍后...')
        }
        // @ts-ignore
        wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: data.appId, // 必填，公众号的唯一标识
            timestamp: (data.timestamp).toString(), // 必填，生成签名的时间戳
            nonceStr: data.nonceStr, // 必填，生成签名的随机串
            signature: data.signature, // 必填，签名
            jsApiList: ["closeWindow", "chooseWXPay"] // 必填，需要使用的JS接口列表
        });
        const that = this;
        // @ts-ignore
        wx.ready(function () {
            that.onWxGzhPay(payObj);
        });
    }

    /**
     * 微信公众号支付
     */
    public onWxGzhPay(payData: any) {
        const that = this;
        // @ts-ignore
        wx.chooseWXPay({
            timestamp: payData.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
            nonceStr: payData.nonceStr, // 支付签名随机串，不长于 32 位
            package: payData.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
            signType: payData.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
            paySign: payData.paySign, // 支付签名
            success: function (res) {
                Toast("充值成功!");
                that.$emit('paysuccess')
            }
        });
    }

    /**
     * token过期的处理
     */
    public tokenExpired() {
        let tipMsg = TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_LOGIN_FAILURE);
        Toast(tipMsg);
        LocalStorageUtil.loginOut();
    }

    /**
     *  去登录
     */
    public gotologin() {
        this.$emit("tologin")
    }
}

import 'babel-polyfill';
import VueI18n from 'vue-i18n';
import {Component, Vue, Prop} from 'vue-property-decorator';
import {LsLanguage} from '../util/LsLanguage';
import Util from '@/ts/utils/Util';
import {ActivityPictureModel} from "@/ts/models/NewsModel";
import {
    PayModel,
    PayRequestModel,
    payTransfer,
    PriceList,
    UserDiscountList,
    UserInfo,
    UserRechargeInfo
} from '@/ts/models/UserModel';
import GlobalConfig from '../global.config';
import HttpClient from "@/ts/net/HttpClient";
import LocalStorageUtil from "@/ts/utils/LocalStorageUtil";
import RechargeProxy from "@/ts/proxy/RechargeProxy";
import ConfigUtil from "@/ts/utils/ConfigUtil";
import {Dialog, Notification, Loading} from 'element-ui'
import PaymentDialog from './PaymentDialog';
import PayDialog from './PayDialog.vue';
import WebParamModel from "@/ts/models/WebModel";
import {TipsMsgUtil} from "@/ts/utils/TipsMsgUtil";

Vue.use(Dialog);
Vue.prototype.$notify = Notification;
Vue.use(Loading);

//语言包
Vue.use(VueI18n);
const webParam = WebParamModel.getInstace(Util.REGION_CODE_1, Util.ZH_CN);
let lang = LsLanguage.getInstance();
lang.init();
const i18n = new VueI18n(lang);

@Component({
    components: {
        'pay-step1': PaymentDialog,
        'pay-step2': PayDialog,
    }
})
export default class RechargeDialog extends RechargeProxy {
    public imageHeadUrl: string = '';
    public webParam = WebParamModel.getInstace(); // 浏览器参数
    public showType: number = 4; // 4：设置支付方式5：二维码支付
    public http = new HttpClient();
    public activityList: Array<ActivityPictureModel> = [];
    public pageName = 'recharge.html';
    public region_code: number = 1;
    public user_url: string = GlobalConfig.getUserBaseUrl() + '/';
    public xianshi_activity_info = null; // 首充活动的信息
    public priceList: Array<PriceList> = []; //显示的套餐列表
    public userchoosePackage_id: number = -999;//用户点击的立即购买。
    public userchooenPrice = new PriceList(); //用户点击的套餐
    public payUserNum: number = 0; //付款的人数信息
    public start_time: string = '';//首单特惠开始时间
    public end_time: string = '';//首单特惠结束时间
    public activity_is_ok: boolean = false;
    public sc_timer = null;//首冲用户定时器
    public payDialogVisible: boolean = false; //显示付款的两步弹框
    public currentPacakge = new UserRechargeInfo();
    public payModal = new PayRequestModel();
    public payTrans = new payTransfer();
    public payway: number = 2; //默认支付方式，支付宝 //支付类型 1微信 2支付宝 3qq支付 5paypal
    public userDiscountList: Array<UserDiscountList> = [];//请求回的全部折扣码列表
    public is_activity_package: boolean = false;
    public activity_package_id: number = 0;
    public activity_price = null;

    //接手父组件的用户信息
    @Prop() public chooseinfo!: UserInfo;

    public created() {
        this.region_code = Number(Util.getUrlParam("region_code")) || LocalStorageUtil.getRegionCodes()
        this.setBaseUrl(GlobalConfig.getBaseUrl());
        this.userInfo = this.chooseinfo;
        this.getUserPackage();
        this.getUserDiscount();
        this.getDownloadUrl();//设置首充活动的时间
        // 修复IE9中调用window.performance.now()报错的问题
        if (typeof window.performance.now !== 'function') {
            window.performance.now = function () {
                return ((+new Date()) - performance.timing.navigationStart)
            }
        }
    }

    /**
     * 支付，调用buy接口的时候token过期
     */
    payLogout() {
        // this.$notify({
        //     title: TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_ERROR_TITLE).toString(),
        //     message: TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_LOGIN_FAILURE).toString(),
        //     type: 'warning'
        // });
        this.payDialogVisible = false;
        this.$emit('loginout',TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_LOGIN_FAILURE).toString());
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
     * 国际区未登录的时候，显示的用户套餐和设置用户状态
     */
    public unlogin0() {
        this.priceList = this.currentPacakge.price.slice()
    }

    /**
     * 国内区未登录的时候，显示的用户套餐和设置用户状态
     */
    public unlogin1() {
        this.priceList = this.currentPacakge.price.slice()
    }

    /**
     * 用户token过期、用户没有token、获取用户信息失败都会调用改方法
     */
    public async tokenExpired() {
    }

    /**
     * 获取用户信息失败
     */
    public getUserinfoFail(data) {
        this.tokenExpired()
    }

    /**
     * 成功用户信息以后；获取用户套餐
     */
    public async getUserinfoSuccess() {
        await this.getUserDiscount(); //需要首先获取用户折扣码，在请求用户套餐，防止出现用户
        await this.getUserPackage();

    }

    /**
     * 获取套餐成功
     */
    public getUserPackageSuccess() {
        this.userInfo = this.chooseinfo;
        if (this.chooseinfo.is_switch_package == 0) {
            // 如果当前套餐还没有用完，根据userInfo的package_id和返回的套餐列表的id进行匹配
            this.onChoosePackageType(null);
        } else {
            //已用完，根据当前所在区域的套餐进行选择（国内，国际）
            for (var i = 0; i < this.packageList.length; i++) {
                if (this.packageList[i].include_region_codes == '1') {
                    this.czTypeIndex = i;
                    this.priceList = this.packageList[i].price;
                    this.priceList.sort((itemA, itemB) => {
                        return itemB.price_is_recommend - itemA.price_is_recommend
                    });
                    this.priceIndex = 0;
                }
            }
        }
    }

    /**
     * 检测用户能否购买选中套餐
     */
    public checkPrice(data: PriceList) {
        let flag = true;
        this.priceList.forEach((item,index)=> {
            if(item.price_id == data.price_id) {
                this.priceIndex = index;
                flag = false;
            }
        })
        if(flag) {
            this.$notify({
                title: TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_ERROR_TITLE),
                message: '当前活动只针对雷神超级会员，海外会员暂不可参与!',
                type: "warning"
            });
        }else {
            this.tryPay(data);
            this.payDialogVisible = true;
        }
    }

    /**
     *
     */
    public buyActivityPackage(id: number,data: any) {
        this.payDialogVisible = true;
        // let num = 9000*60*60 - this.chooseinfo.expiry_time_samp;
        // let hour = Math.floor(num/60/60);
        this.payModal.price_id = data.price_id;
        this.payTrans.price_num = data.price_num;
        this.payTrans.price_title = data.price_title;
        this.is_activity_package = true;
        this.activity_package_id = id;
        this.activity_price = data;
        this.discountList =[];
        for(let qq=0;qq<this.userDiscountList.length;qq++){
            if(this.userDiscountList[qq].price_ids.indexOf(data.price_id) != -1){
                this.discountList.push({label:this.userDiscountList[qq].discount_code,value:this.userDiscountList[qq].title})
            }
        }
        this.payTrans.zheCodeList = this.discountList;
        this.$nextTick(() => {
            (this.$refs.paycomponentRef as any).init();
        })
    }

    /**
     * 购买指定套餐
     */
    public buyDefaultPrice() {
        this.onChoosePrice(this.priceIndex);
        this.payTrans.price_num = this.choosePrice;
        this.payTrans.price_title = this.priceList[this.priceIndex].price_title;
        this.payTrans.zheCodeList = this.discountList;
        this.payDialogVisible = true;
        this.$nextTick(()=> {
            (this.$refs.paycomponentRef as any).init();
        });
    }

    /**
     * plan 支付返回的二维码显示方式 1官网二维码 2移动端需要的二维码 3官网pc端支付宝打开的控制台页面
     * 请求支付
     */
    public async onPayActivityPackage(id: number,data: any) {
        if (this.packageList == null || this.packageList.length <= 0) return;
        this.isLoading = true;
        let refer_code = Util.getUrlParam('refer_code');
        const url = HttpClient.URL_USER_PACKAGE_BUY;
        const token = LocalStorageUtil.getUserToken().account_token;
        let param = new PayRequestModel();
        param.account_token = token;
        param.invoice_from = param.switchFrom(0);
        param.package_id = id;
        param.pay_type = this.payType;
        if(this.payType==2){
            //如果是支付宝支付
            param.qr_type='ali_qr'
        }
        param.price_id = data.price_id;
        param.pay_plat = 1;
        param.src_channel = LocalStorageUtil.getSrcChannel();
        param.os_type = localStorage.getItem(LocalStorageUtil.STORAGES_OS_TYPE);
        if(refer_code){
            param.refer_code = refer_code;
        }

        if (this.zheCode != "" && this.zheCode != null) {
            param.discount_code = this.zheCode;
        }
        //
        this.backData = await this.http.post<PayModel>(url, param);
        this.isLoading = false;
        this.payObj.pay_url = '';
        //
        if (this.backData.code == HttpClient.HTTP_SUCCESS_NET_CODE) {
            this.payObj = this.backData.data;
            this.onBeginpaySuccess();
        } else if (this.backData.code == HttpClient.HTTP_TOKEN_EXPIRE) {
            this.payLogout()
            this.tokenExpired()
        } else {
            this.onBeginpayError(this.backData.msg);
        }
    }

    /**
     * 点击立即购买,
     * 如果item的price_id和priceList其他的price_id都不相同，则代表获取套餐成功，可以进行支付
     */
    public tryPay(item: PriceList) {
        //用户已经登陆，并且已经成功获取套餐
        this.payModal.package_id = this.currentPacakge.package_id;
        this.payModal.price_id = item.price_id;
        this.payModal.account_token = Util.getUrlParam("account_token") || LocalStorageUtil.getUserToken().account_token;
        this.payTrans.price_num = item.price_num;
        this.payTrans.price_title = item.price_title;
        this.showType = 4; //等于1，显示支付组件
        this.payTrans.zheCodeList = [];
        this.userDiscountList.map(useritem => {
            if (useritem.price_ids.length > 0) {
                for (let qq = 0; qq < useritem.price_ids.length; qq++) {
                    if (useritem.price_ids[qq] == item.price_id) {
                        this.payTrans.zheCodeList.push({label: useritem.discount_code, value: useritem.title})
                    }
                }
            }
        });
        this.payDialogVisible = true;
        this.$nextTick(() => {
            (this.$refs.paycomponentRef as any).init();
        })
    }

    /**
     * 登陆成功
     */
    get paycomponent() {
        switch (this.showType) {
            case 4:
                return 'pay-step1';
                break;
            case 5:
                return 'pay-step2';
                break;
        }
    }

    /**
     * 点击 去支付
     * 完成了支付的第一步，支付方式和折扣码，
     * 准备跳转的支付的二维码
     */
    finishStep1(payType: number, zhekou: string) {
        this.payType = payType;
        this.zheCode = zhekou;
        if(this.is_activity_package) {
            this.onPayActivityPackage(this.activity_package_id,this.activity_price);
        }else {
            this.onPay();
        }
    }

    /**
     * 请求支付成功
     */
    onBeginpaySuccess() {
        this.showType = 5; //弹出支付框
        // paypal支付自动刷新页面
        if (this.payType == 5) {
            //打开支付页面
            window.location.href = this.payObj.pay_url;
        }
        this.payObj.payType = this.payType;
        setTimeout(() => {
            (this.$refs.paycomponentRef as any).init();
        }, 0)
        // setTimeout(()=>{},0)
    }

    /**
     * 请求支付失败
     * TODO... 此方法可以重写，处理请求支付成功后的ui逻辑
     */
    onBeginpayError(msg: string) {
        this.$notify({
            title: TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_ERROR_TITLE),
            message: msg,
            type: "warning"
        });
    }

    /**
     * 支付成功点击确认
     */
    payDoned() {
        this.showType = 4;
        this.payDialogVisible = false;
        this.$emit('paysuccess');
    }

    /**
     * 关闭支付弹窗
     */
    public onClosePyaDialog() {
        this.payObj = new PayModel();
        if (this.showType == 5) {
            (this.$refs.paycomponentRef as any).onClose();
            this.showType = 4
            // this.getUserInfo();
        }
    }

    /**
     * 返回设置支付方式
     */
    goBack() {
        (this.$refs.paycomponentRef as any).onClose();
        this.showType = 4
    }

    /**
     * 获取系统时间成功
     */
    public getSystemTimeSuccess() {
        let startDate = new Date(this.start_time).getTime();
        let endDate = new Date(this.end_time).getTime();
        let nowDate = new Date(this.now_time).getTime();
        if (nowDate < startDate || nowDate > endDate) return;
        this.payUserNum = Util.getPayUserNum(this.start_time, this.now_time, 15);
        const that = this;
        this.sc_timer = setInterval(() => {
            let num = Math.round((Math.random() * 90 + 30) / 60);
            that.payUserNum += num;
            let end = new Date(that.end_time).getTime();
            let now = new Date().getTime();
            if (now >= end) {
                clearInterval(that.sc_timer)
            }
        }, 6000)
    }

    /**
     * 设置后台请求的api
     */
    public setBaseUrl(url: string): void {
        this.http.setBaseUrl(url);
    }

    /**
     * 获取下载url
     * @param url
     */
    public async getDownloadUrl() {
        const jsonConfig = await ConfigUtil.getInstance().download(true);
        const downConfig = jsonConfig.leigod[this.webParam.region_code].is_show_xianshi_activity;
        this.start_time = downConfig.start_time.replace(/\-/g, '/');
        this.end_time = downConfig.end_time.replace(/\-/g, '/');
        if (new Date().getTime() < new Date(this.end_time).getTime() && new Date().getTime() > new Date(this.start_time).getTime()) {
            this.activity_is_ok = true
        }
        this.xianshi_activity_info = jsonConfig.leigod.is_show_xianshi_activity;
    }

    /**
     * 切换语言
     */
    public onChangeLanguage(ln: string) {
        this.webParam.language = ln;
        lang.changeLanguage(ln);
        i18n.locale = lang.locale;
        this.getUserPackage();
        GlobalConfig.log('切换语言:' + lang.locale);
    }
}

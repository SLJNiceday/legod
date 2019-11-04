import "@/assets/less/leishen_pc.less";
import "leigod-lib-flexible";
import "babel-polyfill";
import {Component, Vue} from "vue-property-decorator";
import AppParamModel from '@/ts/models/AppModel';
import VueI18n from "vue-i18n";
import {LsLanguage} from "@/pages/leishen_pc/util/LsLanguage";
import PayDialog from "./v6/PayDialog.vue";
import GlobalConfig from "@/pages/leishen_pc/global.config";
import RechargeProxy from "@/ts/proxy/RechargeProxy";
import {Dialog, Message, Autocomplete} from "element-ui";
import HttpClient from '@/ts/net/HttpClient';
import {PayModel, PriceList, UserInfo, UserRechargeInfo} from '@/ts/models/UserModel';
import JumpWebUtil from '@/ts/utils/JumpWebUtil';
import {ExtrnalFactory} from '@/ts/factory/ExtrnalFactory';
import {TipsMsgUtil} from '@/ts/utils/TipsMsgUtil';
import Util from "@/ts/utils/Util";
import LocalStorageUtil from "@/ts/utils/LocalStorageUtil";
import ConfigUtil from "@/ts/utils/ConfigUtil";
import CdKey from './v6/CdKey.vue';
import {Toast} from "vant";

Vue.use(Toast);
Vue.use(Dialog);
Vue.prototype.$message = Message;

Vue.config.productionTip = false;
//语言包
Vue.use(VueI18n);
const appParam: AppParamModel = AppParamModel.getInstace(Util.REGION_CODE_1, Util.ZH_CN);
let lang = LsLanguage.getInstance();
lang.initNoRefresh();
const i18n = new VueI18n(lang);

@Component({
    components: {
        "pay-dialog": PayDialog,
        'el-dialog': Dialog,
        'cdkey': CdKey,
        'el-autocomplete': Autocomplete
    }
})
class Recharge extends RechargeProxy {
    public payDialogVisible: boolean = false; //支付弹窗
    public appParam: AppParamModel = AppParamModel.getInstace();
    public imageHeadUrl: string = "";//图片根路径
    public webUrl: string = '';//网站静态资源根地址
    public serviceAgreen: boolean = false;//是否勾选会员服务条款
    public account_token: string = '';
    public account_out: boolean = false;//未登录或者token失效
    public payUserNum: number = 0;//首冲活动参与人数
    public is_in_shouchong: boolean = false;//是否在首冲活动时间内
    public start_time: string = '';//首单特惠开始时间
    public end_time: string = '';//首单特惠结束时间
    public sc_timer = null;
    public cdKeyDialogVisible: boolean = false;//cdkey弹窗
    public jiaobiao_obj = {};//角标显示配置
    public xianshi_activity_info = {}; // 活动信息
    public temPriceList: Array<PriceList> = [];//价格类型集合
    public zheCodeCopy: string = '';
    public payBackShow: boolean = false;//是否显示支付状态的返回title
    public oldPrice: string = "";//选择套餐的原价
    public recharge_bgimg: string = "";//充值页背景

    public async created() {
        if(Util.getUrlParam("account_token") == '' || Util.getUrlParam("account_token") == undefined){
            this.account_out = true;
            this.getTemPriceList()
        };
        this.priceIndex = Number(Util.getUrlParam('priceIndex'));
        this.setBaseUrl(GlobalConfig.getBaseUrl());
        await this.getUserInfo();
        this.getDownloadUrl();
        this.imageHeadUrl = GlobalConfig.getImgBaseUrl();
        this.webUrl = GlobalConfig.getWebBaseUrl();
        this.onChoosePayType(1);
    }

    /**
     * 获取首冲特惠活动时间
     * @param url
     */
    public async getDownloadUrl() {
        const jsonConfig = await ConfigUtil.getInstance().download(false);
        this.xianshi_activity_info = jsonConfig.leigod[this.appParam.region_code].is_show_xianshi_activity;
        // this.start_time = jsonConfig.leigod.xianshi_activity.start_time;
        // this.end_time = jsonConfig.leigod.xianshi_activity.end_time;
        this.jiaobiao_obj = jsonConfig.leigod[this.appParam.region_code].jiaobiao_is_show;
        this.recharge_bgimg = jsonConfig.leigod[this.appParam.region_code].recharge_bgimg;
        if(this.userInfo.is_pay_user == 0) {
            let data = jsonConfig.leigod[this.appParam.region_code].recharge_bgimg;
            let start_time = new Date(data.start_time).getTime();
            let end_time = new Date(data.end_time).getTime();
            let now_time = new Date().getTime();
            if(start_time<=now_time && now_time<=end_time) {
                this.recharge_bgimg = data;
            }
        }
        this.getSystemTime();
    }
    /**
     * 没有登录的时候，获取套餐信息
     */
    public async getTemPriceList(){
        let packageListJson= await ConfigUtil.getInstance().getRechargeJson(GlobalConfig.getWebBaseUrl())
        let lang=LocalStorageUtil.getLanguage()
        let region_code=LocalStorageUtil.getRegionCodes()
        this.temPriceList=(packageListJson[region_code+'__'+lang] as UserRechargeInfo).price
        this.temPriceList.sort((itemA,itemB)=>{
            return itemB.price_is_recommend-itemA.price_is_recommend
        })
    }
    /**
     * 获取系统时间成功
     */
    public getSystemTimeSuccess(){
        let startDate = new Date(this.start_time).getTime();
        let endDate = new Date(this.end_time).getTime();
        let nowDate = new Date(this.now_time).getTime();
        if(nowDate < startDate || nowDate > endDate) {
            this.is_in_shouchong = false;
            return;
        };
        this.payUserNum = Util.getPayUserNum(this.start_time,this.now_time,15);
        const that = this;
        this.sc_timer = setInterval(()=>{
            let num = Math.round((Math.random()*90 + 30)/60);
            that.payUserNum += num;
            let end = new Date(that.end_time).getTime();
            let now = new Date().getTime();
            if(now >= end) {
                clearInterval(that.sc_timer)
            }
        },6000)
    }

    /**
     * 处理要显示的折扣码列表
     */
    public querySearch(queryString, cb) {
        let restaurants = this.discountList.filter(item=>{
            if(item.value.indexOf(queryString)!=-1||item.label.indexOf(queryString)!=-1){
                return true
            }
        })
        if(restaurants.length==0){
            this.zheCode=queryString
        }
        cb(this.discountList);
    }

    /**
     * 选择折扣码
     */
    public checkDiscount(item){
        if(item){
            this.zheCode = item;
            let zhe_code_info = this.discountList.filter((items)=> {
                return items.label == item;
            })
            if(zhe_code_info.length > 0) {
                this.zheCodeCopy = zhe_code_info[0].value;
            }else {
                this.zheCodeCopy = item;
            }
        }else {
            this.zheCode = '';
            this.zheCodeCopy = '';
        }
        if(this.payType != 12) {
            this.onPay(this.appParam.platform + 1);
        }
    }

    /**
     * 套餐hover效果
     */
    public choosePriceIndex(index: number) {
        this.priceHoverIndex = index;
    }

    /**
     * 套餐hover效果
     */
    public restorePriceIndex() {
        this.priceHoverIndex = this.priceIndex;
    }

    /**
     * 未登录状态点击套餐中的立即购买
     */
    public clickLogin(index: number){
        const factory = ExtrnalFactory.getInstance().getFactory(this.appParam.platform);
        factory.openLogin(index);
    }

    /**
     * 更换支付方式
     */
    public onChangePayType(type: number) {
        this.onChoosePayType(type);
        this.onPay(this.appParam.platform + 1);
    }

    /**
     * 点击请求支付
     */
    public clickPay(index: number) {
        if(!Util.getUrlParam('account_token')) {
            const factory = ExtrnalFactory.getInstance().getFactory(this.appParam.platform);
            factory.openLogin();
            return;
        }
        this.onChoosePrice(index);
        if(this.discountList.length >0) {
            this.zheCodeCopy = this.discountList[0].value;
        }else {
            this.zheCodeCopy = '';
        }
        this.zheCode = '';
        this.onPay(this.appParam.platform + 1);
        this.oldPrice = this.priceList[this.priceIndex].price_short_desc.split(':')[1];
    }

    /**
     *  关闭支付弹窗
     */
    public closePayDialog() {
        this.payDialogVisible = false;
        (this.$refs.payDialogCom as any).onClose();
        this.payObj.pay_url = '';
        this.payType = 1;
        (this.$refs.payDialogCom as any).pay_type = 1;
    }

    /**
     * 打开cdkey弹窗
     */
    public openCdkey(){
        if(!Util.getUrlParam('account_token')) {
            const factory = ExtrnalFactory.getInstance().getFactory(this.appParam.platform);
            factory.openLogin();
            return;
        }
        this.cdKeyDialogVisible = true;
    }

    /**
     * 关闭cdkey弹窗
     */
    public closeCdkey(){
        this.cdKeyDialogVisible = false;
        (this.$refs.cdkey as any).closeCdkeyReset();
    }

    /**
     * 打开支付弹窗
     */
    public onOpenPyaDialog() {
        this.payDialogVisible = true;
    }

    /**
     * 请求支付成功
     */
    public async onBeginpaySuccess(data: any) {
        const factory = ExtrnalFactory.getInstance().getFactory(this.appParam.platform);
        // paypal支付自动打开页面
        if (this.payType == 5) {
            factory.jumpUrl(this.payObj.pay_url);
        }else if(this.payType == 12) {
            const url = GlobalConfig.getBaseUrl() + '/tools/unionpay/pay?token_key=' + data.pay_url.token_key;
            factory.jumpUrl(url);
            this.payDialogVisible = true;
            (this.$refs.payDialogCom as any).uniPay_begin = true;
            setTimeout(()=> {
                (this.$refs.payDialogCom as any).init();
            },200)
        }else {
            this.payObj.payType = this.payType;
            this.payDialogVisible = true;
            setTimeout(()=> {
                (this.$refs.payDialogCom as any).init();
            },200)

        }
    }

    /**
     * 请求支付失败
     * TODO... 此方法可以重写，处理请求支付成功后的ui逻辑
     */
    onBeginpayError(msg: string) {
        this.$toast.fail({
            message:msg,
            className:'zZindex'
        });
    }

    /**
     * 获取用户详细信息
     */
    public async getUserInfo() {
        try {
            let token = Util.getUrlParam('account_token');
            const url = HttpClient.URL_USER_INFO;
            const param = {
                account_token: token,
            };
            this.backData = await this.http.post<UserInfo>(url, param);
            if (this.backData.code == HttpClient.HTTP_SUCCESS_NET_CODE) {
                this.userInfo = this.backData.data;
                await this.getUserPackage();
                await this.getUserDiscount();
            } else if (this.backData.code == HttpClient.HTTP_TOKEN_EXPIRE) {
                this.tokenExpired();
            }
        } catch (e) {
            // JumpWebUtil.backHome();
        }
    }

    /**
     * 获取套餐成功
     */
    public getUserPackageSuccess() {
        if (this.userInfo.is_switch_package == 0) {
            this.onChoosePackageTypeA(null);
        } else {
            for (var i = 0; i < this.packageList.length; i++) {
                if (this.packageList[i].include_region_codes == this.appParam.region_code + '') {
                    this.onChoosePackageTypeA(i);
                }
            }
        }
    }

    /**
     * 获取优惠券成功
     */
    public getUserDiscountSuccess() {
        this.onChoosePrice(this.priceIndex);
    }
    /**
     * 根据选择的套餐自动加载，优惠力度最大的优惠劵
     * 重载的具体方法
     */
    processZhekou(){
        if(this.discountList.length!=0) {
            this.zheCodeCopy=this.discountList[0].value
            this.zheCode = this.discountList[0].label;
        }else{
            this.zheCodeCopy=''
            this.zheCode ==''
        }
    }
    /**
     * 选择套餐类型
     */
    public onChoosePackageTypeA(type: any = null) {
        if (this.packageList.length <= 0) return;
        this.onChoosePackageType(type);
    }

    /**
     * 支付成功
     */
    public paySuccess() {
        this.getUserDiscount();
        this.payBackShow = true;
    }

    /**
     * 支付失败
     */
    public payFaild() {
        this.payBackShow = true;
    }

    /**
     * 重置支付dialog的title
     */
    public resetPayBackShow() {
        this.payBackShow = false;
        (this.$refs.payDialogCom as any).resetPayBack();
    }

    /**
     * 跳转会员服务条款
     */
    public goUserserver() {
        const factory = ExtrnalFactory.getInstance().getFactory(this.appParam.platform);
        let url = GlobalConfig.getWebBaseUrl() + '/' + JumpWebUtil.HTML_NAME_USERSERVER;
        let search = window.location.search;
        url = url + search;
        factory.jumpUrl(url);
    }

    /**
     * token过期处理
     * @param param
     */
    public tokenExpired(param: string = ''): void {
        // const factory = ExtrnalFactory.getInstance().getFactory(this.appParam.platform);
        // factory.loginExpire();
    }
}

new Recharge({
    i18n
}).$mount("#app");

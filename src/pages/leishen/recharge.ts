import '@/assets/less/leishen.less';
import 'babel-polyfill';
import VueI18n from 'vue-i18n';
import {Component, Vue} from 'vue-property-decorator';
import headNav from './components/HeadNav.vue'
import footNav from './components/FootNav.vue'
import downloadBox from './components/DownloadBox.vue'

import payStep1 from './components/setPayWay.vue'
import payStep2 from './components/PayDialog.vue'
import { LsLanguage } from './util/LsLanguage';
import Util from '@/ts/utils/Util';
import { ActivityPictureModel} from "@/ts/models/NewsModel";
import {PayModel, PayRequestModel, payTransfer, PriceList,UserDiscountList, UserInfo, UserRechargeInfo} from '@/ts/models/UserModel';
import GlobalConfig from './global.config';
import HttpClient from "@/ts/net/HttpClient";
import LocalStorageUtil from "@/ts/utils/LocalStorageUtil";
import RechargeProxy from "@/ts/proxy/RechargeProxy";
import ConfigUtil from "@/ts/utils/ConfigUtil";
import {Dialog, Notification,MessageBox, Loading} from 'element-ui'
import UserAd from "./components/UserAd.vue";
import WebParamModel from "@/ts/models/WebModel";
import {TipsMsgUtil} from "@/ts/utils/TipsMsgUtil";
import JumpWebUtil from "@/ts/utils/JumpWebUtil";
Vue.use(Dialog)
Vue.prototype.$notify = Notification;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.use(Loading);
//语言包
Vue.use(VueI18n);
const webParam = WebParamModel.getInstace(Util.REGION_CODE_1, Util.ZH_CN);
let lang = LsLanguage.getInstance();
lang.init();
const i18n = new VueI18n(lang);

@Component({
    components: {
        'pay-step1': payStep1,
        'pay-step2': payStep2,
        'head-nav': headNav,
        'foot-nav': footNav,
        'download-box': downloadBox,
        "user-ad": UserAd
    }
})
class recharge extends RechargeProxy {
    public imageHeadUrl: string = '';
    public webParam = WebParamModel.getInstace(); // 浏览器参数
    public loadingText = "套餐加载中"
    public showType: number = 4; // 4：设置支付方式5：二维码支付
    public http = new HttpClient();
    public activityList: Array<ActivityPictureModel> = []
    public activityInfo = new ActivityPictureModel()
    public pageName = 'recharge.html'
    public region_code: number = 1
    public user_url: string = GlobalConfig.getUserBaseUrl() + '/'
    public gw_url: string = GlobalConfig.getWebBaseUrl() + '/'
    public xiazaiUrl: string = GlobalConfig.goTodownUrl()
    public xianshi_activity_info = {}; // 首充活动的信息
    public shouchong_banner_img: string = ""
    public activity_jiaobiao_info={};
    public priceList: Array<PriceList> = [] //显示的套餐列表
    public userchoosePackage_id:number=-999 //用户点击的立即购买。
    public userchooenPrice=new PriceList() //用户点击的套餐
    public payUserNum: number = 0; //付款的人数信息
    public start_time: string = '';//首单特惠开始时间
    public end_time: string = '';//首单特惠结束时间

    public sc_timer = null;//首冲用户定时器
    public priceHoverIndex: number = 0;//套餐选中效果位置index

    public payDialogVisible: boolean = false //显示付款的两步弹框
    public currentPacakge = new UserRechargeInfo();
    public payModal = new PayRequestModel()
    public payTrans = new payTransfer()
    public payway: number = 2 //默认支付方式，支付宝 //支付类型 1微信 2支付宝 3qq支付 5paypal
    public userDiscountList: Array<UserDiscountList> = [];//请求回的全部折扣码列表
    public needtoCheck:boolean=true //是否需要检查用户的国内区，但是没有绑定手机号-默认需要检查
    public async created() {
        this.region_code = Number(Util.getUrlParam("region_code")) || LocalStorageUtil.getRegionCodes()
        this.setBaseUrl(GlobalConfig.getBaseUrl());
        await this.getUserInfo() //获取用户信息
        this.getDownloadUrl() //设置首充活动的时间
        JumpWebUtil.checkMobile(GlobalConfig.getMobWebBaseUrl()+'/recharge.html');
    }


    /**
     * 退出登陆成功
     */
    logout(){
        this.getUserInfo();
    }
    /**
     * 退出登陆成功
     */
    logSuccess(){
        this.needtoCheck=false
        this.getUserInfo();
    }
    /**
     * 支付，调用buy接口的时候token过期
     */
    payLogout(){
        this.$notify({
            title:TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_ERROR_TITLE).toString(),
            message:TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_LOGIN_FAILURE).toString(),
            type:'warning'
        })
        //@ts-ignore
        this.$refs.headnav.onClickAvatarHand('loginOut')
    }

    /**
     * 首先获取用户信息,根据获取用户信息的结果显示不同的
     */
    async getUserInfo() {
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
                    //@ts-ignore
                    this.$refs.headnav.isRealLogin = true
                    this.userInfo = this.backData.data;
                    UserInfo.getUserName(this.userInfo);
                    UserInfo.getUserAvatar(this.userInfo);
                    UserInfo.updateUserInfo(this.userInfo);
                    if(this.needtoCheck){
                        this.checkMoblie(this.userInfo)
                    }
                    this.getUserinfoSuccess();
                } else if (this.backData.code == HttpClient.HTTP_TOKEN_EXPIRE) {
                    this.tokenExpired();
                    //@ts-ignore
                    this.$refs.headnav.isLogin=false;
                } else {
                    //@ts-ignore
                    this.$refs.headnav.isLogin=false;
                    this.getUserinfoFail(this.backData);
                }
            }
        } catch (e) {

        }
    }
    //对region_code=1用户信息进行检测
    checkMoblie(userInfo:UserInfo){
        if(userInfo.mobile==''&&userInfo.region_code==1){
            // 如果用户是国内登录，且手机号为空；
            let alterTitle=this.$t('public.share67').toString()
            let alterp=this.$t('public.share68').toString()
            let btnText=this.$t('public.share69').toString()
            this.$alert(alterp, alterTitle, {
                confirmButtonText: btnText,
                showClose:false,
                customClass:'llz_bindMobile',
                callback: action => {
                    JumpWebUtil.webGotoUser(GlobalConfig.getUserBaseUrl(), JumpWebUtil.HTML_NAME_LOGIN, 'bind=bindMobile&to='+window.location.href);
                }
            });
        }
    }
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
            this.userDiscountList = this.userDiscountList.sort((a,b)=> {
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
        // console.log(this.userDiscountList)
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
    async unlogin0() {
        this.priceList=this.currentPacakge.price.slice()
    }

    /**
     * 国内区未登录的时候，显示的用户套餐和设置用户状态
     */
    async  unlogin1() {
        this.priceList=this.currentPacakge.price.slice()
    }

    /**
     * 用户token过期、用户没有token、获取用户信息失败都会调用改方法
     */
    async tokenExpired() {
        this.payDialogVisible=false
        this.isLoading = false;
        let lang=LocalStorageUtil.getLanguage().toString();
        let pacakgeJson=await ConfigUtil.getInstance().getRechargeJson(GlobalConfig.getWebBaseUrl())
        this.currentPacakge=(pacakgeJson[this.region_code+'__'+lang] as UserRechargeInfo)
        this.currentPacakge.price.sort((itemA,itemB)=>{
            return itemB.price_is_recommend-itemA.price_is_recommend
        })
        this.priceIndex=0;
        this.priceHoverIndex = 0;
        if (this.region_code == 0) {
            this.unlogin0()
        } else {
            this.unlogin1()
        }
    }

    /**
     * 改变priceHoverIndex
     */
    public changePriceHoverIndex(index: number) {
        this.priceHoverIndex = index;
    }

    /**
     * 改变priceHoverIndex
     */
    public restorePriceHoverIndex() {
        this.priceHoverIndex = this.priceIndex;
    }

    /**
     * 获取用户信息失败
     */
    getUserinfoFail(data) {
        this.tokenExpired()
    }

    /**
     * 成功用户信息以后；获取用户套餐
     */
    async getUserinfoSuccess() {
        //@ts-ignore
        this.$refs.headnav.checkLogin();//重新更新header的状态
        await this.getUserDiscount(); //需要首先获取用户折扣码，在请求用户套餐，防止出现用户
        this.getUserPackage();

    }

    /**
     * 获取套餐成功
     */
    public getUserPackageSuccess() {
        if (this.userInfo.is_switch_package == 0) {
            // 如果当前套餐还没有用完，根据userInfo的package_id和返回的套餐列表的id进行匹配
            for (let i = 0; i < this.packageList.length; i++) {
                if (this.packageList[i].package_id == this.userInfo.package_id) {
                    this.czTypeIndex = i
                    this.priceList = this.packageList[i].price;
                    this.priceList.sort((itemA,itemB)=>{
                        return itemB.price_is_recommend-itemA.price_is_recommend
                    })
                    this.priceIndex=0
                    if(this.currentPacakge.price.length==0){
                        //用户(已经登陆)从官网的其他页面跳转到的充值界面，暗示用户以前没有点击立即购买的按钮
                        this.currentPacakge = this.packageList[i]
                    }else{
                        //否则，用户就在当前页面，1：用户已经点击了立即购买的套餐，2：没有点击立即购买
                        if(this.userchoosePackage_id==this.packageList[i].package_id){
                            //如果用户已经点击了立即购买的套餐，并且套餐id和用户目前的套餐id一致
                            this.priceList.map((item,index)=>{
                                if(item.price_id==this.userchooenPrice.price_id){
                                    this.priceIndex=index
                                    this.tryPay(item)
                                }
                            })
                        }
                        this.currentPacakge=this.packageList[i]
                    }
                }
            }
        } else {
            //已用完，根据当前所在区域的套餐进行选择（国内，国际）
            for (let i = 0; i < this.packageList.length; i++) {
                if (this.packageList[i].include_region_codes == this.region_code + '') {
                    this.czTypeIndex = i
                    this.priceList = this.packageList[i].price
                    this.priceList.sort((itemA,itemB)=>{
                        return itemB.price_is_recommend-itemA.price_is_recommend
                    })
                    this.priceIndex=0
                    if(this.currentPacakge.price.length==0){
                        //用户(已经登陆)从官网的其他页面跳转到的充值界面，暗示用户以前没有点击立即购买的按钮
                        this.currentPacakge = this.packageList[i];
                    }else{
                        //否则，用户就在当前页面，1：用户已经点击了立即购买的套餐，2：没有点击立即购买
                        if(this.userchoosePackage_id==this.packageList[i].package_id){
                            //如果用户已经点击了立即购买的套餐，并且套餐id和用户目前的套餐id一致
                            this.priceList.map((item,index)=>{
                                if(item.price_id==this.userchooenPrice.price_id){
                                    this.priceIndex=index
                                    this.tryPay(item);
                                }
                            })
                        }
                        this.currentPacakge=this.packageList[i]
                    }
                }
            }
        }
    }

    /**
     * 点击立即购买,
     * 如果item的price_id和priceList其他的price_id都不相同，则代表获取套餐成功，可以进行支付
     */
   async tryPay(item:PriceList) {
        let token = Util.getUrlParam("account_token") || LocalStorageUtil.getUserToken().account_token;
        if (token == "") {
            //用户没有登录
            //@ts-ignore
            this.$refs.headnav.toLogin()
            this.userchoosePackage_id=this.currentPacakge.package_id
            this.userchooenPrice=Object.assign({},item)
        } else {
            this.isLoading = true;
            const url = HttpClient.URL_USER_INFO;
            const param = {
                account_token: token
            };
            this.backData = await this.http.post<UserInfo>(url, param);
            this.isLoading = false;
            if (this.backData.code == HttpClient.HTTP_SUCCESS_NET_CODE) {
                //用户已经登陆，并且已经成功获取套餐
                this.payModal.package_id = this.currentPacakge.package_id
                this.payModal.price_id = item.price_id
                this.payModal.account_token = Util.getUrlParam("account_token") || LocalStorageUtil.getUserToken().account_token;
                this.payTrans.price_num = item.price_num
                this.payTrans.price_title = item.price_title
                this.showType = 4 //等于1，显示支付组件
                this.payTrans.zheCodeList=[]
                this.userDiscountList.map(useritem=>{
                    if(useritem.price_ids.length>0){
                        for(let qq=0;qq<useritem.price_ids.length;qq++){
                            if(useritem.price_ids[qq]==item.price_id){
                                this.payTrans.zheCodeList.push({label:useritem.discount_code,value:useritem.title})
                            }
                        }
                    }
                })
                this.payDialogVisible=true
                this.$nextTick(()=>{
                    //@ts-ignore
                    this.$refs.paycomponentRef.init()
                })
            }else{
                //用户获取用户信息失败
                //@ts-ignore
                this.$refs.headnav.toLogin()
                this.userchoosePackage_id=this.currentPacakge.package_id
                this.userchooenPrice=Object.assign({},item)
                this.payLogout()
            }
        }
    }
    /**
     * 登陆成功
     */
    get paycomponent() {
        switch (this.showType) {
            case 4:
                return 'pay-step1'
                break;
            case 5:
                return 'pay-step2'
                break;
        }
    }
    /**
     * 点击 去支付
     * 完成了支付的第一步，支付方式和折扣码，
     * 准备跳转的支付的二维码
     */
    finishStep1(payType: number, zhekou: string) {
        this.payType = payType
        this.zheCode = zhekou
        this.onPay();
    }

    /**
     * 请求支付成功
     */
    onBeginpaySuccess() {
        this.showType = 5 //弹出支付框
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
            title:TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_ERROR_TITLE).toString(),
            message:msg,
            type:'warning'
        })
    }

    /**
     * 支付成功点击确认
     */
    payDoned() {
        this.showType = 4
        this.payDialogVisible = false;
    }

    /**
     * 关闭支付弹窗
     */
    public onClosePyaDialog() {
        this.payObj = new PayModel();
        if(this.showType==5){
            (this.$refs.paycomponentRef as any).onClose();
        }
    }

    /**
     * 返回设置支付方式
     */
    goBack() {
        (this.$refs.paycomponentRef as any).onClose();
        this.showType = 4
        this.$nextTick(()=>{
            //@ts-ignore
            this.$refs.paycomponentRef.init()
        })
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
        //由于目前的活动只是针对国内的用户，所以需要添加一个region_code的判断，等待后台的配置文件更新，则需要更新逻辑
        this.xianshi_activity_info = jsonConfig.leigod[this.region_code].is_show_xianshi_activity;
        // this.start_time = this.xianshi_activity_info.start_time.replace(/\-/g,'/');
        // this.end_time = this.xianshi_activity_info.end_time.replace(/\-/g,'/');
        //由于目前的活动只是针对国内的用户，所以需要添加一个region_code的判断，等待后台的配置文件更新，则需要更新逻辑
        this.activity_jiaobiao_info=jsonConfig.leigod[this.region_code].jiaobiao_is_show;
        if(this.userInfo.is_pay_user == 0) {
            let data = jsonConfig.leigod.shouchong_banner_img;
            let start_time = new Date(data.start_time).getTime();
            let end_time = new Date(data.end_time).getTime();
            let now_time = new Date().getTime();
            if(start_time<=now_time && now_time<=end_time) {
                this.shouchong_banner_img = data.url;
            }
        }
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
    /**
     * 折扣码错误，选择了折扣码，却没有获取到折扣码，
     */
    zhekouError(){
        //@ts-ignore
        let msg=this.$t('recharge.c34').toString()
        this.$notify({
            title: TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_ERROR_TITLE),
            message: msg,
            type: "warning"
        });
    }
}

new recharge({
    i18n
}).$mount('#app');

import './assets/less/kapai.less';
import 'babel-polyfill';
import { Component, Vue } from 'vue-property-decorator';
import VueI18n from 'vue-i18n';
import $ from 'jquery';
import Clipboard from "clipboard";
import { LsLanguage } from '../util/LsLanguage';
import GlobalConfig from '../global.config';
import Util from '@/ts/utils/Util';
import LocalStorageUtil from "@/ts/utils/LocalStorageUtil";
import ActivityProxy from "@/ts/proxy/ActivityProxy";
import ActivityFactory from "@/ts/factory/activity.factory";
import AppParamModel from "@/ts/models/AppModel";
import JumpWeiXin from "@/pages/leishen_app/util/jump";
import RechargeDialog from "@/pages/leishen_app/activitys/components/RechargeDialog";
import HttpClient from "@/ts/net/HttpClient";
import {PriceList, UserInfo} from "@/ts/models/UserModel";
import ConfigUtil from "@/ts/utils/ConfigUtil";
import {Popup, Toast} from "vant";
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
        "recharge-dialog": RechargeDialog
    }
})
class activityModel extends ActivityProxy {

    public activity_id = 200;
    public isLoading: boolean = false;
    public activity_json = ActivityFactory.getInstace('mobile',this.activity_id);
    public appParam = AppParamModel.getInstace(); // 浏览器参数
    public chooseinfo = new UserInfo();//传递的用户信息
    public choosePriceInfo = new PriceList();
    public show_recharge: boolean = false;//支付弹窗
    public package_index: number = 1;//默认选择第二个推荐套餐
    public pay_user_num: number = 0;//当前充值人数
    public game_num01: number = 1800;//全境封锁2剩余数量
    public game_num02: number = 1800;//只狼剩余数量
    public game_num03: number = 1800;//鬼泣5剩余数量

    public created() {
        this.activityJson = this.activity_json;
        this.imageHeadUrl = GlobalConfig.getImgBaseUrl();
        this.account_token = LocalStorageUtil.getUserToken().account_token;
        this.chooseinfo = LocalStorageUtil.getUserInfo();
        this.setBaseUrl(GlobalConfig.getBaseUrl());
        this.checkEnvironment();//获取当前设备环境
        this.getPriceList();
        this.getActivityId();
        this.getActivityDetail();
        this.getReferActivitys();
        this.changePackageIndex(1);
        this.getUserInfo();
        if (this.account_token == '') {
            this.refer_code = '请先登录!';
            this.refer_code_link = '请先登录!';
        }
    }

    /**
     * 获取活动详情成功
     */
    public getActivityDetailSuccess(data: any) {
        let nowTime = new Date().getTime();
        let flag = true;
        if(nowTime > new Date(Util.formateTime(data.end_time)).getTime()) {
            nowTime = new Date(Util.formateTime(data.end_time)).getTime();
            flag = false;
        }
        if(nowTime < new Date(Util.formateTime(data.start_time)).getTime()) {
            nowTime = new Date(Util.formateTime(data.start_time)).getTime();
            flag = false;
        }
        let startTime = new Date(Util.formateTime(data.start_time)).getTime();
        this.pay_user_num = Math.floor((nowTime - startTime)/10000) + Math.floor(Math.random()*20 + 180);
        this.game_num01 = 1800 - Math.floor((nowTime - startTime)/1020000) + Math.round(Math.random()*10);
        this.game_num02 = this.game_num01 + Math.round((Math.random()*2 - 1)*10);
        this.game_num03 = this.game_num01 + Math.round((Math.random()*2 - 1)*10);
        if(this.game_num01 <= 0) {
            this.game_num01 = 0;
        }
        if(this.game_num02 <= 0) {
            this.game_num02 = 0;
        }
        if(this.game_num03 <= 0) {
            this.game_num03 = 0;
        }
        if(flag) {
            setInterval(()=> {
                this.pay_user_num += (1 + Math.round(Math.random()));
            },15000);
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
     * 获取活动套餐
     */
    public async getPriceList() {
        let lang=LocalStorageUtil.getLanguage().toString();
        let pacakgeJson=await ConfigUtil.getInstance().getRechargeJson(GlobalConfig.getWebBaseUrl());
        this.priceList = pacakgeJson[this.appParam.region_code+'__'+lang].price;
        // this.priceList.reverse();
        this.priceList.sort((itemA, itemB) => {
            return itemB.price_is_recommend - itemA.price_is_recommend;
        });
        this.choosePriceInfo = this.priceList[0];//初始化赋值为推荐的套餐
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
     * 页面点击获取固定套餐
     * @param index
     */
    public changePackageIndex(index: number) {
        this.package_index = index;
    }

    /**
     * 点击翻牌
     */
    public clickReverse(index: number) {
        if(this.isBengin) return;
        this.kp_index = index;
        this.onClickDraw();
    }

    /**
     * 点击抽奖
     */
    public onClickDraw() {
        if (this.isBengin) return;
        if (this.account_token == "") {
            //提示登录
            $("body").addClass("body_fixed");
            this.dialog_no_login = true;
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

    /**
     * 默认充值
     */
    public async gotoRecharge(item: PriceList) {
        let token = Util.getUrlParam("account_token") || LocalStorageUtil.getUserToken().account_token;
        if (token == '') {
            //提示登录
            this.dialog_no_login = true;
            return;
        } else {
            await (this.$refs.to_recharge as any).getUserInfo();
            this.choosePriceInfo = item;
            //  如果不是微信环境，直接走原先的移动端充值逻辑
            if (this.appParam.platform != 4) {
                this.dialog_recharge = false;
                this.show_recharge = !this.show_recharge;//打开支付，并未开始支付
                $('body').removeClass('body_fixed');
            } else if (this.appParam.platform === 4) {
                //  如果是微信环境，直接调用子组件的原生微信支付方法
                (this.$refs.to_recharge as any).defaultPay(item);
            }
        }
    }

    /**
     * 立即邀请
     */
    public gotoInvite() {
        this.onCloseRecharge();
        window.location.href = "#step1";
    }

    /**
     * 生成推荐码
     * @param refer_code
     */
    public generateRefercodeLink(refer_code: string) {
        this.refer_code_link = GlobalConfig.getWebBaseUrl() + '/leigod/kapai.html?refer_code=' + refer_code;
    }

    /**
     * 复制推荐链接
     */
    public copyRefercodeLink() {
        if (this.account_token == "") {
            //提示登录
            this.dialog_no_login = true;
            return;
        }
        const that = this;
        let clipboard = new Clipboard("#copyRefercodeLink", {
            text: function () {
                return that.refer_code_link;
            }
        });
        clipboard.on("success", function (e) {
            e.clearSelection();
            that.dialog_error = true;
            that.dialog_msg = '邀请链接已复制到剪切板！快去邀请好友充值获取时长卡吧！';
        });
    }

    /**
     * 前往活动记录+去兑奖
     */
    public gotoRecord() {
        if (this.account_token == "") {
            //提示登录
            this.dialog_no_login = true;
            return;
        }
        let param = "platform=" + this.appParam.platform + "&pageIndex=5";
        JumpWeiXin.gotoCenter(param);
    }

    /**
     * 登录
     */
    public gotoLogin() {
        let refer_code=Util.getUrlParam('refer_code');
        let param='';
        if(refer_code){
             param = "platform=" + this.appParam.platform+"&state_html=activitys/kapai"+"&refer_code="+refer_code;
        }else{
             param = "platform=" + this.appParam.platform+"&state_html=activitys/kapai"+"&refer_code="+refer_code;
        }
        JumpWeiXin.gotoLogin(param);
    }

    /**
     * token过期
     * @param param
     */
    public tokenExpired(param: string = null): void {
        LocalStorageUtil.loginOut();
        this.account_token = '';
        this.userInfo = null;
        this.refer_code = '请先登录!';
        this.refer_code_link = '请先登录!';
    }

}

new activityModel({ i18n }).$mount('#app')

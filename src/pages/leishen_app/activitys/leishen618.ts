import './assets/less/leishen618.less';
import 'babel-polyfill';
import {Component, Vue} from 'vue-property-decorator';
import VueI18n from 'vue-i18n';
import $ from 'jquery';
import Clipboard from "clipboard";
import {LsLanguage} from '../util/LsLanguage';
import GlobalConfig from '../global.config';
import Util from '@/ts/utils/Util';
import LocalStorageUtil from "@/ts/utils/LocalStorageUtil";
import ActivityProxy from "@/ts/proxy/ActivityProxy";
import ActivityFactory from "@/ts/factory/activity.factory";
import AppParamModel from "@/ts/models/AppModel";
import HttpClient from "@/ts/net/HttpClient";
import {PriceList, UserDiscountList, UserInfo} from "@/ts/models/UserModel";
import ConfigUtil from "@/ts/utils/ConfigUtil";
import LoginDialog from "@/pages/leishen_app/activitys/components/LoginDialog";
import RegisterDialog from "@/pages/leishen_app/activitys/components/RegisterDialog";
import ForgetDialog from "@/pages/leishen_app/activitys/components/ForgetDialog";
import RechargeDialog from "@/pages/leishen_app/activitys/components/RechargeDialog";
import RewardDialog from "@/pages/leishen_app/activitys/components/RewardDialog";

import {Popup, Toast} from "vant";
import {
    ActivityModel,
    ActivityDetailRequestModel,
    PresentListRequestModel,
    ActivityPackageRequestModel, ActivityDrawModel
} from "@/ts/models/NewsModel";
import {IdataModel} from "@/ts/models/IdataModel";
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

    public activity_id = 203;//活动一ID参数
    public isLoading: boolean = false;
    public activity_json = ActivityFactory.getInstace('mobile', this.activity_id);
    public appParam = AppParamModel.getInstace(); // 浏览器参数
    public activityDetails_two: ActivityModel = null; //活动二详情
    public points_two: number = 0; // 活动二可抽奖积分
    public aCount_two: number = 0; // 活动二可抽奖次数
    public activity_id_two: number = 205;// 活动二ID参数
    public awardListTwo = []; //活动二中奖列表
    public up_btn_show: boolean = true;
    public up_btn_show_timer = null;
    public activityPackage = [
        {
            "is_enjoy":1
        },
        {
            "is_enjoy":1
        },
        {
            "is_enjoy":1
        },
        {
            "is_enjoy":1
        }
    ];
    public activityPackageId: number = 0;
    public dialog_win2: boolean = false;

    public chooseinfo = new UserInfo();//传递的用户信息
    public choosePriceInfo = new PriceList();

    public showType: number = 1;//组件显示次序，1登录 2注册 3忘记密码
    public show_dialog: boolean = false;//登录、注册、忘记密码弹框
    public show_reward: boolean = false;//兑奖弹窗
    public show_recharge: boolean = false;//支付弹窗
    public userDiscountList: Array<UserDiscountList> = [];//请求回的全部折扣码列表
    public userDiscount: string = '';

    public async created() {
        this.activityJson = this.activity_json;//读取活动配置，获取配置对象
        this.imageHeadUrl = GlobalConfig.getImgBaseUrl();//图片根地址获取
        this.chooseinfo = LocalStorageUtil.getUserInfo();//获取用户登录成功后的具体信息
        this.account_token = LocalStorageUtil.getUserToken().account_token;//获取用户token
        if (this.account_token == '') {
            this.refer_code = '请先登录!';
            this.refer_code_link = '请先登录!';
        }
        this.getActivityId();//获取活动ID
        this.setBaseUrl(GlobalConfig.getBaseUrl());//设置请求的根地址
        await this.getActivityPackage();
        this.checkEnvironment();//获取当前设备环境，分为Android、iOS、微信公众号
        this.getActivityDetail();//获取活动详情，一个是获取活动是否过期信息，一个是获取参与本次活动所需要的最低积分
        this.getActivityTwoDetail();
        this.getAwardList();
        await this.getAwardListTwo();
        this.initAwardListTwo();
        this.getReferActivitys();//获取对参与本活动的用户对应生成唯一的推荐码，包含推荐链接（推荐注册和充值）
        this.getUserInfo();//初始化获取用户信息，用于用户充值
        this.getUserDiscount();
    }

    mounted() {
        this.up_btn_show_timer = setInterval(()=> {
            this.up_btn_show = !this.up_btn_show
        },200)
    }

    /**
     * TODO... 需要重写
     */
    public getAwardListSuccess() {
        this.initAwardList();
    }

    /**
     * 获取抽奖活动二详情
     */
    public async getActivityTwoDetail() {
        if (this.account_token == '') return;
        if (this.activity_id_two == 0) {
            return;
        }
        let url = HttpClient.URL_ACTIVITY_DETAIL + this.activity_id_two;
        let param = new ActivityDetailRequestModel();
        param.type = 1;
        param.id = this.activity_id_two;
        param.plat_type = 1;
        param.region_code = LocalStorageUtil.getRegionCodes();
        param.account_token = this.account_token;
        this.backData = await this.http.get<ActivityDetailRequestModel>(url, param);
        if (this.backData.code == HttpClient.HTTP_SUCCESS_NET_CODE) {
            this.activityDetails_two = this.backData.data.detail as ActivityModel;
            this.points_two = this.backData.data.points;
            this.aCount_two = Math.floor(this.points_two / this.activityDetails_two.fee);
        } else if (this.backData.code == HttpClient.HTTP_TOKEN_EXPIRE) {
            this.tokenExpired();
        }
    }

    /**
     * 获取活动二中奖列表
     */
    public async getAwardListTwo() {
        if (this.activity_id_two == 0) return;
        let url = HttpClient.URL_ACTIVITY_PRESENT_LIST;
        let param = new PresentListRequestModel();
        param.activity_id = this.activity_id_two;
        param.present_type = 0;
        param.size = 50;
        this.backData = await this.http.post<PresentListRequestModel>(url, param);
        if (this.backData.code == HttpClient.HTTP_SUCCESS_NET_CODE) {
            this.awardListTwo = this.backData.data.list;
            let nowTime = new Date().getTime();
            if(nowTime > new Date('2019/7/9 15:30:00').getTime()) {
                nowTime = new Date('2019/7/9 15:30:00').getTime();
            }
            let startTime = new Date('2019/6/18 15:30:00').getTime();
            for(let i=0;i<10;i++) {
                let zj_time = startTime + Math.floor(Math.random()*(nowTime - startTime));
                let creat_time = Util.formatDateTime(zj_time);
                let user_id = Math.floor(Math.random()*65214)
                let phone = Util.getPhoneNum();
                let obj = {
                    create_time: creat_time,
                    mail: "",
                    mobile_num: phone,
                    nickname: "",
                    title: "免单",
                    user_id: user_id,
                    user_name: ""
                }
                this.awardListTwo.push(obj);
            }
            //昵称问题
            for (var i in this.awardListTwo) {
                let name = '';
                if (name == '' && this.awardListTwo[i]['nickname'] != '') {
                    name = this.awardListTwo[i]['nickname'];
                }
                if (name == '' && this.awardListTwo[i]['mobile_num'] != '') {
                    name = this.awardListTwo[i]['mobile_num'];
                }
                if (name == '' && this.awardListTwo[i]['mail'] != '') {
                    name = this.awardListTwo[i]['mail'];
                }
                if (name == '' && this.awardListTwo[i]['user_name'] != '') {
                    name = this.awardListTwo[i]['user_name'];
                }
                this.awardListTwo[i]['nickname'] = name;
            }
        } else {
        }
    }

    /**
     * 初始化活动二中奖列表名单
     */
    public initAwardListTwo() {
        if (this.awardListTwo.length <= 7) return;
        $(function () {
            setInterval(function () {
                var $ul = $("#jilu_box02");
                $ul.animate({
                    marginTop: "-30px"
                }, 400, function () {
                    $ul.find("li").eq(0).appendTo($ul);
                    $ul.css("margin-top", "0")
                })
            }, 2000);
        });
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
    public toLogin() {
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
     * 登录成功，父组件事件
     * @param data
     */
    public alreadyLogin(data) {
        if (data == 0) {
            // 关闭登录弹窗
            this.show_dialog = false;
            //需要重新刷新页面，重新获取用户信息，以及对应的活动积分
            // document.execCommand("Refresh");
            window.location.reload();
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
     * 点击翻牌
     */
    public clickReverse(index: number) {
        if (this.isBengin) return;
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

    /**
     * 点击抽奖二
     */
    public onClickDrawTwo() {
        if (this.isBengin) return;
        if (this.account_token == '') {
            //提示登录
            this.gotoLogin();
            return;
        }
        if (this.aCount_two <= 0) {
            //提示次数不足
            this.dialog_recharge = true;
            return;
        }
        this.isBengin = true;
        this.isWin = true;//播放动画
        this.onDrawTwo(1000, 1000);
    }

    /**
     * 发送抽奖二请求
     * @param delay_win 成功延迟时间
     * @param delay_lose 失败延迟显示
     */
    public async onDrawTwo(delay_win: number = 0, delay_lose: number = 0) {
        const url = HttpClient.URL_ACTIVITY_DRAW;
        const token = this.account_token;
        let param = new ActivityDrawModel();
        param.activity_id = this.activity_id_two;
        param.account_token = token;
        this.backData = await this.http.post(url, param);
        const that = this;
        if (this.backData.code == HttpClient.HTTP_SUCCESS_NET_CODE) {
            this.awardInfo = this.backData.data;
            setTimeout(function () {
                that.onDrawWinTwo(that.backData);
            }, delay_win);
        } else if (this.backData.code == HttpClient.HTTP_TOKEN_EXPIRE) {
            this.tokenExpired();
        } else {
            setTimeout(function () {
                that.onDrawLoseTwo(that.backData);
            }, delay_lose);
        }
    }

    /**
     * 活动二中奖
     * TODO... 需要重写此方法
     */
    public onDrawWinTwo(backData: IdataModel<any>) {
        this.isBengin = false;
        this.dialog_win2 = true;//弹出奖品图片动画
        this.prize_name = backData.data.title;
        this.prize_id = backData.data.present_id;

        //计算次数
        this.points_two = backData.data.points;
        this.aCount_two = Math.floor(this.points_two / this.activityDetails_two.fee);
    }

    /**
     * 活动二未中奖
     * TODO... 需要重写此方法
     */
    public onDrawLoseTwo(backData: IdataModel<any>) {
        this.isBengin = false;
        this.isWin = false;
        //提示
        this.dialog_error = true;
        this.dialog_msg = backData.msg;
        //计算次数
        this.points_two = backData.data.points;
        this.aCount_two = Math.floor(this.points_two / this.activityDetails_two.fee);
    }

    public closeDialog2() {
        this.isWin = false;
        this.dialog_win2 = false;
        $('body').removeClass('body_fixed');
    }

    /**
     * 获取活动套餐
     */
    public async getActivityPackage() {
        if (this.activity_id == 0 || !this.account_token) {
            return;
        }
        let url = HttpClient.URL_ACTIVITY_PACKAGE;
        let param = new ActivityPackageRequestModel();
        param.activity_id = this.activity_id;
        param.lang = this.appParam.language;
        param.region_code = LocalStorageUtil.getRegionCodes();
        param.account_token = this.account_token;
        this.backData = await this.http.get(url, param);
        if (this.backData.code == HttpClient.HTTP_SUCCESS_NET_CODE) {
            if(this.backData.data.length > 0) {
                this.activityPackage = this.backData.data[0].price.reverse();
                this.activityPackageId = this.backData.data[0].package_id;
            }
        } else if (this.backData.code == HttpClient.HTTP_TOKEN_EXPIRE) {
            this.tokenExpired();
        }
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
        if(this.userDiscountList.length >0) this.userDiscount = this.userDiscountList[0].discount_code;
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
    public async gotoRecharge(data: any) {
        let token = Util.getUrlParam("account_token") || LocalStorageUtil.getUserToken().account_token;
        if (token == '') {
            //提示登录
            this.gotoLogin();
            return;
        } else {
            if(!data.is_enjoy) {
                return
            }
            await (this.$refs.to_recharge as any).getUserInfo();
            (this.$refs.to_recharge as any).choosetaocanid = this.activityPackageId;
            (this.$refs.to_recharge as any).activity_buy_type = 618;
            this.choosePriceInfo = data;
            //  如果不是微信环境，直接走原先的移动端充值逻辑
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

    public paySuccess() {
        this.getActivityDetail();//获取活动详情，一个是获取活动是否过期信息，一个是获取参与本次活动所需要的最低积分
        this.getActivityTwoDetail();
        this.getActivityPackage();
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
            this.gotoLogin();
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
        if (this.account_token == '') {
            //提示登录
            this.gotoLogin();
            return;
        } else {
            this.dialog_win = false;
            this.dialog_win2 = false;
            this.show_reward = true;
            (this.$refs.to_reward  as any).loadList();
        }
    }

    /**
     * 关闭活动记录弹窗
     */
    public closeReward() {
        this.show_reward = false;
    }

    /**
     * 登录
     */
    public gotoLogin() {
        this.show_dialog = true;
        this.dialog_no_login = false;
        $('body').removeClass('body_fixed');
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

new activityModel({i18n}).$mount('#app')

import '../../assets/css/animate.min.css';
import '@/assets/less/leishen.less';
import './assets/less/leishen618.less';
import 'babel-polyfill';
import {Component, Vue} from 'vue-property-decorator';
import HeadNav from './components/HeadNav.vue';
import FootNav from './components/FootNav.vue';
import DownloadBox from './components/DownloadBox.vue';
import RechargeDialog from './components/RechargeDialog';
import RecordDialog from './components/RecordDialog';
import VueI18n from 'vue-i18n';
import WebParamModel from '@/ts/models/WebModel';
import {LsLanguage} from './util/LsLanguage';
import GlobalConfig from './global.config';
import Util from '@/ts/utils/Util';
import LocalStorageUtil from "@/ts/utils/LocalStorageUtil";
import {Dialog, Loading, Notification} from "element-ui";
import ActivityProxy from "@/ts/proxy/ActivityProxy";
import JumpWebUtil from "@/ts/utils/JumpWebUtil";
import Clipboard from "clipboard";
import ActivityFactory from "@/ts/factory/activity.factory";
import $ from "jquery";
import HttpClient from "@/ts/net/HttpClient";
import {PriceList, UserInfo} from "@/ts/models/UserModel";
import ConfigUtil from "@/ts/utils/ConfigUtil";
import {TipsMsgUtil} from "@/ts/utils/TipsMsgUtil";
import {
    ActivityDetailRequestModel,
    ActivityModel,
    PresentListRequestModel,
    ActivityPackageRequestModel,
    ActivityDrawModel
} from "@/ts/models/NewsModel";
import {debug} from "util";
import {IdataModel} from "@/ts/models/IdataModel";

Vue.config.productionTip = false;
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
        'head-nav': HeadNav,
        'foot-nav': FootNav,
        'recharge-dialog': RechargeDialog,
        'record-dialog': RecordDialog,//兑奖纪录
        'el-dialog': Dialog,
        'download-box': DownloadBox
    }
})
class activityModel extends ActivityProxy {

    public activity_id = 203;
    public activity_id2 = 205;
    public activity_json = ActivityFactory.getInstace('pc', this.activity_id);
    public webParam = WebParamModel.getInstace(); // 浏览器参数
    public package_index: number = 1;//默认选择第二个推荐套餐
    public isLoading: boolean = false;
    public pay_user_num: number = 0;//当前充值人数
    public game_num01: number = 1800;//全境封锁2剩余数量
    public game_num02: number = 1800;//只狼剩余数量
    public game_num03: number = 1800;//鬼泣5剩余数量
    public awardList2 = []; //中奖列表
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
    public points2: number = 0; //我的活动2抽象积分
    public aCount2: number = 0; // 可抽奖次数
    public dialog_win2: boolean = false;
    public default_awardList = [];



    /**
     *  页面初始化调用
     */
    public async created() {
        this.activityJson = this.activity_json;
        this.imageHeadUrl = GlobalConfig.getImgBaseUrl();
        this.account_token = LocalStorageUtil.getUserToken().account_token;
        this.setBaseUrl(GlobalConfig.getBaseUrl());
        // this.getPriceList();
        this.getActivityId();
        this.getActivityDetail();
        this.getActivity2Detail();
        await this.getUserInfo();
        // this.getReferActivitys();
        this.getActivityPackage();
        // this.changePackageIndex(1);
        if (this.account_token == '') {
            this.refer_code = '';
            this.refer_code_link = '';
        }
        Util.checkIsMobile();
    }

    public async mounted() {
        window.onscroll = () => {
            this.pageScroll(942);
        };
        this.getAwardList();
        this.getAwardList2();
    }

    /**
     * 抽奖按钮hover效果
     */
    public changeBtnShowOver() {
        this.up_btn_show_timer = setInterval(()=> {
            this.up_btn_show = !this.up_btn_show
        },200)
    }

    /**
     * 抽奖按钮离开hover效果
     */
    public changeBtnShowOut() {
        clearInterval(this.up_btn_show_timer);
        this.up_btn_show = true;
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
        param.lang = this.webParam.language;
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
     * 获取活动2中奖列表
     */
    public async getAwardList2() {
        if (this.activity_id2 == 0) return;
        let url = HttpClient.URL_ACTIVITY_PRESENT_LIST;
        let param = new PresentListRequestModel();
        param.activity_id = this.activity_id2;
        param.present_type = 0;
        param.size = 50;
        this.backData = await this.http.post<PresentListRequestModel>(url, param);
        if (this.backData.code == HttpClient.HTTP_SUCCESS_NET_CODE) {
            this.awardList2 = this.backData.data.list;
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
                this.awardList2.push(obj);
            }
            //昵称问题
            for (var i in this.awardList2) {
                let name = '';
                if (name == '' && this.awardList2[i]['nickname'] != '') {
                    name = this.awardList2[i]['nickname'];
                }
                if (name == '' && this.awardList2[i]['mobile_num'] != '') {
                    name = this.awardList2[i]['mobile_num'];
                }
                if (name == '' && this.awardList2[i]['mail'] != '') {
                    name = this.awardList2[i]['mail'];
                }
                if (name == '' && this.awardList2[i]['user_name'] != '') {
                    name = this.awardList2[i]['user_name'];
                }
                this.awardList2[i]['nickname'] = name;
            }
            this.initAwardList2();
        } else {
        }
    }

    /**
     * 获取抽奖活动2详情
     */
    public async getActivity2Detail() {
        if (this.activity_id2 == 0) {
            return;
        }
        let url = HttpClient.URL_ACTIVITY_DETAIL + this.activity_id2;
        let param = new ActivityDetailRequestModel();
        param.type = 1;
        param.id = this.activity_id2;
        param.plat_type = 1;
        param.region_code = LocalStorageUtil.getRegionCodes();
        param.account_token = this.account_token;
        this.backData = await this.http.get<ActivityDetailRequestModel>(url, param);
        if (this.backData.code == HttpClient.HTTP_SUCCESS_NET_CODE) {
            this.activityDetails = this.backData.data.detail as ActivityModel;
            this.points2 = this.backData.data.points;
            let now_time = new Date().getTime();
            let end_time = new Date(Util.formateTime(this.backData.data.detail.end_time)).getTime();
            if(now_time >= end_time) {
                this.dialog_msg = '活动已过期!';
                this.dialog_error = true;
            }
            this.getActivity2DetailSuccess(this.backData.data.detail);
            this.getActivity2Count();
        } else if (this.backData.code == HttpClient.HTTP_TOKEN_EXPIRE) {
            this.tokenExpired();
        }
    }

    /**
     * 获取我的活动2抽奖次数
     */
    public getActivity2Count() {
        this.aCount2 = Math.floor(this.points2 / this.activityDetails.fee);
    }

    /**
     * 点击抽奖
     */
    public onClickDraw2() {
        if (this.isBengin) return;
        if (this.account_token == '') {
            //提示登录
            this.gotoLogin();
            return;
        }
        if (this.aCount2 <= 0) {
            //提示次数不足
            $('body').addClass('body_fixed');
            this.dialog_recharge = true;
            return;
        }
        this.isBengin = true;
        this.isWin = true;//播放动画
        this.onDraw2(1000, 1000);
    }

    /**
     * 发送抽奖请求
     * @param delay_win 成功延迟时间
     * @param delay_lose 失败延迟显示
     */
    public async onDraw2(delay_win: number = 0, delay_lose: number = 0) {
        const url = HttpClient.URL_ACTIVITY_DRAW;
        const token = this.account_token;
        let param = new ActivityDrawModel();
        param.activity_id = this.activity_id2;
        param.account_token = token;
        this.backData = await this.http.post(url, param);
        const that = this;
        if (this.backData.code == HttpClient.HTTP_SUCCESS_NET_CODE) {
            this.awardInfo = this.backData.data;
            setTimeout(function () {
                that.onDrawWin2(that.backData);
            }, delay_win);
        } else if (this.backData.code == HttpClient.HTTP_TOKEN_EXPIRE) {
            this.tokenExpired(this.backData.msg);
            this.isBengin = false;
        } else {
            setTimeout(function () {
                that.onDrawLose2(that.backData);
            }, delay_lose);
        }
    }

    /**
     * 中奖
     * TODO... 需要重写此方法
     */
    public onDrawWin2(backData: IdataModel<any>) {
        this.dialog_win2 = true;//弹出奖品图片动画
        this.isBengin = false;
        this.prize_name = backData.data.title;
        this.prize_id = backData.data.present_id;
        this.points2 = backData.data.points;
        this.getActivity2Count();
    }

    /**
     * 未中奖
     * TODO... 需要重写此方法
     */
    public onDrawLose2(backData: IdataModel<any>) {
        this.isBengin = false;
        this.isWin = false;
        //提示
        this.dialog_error = true;
        this.dialog_msg = backData.msg;
        //计算次数
        this.points2 = backData.data.points;
        this.getActivity2Count();
    }

    closeDialog2() {
        this.isWin = false;
        this.dialog_win2 = false;
        $('body').removeClass('body_fixed');
    }

    /**
     * 获取活动详情成功
     */
    public getActivityDetailSuccess(data: any) {
    }

    /**
     * 获取活动2详情成功
     */
    public getActivity2DetailSuccess(data: any) {
    }

    /**
     * 登录成功
     */
    public async logined() {
        this.needtoCheck=false;
        await this.getUserInfo();
        this.account_token = LocalStorageUtil.getUserToken().account_token;
        this.getActivityDetail();
        this.getActivity2Detail();
        await this.getActivityPackage();
        await (this.$refs.to_recharge as any).getUserDiscount();
        await (this.$refs.to_recharge as any).getUserPackage();
    }

    /**
     * 退出登录
     */
    public logout() {
        this.account_token = LocalStorageUtil.getUserToken().account_token;
        this.aCount = 0;
        this.refer_code = '请先登录!';
        this.refer_code_link = '请先登录!';
    }

    /**
     * 获取活动套餐
     */
    public async getPriceList() {
        let lang=LocalStorageUtil.getLanguage().toString();
        let pacakgeJson=await ConfigUtil.getInstance().getRechargeJson(GlobalConfig.getWebBaseUrl());
        this.priceList = pacakgeJson['1__'+lang].price;
        // this.priceList.reverse();
        this.priceList.sort((itemA, itemB) => {
            return itemB.price_is_recommend - itemA.price_is_recommend
        });
    }

    /**
     * 页面点击获取固定套餐
     * @param index
     */
    public changePackageIndex(index: number) {
        this.package_index = index;
    }

    /**
     * 登录成功后调用户信息接口，获取用户信息
     */
    public async getUserInfo() {
        try {
            this.isLoading = true;
            let token = Util.getUrlParam("account_token") || LocalStorageUtil.getUserToken().account_token;
            if (token == "") {
                // this.tokenExpired(TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_LOGIN_FAILURE));
                return;
            } else {
                const url = HttpClient.URL_USER_INFO;
                const param = {
                    account_token: token
                };
                this.backData = await this.http.post<UserInfo>(url, param);
                this.isLoading = false;
                if (this.backData.code == HttpClient.HTTP_SUCCESS_NET_CODE) {
                    (this.$refs.headnav as any).isRealLogin = true;
                    this.userInfo = this.backData.data;
                    UserInfo.getUserName(this.userInfo);
                    UserInfo.getUserAvatar(this.userInfo);
                    UserInfo.updateUserInfo(this.userInfo);
                    (this.$refs.headnav as any).checkLogin();//重新更新header的状态
                    if(this.needtoCheck){
                        this.checkisBinbMobile(this.userInfo,'pc')
                    }
                    // (this.$refs.to_recharge as any).getUserinfoSuccess();//登录成功获取用户套餐
                } else if (this.backData.code == HttpClient.HTTP_TOKEN_EXPIRE) {
                    this.tokenExpired(this.backData.msg);
                    (this.$refs.headnav as any).isLogin = false;
                } else {
                    (this.$refs.headnav as any).isLogin = false;
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
        this.tokenExpired(data.msg);
    }

    /**
     * 初始化中奖列表名单
     */
    public initAwardList() {
        if (this.awardList.length <= 6) return;
        $(function () {
            setInterval(function () {
                var $ul = $("#jilu_box");
                $ul.animate({
                    marginTop: "-40px"
                }, 400, function () {
                    $ul.find("li").eq(0).appendTo($ul);
                    $ul.css("margin-top", "0")
                })
            }, 2000);
        });
    }

    /**
     * 初始化中奖列表名单
     */
    public initAwardList2() {
        if (this.awardList2.length <= 6) return;
        $(function () {
            setInterval(function () {
                var $ul = $("#jilu_box2");
                $ul.animate({
                    marginTop: "-40px"
                }, 400, function () {
                    $ul.find("li").eq(0).appendTo($ul);
                    $ul.css("margin-top", "0")
                })
            }, 2000);
        });
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
     * 生成推荐链接
     * @param refer_code
     */
    public generateRefercodeLink(refer_code: string) {
        this.refer_code_link = Util.getOrigin() + '/leigod/kapai.html?refer_code=' + refer_code + '#recharge';
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
     * 立即充值
     */
    public gotoInvite() {
        this.onCloseRecharge();
        window.location.href = "#recharge";
    }

    /**
     * 登录
     */
    public gotoLogin() {
        this.dialog_no_login = false;
        $('body').removeClass('body_fixed');
        if (this.account_token == '' || this.account_token == null) {
            (this.$refs.headnav as any).toLogin();
        }
    }

    /**
     * 充值
     */
    public gotoRecharge(data: any) {
        if(!data.is_enjoy) return;
        if (this.account_token == '' || this.account_token == null) {
            this.gotoLogin();
        } else {
            //  支付请求
            this.choosen_price.price_id = data.price_id;
            this.choosen_price.price_num = data.price_num;
            this.choosen_price.price_title = data.price_title;
            (this.$refs.to_recharge as any).buyActivityPackage(this.activityPackageId,this.choosen_price);
        }
    }

    /**
     * 兑奖
     */
    public gotoDuijiang(status: number = 0) {
        this.closeDialog();
        this.closeDialog2();
        if (this.account_token == '' || this.account_token == null) {
            this.gotoLogin();
        } else {
            if (status != 3) {
                // JumpWebUtil.webGotoUser(GlobalConfig.getUserBaseUrl(), JumpWebUtil.HTML_NAME_USER, 'page=7');
                (this.$refs.activeRecordList as any).recordDialogVisible = true;
                (this.$refs.activeRecordList as any).initA();
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
        (this.$refs.headnav as any).checkLogin();
        // this.$notify({
        //     title: TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_ERROR_TITLE).toString(),
        //     message: param,
        //     type: 'warning'
        // });
        // this.gotoLogin();
    }

    /**
     * 切换语言
     */
    public onChangeLanguage(ln: string) {
        lang.changeLanguage(ln);
        i18n.locale = lang.locale;
        this.webParam.language = ln;
    }
}

new activityModel({i18n}).$mount('#app')

import '../../assets/css/animate.min.css';
import '@/assets/less/leishen.less';
import './assets/less/kapai.less';
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

    public activity_id = 200;
    public activity_json = ActivityFactory.getInstace('pc', this.activity_id);
    public webParam = WebParamModel.getInstace(); // 浏览器参数
    public package_index: number = 1;//默认选择第二个推荐套餐
    public isLoading: boolean = false;
    public pay_user_num: number = 0;//当前充值人数
    public game_num01: number = 1800;//全境封锁2剩余数量
    public game_num02: number = 1800;//只狼剩余数量
    public game_num03: number = 1800;//鬼泣5剩余数量



    /**
     *  页面初始化调用
     */
    public async created() {
        this.activityJson = this.activity_json;
        this.imageHeadUrl = GlobalConfig.getImgBaseUrl();
        this.account_token = LocalStorageUtil.getUserToken().account_token;
        this.setBaseUrl(GlobalConfig.getBaseUrl());
        this.getPriceList();
        this.getActivityId();
        this.getActivityDetail();
        await this.getUserInfo();
        this.getReferActivitys();
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
        };
        if(this.game_num02 <= 0) {
            this.game_num02 = 0;
        };
        if(this.game_num03 <= 0) {
            this.game_num03 = 0;
        };
        if(flag) {
            setInterval(()=> {
                this.pay_user_num += (1 + Math.round(Math.random()));
            },15000);
        };
    }

    /**
     * 登录成功
     */
    public async logined() {
        this.needtoCheck=false
        await this.getUserInfo();
        this.account_token = LocalStorageUtil.getUserToken().account_token;
        this.getActivityDetail();
        this.getReferActivitys();
        (this.$refs.to_recharge as any).getUserPackage();
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
        if (this.awardList.length <= 4) return;
        $(function () {
            setInterval(function () {
                var $ul = $("#jilu_box");
                $ul.animate({
                    marginTop: "-30px"
                }, 400, function () {
                    $ul.find("li").eq(0).appendTo($ul);
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

    // /**
    //  * 充值
    //  */
    // public async gotoRecharge(data: any) {
    //     if (this.account_token == '' || this.account_token == null) {
    //         this.gotoLogin();
    //     } else {
    //         //  支付请求
    //         this.choosen_price.price_id = data.price_id;
    //         this.choosen_price.price_num = data.price_num;
    //         this.choosen_price.price_title = data.price_title;
    //         await (this.$refs.to_recharge as any).checkPrice(this.choosen_price);
    //     }
    // }

    /**
     * 兑奖
     */
    public gotoDuijiang(status: number = 0) {
        this.closeDialog();
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

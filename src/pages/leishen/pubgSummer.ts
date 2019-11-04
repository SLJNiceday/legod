import '../../assets/css/animate.min.css';
import '@/assets/less/leishen.less';
import './assets/less/shujia.less';
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
import ActivityFactory from "@/ts/factory/activity.factory";
import $ from "jquery";
import HttpClient from "@/ts/net/HttpClient";
import {PriceList, UserInfo, UserRechargeInfo} from "@/ts/models/UserModel";

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

    public activity_id = 216;
    public activity_json = ActivityFactory.getInstace('pc', this.activity_id);
    public webParam = WebParamModel.getInstace(); // 浏览器参数
    // public package_index: number = 1;//默认选择第二个推荐套餐
    public isLoading: boolean = false;

    public activityPackageId: number = 0;

    public currentPacakge = new UserRechargeInfo();
    /**
     *  页面初始化调用
     */
    public async created() {
        this.activityJson = this.activity_json;
        this.imageHeadUrl = GlobalConfig.getImgBaseUrl();
        this.account_token = LocalStorageUtil.getUserToken().account_token;
        this.setBaseUrl(GlobalConfig.getBaseUrl());
        this.getActivityDetail();
        await this.getUserInfo();
        this.getSpeicalPackage()
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
        this.luck.init('prize','.sj_prize');
        this.getAwardList();
    }

    /**
     * 成功获取套餐
     */
    getSpeicalPackageSuccess(packageData:UserRechargeInfo){
        this.activityPackageId=packageData.package_id;
        let tempPrice=packageData.price.sort((a,b)=>{
            return b.price_is_recommend-a.price_is_recommend
        })
        this.currentPacakge=packageData
        this.currentPacakge.price=tempPrice.slice(0)

    }
    /**
     * 登录成功
     */
    public async logined() {
        this.needtoCheck=false;
        await this.getUserInfo();
        this.account_token = LocalStorageUtil.getUserToken().account_token;
        this.getActivityDetail();
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
                    // (this.$refs.headnav as any).isRealLogin = true;
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
                    marginTop: "-56px"
                }, 400, function () {
                    $ul.find("li").eq(0).appendTo($ul);
                    $ul.css("margin-top", "0")
                })
            }, 2000);
        });
    }
    // 点击中奖列表时
    public onClickAward(){
        if (this.account_token == '') {
            //提示登录
            this.gotoLogin();
            return;
        }else{
            //@ts-ignore
            this.$refs.activeRecordList.recordDialogVisible=true;
            //@ts-ignore
            this.$refs.activeRecordList.initA()
            // this.getActiveRecordList(1, 6);
        }
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
        if (this.account_token == '' || this.account_token == null) {
            this.gotoLogin();
        } else {
            if (status != 3) {
                (this.$refs.activeRecordList as any).recordDialogVisible = true;
                (this.$refs.activeRecordList as any).initA();
            }
        }
    }

    /**
     * token过期
     * @param param
     */
    public async tokenExpired(param: string = null) {
        LocalStorageUtil.loginOut();
        this.account_token = '';
        this.userInfo = null;
        (this.$refs.headnav as any).checkLogin();
    }

    /**
     * 切换语言
     */
    public onChangeLanguage(ln: string) {
        lang.changeLanguage(ln);
        i18n.locale = lang.locale;
        this.webParam.language = ln;
    }
    /**
     * 重写转动的方法
     */
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
}

new activityModel({i18n}).$mount('#app')

import '../../assets/css/animate.min.css';
import '@/assets/less/leishen.less';
import './assets/less/wuyi.less';
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
import {Dialog, Loading} from "element-ui";
import ActivityProxy from "@/ts/proxy/ActivityProxy";
import JumpWebUtil from "@/ts/utils/JumpWebUtil";
import ActivityFactory from "@/ts/factory/activity.factory";
import $ from "jquery";
import HttpClient from "@/ts/net/HttpClient";
import {PriceList, UserInfo} from "@/ts/models/UserModel";

Vue.config.productionTip = false;
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

    public activity_id = 193;
    public activity_json = ActivityFactory.getInstace('pc', this.activity_id);
    public webParam = WebParamModel.getInstace(); // 浏览器参数
    public package_index: number = 1;//默认选择第二个推荐套餐
    public isLoading: boolean = false;
    public chooseinfo = new UserInfo();//传递的用户信息
    public PriceList = new PriceList();//选中的套餐信息
    public priceList1 = new PriceList();
    public priceList2 = new PriceList();

    /**
     *  页面初始化调用
     */
    public created() {
        //套餐一
        this.priceList1.price_id = 7;
        this.priceList1.price_num = "49元";
        this.priceList1.price_title = "800";
        //套餐二
        this.priceList2.price_id = 10;
        this.priceList2.price_num = "279元";
        this.priceList2.price_title = "9000";

        this.activityJson = this.activity_json;
        this.imageHeadUrl = GlobalConfig.getImgBaseUrl();
        this.account_token = LocalStorageUtil.getUserToken().account_token;
        this.chooseinfo = LocalStorageUtil.getUserInfo();
        this.setBaseUrl(GlobalConfig.getBaseUrl());
        this.getActivityId();
        this.getActivityDetail();
        this.getReferActivitys();
        this.changePackageIndex(1);
        this.getUserInfo();
        if (this.account_token == '') {
            this.refer_code = '请先登录!';
            this.refer_code_link = '请先登录!';
        }
        Util.checkIsMobile();
    }

    public async mounted() {
        window.onscroll = () => {
            this.pageScroll(942);
        };
        let now_time = new Date().getTime();
        let end_time = new Date(this.activity_json.endtime).getTime();
        if (now_time >= end_time) {
            this.dialog_msg = '活动已过期!';
            this.dialog_error = true;
        }
        this.getAwardList();
    }

    /**
     * 登录成功
     */
    public logined() {
        this.getUserInfo();
        this.account_token = LocalStorageUtil.getUserToken().account_token;
        this.getActivityDetail();
        this.getReferActivitys();
    }

    /**
     * 退出登录
     */
    public logout() {
        this.getUserInfo();
        this.account_token = LocalStorageUtil.getUserToken().account_token;
        this.aCount = 0;
        this.refer_code = '请先登录!';
        this.refer_code_link = '请先登录!';
    }

    /**
     * 页面点击获取固定套餐
     * @param index
     */
    public changePackageIndex(index: number) {
        this.package_index = index;
        if (index === 0) {
            this.PriceList = this.priceList1;
        } else if (index === 1) {
            this.PriceList = this.priceList2;
        }
    }

    /**
     * 登录成功后调用户信息接口，获取用户信息
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
                    (this.$refs.headnav as any).isRealLogin = true;
                    this.userInfo = this.backData.data;
                    UserInfo.getUserName(this.userInfo);
                    UserInfo.getUserAvatar(this.userInfo);
                    UserInfo.updateUserInfo(this.userInfo);
                    (this.$refs.headnav as any).checkLogin();//重新更新header的状态
                    (this.$refs.to_recharge as any).getUserinfoSuccess();//登录成功获取用户套餐
                } else if (this.backData.code == HttpClient.HTTP_TOKEN_EXPIRE) {
                    this.tokenExpired();
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
        this.tokenExpired();
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
     * 生成推荐链接
     * @param refer_code
     */
    public generateRefercodeLink(refer_code: string) {
        this.refer_code_link = GlobalConfig.getUserBaseUrl() + '/' + JumpWebUtil.HTML_NAME_REGISTER + '?refer_code=' + refer_code;
    }

    /**
     * 立即邀请
     */
    public gotoInvite() {
        this.onCloseRecharge();
        window.location.href = "#step1";
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
    public async gotoRecharge() {
        if (this.account_token == '' || this.account_token == null) {
            $('body').removeClass('body_fixed');
            this.dialog_no_login = true;
        } else {
            //  支付请求
            (this.$refs.to_recharge as any).payDialogVisible = true;
            await (this.$refs.to_recharge as any).tryPay(this.PriceList);
        }
    }

    /**
     * 兑奖
     */
    public gotoDuijiang(status: number = 0) {
        if (this.account_token == '' || this.account_token == null) {
            $('body').addClass('body_fixed');
            this.dialog_no_login = true;
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
    public tokenExpired(param: string = null): void {
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
}

new activityModel({i18n}).$mount('#app')

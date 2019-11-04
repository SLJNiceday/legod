import '../../assets/less/leishen.less';
import './assets/less/preferential.less';
import 'babel-polyfill';
import { Component, Vue } from 'vue-property-decorator';
import HeadNav from './components/HeadNav.vue';
import FootNav from './components/FootNav.vue';
import VueI18n from 'vue-i18n';
import WebParamModel from '@/ts/models/WebModel';
import { LsLanguage } from './util/LsLanguage';
import GlobalConfig from './global.config';
import Util from '@/ts/utils/Util';
import LocalStorageUtil from "@/ts/utils/LocalStorageUtil";
import { Dialog } from "element-ui";
import ActivityProxy from "@/ts/proxy/ActivityProxy";
import JumpWebUtil from "@/ts/utils/JumpWebUtil";
import ActivityFactory from "@/ts/factory/activity.factory";
import HttpClient from "@/ts/net/HttpClient";
import {PriceList, UserInfo} from "@/ts/models/UserModel";

Vue.config.productionTip = false;

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
        'el-dialog': Dialog
    }
})
class activityModel extends ActivityProxy {

    // http://localhost:8080/shuangdan.html?id=36&region_code=1&language=zh_CN&account_token=VxHnkvLQZFN1PVvXHgBzuZFZksgKZ0Bk5WcJYox657pvSKgzcgTgUgdb0R3wdL90
    public activity_id = 195;
    public activity_json = ActivityFactory.getInstace('pc',this.activity_id);
    public webParam = WebParamModel.getInstace(); // 浏览器参数
    public PriceList = new PriceList();//选中的套餐信息

    /**
     *
     */
    public created() {
        //套餐一
        Util.checkIsMobile();
        this.PriceList.price_id = 7;
        this.PriceList.price_num = "99元";
        this.PriceList.price_title = "2300小时";
        this.activityJson = this.activity_json;
        this.imageHeadUrl = GlobalConfig.getImgBaseUrl();
        this.account_token = LocalStorageUtil.getUserToken().account_token;
        this.setBaseUrl(GlobalConfig.getBaseUrl());
        this.getActivityId();
        this.getActivityDetail();
        this.getReferActivitys();
        // this.getUserInfo();
        if (this.account_token == '') {
            this.refer_code = '请先登录!';
            this.refer_code_link = '请先登录!';
        }
    }

    /**
     *
     */
    public mounted() {
        window.onscroll = () => {
            this.pageScroll(887);
        };
        this.luck.init('prize','.th_prize');
        this.getAwardList();
    }

    public generateRefercodeLink(refer_code: string) {
        this.refer_code_link = GlobalConfig.getUserBaseUrl() + '/' + JumpWebUtil.HTML_NAME_REGISTER + '?refer_code=' + refer_code;
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
     * 前往充值页(旧版)
     */
    public async gotoRecharge() {
        JumpWebUtil.webGotoUser(GlobalConfig.getUserBaseUrl(), JumpWebUtil.HTML_NAME_USER, 'page=3&package_index=0');
    }

    /**
     * 充值
     */
    // public async gotoRecharge() {
    //     if (this.account_token == '' || this.account_token == null) {
    //         $('body').removeClass('body_fixed');
    //         this.dialog_no_login = true;
    //     } else {
    //         //  支付请求
    //         (this.$refs.to_recharge as any).payDialogVisible = true;
    //         await (this.$refs.to_recharge as any).tryPay(this.PriceList);
    //     }
    // }

    /**
     * 兑奖
     */
    public gotoDuijiang() {
        JumpWebUtil.webGotoUser(GlobalConfig.getUserBaseUrl(), JumpWebUtil.HTML_NAME_USER, 'page=2');
    }

    /**
     * 登录成功后调用户信息接口，获取用户信息
     */
    async getUserInfo() {
        try {
            let token = Util.getUrlParam("account_token") || LocalStorageUtil.getUserToken().account_token;
            if (token == "") {
                this.tokenExpired()
            } else {
                const url = HttpClient.URL_USER_INFO;
                const param = {
                    account_token: token
                };
                this.backData = await this.http.post<UserInfo>(url, param);
                if (this.backData.code == HttpClient.HTTP_SUCCESS_NET_CODE) {
                    //@ts-ignore
                    this.$refs.headnav.isRealLogin = true;
                    this.userInfo = this.backData.data;
                    UserInfo.getUserName(this.userInfo);
                    UserInfo.getUserAvatar(this.userInfo);
                    UserInfo.updateUserInfo(this.userInfo);
                    (this.$refs.headnav as any).checkLogin();//重新更新header的状态
                    (this.$refs.to_recharge as any).getUserinfoSuccess();//登录成功获取用户套餐
                } else if (this.backData.code == HttpClient.HTTP_TOKEN_EXPIRE) {
                    this.tokenExpired();
                    //@ts-ignore
                    this.$refs.headnav.isLogin = false;
                } else {
                    //@ts-ignore
                    this.$refs.headnav.isLogin = false;
                    this.getUserinfoFail(this.backData);
                }
            }
        } catch (e) {

        }
    }

    /**
     * 获取用户信息失败
     */
    getUserinfoFail(data) {
        this.tokenExpired();
    }

    /**
     * 登录成功
     */
    public logined() {
        // this.getUserInfo();
        this.account_token = LocalStorageUtil.getUserToken().account_token;
        this.getActivityDetail();
        this.getReferActivitys();
    }

    /**
     * 退出登录
     */
    public logout() {
        // this.getUserInfo();
        this.account_token = LocalStorageUtil.getUserToken().account_token;
        this.aCount = 0;
        this.refer_code = '请先登录!';
        this.refer_code_link = '请先登录!';
    }

    /**
     * token过期
     * @param param
     */
    public tokenExpired(param: string = null): void {
        LocalStorageUtil.loginOut();
        this.account_token = '';
        this.userInfo = null;
        (this.$refs.head as any).checkLogin();
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

new activityModel({ i18n }).$mount('#app')

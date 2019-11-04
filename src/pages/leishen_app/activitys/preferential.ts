import '@/assets/less/leishen_app.less';
import './assets/less/preferential.less';
import 'babel-polyfill';
import {Component, Vue} from 'vue-property-decorator';
import VueI18n from 'vue-i18n';
import {LsLanguage} from '../util/LsLanguage';
import GlobalConfig from '../global.config';
import Util from '@/ts/utils/Util';
import LocalStorageUtil from "@/ts/utils/LocalStorageUtil";
import ActivityProxy from "@/ts/proxy/ActivityProxy";
import ActivityFactory from "@/ts/factory/activity.factory";
import AppParamModel from "@/ts/models/AppModel";
import JumpWeiXin from "@/pages/leishen_app/util/jump";
import JumpWebUtil from "@/ts/utils/JumpWebUtil";

Vue.config.productionTip = false;

//语言包
Vue.use(VueI18n);
const appParam: AppParamModel = AppParamModel.getInstace(Util.REGION_CODE_1, Util.ZH_CN);
let lang = LsLanguage.getInstance();
lang.init();
const i18n = new VueI18n(lang);

@Component
class activityModel extends ActivityProxy {

    public activity_id = 195;
    public activity_json = ActivityFactory.getInstace('mobile', this.activity_id);
    public appParam = AppParamModel.getInstace(); // 浏览器参数

    /**
     *
     */
    public created() {
        this.activityJson = this.activity_json;
        this.imageHeadUrl = GlobalConfig.getImgBaseUrl();
        this.account_token = LocalStorageUtil.getUserToken().account_token;
        this.setBaseUrl(GlobalConfig.getBaseUrl());
        this.getActivityId();
        this.getActivityDetail();
        this.getReferActivitys();
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
            this.pageScroll(835);
        };
        this.luck.init('prize', '.app-present_cell');
        this.getAwardList();
        const that = this;
        setInterval(function () {
            that.clock = Object.assign({}, that.getClock(that.activity_json.endtime));
        }, 1000)
    }

    /**
     * 用户生成推荐码
     * @param {string} refer_code
     */
    public generateRefercodeLink(refer_code: string) {
        this.refer_code_link = GlobalConfig.getUserBaseUrl() + '/' + JumpWebUtil.HTML_NAME_REGISTER + '?refer_code=' + refer_code;
    }

    /**
     * 登录
     */
    public gotoLogin() {
        let param = "platform=" + this.appParam.platform;
        JumpWeiXin.gotoLogin(param);
    }

    /**
     * 充值
     */
    public gotoRecharge() {
        let param = "platform=" + this.appParam.platform;
        JumpWeiXin.gotoRecharge(param);
    }

    /**
     * 前往活动记录+去兑奖
     */
    public gotoRecord() {
        let param = "platform=" + this.appParam.platform + "&pageIndex=5";
        JumpWeiXin.gotoCenter(param);
    }

    /**
     * token过期
     * @param param
     */
    public tokenExpired(param: string = null): void {
        LocalStorageUtil.loginOut();
        this.account_token = '';
        this.userInfo = null;
    }

    /**
     * 切换语言
     */
    public onChangeLanguage(ln: string) {
        lang.changeLanguage(ln);
        i18n.locale = lang.locale;
        this.appParam.language = ln;
    }


}

new activityModel({i18n}).$mount('#app')

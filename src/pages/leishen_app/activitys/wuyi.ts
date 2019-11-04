import '@/assets/less/leishen_app.less';
import './assets/less/wuyi.less';
import 'babel-polyfill';
import $ from "jquery";
import { Component, Vue } from 'vue-property-decorator';
import VueI18n from 'vue-i18n';
import { LsLanguage } from '../util/LsLanguage';
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

    public activity_id = 193;
    public activity_json = ActivityFactory.getInstace('mobile',this.activity_id);
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
            this.refer_code_link = '';
        }
    }

    /**
     *
     */
    public mounted() {
        this.getAwardList();
        let now_time = new Date().getTime();
        let end_time = new Date(this.activity_json.endtime).getTime();
        if(now_time >= end_time) {
            this.dialog_msg = '活动已过期!';
            this.dialog_error = true;
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
        this.refer_code_link = GlobalConfig.getMobWebBaseUrl() + '/mreg.html?refer_code=' + refer_code;
    }

    /**
     * 前往活动记录+去兑奖
     */
    public gotoRecord() {
        let param = "platform=" + this.appParam.platform + "&pageIndex=5";
        JumpWeiXin.gotoCenter(param);
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
     * token过期
     * @param param
     */
    public tokenExpired(param: string = null): void {
        LocalStorageUtil.loginOut();
        this.account_token = '';
        this.userInfo = null;
    }

}

new activityModel({ i18n }).$mount('#app')

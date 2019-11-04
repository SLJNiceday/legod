import '@/assets/less/leishen_app.less';
import './assets/less/mario.less';
import 'babel-polyfill';
import { Component, Vue } from 'vue-property-decorator';
import VueI18n from 'vue-i18n';
import { LsLanguage } from '../util/LsLanguage';
import GlobalConfig from '../global.config';
import Util from '@/ts/utils/Util';
import AppParamModel from "@/ts/models/AppModel";
import Load from "../components/Loading.vue";
import {Loading} from "vant";
import JumpWeiXin from "@/pages/leishen_app/util/jump";
import ConfigUtil from "@/ts/utils/ConfigUtil";
import $ from "jquery";

Vue.config.productionTip = false;
Vue.use(Loading);

//语言包
Vue.use(VueI18n);
const appParam: AppParamModel = AppParamModel.getInstace(Util.REGION_CODE_1, Util.ZH_CN);
let lang = LsLanguage.getInstance();
lang.init();
const i18n = new VueI18n(lang);

@Component({
    components:{
        'loading': Load
    }
})
class Mario extends Vue {
    public appParam = AppParamModel.getInstace(); // 浏览器参数
    public downUrl: string = "";
    public winDownUrl: string = "";

    created() {
        this.getDownloadUrl();
    }

    public goDetail(detail: number) {
        switch(detail) {
            case 0:
                window.location.href = 'https://www.leigod.com/notice/51264.html';
                break;
            case 1:
                window.location.href = 'https://www.leigod.com/notice/51265.html';
                break;
            case 2:
                window.location.href = 'https://www.leigod.com/notice/51263.html';
                break;
            case 3:
                window.location.href = 'https://www.leigod.com/notice/51266.html';
                break;
        }
    }

    /**
     * 充值
     */
    public gotoRecharge() {
        let param = "platform=" + this.appParam.platform;
        JumpWeiXin.gotoRecharge(param);
    }

    /**
     * 获取下载url
     * @param url
     */
    public async getDownloadUrl() {
        const jsonConfig = await ConfigUtil.getInstance().download(true);
        this.downUrl = jsonConfig.leigod.android.download_url;
        this.winDownUrl = jsonConfig.leigod.windows.download_url;
        this.checkType();
    }

    /**
     * 检测手机浏览器内核类型
     */
    public checkType() {
        const self = this;
        $(function () {
            var ua = window.navigator.userAgent.toLowerCase();
            var u = navigator.userAgent;
            var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
            var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

            // @ts-ignore
            if (ua.match(/MicroMessenger/i) == "micromessenger") {

                //微信环境
                $("#downBtn").click(function () {
                    $(".shadow").show();
                });
                $(".shadow").click(function () {
                    $(this).hide();
                });
            }else if (isIOS) {
                $("#downBtn").click(
                    function (e) {
                        e.preventDefault();
                        window.open('itms-apps://itunes.apple.com/WebObjects/MZStore.woa/wa/viewSoftware?id=1403370767')
                    }
                );
            }else{
                $("#downBtn").click(function (e) {
                    e.preventDefault();
                    window.open(self.downUrl)
                });
            }
        });
    }
}
new Mario({ i18n }).$mount('#app')

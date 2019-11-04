
import "leigod-lib-flexible";
import "babel-polyfill";
import VueI18n from "vue-i18n";
import {Vue, Component} from "vue-property-decorator";
import AppParamModel from "@/ts/models/AppModel";
import {LsLanguage} from "../util/LsLanguage";
import {Collapse, CollapseItem} from 'vant';

Vue.use(Collapse);
Vue.use(CollapseItem);
import Util from "@/ts/utils/Util";
import ConfigUtil from "@/ts/utils/ConfigUtil";
import $ from "jquery";

Vue.config.productionTip = false;

//语言包
const appParam: AppParamModel = AppParamModel.getInstace(Util.REGION_CODE_1, Util.ZH_CN);
Vue.use(VueI18n);
let lang = LsLanguage.getInstance();
lang.initNoRefresh();
const i18n = new VueI18n(lang);

@Component
class Appshow extends Vue {
    public appParam: AppParamModel = AppParamModel.getInstace();
    public downUrl: string = "";
     mounted(){
         this.getDownloadUrl()
    }

    // public  applink() {
    //     let isIOS = navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false;
    //     if (isIOS) {
    //         $("#downBtn").attr(
    //             "href",
    //             "itms-apps://itunes.apple.com/WebObjects/MZStore.woa/wa/viewSoftware?id=1403370767"
    //         );
    //     } else {
    //         $("#downBtn").attr("href", this.downUrl);
    //     }
    // }
    /**
     * 检测手机浏览器内核类型
     */
    public applink() {
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
                $("#downBtn").attr(
                    "href",
                    "itms-apps://itunes.apple.com/WebObjects/MZStore.woa/wa/viewSoftware?id=1403370767"
                );
            }else{
                $("#downBtn").attr("href", self.downUrl);
            }
        });
    }

    /**
     * 获取下载url
     * @param url
     */
    public async getDownloadUrl() {
        const jsonConfig = await ConfigUtil.getInstance().download(true);
        this.downUrl = jsonConfig.leigod.android.download_url;
        this.applink();

    }


}

new Appshow({i18n}).$mount("#app");



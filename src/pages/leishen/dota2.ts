import '@/assets/css/animate.min.css';
import '@/assets/less/leishen.less';
import './assets/less/zhuanti.less';
import "babel-polyfill";
import {Vue, Component} from 'vue-property-decorator';
import HeadNav from './components/HeadNav.vue';
import FootNav from './components/FootNavZt.vue';
import DownloadBox from './components/DownloadBox.vue';
import WebParamModel from '@/ts/models/WebModel';
import {LsLanguage} from './util/LsLanguage';
import GlobalConfig from './global.config';
import ConfigUtil from "@/ts/utils/ConfigUtil";
import LocalStorageUtil from "@/ts/utils/LocalStorageUtil";
import HttpClient from "@/ts/net/HttpClient";
import {AdModel} from "@/ts/models/UserModel";
import VueI18n from 'vue-i18n';
import Util from "@/ts/utils/Util";
import $ from 'jquery';

Vue.use(VueI18n);
Vue.config.productionTip = false;

//语言包
const webParam = WebParamModel.getInstace(Util.REGION_CODE_1, Util.ZH_CN);
let lang = LsLanguage.getInstance();
lang.init();
const i18n = new VueI18n(lang);

@Component({
    components: {
        'head-nav': HeadNav,
        'foot-nav': FootNav,
        'download-box': DownloadBox,
    }
})
class ZhuanTi extends Vue {
    public webParam = WebParamModel.getInstace();
    public windowsDownloadUrl: string = ""; //windows客户端下载配置
    public macDownloadUrl: string = ""; //mac客户端下载配置
    public webBaseURL: string = GlobalConfig.getWebBaseUrl();
    //////////公共参数
    public http = new HttpClient();
    private imageHeadUrl: string;

    public adlink: string = '';
    public adSrc: string = '';
    public adshow: number = 0;
    public is_day: boolean = true;
    public mario_cursor_show: boolean = true;//是否显示提示手型

    public created() {
        this.imageHeadUrl = GlobalConfig.getImgBaseUrl();
        this.setBaseUrl(GlobalConfig.getBaseUrl());
        this.getDownloadUrl();
        // Util.checkIsMobile();
    }

    /**
     * 切换语言
     */
    public onChangeLanguage(ln: string) {
        lang.changeLanguage(ln);
        i18n.locale = lang.locale;
        GlobalConfig.log('切换语言:' + lang.locale);
    }

    public setBaseUrl(url: string): void {
        this.http.setBaseUrl(url);
    }

    /**
     * 登录成功
     */
    public logined() {
    }

    /**
     * 退出登录
     */
    public logout() {
    }

    /**
     * 获取下载url
     * @param url
     */
    public async getDownloadUrl() {
        const jsonConfig = await ConfigUtil.getInstance().download(true);
        const downConfig = jsonConfig.leigod.down_platform[this.webParam.from];
        this.windowsDownloadUrl = downConfig.windows.download_url;
        this.macDownloadUrl = downConfig.mac.download_url;
    }

    // 读取右下角广告
    async getAd(group) {
        try {
            const url = HttpClient.URL_AD;
            const code = LocalStorageUtil.getRegionCodes()
            const param = {
                group: group,
                region_codes: code
            };
            let data = await this.http.get<AdModel>(url, param);

            if (data.code == HttpClient.HTTP_SUCCESS_NET_CODE) {
                this.adlink = data.data[0].url
                this.adSrc = this.imageHeadUrl + data.data[0].img_url;
            }
        } catch (e) {

        }
    }

    public closeAd() {
        this.adshow = 1;
    }
}

(window as any).mario = new ZhuanTi({
    i18n
}).$mount('#app');

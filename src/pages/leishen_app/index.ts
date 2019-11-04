import "./css/wap.less";
import "@/assets/less/leishen_app.less";
import "leigod-lib-flexible";
import "babel-polyfill";
import VueI18n from "vue-i18n";
import {Vue, Component} from "vue-property-decorator";
import AppParamModel from "@/ts/models/AppModel";
import {LsLanguage} from "@/pages/leishen_app/util/LsLanguage";
import ConfigUtil from "@/ts/utils/ConfigUtil";
import $ from "jquery";
import Util from "@/ts/utils/Util";
import NavList from "./components/NavList.vue";
import {Icon, Popup, Picker, Swipe, SwipeItem,ImagePreview} from "vant";
import {LanguageInfo, LanguageConfig} from "@/ts/utils/Language";
import LocalStorageUtil from "@/ts/utils/LocalStorageUtil";

Vue.use(Icon);
Vue.use(Popup);
Vue.use(Picker);
Vue.use(Swipe);
Vue.use(SwipeItem);
Vue.use(ImagePreview);
Vue.config.productionTip = false;

//语言包
Vue.use(VueI18n);
const appParam: AppParamModel = AppParamModel.getInstace(
    Util.REGION_CODE_1,
    Util.ZH_CN
);
let lang = LsLanguage.getInstance();
lang.initNoRefresh();
const i18n = new VueI18n(lang);

@Component({
    components: {
        navlist: NavList
    }
})
class Index extends Vue {
    private appParam: AppParamModel = AppParamModel.getInstace();
    public downUrl: string = "";
    public winDownUrl: string = "";
    private langListshow: boolean = false;
    public languageList: LanguageInfo[] = [];
    private _lanConfig: LanguageConfig = null;
    public seleteLng: LanguageInfo = new LanguageInfo(); //选择的语言
    public seleteCode: string = "";
    public langText: string = "中文";
    public showlangText: string = "中文";
    private images=[
        '/images/zhanshitu_big1.png',
        '/images/zhanshitu_big2.png',
        '/images/zhanshitu_big3.png',
        '/images/zhanshitu_big4.png',
        '/images/zhanshitu_big5.png',
    ]

    public created() {
        this.lanConfig = LsLanguage.getInstance();
        this.getDownloadUrl();
        this.onSetLanguage();
    }

    /**
     * 设置语言类，每个项目都有一个语言类，切勿搞错
     * @param value
     */
    public set lanConfig(value: LanguageConfig) {
        this._lanConfig = value;
        this.languageList = this.lanConfig.getLanguageList();
    }

    public get lanConfig() {
        return this._lanConfig;
    }

    /**
     * 切换语言
     */
    public onChangeLanguage(ln: string) {
        lang.changeLanguage(ln);
        i18n.locale = lang.locale;
        this.appParam.language = ln;
        // GlobalConfig.log('切换语言:' + lang.locale);
    }

    /**
     * 切换语言
     */
    onSetLanguage(ln: string = "") {
        if (ln == "" || ln == null) {
            ln = LocalStorageUtil.getLanguage();
        }
        this.seleteLng = this.lanConfig.getLanguageInfo(ln, this.languageList);
        this.seleteCode = this.seleteLng.code;
    }

    /**
     * 预览图片
     * @param position 初始位置
     * @param 几秒后自动关闭 可不填
     */
    public showImagePreview(position) {
        let images=this.images;
        const instance = ImagePreview({
            images,
            startPosition: typeof position === 'number' ? position : 0,
            loop:false// 关闭循环播放
        });
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
     * 呼出切换语言列表
     */
    public showLangList() {
        this.langListshow = true;
    }

    onCancel() {
        this.langListshow = false;
    }

    onConfirm() {
        this.onChangeLanguage(this.seleteCode);
        this.showlangText = this.langText;
        this.langListshow = false;
    }

    onChange(picker, value, index) {
        this.seleteCode = value.code;
        this.langText = value.name;
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
                $("#downBtn").attr(
                    "href",
                    "itms-apps://itunes.apple.com/WebObjects/MZStore.woa/wa/viewSoftware?id=1403370767"
                );
            }else{
                $("#downBtn").attr("href", self.downUrl);
            }
        });
    }
}

new Index({i18n}).$mount("#app");
import AppParamModel from "@/ts/models/AppModel";
import Util from "@/ts/utils/Util";
import '@/assets/less/leishen_pc.less';
import "leigod-lib-flexible";
import "babel-polyfill";
import {Component, Vue} from "vue-property-decorator";
import VueI18n from "vue-i18n";
import {LsLanguage} from "@/pages/leishen_pc/util/LsLanguage";
import {ExtrnalFactory} from "@/ts/factory/ExtrnalFactory";
import HttpClient from "@/ts/net/HttpClient";
import {ActivityPictureModel, ActivityRequestPictureModel} from "@/ts/models/NewsModel";
import {IdataModel} from "@/ts/models/IdataModel";
import GlobalConfig from "@/pages/leishen_pc/global.config";
import ConfigUtil from "@/ts/utils/ConfigUtil";
import LocalStorageUtil from "@/ts/utils/LocalStorageUtil";

//语言包
Vue.use(VueI18n);
const appParam: AppParamModel = AppParamModel.getInstace(Util.REGION_CODE_1, Util.ZH_CN);
let lang = LsLanguage.getInstance();
lang.initNoRefresh();
const i18n = new VueI18n(lang);

@Component
class Indexs extends Vue{
    public appParam: AppParamModel = AppParamModel.getInstace(Util.REGION_CODE_1,Util.ZH_CN);
    public index_bg: string = '';//首页背景图链接
    public index_bg_link: string = '';//首页背景图点击跳转地址
    public index_bg_show: boolean = false;
    public bannerList: Array<ActivityPictureModel> = [];

    public http = new HttpClient();
    public backData: IdataModel<any> | undefined;

    /**
     * 初始化
     */
    public created(){
        this.setBaseUrl(GlobalConfig.getBaseUrl())
        this.getDownloadUrl();
    }

    public setBaseUrl(url: string): void {
        this.http.setBaseUrl(url);
    }

    /**
     * 获取下载列表
     * @param url
     */
    public async getDownloadUrl() {
        const jsonConfig = await ConfigUtil.getInstance().download(false);
        const region_code = LocalStorageUtil.getRegionCodes();
        const language = LocalStorageUtil.getLanguage();
        this.index_bg = jsonConfig.leigod[region_code].index_banner.img_url;
        this.index_bg_link = jsonConfig.leigod[region_code].index_banner.link_url;
    }

    /**
     * 获取活动banner
     */
    public async getActivityInfo() {
        let url = HttpClient.URL_ACTIVITY_PICTURE_LIST;
        let param = new ActivityRequestPictureModel();
        param.region_code = this.appParam.region_code;
        param.plat_type = 3;
        this.backData = await this.http.get(url, param);
        if (this.backData.code == HttpClient.HTTP_SUCCESS_NET_CODE) {
            this.bannerList = this.backData.data as ActivityPictureModel[];
            for(let i = 0 ; i<this.bannerList.length;i++ ) {
                let start_time = new Date(Util.formateTime(this.bannerList[i].start_time)).getTime();
                let end_time = new Date(Util.formateTime(this.bannerList[i].end_time)).getTime();
                let now_time = new Date(Util.formateTime(this.bannerList[i].now_time)).getTime();
                if(start_time < now_time && now_time  < end_time) {
                    let imgUrls = this.bannerList[i].imgs.filter((item) => {
                        return item.key == 2;
                    })[0];
                    if(imgUrls) {
                        this.index_bg = imgUrls.img_url;
                    };
                    if(this.bannerList[i].url_type == 1) {
                        this.index_bg_link = this.bannerList[i].url;
                    }
                    break;
                }else {
                    this.index_bg_show = false;
                }
            }
        }
    }

    /**
     * banner点击跳转
     */
    public goLinkUrl(){
        const factory = ExtrnalFactory.getInstance().getFactory(this.appParam.platform);
        if(this.index_bg_link) {
            factory.jumpUrl(this.index_bg_link);
        }
    }
}

new Indexs({
    i18n
}).$mount("#app");

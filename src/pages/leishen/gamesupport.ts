import '@/assets/less/leishen.less';
import "babel-polyfill";
import {Component, Vue} from 'vue-property-decorator';
import HeadNav from './components/HeadNav.vue';
import FootNav from './components/FootNav.vue';
import DownloadBox from './components/DownloadBox.vue';
import VueI18n from 'vue-i18n';
import WebParamModel from '@/ts/models/WebModel';
import {LsLanguage} from './util/LsLanguage';
import GlobalConfig from './global.config';
import JumpWebUtil from '@/ts/utils/JumpWebUtil';
import {
    ActivityPictureModel,
    ActivityRequestPictureModel
} from "@/ts/models/NewsModel";
import HttpClient from "@/ts/net/HttpClient";
import {IdataModel} from "@/ts/models/IdataModel";
import {IProxy} from "@/ts/interface/IProxy";
import Util from "@/ts/utils/Util";
import {Pagination, Loading, Dialog, Carousel, CarouselItem} from 'element-ui';
import UserAd from "./components/UserAd.vue";
import ConfigUtil from "@/ts/utils/ConfigUtil";

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
        'download-box': DownloadBox,
        'el-pagination': Pagination,
        'el-dialog': Dialog,
        'el-carousel': Carousel,
        'el-carousel-item': CarouselItem,
        "user-ad": UserAd
    }
})
class Gamesupport extends Vue implements IProxy {
    public webParam = WebParamModel.getInstace();
    public activityInfo: ActivityPictureModel = new ActivityPictureModel();
    public navIndex: number = 0;//tab栏索引
    public gameList = [];//所有游戏列表
    public checkGameList = [];//选择的类型的游戏列表
    public showGameList = [];//当前页显示的游戏列表
    public keyWords: string = '';
    public isLoading: boolean = false;
    public emptyDialogVisible: boolean = false;//未搜索到游戏时上报游戏提示弹窗
    public currentPage: number = 1;//分页当前页

    ///////公共参数
    // http
    public http = new HttpClient();
    public backData: IdataModel<any> | undefined;

    public execute(): void {
    }

    public init(): void {
    }

    public setBaseUrl(url: string): void {
        this.http.setBaseUrl(url);
    }

    public created() {
        this.setBaseUrl(GlobalConfig.getBaseUrl());
        this.getActivityInfo();
        this.getGameList();
    }

    /**
     * 切换语言
     */
    public onChangeLanguage(ln: string) {
        lang.changeLanguage(ln);
        i18n.locale = lang.locale;
        GlobalConfig.log('切换语言:' + lang.locale);
    }

    /**
     * 跳转用户中心
     */
    public logined() {
        // this.isLoading=true;
        // JumpWebUtil.webGotoUser(GlobalConfig.getUserBaseUrl(), JumpWebUtil.HTML_NAME_USER);
    }

    /**
     * 切换游戏类型
     */
    public changeNavIndex(index: number){
        this.navIndex = index;
        this.keyWords='';
        this.currentPage = 1;
        switch (index) {
            case 0:
                this.checkGameList = this.gameList;
                this.getShowGameList(1);
                break;
            case 1:
                this.getNewGameList();
                break;
            case 2:
                this.getHotGameList();
                break;
            case 3:
                this.getFreeGameList();
                break;
            case 4:
                this.getMobileGameList();
                break;
            case 5:
                this.getLabelGameList('Steam');
                break;
            case 6:
                this.getLabelGameList('Origin');
                break;
            case 7:
                this.getLabelGameList('Uplay');
                break;
            case 8:
                this.getLabelGameList('Xbox');
                break;
            case 9:
                this.getLabelGameList('PS4');
                break;
            case 10:
                this.getLabelGameList('Switch');
                break;
            default:
                break;
        }
    }

    /**
     * 获取所有游戏列表
     */
    public async getGameList() {
        this.isLoading = true;
        let pacakgeJson=await ConfigUtil.getInstance().getGamesJson(GlobalConfig.getWebBaseUrl());
        this.processData(pacakgeJson);
        this.gameList = pacakgeJson;
        this.checkGameList = this.gameList;
        this.isLoading = false;
        this.getShowGameList(1);
    }

    /**
     * 处理返回的数据
     */
    public processData(data){
        data.forEach((item,index)=>{
            let createTime = new Date(Util.formateTime(item.create_time)).getTime();
            let nowTime = new Date().getTime();
            if((nowTime - createTime) <= 7776000000){
                item['is_new'] = 1;
            }else {
                item['is_new'] = 0;
            }
        });
    }

    /**
     * 获取当前页游戏列表
     */
    public getShowGameList(page: number) {
        this.showGameList = this.checkGameList.slice((page - 1)*150,page*150)
    }

    /**
     * 获取最新游戏
     */
    public getNewGameList() {
        this.checkGameList = this.gameList.filter((item)=>{
            return item.is_new == 1;
        });
        this.getShowGameList(1);
    }

    /**
     * 获取热门游戏
     */
    public getHotGameList() {
        this.checkGameList = this.gameList.filter((item)=>{
            return item.is_hot == 1;
        });
        this.getShowGameList(1);
    }

    /**
     * 获取手游
     */
    public getMobileGameList() {
        this.checkGameList = this.gameList.filter((item)=>{
            return item.is_support_ios == 1 || item.is_support_android == 1;
        });
        this.getShowGameList(1);
    }

    /**
     * 获取指定平台游戏
     */
    public getLabelGameList(label: string) {
        this.checkGameList = this.gameList.filter((item)=>{
            if(item.game_label == null) {
                item.game_label = '';
            }
            return item.game_label.indexOf(label) != -1;
        });
        this.getShowGameList(1);
    }

    /**
     * 获取限免游戏
     */
    public getFreeGameList() {
        this.checkGameList = this.gameList.filter((item)=>{
            return item.is_free == 1;
        });
        this.getShowGameList(1);
    }

    /**
     * 搜索游戏
     */
    public searchGame() {
        let arr = this.gameList.filter((item)=>{
            let key_words = item.keywords.toLowerCase();
            return key_words.indexOf(this.keyWords.toLowerCase()) != -1;
        });
        /*** 上报游戏弹窗 ****/
        // if(arr.length == 0){
        //     this.emptyDialogVisible = true;
        //     return;
        // }
        this.checkGameList = arr;
        this.getShowGameList(1);
    }

    /**
     * 获取活动banner
     */
    public async getActivityInfo() {
        let url = HttpClient.URL_ACTIVITY_PICTURE_LIST;
        let param = new ActivityRequestPictureModel();
        param.region_code = this.webParam.region_code;
        param.plat_type = 1;
        this.backData = await this.http.post(url, param);
        if (this.backData.code == HttpClient.HTTP_SUCCESS_NET_CODE) {
            if(this.backData.data.length > 0){
                this.activityInfo = this.backData.data[0];
                if (this.activityInfo.url == '') {
                    this.activityInfo.url = JumpWebUtil.HTML_NAME_DETAILS_ACTIVITY_NEW + '?id=' + this.activityInfo.id;
                }
            }
        }
    }
}

new Gamesupport({i18n}).$mount('#app')
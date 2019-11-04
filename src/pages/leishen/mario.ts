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
        Util.checkIsMobile();
    }

    public mounted() {
        let mario = $('#mario_move');
        let mogu = $('#mario_mogu');
        this.marioMoveStart(mario,mogu);
        this.marioBoomGif();
        this.marioBoomMove();
        this.marioCursorGif();
    }

    public goDetail(detail: number) {
        switch(detail) {
            case 0:
                window.open('https://www.leigod.com/notice/51264.html');
                break;
            case 1:
                window.open('https://www.leigod.com/notice/51265.html');
                break;
            case 2:
                window.open('https://www.leigod.com/notice/51263.html');
                break;
            case 3:
                window.open('https://www.leigod.com/notice/51266.html');
                break;
        }
    }

    /**
     * 马里奥运动1
     */
    public marioMoveStart(el:any,el2: any) {
        let timer = setInterval(()=> {
            let left = parseInt($(el).css('margin-left'));
            $(el).css('margin-left',left + 7 + 'px');
            if(left + 8 > -125){
                $(el).css('margin-left','-125px');
                clearInterval(timer);
                this.marioMoveOne(el,el2);
            }
        },30)
    }

    /**
     * 马里奥运动2
     */
    public marioMoveOne(el:any,el2:any) {
        let timer = setInterval(()=> {
            let bottom = parseInt($(el).css('bottom'));
            $(el).css('bottom',bottom + 7 + 'px');
            if(bottom + 6 >= -211){
                $(el).css('bottom','-211px');
                $('#mario_btn_move').addClass('mario_btn_move');
                clearInterval(timer);
                this.marioMoveTwo(el,el2);
                setTimeout(()=> {
                    $(el2).css('display','block');
                    this.marioMoguMoveStart(el2);
                },300)
            }
        },15)
    }

    /**
     * 马里奥运动3
     */
    public marioMoveTwo(el:any,el2: any) {
        let timer = setInterval(()=> {
            let bottom = parseInt($(el).css('bottom'));
            $(el).css('bottom',bottom - 7 + 'px');
            if(bottom - 6 <= -266){
                $(el).css('bottom','-266px');
                clearInterval(timer);
                this.marioMoveEnd(el,el2);
            }
        },15)
    }

    /**
     * 马里奥运动3
     */
    public marioMoveEnd(el:any,el2:any) {
        let timer = setInterval(()=> {
            let left = parseInt($(el).css('margin-left'));
            $(el).css('margin-left',left + 9 + 'px');
            if(left + 8 >= 920){
                clearInterval(timer);
                setTimeout(()=> {
                    $(el).css('margin-left','-1025px');
                    $('#mario_btn_move').removeClass('mario_btn_move');
                    this.marioMoveStart(el,el2);
                },5000);
            }
        },30)
    }

    /**
     * 蘑菇运动1
     */
    public marioMoguMoveStart(el:any) {
        let timer = setInterval(()=> {
            let top = parseInt($(el).css('top'));
            $(el).css('top',top - 8 + 'px');
            if(top - 8 <= 315){
                $(el).css('top','315px');
                clearInterval(timer);
                this.marioMoguMoveTwo(el);
            }
        },30)
    }

    /**
     * 蘑菇运动2
     */
    public marioMoguMoveTwo(el:any) {
        let timer = setInterval(()=> {
            let left = parseInt($(el).css('left'));
            $(el).css('left',left + 6 + 'px');
            if(left + 6 >= 1050){
                clearInterval(timer);
                this.marioMoguMoveThree(el);
            }
        },30)
    }

    /**
     * 蘑菇运动3
     */
    public marioMoguMoveThree(el:any) {
        let timer = setInterval(()=> {
            let top = parseInt($(el).css('top'));
            let left = parseInt($(el).css('left'));
            if(top < 685) {
                $(el).css('top',top + 12 + 'px');
            }
            $(el).css('left',left + 6 + 'px');
            if(top + 12 >= 685){
                $(el).css('top','685px');
            }
            if(left + 6 >= 1910){
                $(el).css('top','405px');
                $(el).css('left','890px');
                $(el).css('display','none');
                clearInterval(timer);
            }
        },30)
    }

    /**
     * 太阳月亮运动1
     */
    public marioSunMove(el:any,callback: any) {
        this.mario_cursor_show = false;
        let timer = setInterval(()=> {
            let left = parseInt($(el).css('left'));
            let top = parseInt($(el).css('top'));
            $(el).css('left',left + 12 + 'px');
            $(el).css('top',top - 11 + 'px');
            if(left + 12 >= 448){
                $(el).css('left','-310px');
                $(el).css('top','350px');
                clearInterval(timer);
                callback();
                this.marioSunMoveTwo(el);
            }
        },30)
    }

    /**
     * 太阳月亮运动2
     */
    public marioSunMoveTwo(el:any) {
        let timer = setInterval(()=> {
            let left = parseInt($(el).css('left'));
            let top = parseInt($(el).css('top'));
            $(el).css('left',left + 12 + 'px');
            $(el).css('top',top - 11 + 'px');
            if(left + 12 >= 50){
                clearInterval(timer);
                this.mario_cursor_show = true;
            }
        },30)
    }

    /**
     * 手型提示序列帧
     */
    public marioCursorGif() {
        let mario_cursor = $('.mario_cursor_move');
        let n = 0;
        let timer = setInterval(()=> {
            n++;
            if(n>17) n=0;
            mario_cursor.css('margin-left',-250*n + 'px');
        },30)
    }

    /**
     * 导弹序列帧
     */
    public marioBoomGif() {
        let mario_boom = $('.mario_boom_move');
        let n = 0;
        let timer = setInterval(()=> {
            n++;
            if(n>34) n=0;
            mario_boom.css('margin-left',-200*n + 'px');
        },30)
    }

    /**
     * 导弹运动
     */
    public marioBoomMove() {
        let mario_boom = $('.mario_boom');
        let timer = setInterval(()=> {
            let right = parseInt(mario_boom.css('right'));
            let top = parseInt(mario_boom.css('top'));
            mario_boom.css('right',right + 5 + 'px');
            mario_boom.css('top',top - 1 + 'px');
            if(top - 1 <= 0) {
                mario_boom.css('right','0px');
                mario_boom.css('top','600px');
            }
        },20)
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
     * 切换昼夜
     * @param url
     */
    public changeDayOrNight() {
        let sun_moon = $('#sun_moon');
        this.marioSunMove(sun_moon,()=> {
            this.is_day = !this.is_day;
        })
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

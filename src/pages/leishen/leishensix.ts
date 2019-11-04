import '@/assets/css/animate.min.css';
import '@/assets/less/leishen.less';
import './assets/less/zhuanti.less';
import "babel-polyfill";
import {Vue, Component} from 'vue-property-decorator';
import HeadNav from './components/HeadNav.vue';
import FootNav from './components/FootNav.vue';
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
import Fullpage from 'vue-fullpage.js';
import 'fullpage.js/dist/fullpage.css';

const echarts = require('echarts/lib/echarts');
require('echarts/lib/chart/line');
require('echarts/lib/component/tooltip');
require('echarts/lib/component/title');

Vue.use(Fullpage);
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
class LeishenSix extends Vue {
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
    public tabOne: number = 0;
    public tabTwo: number = 1;
    public myCharts: any = null;
    public dataOne: number = 0;
    public dataTwo: number = 0;

    public Fullpageoptions: object = {
        onLeave: this.onLeave,
        menu: '#menu',
        navigation: true,
        navigationPosition: 'left',
        bigSectionsDestination: 'top',
        controlArrows: true,
        anchors: ['page1', 'page2', 'page3', 'page4', 'page5', 'page6'],
    };

    public created() {
        this.imageHeadUrl = GlobalConfig.getImgBaseUrl();
        this.setBaseUrl(GlobalConfig.getBaseUrl());
        this.getDownloadUrl();
        this.getAd('indexfloat');
    }

    public mounted() {
        this.initEchart();
    }

    public onLeave(origin: any, destination: any) {
        if (destination.index == 1) {
            this.myCharts.clear();
            this.dataTwo = 0;
            this.dataOne = 0;
            this.initEchart();
            this.countBackTime();
            this.changeTabOne(0);
        } else if(destination.index == 3) {
            this.changeTabTwo(0);
            this.playVideo();
        }
    }

    public playVideo() {
        let myVideo = document.getElementById('videoOne');
        //@ts-ignore
        myVideo.play()

    }

    public initEchart() {
        var speed = [];
        var download = [];
        var dataArr = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10];
        for (var i = 0; i <= dataArr.length; i++) {
            var y = 5*(dataArr[i]*(19-dataArr[i]))/6+3;
            speed.push(y);
        }
        for (var j = 0; j <= dataArr.length; j++) {
            var y = dataArr[j]*(22-dataArr[j])+3;
            download.push(y);
        }
        this.myCharts = echarts.init(document.getElementById('mainEcharts'), 'sakura');
        let xAxes = [{
            type: 'category',
            splitLine: {show: false},
            axisLine: {
                lineStyle: {
                    type: 'solid',
                    color: '#6b6297',//左边线的颜色
                    width: '2'//坐标线的宽度
                }
            },
            axisTick: {
                show: false
            },
        }];
        let yAxes = [{
            type: 'value',
            splitLine: {show: false},
            axisLine: {
                lineStyle: {
                    type: 'solid',
                    color: '#6b6297',//左边线的颜色
                    width: '2'//坐标线的宽度
                }
            },
            min: 0,
            max: 150,
            axisTick: {
                show: false
            }
        }];
        const option = {
            textStyle: {
                color: "#9b91c9",
                fontSize: 12,
            },
            xAxis: xAxes,
            yAxis: yAxes,
            series: [
                {
                    name: '下载提升指数',
                    type: 'line',
                    symbol: 'none',
                    data: download,
                    itemStyle: {
                        color: '#ff3998',
                        borderColor: '#ff3998',
                    },
                    lineStyle: {
                        color: "#ff3998",
                        width: 5
                    },
                    smooth: true
                },
                {
                    name: '加速提升指数',
                    type: 'line',
                    symbol: 'none',
                    data: speed,
                    itemStyle: {
                        color: '#37adff',
                        borderColor: '#37adff',
                    },
                    lineStyle: {
                        color: "#37adff",
                        width: 5
                    },
                    smooth: true
                },
            ],
            legend: {
                left: 'left',
                data: ['下载提升指数', '加速提升指数']
            },
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c}'
            },
        };
        this.myCharts.setOption(option);
    }

    public countBackTime() {
        let time = setInterval(() => {
            this.dataOne += 7.5;
            this.dataTwo += 12;
            if (this.dataOne >= 75 || this.dataTwo >= 120) {
                this.dataOne = 75;
                this.dataTwo = 120;
                clearInterval(time)
            }
        }, 120);
    }

    public changeTabOne(index: number) {
        this.tabOne = index;
    }

    public changeTabTwo(index: number) {
        this.tabTwo = index;
    }

    /**
     * 屏幕宽度小于1200跳转移动端首页
     */
    public checkMobile() {
        window.onresize = function () {
            let clientWidth = document.documentElement.clientWidth;
            let mUrl = GlobalConfig.getMobWebBaseUrl();
            if (clientWidth < 1200) window.location.href = mUrl;
        }
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

new LeishenSix({
    i18n
}).$mount('#app');

<template>
    <div style="color: #000;">
        <div class="package_slideshow_box" v-if="webParam.region_code == 1">
            <!--轮播图-->
            <!--活动图多于1个时显示-->
            <div class="components_cell" style="margin-bottom: 0;" :style="{width:carouselwidth}" v-if="(activityList.length>1)">
                <el-carousel arrow='always' >
                    <!--首冲特惠-->
                    <el-carousel-item style="width: 100%;height:100%" v-if="userinfo.is_pay_user == 0 && shouchongbanner">
                        <img :src="shouchongbanner" class="img_filter cursor" style="width: 1920px;height: 394px;position: relative;left: 50%;margin-left: -960px;">
                    </el-carousel-item>
                    <el-carousel-item style="width: 100%;height:100%" v-for="(item,index) in activityList" :key="index" v-if="item.is_show">
                        <img :src="item.imgUrl" class="img_filter cursor" style="width: 3000px;height: 394px;position: relative;left: 50%;margin-left: -1500px;" @click="goActivityDetail(item)">
                    </el-carousel-item>
                </el-carousel>
            </div>
            <!--活动图只有一个且无法参与首冲-->
            <div v-if="(activityList.length==1) && userinfo.is_pay_user == 1" class="components_cell" :style="{width:carouselwidth}">
                <img :src="activityList[0].imgUrl" class="cursor" alt="" style="width: 3000px;height: 394px;position: relative;left: 50%;margin-left: -1500px;" @click="goActivityDetail(activityList[0])">
            </div>
            <!--活动图只有一个且可以参与首冲-->
            <div v-if="(activityList.length==1) && userinfo.is_pay_user == 0" class="components_cell" :style="{width:carouselwidth}">
                <el-carousel arrow='always' >
                    <el-carousel-item style="width: 100%;height:100%" v-for="(item,index) in activityList" :key="index" v-if="item.is_show">
                        <img :src="item.imgUrl" class="img_filter cursor" style="width: 3000px;height: 394px;position: relative;left: 50%;margin-left: -1500px;" @click="goActivityDetail(item)">
                    </el-carousel-item>
                    <el-carousel-item style="width: 100%;height:100%" v-if="shouchongbanner">
                        <img :src="shouchongbanner" class="img_filter cursor" style="width: 1920px;height: 394px;position: relative;left: 50%;margin-left: -960px;">
                    </el-carousel-item>
                </el-carousel>
            </div>
            <!--无活动且无法参与首冲-->
            <div v-if="default_banner_show && userinfo.is_pay_user == 1" class="components_cell" :style="{width:carouselwidth}">
                <img src="../images/recharge_banner_default.png" alt="" style="width: 3000px;height: 394px;position: relative;left: 50%;margin-left: -1500px;">
            </div>
            <!--无活动且可以参与首冲-->
            <div v-if="default_banner_show && userinfo.is_pay_user == 0 && shouchongbanner" class="components_cell" :style="{width:carouselwidth}">
                <img :src="shouchongbanner" class="img_filter cursor" style="width: 1920px;height: 394px;position: relative;left: 50%;margin-left: -960px;">
            </div>
        </div>
        <div v-if="webParam.region_code == 0">
            <a href="/brandnew.html" class="img_filter">
                <img class="img_filter cursor" src="../images/recharge_banner_4.png" style="width: 3000px;height: 394px;position: relative;left: 50%;margin-left: -1500px;" alt>
            </a>
        </div>
    </div>
</template>

<script lang="ts">
    import {Vue, Component, Prop} from "vue-property-decorator";
    import {Carousel, CarouselItem} from 'element-ui';
    import NewsConfigModel,{ NewModel,ActivityRequestModel,NewRequestModel, NewsModel, ActivityModel, ActivityRequestPictureModel, ActivityPictureModel } from '@/ts/models/NewsModel';
    import {UserToken, UserInfo} from '@/ts/models/UserModel';
    import HttpClient from '@/ts/net/HttpClient';
    import {TdappModel} from '@/ts/models/TdappModel';
    import {IdataModel} from '@/ts/models/IdataModel';
    import GlobalConfig from '..//global.config';
    import LocalStorageUtil from '@/ts/utils/LocalStorageUtil';
    import AppParamModel from "@/ts/models/WebModel";
    import JumpWebUtil from '@/ts/utils/JumpWebUtil';
    import Util from "../../../ts/utils/Util";

    @Component({
        components: {
            'el-carousel': Carousel,
            'el-carousel-item': CarouselItem
        }
    })
    export default class UserCenter extends Vue {
        @Prop() public userinfo: UserInfo;
        @Prop() public shouchongbanner: string;
        @Prop(String) carouselwidth !: string;
        public webParam = AppParamModel.getInstace(); // 浏览器参数
        public hotNewsList: Array<NewModel> = [];
        public lastNewsList: Array<NewModel> = [];
        public notifyList: Array<NewModel> = [];
        public activityList: Array<ActivityPictureModel> = [];
        public imageHeadUrl: string = '';
        public token: UserToken = new UserToken();
        public windowsDownloadUrl: string = '';
        public macDownloadUrl: string = '';
        public checkBtn: number = 0;
        public browserTipShow: boolean = false;
        public chooseBtn: number = 0;   //按钮移动默认选中
        public bannerImg: string = ''; //活动banner图片
        public default_banner_show: boolean = false;

        //////////公共参数
        public http = new HttpClient();
        public backData: IdataModel<any> | undefined;

        //////////END

        public created() {
            this.setBaseUrl(GlobalConfig.getBaseUrl());
            this.imageHeadUrl = GlobalConfig.getImgBaseUrl();
            this.getActivityInfo();
            this.token = LocalStorageUtil.getUserToken();
            this.checkBrowserVersion();
        }
        /**
         * 改变选中按钮
         */
        public changeCheckBtn(index: number) {
            this.chooseBtn = index;
        }

        /**
         * 老用户绑定账号
         */
        public bindAccount(){
            this.$emit('bindaccount')
        }

        /**
         * 跳转活动详情
         */
        public goActivityDetail(item: any) {
            if (item.url_type == 1) {
                window.open(item.url);
            }
        }

        /**
         * 跳转公告详情
         */
        public goNotifyDetail(id: number) {
            JumpWebUtil.userGotoWeb(GlobalConfig.getWebBaseUrl(), JumpWebUtil.HTML_NAME_DETAILS_NOTICE + id + '.html');
        }

        /**
         * 检测用户浏览器版本
         */
        public checkBrowserVersion() {
            let browserInfo = new TdappModel();
            browserInfo.getBrowser();
            if (browserInfo.browser_version == 9) {
                this.browserTipShow = true;
            }
        }

        /**
         * 关闭浏览器版本过低提示
         */
        public closeBrowserTip() {
            this.browserTipShow = false;
        }

        /**
         * 设置根路径
         * @param url
         */
        public setBaseUrl(url: string): void {
            this.http.setBaseUrl(url);
        }


        /**
         * 跳转page页
         */
        public changePage(index: number){
            this.$emit('changepage',index)
        }

        /**
         * 获取公告列表
         */
        public async getNotifyList(page: number = 1) {
            let url = HttpClient.URL_NEWS;
            let param = new NewRequestModel();
            param.page = page;
            param.size = 6;
            param.support_type = 1;
            param.region_code = this.webParam.region_code;
            this.backData = await this.http.get<Array<NewModel>>(url, param);
            if (this.backData.code == HttpClient.HTTP_SUCCESS_NET_CODE) {
                this.notifyList = this.backData.data.list;
            }
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
                this.activityList = this.backData.data as ActivityPictureModel[];
                if(this.activityList.length == 0) {
                    this.default_banner_show = true;
                }
                for(let i=0;i<this.activityList.length;i++){
                    let imgUrl;
                    let imgUrls = this.activityList[i].imgs.filter((item)=>{
                        return item.key == 5;
                    });
                    if(imgUrls.length > 0) {
                        imgUrl = imgUrls[0].img_url;
                    }
                    if(imgUrl){
                        this.activityList[i]['imgUrl'] = this.imageHeadUrl+ imgUrl;
                    }else{
                        this.activityList[i]['imgUrl'] = './images/defaut_acyivity.png';
                    }
                    let start_time = new Date(Util.formateTime(this.activityList[i].start_time)).getTime();
                    let end_time = new Date(Util.formateTime(this.activityList[i].end_time)).getTime();
                    let now_time = new Date(Util.formateTime(this.activityList[i].now_time)).getTime();
                    if(start_time < now_time && now_time  < end_time) {
                        this.activityList[i]['is_show'] = true;
                    }else {
                        this.activityList[i]['is_show'] = false;
                    }
                }
            }
        }
    }
</script>

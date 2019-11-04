<template>
    <div class="foot">
        <div class="foot_content">
            <!--foot-one-->
            <div class="row-fluid pos_foot_txt1">
                <div class="cursor span3">
                    <ul class="">
                        <li class="h5_font_no_hover" style="margin-bottom: 30px;">
                            {{$t("nav.navlist32")}}
                        </li>
                        <li class="foot_downbox clear_fix">
                            <div class="f_left foot_downbox_cell">
                                <a :href="windowsDownloadUrl">
                                    <i class="iconfont icon-windows"></i>
                                    <p style="font-size: 12px;">Windows</p>
                                </a>
                            </div>
                            <div class="f_left foot_downbox_cell mar_l30">
                                <el-tooltip class="item" effect="dark" placement="top">
                                    <div slot="content">
                                        <p>{{$t("index.a28")}}</p>
                                    </div>
                                    <div>
                                        <i class="iconfont icon-mac"></i>
                                        <p style="font-size: 12px;">Mac</p>
                                    </div>
                                </el-tooltip>
                            </div>
                            <div class="f_left foot_downbox_cell mar_l40">
                                <el-tooltip class="item" effect="dark" placement="top">
                                    <div slot="content">
                                        <img style="width: 100px;height: 100px;" src="../images/code_0_cn.png" alt='雷神加速器' v-if="this.webParam.region_code == 0 && this.webParam.language == 'zh_CN'">
                                        <img style="width: 100px;height: 100px;" src="../images/code_1_cn.png" alt='雷神加速器' v-if="this.webParam.region_code == 1 && this.webParam.language == 'zh_CN'">
                                        <img style="width: 100px;height: 100px;" src="../images/code_0_en.png" alt='雷神加速器' v-if="this.webParam.region_code == 0 && this.webParam.language == 'en'">
                                        <img style="width: 100px;height: 100px;" src="../images/code_1_en.png" alt='雷神加速器' v-if="this.webParam.region_code == 1 && this.webParam.language == 'en'">
                                    </div>
                                    <div>
                                        <i class="iconfont icon-iOS"></i>
                                        <p style="font-size: 12px;">iOS</p>
                                    </div>
                                </el-tooltip>
                            </div>
                            <div class="f_left foot_downbox_cell mar_l30">
                                <el-tooltip class="item" effect="dark" placement="top">
                                    <div slot="content">
                                        <img style="width: 100px;height: 100px;" src="../images/code_0_cn.png" alt='雷神加速器' v-if="this.webParam.region_code == 0 && this.webParam.language == 'zh_CN'">
                                        <img style="width: 100px;height: 100px;" src="../images/code_1_cn.png" alt='雷神加速器' v-if="this.webParam.region_code == 1 && this.webParam.language == 'zh_CN'">
                                        <img style="width: 100px;height: 100px;" src="../images/code_0_en.png" alt='雷神加速器' v-if="this.webParam.region_code == 0 && this.webParam.language == 'en'">
                                        <img style="width: 100px;height: 100px;" src="../images/code_1_en.png" alt='雷神加速器' v-if="this.webParam.region_code == 1 && this.webParam.language == 'en'">
                                    </div>
                                    <div>
                                        <i class="iconfont icon-anzhuo"></i>
                                        <p style="font-size: 12px;">Android</p>
                                    </div>
                                </el-tooltip>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="span2">
                    <ul class="flex_column_around">
                        <li>
                            <a class="h5_font_no_hover pos_foot_txt0">{{$t("nav.navlist10")}}</a>
                        </li>
                        <li>
                            <a class="list_font pos_foot_txt3" @click="goRecharge">{{$t("nav.navlist11")}}</a>
                        </li>
                        <li>
                            <a class="list_font pos_foot_txt3" :href="page_activity">{{$t("nav.navlist12")}}</a>
                        </li>
                    </ul>
                </div>
                <div class="span2">
                    <ul class="flex_column_around">
                        <li>
                            <a class="h5_font_no_hover pos_foot_txt0">{{$t("nav.navlist13")}}</a>
                        </li>
                        <li>
                            <a class="list_font pos_foot_txt3" :href="page_help">{{$t("nav.navlist14")}}</a>
                        </li>
                        <li>
                            <a class="list_font pos_foot_txt3" :href="page_userserver">{{$t("nav.navlist15")}}</a>
                        </li>
                    </ul>
                </div>
                <div class="span2">
                    <ul class="flex_column_around">
                        <li>
                            <a class="h5_font_no_hover pos_foot_txt0">{{$t("nav.navlist16")}}</a>
                        </li>
                        <li>
                            <el-tooltip class="item" effect="dark" placement="left">
                                <div slot="content">
                                    <img src="../images/weixin.png" alt="">
                                </div>
                                <a class="list_font pos_foot_txt3">{{$t("nav.navlist17")}}</a>
                            </el-tooltip>
                        </li>
                        <li>
                            <el-tooltip class="item" effect="dark" placement="left">
                                <div slot="content">
                                    <img src="../images/weibo.png" alt="">
                                </div>
                                <a class="list_font pos_foot_txt3" href="https://weibo.com/p/1006066443936086?is_hot=1" target="_blank">
                                {{$t("nav.navlist18")}}</a>
                            </el-tooltip>
                        </li>
                    </ul>
                </div>
                <div class="span3 f_right">
                    <ul v-if="webParam.region_code == 1" class="flex_column_center">
                        <li class="kefu_box newmodal">
                            <img src="../images/qq_kfu@2x.png" alt="" width="16" height="16">
                            <a>{{$t("nav.navlist19")}}</a>
                        </li>
                        <!---->
                        <!--<li class="web_phone_number pos_banner_txt0">-->
                            <!--021-80270833-->
                        <!--</li>-->
                        <li style="margin-top: 10px;" class="product_font">
                            {{$t("nav.navlist20")}}
                        </li>
                    </ul>
                    <div v-if="webParam.region_code == 0" class="flex_column_center">
                        <img src="../images/email_icon.png" alt="" width="28">
                        <p class="email_font pos_warm_txt">service@nn.com</p>
                        <p class="connect_email_font">{{$t("nav.navlist26")}}</p>
                    </div>
                </div>
            </div>
            <div style="margin: 28px auto 13px;" v-if="webParam.region_code==1&&webParam.language=='zh_CN'">
                <div class="solid_line"></div>
                <div class="friendLinkBox">
                    <span class="friendLink_tit">友情链接：</span>
                    <ul class="friendLink">
                        <li v-for="item in friendLinks" :key="item.id" class="friendLink_cell">
                            <a :href="item.url" target="_blank" >{{item.title}}</a>
                        </li>
                    </ul>
                </div>
                <div class="solid_line"></div>
            </div>
            <div class="solid_line" v-else></div>
            <!--foot-two-->
            <div class="clear_fix pos_foot_txt2">
                <div class="f_left">
                    <ul>
                        <!--<li class="pos_foot_txt3">-->
                            <!--<span class="h5_font12_white">{{$t("nav.navlist21")}}</span>-->
                            <!--<span class="product_font">{{$t("nav.navlist22")}}</span>-->
                        <!--</li>-->
                        <li class="pos_foot_txt3">
                            <p class="product_font">{{$t("nav.navlist23")}}
                            </p>
                        </li>
                        <li>
                            <p class="product_font">{{$t("nav.navlist24")}}</p>
                        </li>
                    </ul>
                </div>
                <div class="f_right">
                    <ul class="clear_fix">
                        <li class="pos_foot_img f_left">
                            <a id="_pingansec_bottomimagesmall_brand"
                               href="http://si.trustutn.org/info?sn=544171218031154034526&certType=1">
                                <img src="https://v.trustutn.org/images/cert/brand_bottom_small.jpg">
                            </a>
                        </li>
                        <li class="pos_foot_img f_left">
                            <a
                                key="5a15257a0c909623245ac96b"
                                href="http://www.cn-ecusc.org.cn/cert/aqkx/site/?site=www.leigod.com">
                                <img src="http://static.anquan.org/static/outer/image/aqkx_124x47.png?id=www.leigod.com?t=79">
                            </a>
                        </li>
                        <li class="pos_foot_img f_left">
                            <a
                                key="5a15257a0c909623245ac96b"
                                logo_size="124x47"
                                logo_type="business"
                                href="https://v.pinpaibao.com.cn/authenticate/cert/?site=www.leigod.com&at=business">
                                <img src="http://static.anquan.org/static/outer/image/hy_124x47.png?id=www.leigod.com?t=79">
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">

    import {Vue, Component} from "vue-property-decorator";
    import { Tooltip } from "element-ui";
    import WebParamModel from '@/ts/models/WebModel';
    import Util from "@/ts/utils/Util";
    import {AdModel} from "@/ts/models/UserModel";
    import ConfigUtil from "@/ts/utils/ConfigUtil";
    import HttpClient from "@/ts/net/HttpClient";
    import GlobalConfig from '../global.config';
    @Component({
        components:{
            "el-tooltip": Tooltip
        }
    })
    export default class FootNav extends Vue {
        public webParam = WebParamModel.getInstace(Util.REGION_CODE_1,Util.ZH_CN);
        public page_activity = Util.getOrigin() + '/activity.html' + window.location.search;
        public page_help = Util.getOrigin() + '/help.html' + window.location.search;
        public page_userserver = Util.getOrigin() + '/userserver.html' + window.location.search;
        public windowsDownloadUrl: string = ""; //windows客户端下载配置
        public macDownloadUrl: string = ""; //mac客户端下载配置
        public friendLinks:Array <AdModel> =[]
        public http = new HttpClient();
        created(){
            this.setBaseUrl(GlobalConfig.getBaseUrl());
            this.getDownloadUrl();
            this.getFriendLinks()
        }
        public setBaseUrl(url: string): void {
            this.http.setBaseUrl(url);
        }

        /**
         * 获取友情链接的列表
         * @param url
         */
       async getFriendLinks(){
            const url = HttpClient.URL_AD;
            const code = this.webParam.region_code
            const param = {
                group: 'youqing',
                region_codes: code
            };
            let data = await this.http.get<AdModel>(url, param);
            if (data.code == HttpClient.HTTP_SUCCESS_NET_CODE) {
                this.friendLinks=data.data;
            }
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

        /**
         * 跳转套餐页
         */
        public goRecharge() {
            window.location.href = Util.getOrigin() + '/leigod/recharge.html' + window.location.search;
        }
    }
</script>

<template>
    <div class="foot_nav clear_fix">
        <div class="f_left mar_r90">
            <!--            商务合作-->
            <a class="busiess_corp_box mar_r15"></a>
            <a>商务合作 <br> <span class="foot_base_font opacity_07">合作邮箱：busiess@bohe.com</span></a><br>
            <!--            链接-->
            <div class="clear_fix mar_t30">
                <div class="f_left mar_r50">
                    <p class="foot_title_font">关于我们</p>
                    <p class="mar_t20"><a class="opacity_07">关于BOHE</a></p>
                    <p class="mar_t10"><a class="opacity_07">加入我们</a></p>
                </div>
                <div class="f_left">|</div>
                <div class="f_left mar_l50">
                    <p class="foot_title_font">网站导航</p>
                    <a class="mar_t20"><img src="../images2.0/nnn_site_logo.png" alt=""></a><br>
                    <a class="mar_t15"><img src="../images2.0/nn_yuewan_logo.png" alt=""></a>
                </div>
            </div>
            <p class="mar_t50">鄂ICP备18023477号@武汉薄荷科技有限公司</p>
        </div>
        <div class="f_left text_center">
            <div class="f_left mar_r50">
                <img class="mar_b20" src="../images2.0/bohe_wechat.png" alt="" width="100px">
                <p class="foot_base_font">BOHE 微信公众号</p>
            </div>
            <div class="f_left">
                <img class="mar_b20" src="../images2.0/bohe_weibo.png" alt="" width="100px">
                <p class="foot_base_font">BOHE 新浪微博</p>
            </div>
        </div>
        <div class="f_right">
            <p class="foot_sub_title">多端支持 免费加速</p>
            <div class="clear_fix mar_t30">
                <div class="f_left product_down_list">
                    <img src="../images2.0/bh_windows_nor.png" alt="">
                    <p class="mar_t15 product_down_font">PC</p>
                </div>
                <div class="f_left product_down_list">
                    <img src="../images2.0/bh_mac_nor.png" alt="">
                    <p class="mar_t15 product_down_font">MAC</p>
                </div>
                <div class="f_left product_down_list">
                    <img src="../images2.0/bh_ipone_nor.png" alt="">
                    <p class="mar_t15 product_down_font">iPhone/iPad</p>
                </div>
                <div class="f_left product_down_list">
                    <img src="../images2.0/bh_android_nor.png" alt="">
                    <p class="mar_t15 product_down_font">Android</p>
                </div>
            </div>
            <div class="text_right mar_t100">
                <p>联系电话: 027-86951781</p>
                <p class="mar_t5">详细地址: 湖北省武汉市洪山区花山大道软件新城A2栋4楼</p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import DownloadBox from "@/pages/bohe/components/DownloadBox.vue";
    import {Tooltip} from "element-ui";
    import JumpWebUtil from "@/ts/utils/JumpWebUtil";
    import GlobalConfig from "@/pages/bohe/global.config";
    import {IdataModel} from "@/ts/models/IdataModel";
    import WebParamModel from "@/ts/models/WebModel";
    import ConfigUtil from "@/ts/utils/ConfigUtil";
    import UchatUtil, {UchatModels} from "@/ts/utils/UchatUtil";

    @Component({
        components: {
            "download-box": DownloadBox,
            "el-tooltip": Tooltip
        }
    })
    export default class FootNav extends Vue {
        public webParam = WebParamModel.getInstace(); // 浏览器参数
        public backData: IdataModel<any> | undefined;
        public windowsDownloadUrl: string = "";
        public macDownloadUrl: string = "";

        public created() {
            this.getDownloadUrl();
        }

        /**
         * 获取下载url
         * @param url
         */
        public async getDownloadUrl() {
            const jsonConfig = await ConfigUtil.getInstance().download(true);
            const downConfig = jsonConfig.bohe.down_platform[this.webParam.from];
            this.windowsDownloadUrl = downConfig.windows.download_url;
            this.macDownloadUrl = downConfig.mac.download_url;
            this.$emit("ondownloadconfig", jsonConfig);
        }

        /**
         * 跳转套餐页
         */
        public goRecharge() {
            JumpWebUtil.backRecharge();
        }

        /**
         * 跳转用户协议
         */
        public goAgreement() {
            JumpWebUtil.backAgreement();
        }

        /**
         * 下载windows客户端
         */
        public downloadWindowsClient() {
            window.location.href = this.windowsDownloadUrl;
            this.$emit("download");
        }

        /**
         * 跳转公告页
         */
        public goNotify() {
            JumpWebUtil.backNotice();
        }

        /**
         * 跳转资讯页
         */
        public goNews() {
            JumpWebUtil.backNews();
        }

        /**
         * 跳转关于薄荷页
         */
        public goAbout() {
            JumpWebUtil.backAbout();
        }

        /**
         * 聊天
         */
        public onUchat() {
            const chat = new UchatUtil();
            const mod = new UchatModels();
            mod.imnumber = GlobalConfig.UC_IM_Number;
            mod.box = true;
            chat.pop(mod);
            chat.ready(null);
        }
    }
</script>


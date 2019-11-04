<template>
    <div class="head">
        <div class="user_head_content flex_sbe">
            <div class="flex_row_center" style="justify-content: left;width:310px;">
                <img src="../images/head_logo.png" alt="" @click="goHome">
                <span class="webnav_font pos_line_member" style="color: #7e7e7e;">|</span>
                <span style="font-size: 16px;color:#fff;">{{$t("nav.navlist0")}}</span>
            </div>
            <ul class="user_webnav_box" style="width: calc(100% - 300px)">
                <li class="webnav_font head_menu" @click="goHome">{{$t("nav.navlist1")}}</li>
                <li class="webnav_font head_menu"  @click="goRecharge">{{$t("user.b65")}}</li>
                <li class="webnav_font head_menu">
                    <el-dropdown trigger="hover" placement="bottom">
                    <span class="cursor" style="color:#fff;">
                        <span style="font-size:16px;">
                            <a class="dropdown-item__alink webnav_font">{{$t("nav.navlist36")}}</a>
                        </span>
                    </span>
                    <el-dropdown-menu class="llz_header-recharge" slot="dropdown">
                        <el-dropdown-item>
                            <a @click="goGameSupport"  class="dropdown-item__alink">{{$t("nav.navlist30")}}</a>
                        </el-dropdown-item>
                        <el-dropdown-item>
                            <a @click="goGameNews"  class="dropdown-item__alink">{{$t("nav.navlist31")}}</a>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                    </el-dropdown>
                </li>
                <li class="webnav_font head_menu"  @click="goWangba">{{$t("nav.navlist2")}}</li>
                <li class="webnav_font head_menu"  @click="goActivity">{{$t("nav.navlist12")}}</li>

                <li class="webnav_font head_menu">
                    <el-dropdown trigger="hover" placement="bottom">
							<span class="cursor" style="color:#fff;font-size: 16px;">
								<span> <a class="webnav_font">{{$t("help.g9")}} </a></span>
							</span>
                        <el-dropdown-menu slot="dropdown" class="llz_header-recharge">
                            <el-dropdown-item>
<!--                                常见问题-->
                                <a @click="goHelp" class="dropdown-item__alink">{{$t("nav.navlist6_0")}} </a>
                            </el-dropdown-item>
                            <el-dropdown-item>
<!--                                关于我们-->
                                <a @click="goAbout" class="dropdown-item__alink">{{$t("nav.navlist33")}} </a>
                            </el-dropdown-item>
                            <el-dropdown-item>
<!--                                商务合作-->
                                <a @click="goBusiness" class="dropdown-item__alink">{{$t("nav.navlist34")}} </a>
                            </el-dropdown-item>
                            <el-dropdown-item>
<!--                                加入我们-->
                                <a @click="goJoin" class="dropdown-item__alink">{{$t("nav.navlist35")}} </a>
                            </el-dropdown-item>
                            <el-dropdown-item>
<!--                                官网公告-->
                                <a @click="goNotice" class="dropdown-item__alink">{{$t("nav.navlist4")}} </a>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </li>
                <li class="webnav_font head_lang">
                    <el-dropdown trigger="hover" @command="onSelectLang" placement="bottom">
							<span class="cursor" style="color:#fff;font-size: 16px;">
								<span v-if="seleteCode=='en'"><img src="../images/usaFlag.png" alt=""></span>
                                <span v-else=""><img src="../images/chinaFlag.png" alt=""></span>
							</span>
                        <el-dropdown-menu slot="dropdown" class="llz_header-recharge llz_header-lang">
                            <el-dropdown-item command="zh_CN">
                                <img src="../images/chinaFlag.png" alt="">
                                <span class="dropdown-item__alink">中文 </span>
                            </el-dropdown-item>
                            <el-dropdown-item command="en">
                                <img src="../images/usaFlag.png" alt="">
                                <span class="dropdown-item__alink">EN</span>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </li>
                <li class="webnav_font head_menu">
                    <el-dropdown :hide-on-click="false" placement="bottom" trigger="hover" @command="handleCommand">
                        <div>
                            <img :src="avatar" alt="" style="height:41px;border-radius:50%;">
                        </div>
                        <el-dropdown-menu slot="dropdown" class="llz_header-recharge">
                            <el-dropdown-item command="logout">
                                <a class="dropdown-item__alink">{{$t("user.b75")}}</a>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </li>
            </ul>
        </div>
    </div>
</template>

<script lang="ts">
    import HeadProxy from "@/ts/proxy/HeadProxy";
    import {Vue, Component} from "vue-property-decorator";
    import LocalStorageUtil from "@/ts/utils/LocalStorageUtil";
    import {
        Dropdown,
        DropdownItem,
        DropdownMenu,
        Option,
        Select
    } from "element-ui";
    import JumpWebUtil from "../../../ts/utils/JumpWebUtil";
    import {LsLanguage} from '@/pages/leishen_user/util/LsLanguage';
    import GlobalConfig from "../global.config";
    import Util from "@/ts/utils/Util";
    @Component({
        components: {
            "el-select": Select,
            "el-option": Option,
            "el-dropdown": Dropdown,
            "el-dropdown-menu": DropdownMenu,
            "el-dropdown-item": DropdownItem
        }
    })
    export default class HeadNavTwo extends HeadProxy {
        public nickname:string=''
        public avatar:string=''
        /**
         *初始化
         */
        public created() {
            /******** 注意 *******/
            // 注意：copy代码的时候这个类一定要改成对应项目的语言配置类
            this.lanConfig = LsLanguage.getInstance();
            /******** end *******/
            this.setBaseUrl(GlobalConfig.getBaseUrl());
            this.getPageIndex();
            this.init();
        }

        /**
         * 选择语言
         */
        public onSelectLang(value: string) {
            if(value!==LocalStorageUtil.getLanguage()){
                this.onChangeLanguage(value);
            }
        }
        /**
         * 更新头部的用户信息
         */
        updateHeader(){
            this.checkLogin()
            this.nickname=this.userInfo.nickname
            this.avatar=this.userInfo.avatar_new||this.userInfo.avatar
        }
        /**
         * 选择页面
         */
        public onSelectPage(value: string) {
            if(value=='xiazai.html'){
                window.open(GlobalConfig.goTodownUrl(),'_blank')
            }else{
                JumpWebUtil.userGotoWeb(GlobalConfig.getWebBaseUrl(), value);
            }
        }
        /**
         * 跳转到网吧版雷神
         */
        goWangba() {
            window.open(GlobalConfig.getBarUrl(), '_blank')
        }
        goRecharge(){
            this.$emit('gorecharge')
        }
        /**
         *处理退出登陆
         */
        handleCommand(command){
            if(command=='logout'){
                this.$emit('loginout')
            }
        }
        /**
         * 切换语言
         */
        public onChangeLanguage(ln: string = "") {
            this.onSetLanguage(ln);
            // 抛出自定义事件
            this.$emit("changelanguage", this.seleteLng.code);
        }

        /**
         * 跳转首页
         */
        public goHome() {
            this.userGotoWeb(GlobalConfig.getWebBaseUrl(), JumpWebUtil.HTML_NAME_INDEX);
        }

        /**
         * 跳转帮助
         */
        public goHelp() {
            this.userGotoWeb(GlobalConfig.getWebBaseUrl(), JumpWebUtil.HTML_NAME_HELP);
        }
        /**
         * 跳转游戏支持
         */
        public goGameSupport() {
            this.userGotoWeb(GlobalConfig.getWebBaseUrl()+'/leigod', JumpWebUtil.HTML_NAME_SUPPORT);
        }
        /**
         * 跳转游戏资讯
         */
        public goGameNews() {
            this.userGotoWeb(GlobalConfig.getWebBaseUrl(), JumpWebUtil.HTML_NAME_NEWS);
        }
        /**
         * 跳转关于我们
         */
        public goAbout() {
            this.userGotoWeb(GlobalConfig.getWebBaseUrl(), JumpWebUtil.HTML_NAME_ABOUT);
        }
        /**
         * 跳转商务合作
         */
        public goBusiness() {
            this.userGotoWeb(GlobalConfig.getWebBaseUrl(), JumpWebUtil.HTML_NAME_BUSINESS);
        }
        /**
         * 跳转加入我们
         */
        public goJoin() {
            this.userGotoWeb(GlobalConfig.getWebBaseUrl(), JumpWebUtil.HTML_NAME_JOIN);
        }
        /**
         * 跳转活动专区
         */
        public goActivity() {
            this.userGotoWeb(GlobalConfig.getWebBaseUrl(), JumpWebUtil.HTML_NAME_ACTIVITY);
        }
        /**
         * 跳转官网公告
         */
        public goNotice() {
            this.userGotoWeb(GlobalConfig.getWebBaseUrl(), JumpWebUtil.HTML_NAME_NOTIFY);
        }
        public userGotoWeb(webHost: string, htmlName: string, param: string = '') {
            let host=webHost
            const region_code = LocalStorageUtil.getRegionCodes();
            switch (region_code) {
                case Util.REGION_CODE_0:
                    host = webHost + '/intl';
                    break;
                case Util.REGION_CODE_1:
                    break;
            }
            //
            const language = LocalStorageUtil.getLanguage();
            switch (language) {
                case Util.EN:
                    host = webHost + '/en';
                    break;
                case Util.ZH_CN:
                    break;
            }
            let url = host + '/' + htmlName;
            let search = window.location.search;
            search = '';
            if (search == null || search == '') {
                if (param != '') url = url + '?' + param;
            } else {
                url = url + search;
                if (param != '') url = url + '&' + param;
            }
            window.location.href = url;
        }
    }
</script>


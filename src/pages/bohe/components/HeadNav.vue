<template>
    <div class="content_wrap" style="overflow: initial;">
            <div class="row-fluid">
                <div class="span2">
                    <img class="head_nav_logo" src="../images2.0/bohe_logo.png" alt="">
                </div>
                <div class="span6">
                    <div class="clear_fix">
                        <div class="head_nav_item" :class="{'active' : pageName == 'index.html'}">
                            <a class="head_nav_font" @click="goHome">首页</a>
                        </div>
                        <div class="head_nav_item" :class="{'active' : pageName == 'ganmesupport.html'}">
                            <span class="head_nav_space">|</span>
                            <a class="head_nav_font" @click="goHome">游戏支持</a>
                        </div>
                        <div class="head_nav_item" :class="{'active' : pageName == 'activity.html'}">
                            <span class="head_nav_space">|</span>
                            <a class="head_nav_font" @click="goActivity">热门活动</a>
                        </div>
                        <div class="head_nav_item" :class="{'active' : pageName == 'notify.html'}">
                            <span class="head_nav_space">|</span>
                            <a class="head_nav_font" @click="goNotify">官方公告</a>
                        </div>
                        <div class="head_nav_item" :class="{'active' : pageName == 'about.html'}">
                            <span class="head_nav_space">|</span>
                            <a class="head_nav_font" @click="goAbout">关于BOHE</a>
                        </div>
                    </div>
                </div>
                <div class="span4" style="float: right;">
                    <div class="lang_select_box f_left">
                        <img src="" alt="">
                        <span>English</span>
                        <img src="../images2.0/select_cart.png" class="select_cart">
                        <div class="dropdown-menu">
                            <ul>
                                <li>
                                    <a class="lang_select_font">中文</a>
                                    <a class="lang_select_font">English</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="f_left">
                        <a class="login_kong_btn">登录</a>
                        <a class="login_btn">注册</a>
                    </div>
                </div>
            </div>
        </div>
</template>

<script lang="ts">
    import {Component} from "vue-property-decorator";
    import {Dropdown, DropdownItem, DropdownMenu, Option, Select} from "element-ui";
    import GlobalConfig from "../global.config";
    import JumpWebUtil from "@/ts/utils/JumpWebUtil";
    import WebParamModel from '@/ts/models/WebModel';
    import HeadProxy from "../../../ts/proxy/HeadProxy";
    import "babel-polyfill";
    import {LanguageConfig} from "../../../ts/utils/Language";
    import LocalStorageUtil from "../../../ts/utils/LocalStorageUtil";
    import UchatUtil, {UchatModels} from "../../../ts/utils/UchatUtil";

    @Component({
        components: {
            "el-select": Select,
            "el-option": Option,
            "el-dropdown": Dropdown,
            "el-dropdown-menu": DropdownMenu,
            "el-dropdown-item": DropdownItem
        }
    })
    export default class HeadNav extends HeadProxy {

        public webParam = WebParamModel.getInstace(); // 浏览器参数
        public region_code = 0;
        public gw_url: string = '';

        /**
         *初始化
         */
        public created() {
            this.region_code = LocalStorageUtil.getRegionCodes();
            /******** 注意 *******/
            // 注意：copy代码的时候这个类一定要改成对应项目的语言配置类
            this.lanConfig = LanguageConfig.getInstance();
            /******** end *******/
            this.setBaseUrl(GlobalConfig.getBaseUrl());
            this.getPageIndex();
            this.init();
            if(this.seleteCode!=LocalStorageUtil.getLanguage()){
                this.onChangeLanguage(this.seleteCode)
            }
             this.$emit("changelanguage", this.seleteLng.code);
        }
        /**
         * 选择语言
         */
        public onSelectLang(value: string) {
            this.onChangeLanguage(value);
        }

        /**
         * 打开登录
         */
        public gotoLoginIn() {
            JumpWebUtil.backLogin();
            // JumpWebUtil.webGotoUser(GlobalConfig.getUserBaseUrl(), JumpWebUtil.HTML_NAME_LOGIN);
        }

        /**
         * 打开注册
         */
        public gotoRegister() {
            JumpWebUtil.backRegister();
            // JumpWebUtil.webGotoUser(GlobalConfig.getUserBaseUrl(), JumpWebUtil.HTML_NAME_REGISTER);
        }

        /**
         * 个人中心
         */
        public gotouserCentre() {
            JumpWebUtil.backUser();
            // JumpWebUtil.webGotoUser(GlobalConfig.getUserBaseUrl(), JumpWebUtil.HTML_NAME_USER);
        }

        /**
         * 跳转首页
         */
        public goHome() {
            JumpWebUtil.backHome();
        }

        /**
         * 跳转套餐页
         */
        public goRecharge() {
            JumpWebUtil.backRecharge();
        }

        /**
         * 跳转公告页
         */
        public goNotify() {
            JumpWebUtil.backNotice();
        }

        /**
         * 跳转公告页
         */
        public goActivity() {
            JumpWebUtil.backActivity();
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
         * 切换语言
         */
        public onChangeLanguage(ln: string = "") {
            this.onSetLanguage(ln);
            // 抛出自定义事件
            this.$emit("changelanguage", this.seleteLng.code);
        }

        /**
         * 点击用户头像菜单
         */
        public onClickAvatarHand(command: string) {
            switch (command) {
                case "userCentre":
                    //个人中心
                    this.gotouserCentre();
                    break;
                case "loginOut":
                    //退出登录
                    this.onLoginOut();
                    break;
            }
        }
    }
</script>

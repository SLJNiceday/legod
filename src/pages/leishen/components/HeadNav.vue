<template>
    <div>
        <div class="head">
            <div class="head_content">
                <!--                <div class="row-fluid" style="position:relative;">-->
                <!--                    <div class="webnav_box" style="left: 0;">-->
                <div class="head_logo">
                    <a :href="indexLink"><img src="../images/head_logo.png" alt=""></a>
                </div>
                <div class="head_menu">
                    <a :class="{'webnav_font_active': pageName == 'index.html' }" :href="indexLink"
                       class="webnav_font">{{$t("nav.navlist1")}}</a>
                </div>
                <div class="head_menu">
                    <a :class="{'webnav_font_active': pageName == 'recharge.html' }"
                       :href="rechargeLink" class="webnav_font">{{$t("nav.navlist11")}}</a>
                </div>
                <div class="head_menu">
                    <el-dropdown trigger="hover" placement="bottom">
									<span class="cursor">
										<a class="webnav_font" :class="{'webnav_font_active': pageName == 'gamesupport.html'}">{{$t("nav.navlist36")}}</a>
									</span>
                        <el-dropdown-menu class="llz_header-recharge" slot="dropdown">
                            <el-dropdown-item>
                                <a :href="gamesupportLink" class="dropdown-item__alink">{{$t("nav.navlist30")}}</a>
                            </el-dropdown-item>
                            <el-dropdown-item>
                                <a :href="gamenewsLink"
                                   class="dropdown-item__alink">{{$t("nav.navlist31")}}</a>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
                <div class="head_menu">
                    <a :class="{'webnav_font_active': pageName == 'wangba.html' }"
                       :href="'https://netbar.leigod.com/?rewrite_time='+(new Date().getTime().toString())"
                       class="webnav_font">{{$t("nav.navlist2")}}</a>
                </div>
                <div class="head_menu">
                    <a :class="{'webnav_font_active': pageName == 'activity.html' }"
                       :href="activityLink" class="webnav_font">{{$t("nav.navlist12")}}</a>
                </div>
                <div class="head_menu">
                    <el-dropdown trigger="hover" placement="bottom">
                                    <span class="cursor" style="color:#fff;font-size: 16px;">
                                        <a class="webnav_font">{{$t("nav.navlist6")}}</a>
                                    </span>
                        <el-dropdown-menu slot="dropdown" class="llz_header-recharge">
                            <el-dropdown-item>
                                <a :href="helpLink" class="dropdown-item__alink">{{$t("nav.navlist6_0")}} </a>
                            </el-dropdown-item>
                            <el-dropdown-item>
                                <a :href="aboutLink" class="dropdown-item__alink">{{$t("nav.navlist33")}} </a>
                            </el-dropdown-item>
                            <el-dropdown-item>
                                <a :href="businessLink" class="dropdown-item__alink">{{$t("nav.navlist34")}} </a>
                            </el-dropdown-item>
                            <el-dropdown-item>
                                <a :href="joinLink" class="dropdown-item__alink">{{$t("nav.navlist35")}} </a>
                            </el-dropdown-item>
                            <el-dropdown-item>
                                <a :href="noticyLink" class="dropdown-item__alink">{{$t("nav.navlist4")}} </a>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
                <div class="head_menu">
                    <a href="http://139.224.119.40"  class="webnav_font" target="_blank">{{$t("nav.navlist12_1")}}</a>
                </div>
                <div class="head_lang">
                    <div class="webnav_font">
                        <el-dropdown trigger="hover" placement="bottom" @command="onSelectLang">
                                        <span class="cursor" style="color:#fff;font-size: 16px;">
                                            <a class="webnav_font" v-if="seleteCode=='en'"><img
                                                    src="../images/usaFlag.png" alt=""></a>
                                            <a class="webnav_font" v-else="">
                                                <img src="../images/chinaFlag.png" alt=""></a>
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
                    </div>

                </div>
                <div class="head_menu head_login_box">
                    <!--未登录-->
                    <ul style="margin-top: 24px;width: 155px;display: none" v-show="!isLogin"
                        class="clear_fix">
                        <li class="f_left" @click="toRegister">
                            <a class="webnav_font">{{$t("public.share26")}}</a>
                            <span style="color:#bbbbbb;margin:0 2px;">|</span>
                        </li>
                        <li class="f_left" @click="toLogin">
                            <a class="webnav_font">{{$t("public.share27")}}</a>
                        </li>
                    </ul>
                    <!--已登录-->
                    <div style="display: none" v-show="isLogin" class="clear_fix">
                        <el-dropdown class="f_left" placement="bottom" trigger="hover" @command="onClickAvatarHand">
                            <p class="cursor" style="width: 110px;text-align: center;">
                                <img class="head_avatar" :src="userInfo.avatar"
                                     onerror="javascript:this.src='/images/default_avatar.png'"/>
                            </p>
                            <el-dropdown-menu slot="dropdown" class="llz_header-recharge">
                                <el-dropdown-item command="userCentre">
                                    <span class="dropdown-item__alink"> {{$t("nav.navlist0")}} </span>
                                </el-dropdown-item>
                                <el-dropdown-item command="loginOut">
                                    <span class="dropdown-item__alink">{{$t("nav.navlist9")}}</span>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </div>
            </div>
        </div>
        <el-dialog :visible.sync="userDialogVisible" id="userLoginRegisterFind" width="420px"
                   :modal-append-to-body="false" center :close-on-click-modal="false"
                   :close-on-press-escape="false">
            <component :is="usercomponent" ref="loginRegisterForget" @logined="logined" @tologin="toLogin"
                       @toregister="toRegister"
                       @toforget="toforgetPass"></component>
        </el-dialog>
    </div>
</template>

<script lang="ts">
    import HeadProxy from "@/ts/proxy/HeadProxy";
    import {Vue, Component, Prop} from "vue-property-decorator";
    import {
        Dropdown,
        DropdownItem,
        DropdownMenu,
        Option,
        Dialog,
        Select, Notification
    } from "element-ui";
    import JumpWebUtil from "@/ts/utils/JumpWebUtil";
    import LocalStorageUtil from "@/ts/utils/LocalStorageUtil";
    import GlobalConfig from "../global.config";
    import {LsLanguage} from "../util/LsLanguage";
    import Util from "@/ts/utils/Util";
    import wwwLogin from './wwwLogin.vue'
    import wwwRegister from './wwwRegister.vue'
    import wwwForgetPass from './wwwForgetPass.vue'
    import {UserInfo} from "@/ts/models/UserModel";
    import HttpClient from "@/ts/net/HttpClient";

    Vue.prototype.$notify = Notification;
    Vue.use(Dialog)
    @Component({
        components: {
            "el-select": Select,
            "el-option": Option,
            "el-dropdown": Dropdown,
            "el-dropdown-menu": DropdownMenu,
            "el-dropdown-item": DropdownItem,
            'www-login': wwwLogin,
            'www-register': wwwRegister,
            'www-forget-pass': wwwForgetPass,
        }
    })
    export default class HeadNav extends HeadProxy {
        @Prop(String) page_name!: String;
        public region_code = 0;
        public isRealLogin = false
        public indexLink: string = ''
        public rechargeLink: string = ''
        gamesiteLink: string = ''
        gamesupportLink: string = ''
        gamenewsLink: string = ''
        helpLink: string = ''
        aboutLink: string = ''
        joinLink: string = ''
        businessLink: string = ''
        activityLink: string = ''
        noticyLink: string = ''
        public userDialogVisible: boolean = false //显示登陆，注册，忘记密码，弹框
        public dialogType: number = 1; // dialogType:1登陆，2：注册
        /**
         *初始化
         */
        public async created() {
            this.region_code = LocalStorageUtil.getRegionCodes();
            /******** 注意 *******/
            // 注意：copy代码的时候这个类一定要改成对应项目的语言配置类
            this.lanConfig = LsLanguage.getInstance();
            /******** end *******/
            this.setBaseUrl(GlobalConfig.getBaseUrl());
            this.getPageIndex();
            this.init();
            await this.getAreaCodeInfoList(GlobalConfig.getWebBaseUrl());
            this.indexLink = Util.getOrigin() + '/' + window.location.search;
            this.rechargeLink = Util.getOrigin() + '/leigod/' + JumpWebUtil.HTML_NAME_RECHARGE + window.location.search;
            this.gamesiteLink = GlobalConfig.goTodownUrl();
            this.gamesupportLink = Util.getOrigin() + '/leigod/' + JumpWebUtil.HTML_NAME_SUPPORT + window.location.search;
            this.gamenewsLink = Util.getOrigin() + '/' + JumpWebUtil.HTML_NAME_NEWS + window.location.search;
            this.helpLink = Util.getOrigin() + '/' + JumpWebUtil.HTML_NAME_HELP + window.location.search;
            this.aboutLink = Util.getOrigin() + '/' + JumpWebUtil.HTML_NAME_ABOUT + window.location.search;
            this.businessLink = Util.getOrigin() + '/' + JumpWebUtil.HTML_NAME_BUSINESS + window.location.search;
            this.joinLink = Util.getOrigin() + '/' + JumpWebUtil.HTML_NAME_JOIN + window.location.search;
            this.activityLink = Util.getOrigin() + '/' + JumpWebUtil.HTML_NAME_ACTIVITY + window.location.search;
            this.noticyLink = Util.getOrigin() + '/' + JumpWebUtil.HTML_NAME_NOTIFY + window.location.search;
        }

        /**
         * 登陆成功
         */
        async logined() {
            this.userDialogVisible = false;
            const info = LocalStorageUtil.getUserInfo();
            this.isLogin = true;
            this.userInfo = info;
            this.$emit('logined');
        }

        /**
         * 跳转到登录界面
         */
        toLogin() {
            this.dialogType = 1
            this.userDialogVisible = true
            this.$nextTick(() => {
                //@ts-ignore
                this.$refs.loginRegisterForget.country_code_list = this.codeList
                //@ts-ignore
                this.$refs.loginRegisterForget.country_code = this.nowCountryObj.code
                //@ts-ignore
                this.$refs.loginRegisterForget.countryCode = Object.assign({}, this.nowCountryObj)
            })
        }

        /**
         * 跳转到注册界面
         */
        toRegister() {
            this.dialogType = 2
            this.userDialogVisible = true
            this.$nextTick(() => {
                //@ts-ignore
                this.$refs.loginRegisterForget.country_code_list = this.codeList
                //@ts-ignore
                this.$refs.loginRegisterForget.country_code = Object.assign({}, this.nowCountryObj)
                //@ts-ignore
                this.$refs.loginRegisterForget.countryCode = this.nowCountryObj.code
            })
        }

        /**
         * 跳转到忘记密码界面
         */
        toforgetPass() {
            this.dialogType = 3
            this.$nextTick(() => {
                //@ts-ignore
                this.$refs.loginRegisterForget.country_code_list = this.codeList
                //@ts-ignore
                this.$refs.loginRegisterForget.country_code = Object.assign({}, this.nowCountryObj)
                //@ts-ignore
                this.$refs.loginRegisterForget.countryCode = this.nowCountryObj.code
            })
        }

        /**
         * 设置组件的名字
         */
        get usercomponent() {
            switch (this.dialogType) {
                case 1:
                    return 'www-login'
                    break;
                case 2:
                    return 'www-register'
                    break;
                case 3:
                    return 'www-forget-pass'
                    break;
            }
        }

        /**
         * 选择语言
         */
        public onSelectLang(value: string) {
            if (value !== LocalStorageUtil.getLanguage()) {
                this.onChangeLanguage(value);
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
         * 个人中心
         */
        public gotouserCentre() {
            JumpWebUtil.webGotoUser(GlobalConfig.getUserBaseUrl(), JumpWebUtil.HTML_NAME_USER);
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

        //返回首页
        backHome() {

        }

        /**
         * 点击用户头像菜单
         */
        onLoginOutSuccess() {
            this.isLogin = false;
            this.$emit('logout')
        }
    }
</script>


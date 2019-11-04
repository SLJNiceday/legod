<template>
    <div>
        <!-- 头部 -->
        <header-nav :userinfo="userInfo" ref='headnav'></header-nav>
        <div class="leigod_user_contentBox">
            <img class="user_pos_banner" src="../../images/user_banner.png" alt="">
            <div class="leigod_wrap leigod_usercenter">
                <div class="leigod_userleft whitebg leigod_pb20">
                    <!--<div class="leigod_user_portraitBox">
                        <img :src="face_image_url" alt="" class="leigod_user_portrait">
                        <div class="leigod_user_username leigod_mt20">{{username}}</div>
                        <div v-if="feeType==0" class="leigod_user_username leigod_mt20">剩余:{{remainedTime}}</div>
                        <div class="leigod_dashedbottom"></div>
                    </div>-->
                    <ul class="leigod_userNavList">
                        <li class="leigod_userNav_cell leigod_flex" :class="{active:curNavIndex==1}" v-if="userInfo.business_type == 1" @click="jumpRoute('/user/#/ShopManage')">
                            <h5 class="leigod_userNav_tit">商户管理</h5>
                        </li>
                        <li class="leigod_userNav_cell leigod_flex" :class="{active:curNavIndex==2}" @click="jumpRoute('/user/#/WangbaManager')">
                            <h5 class="leigod_userNav_tit">网吧管理</h5>
                        </li>
                        <li class="leigod_userNav_cell leigod_flex" :class="{active:curNavIndex==5}" @click="jumpRoute('/user/#/Recharge')">
                            <h5 class="leigod_userNav_tit">充值续费</h5>
                        </li>
                        <li class="leigod_userNav_cell leigod_flex" :class="{active:curNavIndex==4}" @click="jumpRoute('/user/#/OrderManage')">
                            <h5 class="leigod_userNav_tit">订单管理</h5>
                        </li>
                        <li class="leigod_userNav_cell leigod_flex" :class="{active:curNavIndex==3}" @click="jumpRoute('/user/#/AccountManage')">
                            <h5 class="leigod_userNav_tit">账号管理</h5>
                        </li>
                        <li class="leigod_dashedbottom"></li>
                    </ul>

                    <div class="leigod_usercodeBox">
                        <img src="../../images/wangbaewm.png" alt="">
                        <h6 class="leigod_mt5">关注微信公众号</h6>
                    </div>

                    <div class="leigod_flex">
                        <a class="leigod_user_loginoutbtn" @click="onloginout">退出</a>
                    </div>
                </div>
                <div class="leigod_userright">
                    <transition
                            name="fade-transform"
                            mode="out-in"
                    >
                        <router-view ref="component" :userinfo="userInfo" @getuserinfo="getUserInfo"></router-view>
                    </transition>
                </div>
            </div>
        </div>
        <!-- foot -->
        <footer-nav></footer-nav>
    </div>
</template>

<script lang="ts">
    import {Vue, Component, Watch} from 'vue-property-decorator';
    import "babel-polyfill";
    import Header from '@/pages/leishen_wangba/components/Headnav.vue';
    import Footer from '@/pages/leishen_wangba/components/Footer.vue';
    import { Input, Checkbox, Row, Col, Steps, Step,Dialog, Tag, Table, TableColumn, Button, Pagination, MessageBox,Alert,Form,FormItem, DatePicker, Select, Option, Upload } from "element-ui";
    import UserProxy from "@/ts/netbar/api/UserProxy";
    import GlobalConfig from "../../global_config";
    import LocalStorageUtil from "../../../../ts/netbar/utils/LocalStorageUtil";
    import {UserInfoModel} from "../../../../ts/netbar/model/userModel";

    Vue.use(Input);
    Vue.use(Dialog);
    Vue.use(Checkbox);
    Vue.use(Row);
    Vue.use(Col);
    Vue.use(Steps);
    Vue.use(Step);
    Vue.use(Form);
    Vue.use(FormItem);
    Vue.use(Tag);
    Vue.use(Table);
    Vue.use(TableColumn);
    Vue.use(Button);
    Vue.use(Pagination);
    Vue.use(DatePicker);
    Vue.use(Select);
    Vue.use(Option);
    Vue.use(Upload);
    Vue.prototype.$confirm = MessageBox.confirm;
    Vue.prototype.$alert = MessageBox.alert;
    @Component({
        components: {
            'header-nav': Header,
            'footer-nav': Footer
        }
    })
    export default class User extends UserProxy {

        public async created() {
            this.setBaseUrl(GlobalConfig.getBaseUrl());
            await this.getUserInfo();
            // this.init();
            switch(this.$route.path) {
                case '/ShopManage':
                    this.curNavIndex = 1;
                    break;
                case '/WangbaManager':
                    this.curNavIndex = 2;
                    break;
                case '/AccountManage':
                    this.curNavIndex = 3;
                    break;
                case '/OrderManage':
                    this.curNavIndex = 4;
                    break;
                case '/Recharge':
                    this.curNavIndex = 5;
                    break;
                default:
                    break;
            }
        }

        /**
         * 切换路由时变更选中的
         */
        @Watch("$route")
        route() {
            switch(this.$route.path) {
                case '/ShopManage':
                    this.curNavIndex = 1;
                    break;
                case '/WangbaManager':
                    this.curNavIndex = 2;
                    break;
                case '/AccountManage':
                    this.curNavIndex = 3;
                    break;
                case '/OrderManage':
                    this.curNavIndex = 4;
                    break;
                case '/Recharge':
                    this.curNavIndex = 5;
                    break;
                default:
                    break;
            }
        }

        /**
         * 跳转路由
         */
        public jumpRoute(path:string){
            if(location.href.includes(path)){
                return;
            }
            location.href=path;
        }

        /**
         * 退出
         */
        public onloginout() {
            this.$confirm('确认退出?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // this.LoginOut()

            }).catch(() => {
            });
        }
    }
</script>

<style scoped lang="less">
    /* fade */
    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.28s;
    }

    .fade-enter,
    .fade-leave-active {
        opacity: 0;
    }

    /* fade-transform */
    .fade-transform-leave-active,
    .fade-transform-enter-active {
        transition: all .5s;
    }

    .fade-transform-enter {
        opacity: 0;
        transform: translateX(-30px);
    }

    .fade-transform-leave-to {
        opacity: 0;
        transform: translateX(30px);
    }

    /* list */
    .list-enter-active, .list-leave-active {
        transition: all .5s;
    }
    .list-enter, .list-leave-to
        /* .list-leave-active for below version 2.1.8 */ {
        opacity: 0;
        transform: translateX(20px);
    }
</style>

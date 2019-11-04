<template>
    <!--登录-->
    <div class="dialog_box" v-loading="isLoading">
        <div class="clear_fix login_tab_box" style="width:90%;">
            <div class="f_left login_tab_item" @click="changeLoginType(0)"
                 :class="{'login_tab_active': loginType == 0}">
                <!--                            手机号-->
                <span class="txt">{{$t("public.share28")}}</span>
                <i class="tag"></i>
            </div>
            <div class="f_right login_tab_item" @click="changeLoginType(1)"
                 :class="{'login_tab_active': loginType == 1}">
                <!--                            邮箱/账号-->
                <span class="txt">{{$t("public.share29")}}</span>
                <i class="tag"></i>
            </div>
        </div>
        <!--手机-->
        <div style="display: none;" v-show="loginType == 0">
            <div class="mar_t30 public_enter_ipt">
                <div class="f_left select_box login_select_box" style="background:#f6f6f6;margin-left: -10px;" id="phoneCodePart">
                    <el-select @change="onSelectCountryCode" :value="countryCode.code"
                               placeholder="" style="width:100%;">
                        <div slot="prefix"> <img :src="countryCode.ico" alt="" style="margin-top:10px;"></div>
                        <el-option-group
                                v-for="group in country_code_list"
                                :key="group.label"
                                :label="group.label">
                            <el-option v-for="(val,index) in group.options" :key="index"
                                       :value="val.code" :label="'+'+val.code">
                                <img :src="val.ico" alt="">
                                <span style="color:#666;margin-left:6px;">{{val.name}}</span>
                            </el-option>
                        </el-option-group>
                    </el-select>
                </div>
                <div class="f_left">|</div>
                <input class="f_left transparent_ipt" type="text" v-model="phone"
                       :placeholder="$t('public.share2')">
            </div>
            <!--                        placeholder="密码"-->
            <input class="mar_t25 public_enter_ipt" type="password" v-model="phonePassword"
                   @change="passwordInput(0)" :placeholder="$t('public.share30')">
        </div>
        <!--邮箱/账号-->
        <div style="display: none;" v-show="loginType == 1">
            <!--                        placeholder="邮箱号/账号"-->
            <input class="mar_t30 public_enter_ipt" type="text" v-model="email" :placeholder="$t('public.share31')">
            <!--                        placeholder="密码"-->
            <input class="mar_t25 public_enter_ipt" type="password" :placeholder="$t('public.share30')"
                   v-model="emailPassword" @change="passwordInput(1)">
        </div>
        <div class="clear_fix mar_t25">
            <!--                        记住我-->
            <div id="payzhekou" style="text-align: left;">
                <van-checkbox style="display:inline-block;" v-model="isKeepPw" shape="square"
                              checked-color="#ffd33e">{{$t('public.share32')}}
                </van-checkbox>
                <a class="f_right gotoLogin_btn" @click="goForgetPwd">{{$t("public.share33")}}</a>
            </div>
            <!--                        忘记密码-->
        </div>
        <div class="mar_t20 public_enter_btn" @click="clickLogin">
            <!--                        立即登录-->
            {{$t("public.share34")}}
        </div>
        <div class="mar_t15 public_white_btn" @click="goRegister">
            <!--                        注册雷神, 免费体验1小时-->
            {{$t("public.share36")}}
        </div>
        <div class="mar_t25 third_party loginthreeicon">
            <a @click="setBindUrlTYype('wechart')" href="javascript:void(0)">
                <i class="iconfont icon-weixin"></i>
            </a>
            <a @click="setBindUrlTYype('qq')" href="javascript:void(0)">
                <i class="iconfont icon-QQ"></i>
            </a>
            <a @click="setBindUrlTYype('weibo')" href="javascript:void(0)">
                <i class="iconfont icon-weibo"></i>
            </a>
        </div>
    </div>
</template>
<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {Loading, Notification, Option, Select, OptionGroup,Alert,MessageBox} from 'element-ui';
    import {LoginProxy} from '@/ts/proxy/LoginProxy';
    import GlobalConfig from '../global.config';
    import {TipsMsgUtil} from '@/ts/utils/TipsMsgUtil';
    import CheckUtil from '@/ts/utils/CheckUtil';
    import {ActivityPictureModel} from '@/ts/models/NewsModel';
    import LocalStorageUtil from '@/ts/utils/LocalStorageUtil';
    import JumpWebUtil from "@/ts/utils/JumpWebUtil";
    Vue.prototype.$notify = Notification;
    Vue.use(Select);
    Vue.use(Option);
    Vue.use(OptionGroup);
    Vue.use(Loading);
    Vue.prototype.$msgbox = MessageBox;
    Vue.prototype.$alert = MessageBox.alert;
    @Component
    export default class Login extends LoginProxy {
        public activityInfo: ActivityPictureModel = new ActivityPictureModel();
        public bannerImg: string = ''; //活动banner图片
        public activeLink: string = ''; //活动URL链接
        public imageHeadUrl: string = '';
        public qq_url = '';
        public wechart_url=''
        public weibo_url=''
        public async created() {
            GlobalConfig.log('注册log');
            LocalStorageUtil.saveParam();
            this.setBaseUrl(GlobalConfig.getBaseUrl());
            this.imageHeadUrl = GlobalConfig.getImgBaseUrl();
            // await this.getAreaCodeInfoList(GlobalConfig.getWebBaseUrl());
            this.init();
            let region_code=LocalStorageUtil.getRegionCodes()
            let language=(LocalStorageUtil.getLanguage()=='zh_CN')?'cn':'en'
            this.weibo_url='https://api.weibo.com/oauth2/authorize?client_id=825933425&response_type=code&redirect_uri=https://webapi.leigod.com/api/auth/open/sina&state='+region_code+'_0_'+language+'_2';
            this.wechart_url='https://open.weixin.qq.com/connect/qrconnect?appid=wx99a90917c0647828&redirect_uri=https://webapi.leigod.com/api/auth/open/wx&response_type=code&scope=snsapi_login&state='+region_code+'_0_'+language+'_2'+'&connect_redirect=1#wechat_redirect';
            this.qq_url = 'https://graph.qq.com/oauth2.0/show?which=Login&display=pc&response_type=code&client_id=101523719&redirect_uri=https://webapi.leigod.com/api/auth/open/qq&state=' + region_code + '_0_' + language + '_2' + '&scope=get_user_info';
        }


        /**
         * 改变手机区号
         */
        public onSelectCountryCode(val:number) {
            this.country_code_list.map(item=>{
                for(let qq=0;qq<item.options.length;qq++){
                    if(val==item.options[qq].code){
                        this.countryCode=Object.assign({},item.options[qq])
                        this.country_code=val.toString()
                    }
                }
            })
        }

        /**
         * 跳转忘记密码
         */
        public goForgetPwd() {
            this.$emit('toforget')
        }

        /**
         * 跳转注册
         */
        public goRegister() {
            this.$emit('toregister')
        }

        /**
         * 点击登录
         */
        public clickLogin() {
            let flag = true;
            let tipMsg = '';
            if (this.loginType == 0) {
                if (this.country_code == '86') {
                    //验证手机号
                    if (!CheckUtil.checkPhone(this.phone) && flag) {
                        tipMsg = TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_PHONE_ERROR);
                        flag = false;
                        if (this.phone == '') {
                            tipMsg = TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_PHONE_EMPTY);
                            flag = false;
                        }
                    }
                }

                if (this.isPwMd5) {
                    //验证密码
                    if (this.phonePassword == '') {
                        tipMsg = TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_PASSWORD_EMPTY);
                        flag = false;
                    }
                } else {
                    //验证记住的密码
                    if (!CheckUtil.checkRemberPwd(this.phonePassword) && flag) {
                        tipMsg = TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_PASSWORD_ERROR);
                        flag = false;
                        if (this.phonePassword == '') {
                            tipMsg = TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_PASSWORD_EMPTY);
                            flag = false;
                        }
                    }
                }
                if (!flag) {
                    this.$notify({
                        title: TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_ERROR_TITLE),
                        message: tipMsg,
                        type: 'warning'
                    });
                    return;
                }
                this.setLoadingStatuas(true);
                this.onPhoneLogin();
            } else {
                //验证邮箱/账号
                if (!CheckUtil.checkEmail(this.email) && flag) {
                    if (!CheckUtil.checkAccount(this.email)) {
                        tipMsg = TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_ACCOUNT_ERROR);
                        flag = false;
                    }
                    if (this.email == '') {
                        tipMsg = TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_ACCOUNT_EMPTY);
                        flag = false;
                    }
                }
                if (this.isPwMd5) {
                    if (this.emailPassword == '') {
                        tipMsg = TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_PASSWORD_EMPTY);
                        flag = false;
                    }
                } else {
                    //验证记住的密码
                    if (!CheckUtil.checkRemberPwd(this.emailPassword) && flag) {
                        tipMsg = TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_PASSWORD_ERROR);
                        flag = false;
                        if (this.emailPassword == '') {
                            tipMsg = TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_PASSWORD_EMPTY);
                            flag = false;
                        }
                    }
                }

                if (!flag) {
                    this.$notify({
                        title: TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_ERROR_TITLE),
                        message: tipMsg,
                        type: 'warning'
                    });
                    return;
                }
                this.setLoadingStatuas(true);
                this.onEmaillLogin();
            }
        }

        /**
         * 登录成功
         * TODO... 此方法可以重写，处理登录成功后的ui逻辑
         */
        onLoginSuccess() {
            this.$notify({
                title: TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_SUCCESS_TITLE),
                message: TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_LOGIN),
                type: 'success'
            });
            //成功完成支付
            this.$emit('logined')
            let userInfo=LocalStorageUtil.getUserInfo();

            if(userInfo.mobile==''&&userInfo.region_code==1){
                // 如果用户是国内登录，且手机号为空；
                let alterTitle=this.$t('public.share67').toString()
                let alterp=this.$t('public.share68').toString()
                let btnText=this.$t('public.share69').toString()
                this.$alert(alterp, alterTitle, {
                    confirmButtonText: btnText,
                    showClose:false,
                    customClass:'llz_bindMobile',
                    callback: action => {
                        JumpWebUtil.webGotoUser(GlobalConfig.getUserBaseUrl(), JumpWebUtil.HTML_NAME_LOGIN, 'bind=bindMobile&to='+window.location.href);
                    }
                });
                // JumpWebUtil.webGotoUser(GlobalConfig.getUserBaseUrl(), JumpWebUtil.HTML_NAME_LOGIN, '?bindMoblie=webbind&to='+tempArr[tempArr.length-1]);
            }
        }

        /**
         * 登录失败
         * TODO... 此方法可以重写，处理登录失败后的ui逻辑
         */
        onLoginFaild(data: any) {
            // 错误返回
            this.setLoadingStatuas(false);
            this.$notify({
                title: TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_ERROR_TITLE),
                message: data.msg,
                type: 'warning'
            });
        }

        /**
         * 改变密码
         */
        public passwordInput(type: number) {
            //TODO...需要验证输入
            this.onPasswordInput(type);
        }

        /**
         * 设置loading状态
         */
        public setLoadingStatuas(b: boolean) {
            this.isLoading = b;
            this.loadingMsg = TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_LOADING);
        }

        /**
         * 设置第三方绑定来源类型
         */
        public setBindUrlTYype(type:string) {
            LocalStorageUtil.addthreeBindSource('1')
            switch (type) {
                case 'qq':
                    window.location.href=this.qq_url
                    break;
                case 'wechart':
                    window.location.href=this.wechart_url
                    break;
                case 'weibo':
                    window.location.href=this.weibo_url
                    break;
            }
        }
    }
</script>

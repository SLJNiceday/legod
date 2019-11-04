import '@/assets/less/leishen.less';
import 'babel-polyfill';
import {Component, Vue} from 'vue-property-decorator';
import FootNavTwo from './components/FootNavTwo.vue';
import OauthLogin from './components/OauthLogin.vue';
import VueI18n from 'vue-i18n';
import {Loading, Notification, Option, Select, OptionGroup,Alert,MessageBox} from 'element-ui';
import {LoginProxy} from '@/ts/proxy/LoginProxy';
import GlobalConfig from './global.config';
import {TipsMsgUtil} from '@/ts/utils/TipsMsgUtil';
import JumpWebUtil from '@/ts/utils/JumpWebUtil';
import Util from '@/ts/utils/Util';
import CheckUtil from '@/ts/utils/CheckUtil';
import AppParamModel from '@/ts/models/AppModel';
import {LsLanguage} from '@/pages/leishen_user/util/LsLanguage';
import HttpClient from '@/ts/net/HttpClient';
import {ActivityPictureModel, ActivityRequestPictureModel} from '@/ts/models/NewsModel';
import LocalStorageUtil from '@/ts/utils/LocalStorageUtil';
import ConfigUtil from "@/ts/utils/ConfigUtil";
Vue.prototype.$notify = Notification;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.use(Select);
Vue.use(Option);
Vue.use(OptionGroup);
Vue.use(Loading);

//语言包
Vue.use(VueI18n);
const webParam = AppParamModel.getInstace(Util.REGION_CODE_1, Util.ZH_CN);
let lang = LsLanguage.getInstance();
lang.init();
const i18n = new VueI18n(lang);

@Component({
    components: {
        'foot-nav-two': FootNavTwo,
        'oauth-login': OauthLogin
    }
})
// class
class Login extends LoginProxy {
    public webParam = AppParamModel.getInstace(); // 浏览器参数
    public activityInfo: ActivityPictureModel = new ActivityPictureModel();
    public bannerImg: string = ''; //活动banner图片
    public activeLink: string = ''; //活动URL链接
    public imageHeadUrl: string = '';
    public isshowLogin:boolean=true
    public created() {
        GlobalConfig.log('注册log');
        LocalStorageUtil.saveParam();
        this.setBaseUrl(GlobalConfig.getBaseUrl());
        this.imageHeadUrl = GlobalConfig.getImgBaseUrl();
        this.init();
        this.getAreaCodeInfoList(GlobalConfig.getWebBaseUrl());
        this.getDownloadUrl();
        //读取to参数跳转到对应的页面
        const bindMoblie = Util.getUrlParam('bind');
        if (bindMoblie == 'bindMobile') {
            this.isshowLogin=false
            this.registerIsCaptcha()
        }
    }

    /**
     * 切换语言
     */
    public onChangeLanguage(ln: string) {
        lang.changeLanguage(ln);
        i18n.locale = lang.locale;
        this.webParam.language = ln;
        // GlobalConfig.log('切换语言:' + lang.locale);
    }

    /**
     * 获取配置文件
     * @param url
     */
    public async getDownloadUrl() {
        const jsonConfig = await ConfigUtil.getInstance().download(true);
        const region_code = LocalStorageUtil.getRegionCodes();
        const language = LocalStorageUtil.getLanguage();
        this.bannerImg = jsonConfig.leigod[region_code][language].index_news.img_url;
        this.activeLink = jsonConfig.leigod[region_code][language].index_news.new_url;
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
        JumpWebUtil.wapJump(GlobalConfig.getUserBaseUrl(), JumpWebUtil.HTML_NAME_FORGETPWD);
    }

    /**
     * 跳转注册
     */
    public goRegister() {
        JumpWebUtil.wapJump(GlobalConfig.getUserBaseUrl(), JumpWebUtil.HTML_NAME_REGISTER);
    }

    /**
     * 跳转首页
     */
    public goHome() {
        JumpWebUtil.userGotoWeb(GlobalConfig.getWebBaseUrl(), JumpWebUtil.HTML_NAME_INDEX);
    }

    /**
     * 跳转活动详情
     */
    public goActivityDetail(item: any) {
        if (item.url_type == 1) {
            window.open(item.url);
        } else {
            JumpWebUtil.userGotoWeb(GlobalConfig.getWebBaseUrl(), JumpWebUtil.HTML_NAME_DETAILS_ACTIVITY + item.id + '.html');
        }
    }

    /**
     * 获取活动banner
     */
    public async getActivityInfo() {
        let url = HttpClient.URL_ACTIVITY_PICTURE_LIST;
        let param = new ActivityRequestPictureModel();
        param.plat_type = 1;
        param.region_code = this.webParam.region_code;
        this.backData = await this.http.post(url, param);
        if (this.backData.code == HttpClient.HTTP_SUCCESS_NET_CODE) {
            const activityList = this.backData.data as ActivityPictureModel[];
            this.activityInfo = activityList[0];
            if (this.activityInfo) {
                this.bannerImg = this.activityInfo.imgs.filter((a, b) => {
                    return a.key == 0; // 0 官网  1是移动端  2pc 客户端
                })[0].img_url;
            }

            //给banner  赋值
            if (this.bannerImg != '') {
                this.bannerImg = this.imageHeadUrl + this.bannerImg;
            }
        }
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
        let self = this;
        this.isLoading = true;
        //读取to参数跳转到对应的页面
        const toHtml = Util.getUrlParam('to');
        if (toHtml != '') {
            //跳转到指定页面
            const page = parseInt(Util.getUrlParam('page'));
            const tid = parseInt(Util.getUrlParam('id'));
            setTimeout(() => {
                JumpWebUtil.toPage(toHtml, page, tid);
            }, 1000);
        } else {
            let userinfo=LocalStorageUtil.getUserInfo()
            if(userinfo.region_code==1&&userinfo.mobile==''){
                //如果用户的手机号未绑定且region_code=1
                this.isLoading = false;
                let alterTitle=this.$t('public.share67').toString()
                let alterp=this.$t('public.share68').toString()
                let btnText=this.$t('public.share69').toString()
                this.$alert(alterp, alterTitle, {
                    confirmButtonText: btnText,
                    showClose:false,
                    customClass:'llz_bindMobile',
                    callback: action => {
                        this.isshowLogin=false
                    }
                });
            }else{
                setTimeout(() => {
                    let url=window.location.protocol+'//'+window.location.host
                    JumpWebUtil.wapJump(url, JumpWebUtil.HTML_NAME_USER);
                }, 1000);
            }
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
    public setBindUrlTYype() {
        LocalStorageUtil.addthreeBindSource('1')
    }
    //type=0短信type=1语音
    public getSmscode(type: number) {
        //验手机格式
        if (this.country_code == '86') {
            if (!CheckUtil.checkPhone(this.phone)) {
                if (this.phone == "") {
                    this.$notify({
                        title: TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_ERROR_TITLE),
                        message: TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_PHONE_EMPTY),
                        type: "warning"
                    });
                    return;
                }
                this.$notify({
                    title: TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_ERROR_TITLE),
                    message: TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_PHONE_ERROR),
                    type: "warning"
                });
                return;
            }
        }

        this.onGetSmscode(type,4);
    }
    //短信验证码发送成功的提示
    SmscodeSuccessTip(){
        this.$notify({
            title: TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_SUCCESS_TITLE),
            message: TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_SMS),
            type: "success"
        });
    }
    //短信验证码发送失败的提示
    onGetSmscodeFaild(data: any) {
        this.$notify({
            title: TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_ERROR_TITLE),
            message: data.msg,
            type: "warning"
        });
    }
    // 绑定手机号
    bindPhoneSuccess(msg:string){
        this.$notify({
            title: TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_SUCCESS_TITLE),
            message: msg,
            type: "success"
        });
        //读取to参数跳转到对应的页面
        const toHtml = Util.getUrlParam('to');
        if (toHtml != '') {
            //跳转到指定页面
            const page = (Util.getUrlParam('page')==''?-1:parseInt(Util.getUrlParam('page')))
            const tid = (Util.getUrlParam('id')==''?-1:parseInt(Util.getUrlParam('id')))
            setTimeout(() => {
                JumpWebUtil.toPage(toHtml, page, tid);
            }, 1000);
        } else {
            setTimeout(() => {
                let url=window.location.protocol+'//'+window.location.host
                JumpWebUtil.wapJump(url, JumpWebUtil.HTML_NAME_USER);
            }, 1000);
        }
    }

    // 绑定手机号
    bindPhoneFaild(data: any) {
        this.$notify({
            title: TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_ERROR_TITLE),
            message: data.msg,
            type: "warning"
        });
    }
}

new Login({
    i18n
}).$mount('#app');

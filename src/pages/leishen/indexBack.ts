import '@/assets/less/leishen.less';
import "babel-polyfill";
import {Component, Vue} from "vue-property-decorator";
import VueI18n from "vue-i18n";
import WebParamModel from "@/ts/models/WebModel";
import Util from "@/ts/utils/Util";
import {LsLanguage} from "@/pages/leishen/util/LsLanguage";
import {TdappModel} from "@/ts/models/TdappModel";
import JumpWebUtil from "@/ts/utils/JumpWebUtil";
import HttpClient from "@/ts/net/HttpClient";
import GlobalConfig from "./global.config";
import LoginDialog from './components/wwwLogin.vue'
import RegisterDialog from './components/wwwRegister.vue'
import ForgetPwd from './components/wwwForgetPass.vue'
import $ from 'jquery'
import HeadProxy from "@/ts/proxy/HeadProxy";
//语言包
Vue.use(VueI18n);
const webParam = WebParamModel.getInstace(Util.REGION_CODE_1, Util.ZH_CN);
let lang = LsLanguage.getInstance();
lang.init();
const i18n = new VueI18n(lang);

@Component({
    components: {
        'login-dialog': LoginDialog,
        'register-dialog': RegisterDialog,
        'forget-pwd': ForgetPwd
    }
})
class Index extends HeadProxy {
    public webParam = WebParamModel.getInstace(); // 浏览器参数
    public browserModel = new TdappModel();
    public http: HttpClient = new HttpClient();
    public showType: number = 1; // showType:1登陆，2：注册3：忘记密码，
    public test='';
    public nowCountryObj={
        code: "",
        group: "",
        ico: "",
        iso_code: "",
        name: "",
    };
    public codeList=[]
    public setBaseUrl(url: string): void {
        this.http.setBaseUrl(url);
    }

    public async created() {
        this.setBaseUrl(GlobalConfig.getBaseUrl());
        await this.getAreaCodeInfoList(GlobalConfig.getWebBaseUrl());
        if(Util.getUrlParam('showType')){
            let initType=parseInt(Util.getUrlParam('showType'));
            switch (initType) {
                case 1:
                    this.toLogin()
                    break;
                case 2:
                    this.toRegister()
                    break;
            }
        }

        await this.getAreaCodeInfoList(GlobalConfig.getWebBaseUrl());

        // 导出注册
        //@ts-ignore
        window.toRegister = this.toRegister;
        // 导出登录
        //@ts-ignore
        window.toLogin = this.toLogin;
        // 导出忘记密码
        //@ts-ignore
        window.toForget = this.toforgetPass;
    }

    /**
     * 设置组件的名字
     */
    get usercomponent() {
        switch (this.showType) {
            case 1:
                return 'login-dialog'
                break;
            case 2:
                return 'register-dialog'
                break;
            case 3:
                return 'forget-pwd'
                break;
        }
    }
    /**
     * 跳转到登录界面
     */
    toLogin(){
        $('#operateDiv').show()
        this.showType=1
        this.$nextTick(()=>{
            //@ts-ignore
            this.$refs.loginRegisterForget.country_code_list=this.codeList
            //@ts-ignore
            this.$refs.loginRegisterForget.country_code=this.nowCountryObj.code
            //@ts-ignore
            this.$refs.loginRegisterForget.countryCode=Object.assign({},this.nowCountryObj)
        })

    }
    /**
     * 跳转到注册界面
     */
    toRegister(){
        $('#operateDiv').show()
        this.showType=2;
        this.$nextTick(()=>{
            //@ts-ignore
            this.$refs.loginRegisterForget.country_code_list=this.codeList
            //@ts-ignore
            this.$refs.loginRegisterForget.country_code=Object.assign({},this.nowCountryObj)
            //@ts-ignore
            this.$refs.loginRegisterForget.countryCode=this.nowCountryObj.code
        })
    }
    /**
     * 跳转到忘记密码界面
     */
    toforgetPass(){
        $('#operateDiv').show()
        this.showType=3;
        this.$nextTick(()=>{
            //@ts-ignore
            this.$refs.loginRegisterForget.country_code_list=this.codeList
            //@ts-ignore
            this.$refs.loginRegisterForget.country_code=Object.assign({},this.nowCountryObj)
            //@ts-ignore
            this.$refs.loginRegisterForget.countryCode=this.nowCountryObj.code
        })
    }
    /**
     * 关闭弹框
     */
    closeDialog(){
        $('#operateDiv').hide()
    }
    /**
     * 登陆成功
     */
    logined() {
        JumpWebUtil.webGotoUser(GlobalConfig.getUserBaseUrl(),JumpWebUtil.HTML_NAME_USER)
    }
}

new Index({
    i18n
}).$mount('#www_leishen');

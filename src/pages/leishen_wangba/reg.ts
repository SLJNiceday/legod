import { Vue, Component } from "vue-property-decorator";
import "babel-polyfill";
import Header from "./components/Headnav.vue";
import Footer from "./components/Footer.vue";
import {
  Input,
  Checkbox,
  Row,
  Col,
  Upload,
  Message,
  Cascader,
  Loading,
  Select,
  Option,
  Button
} from "element-ui";
import XmlHttpClient from "@/ts/net/XmlHttpClient";
import "./less/leigodwangba.less";
import {
  RegRequestModel,
  SmsCaptchaRequestModel,
  SmsCaptchaModel,
  ImproveRequestModel,
  UserInfoModel
} from "../../ts/netbar/model/userModel";
import {ImgCaptchaRequestModel, ImgCaptchaModel, RegisterModel} from "../../ts/netbar/model/RegModel";
import GlobalConfig from "./global_config";
import CheckUtil from "@/ts/utils/CheckUtil";
import netbarCheckUtil from "../../ts/netbar/utils/netbarCheckUtil";
import { TipsMsgUtil } from "@/ts/utils/TipsMsgUtil";
import { LanguageConfig } from "@/ts/utils/Language";
import LocalStorageUtil from "../../ts/netbar/utils/LocalStorageUtil";
import Util from "@/ts/utils/Util";
import ConfigUtil from "@/ts/utils/ConfigUtil";
import HttpClient from "@/ts/net/HttpClient";
import UserProxy from "@/ts/netbar/api/UserProxy";
import Md5 from 'md5';
Vue.use(Input);
Vue.use(Checkbox);
Vue.use(Row);
Vue.use(Col);
Vue.use(Upload);
Vue.use(Cascader);
Vue.use(Loading);
Vue.use(Select);
Vue.use(Option);
Vue.use(Button);
Vue.prototype.$message = Message;

LocalStorageUtil.addLanguage(Util.ZH_CN);
let lang = LanguageConfig.getInstance();
lang.initNoRefresh();

@Component({
  components: {
    "header-nav": Header,
    "footer-nav": Footer
  }
})
export default class Reg extends UserProxy {
    public reg_step: number = 1;//入驻步骤
    public username: string = '';//用户名
    public password: string = '';//密码
    public password_double: string = '';//确认密码
    public isAgree:boolean = false;//是否勾选用户协议
    public bar_name:string = '';//网吧名称
    public manager:string = '';//联系人
    public phone:string = '';//联系方式

    created() {
        this.setBaseUrl(GlobalConfig.getBaseUrl());
    }

    /**
     * 验证信息
     */
    public clickRegister() {
        let tipMsg = '';
        let flag = false;
        //验证用户名
        if(!netbarCheckUtil.checkUsername(this.username)) {
            tipMsg = '用户名格式不正确';
            if(this.username ==  ''){
                tipMsg = '用户名不能为空!';
            }
            flag = true;
        }
        //验证密码
        if(!netbarCheckUtil.checkPwd(this.password) && !flag) {
            tipMsg = '密码格式不正确';
            if(this.username ==  ''){
                tipMsg = '密码不能为空!';
            }
            flag = true;
        }
        //验证确认密码
        if(this.password !== this.password_double && !flag) {
            tipMsg = '两次输入的密码不一致!';
            if(!netbarCheckUtil.checkPwd(this.password_double)) {
                tipMsg = '密码格式不正确';
                if(this.username ==  ''){
                    tipMsg = '密码不能为空!';
                };
            };
            flag = true;
        }
        //验证网吧名称
        if(!netbarCheckUtil.checkNetbar(this.bar_name) && !flag) {
            tipMsg = '网吧名称过长!';
            if(this.bar_name ==  ''){
                tipMsg = '网吧名称不能为空!';
            }
            flag = true;
        }
        //验证网吧负责人
        if(!this.manager && !flag) {
            tipMsg = '联系人不能为空!';
            flag = true;
        }
        //验证网吧名称
        if(!netbarCheckUtil.checkPhone(this.phone) && !flag) {
            tipMsg = '手机号码格式不正确!';
            if(this.phone ==  ''){
                tipMsg = '手机号码不能为空!';
            }
            flag = true;
        }
        if(flag) {
            this.$message.error(tipMsg);
            return;
        }
        this.onRegister();
    }

    public async onRegister() {
        let url = HttpClient.NETBAR_AUTH_REGISTER;
        let param = new RegisterModel();
        param.user_name = this.username;
        param.password = Md5(this.password).toString();
        param.bar_name = this.bar_name;
        param.business_user = this.manager;
        param.business_phone = this.phone;
        this.backData = await this.http.post(url,param);
        if(this.backData.code == HttpClient.HTTP_SUCCESS_NET_CODE) {
            this.reg_step = 2;
        }else {
            this.$message.error(this.backData.msg);
        }
    }
}

new Reg({}).$mount("#login");

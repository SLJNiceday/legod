import {Vue, Component} from "vue-property-decorator";
import "babel-polyfill";
import Header from "./components/Headnav.vue";
import Footer from "./components/Footer.vue";
import {Input, Checkbox, Row, Col, Message, Loading} from "element-ui";
import "./less/leigodwangba.less";
import GlobalConfig from "./global_config";
import HttpClient from "@/ts/net/HttpClient";
import LocalStorageUtil from "../../ts/netbar/utils/LocalStorageUtil";
import {LoginRequestModel, LoginModel} from "../../ts/netbar/model/userModel";
import {LoginProxy} from "@/ts/netbar/api/LoginProxy";
import Md5 from 'md5';

Vue.use(Input);
Vue.use(Checkbox);
Vue.use(Row);
Vue.use(Col);
Vue.use(Loading);
Vue.prototype.$message = Message;
@Component({
    components: {
        "header-nav": Header,
        "footer-nav": Footer
    }
})
export default class Login extends LoginProxy {
    public username: string = ""; //用户名
    public password: string = ""; //密码
    public isKeepPw: boolean = false; //记住密码
    public isMd5: boolean = false;//密码是否md转码过

    created() {
        console.log("登录log");
        this.setBaseUrl(GlobalConfig.getBaseUrl());
        this.init();
    }

    /**
     * 初始化
     */
    public init(): void {
        let username = localStorage.getItem(LocalStorageUtil.STORAGES_USERNAME);
        if (username != null && username != "undefined") {
            this.username = username;
        }
        let pwd = localStorage.getItem(LocalStorageUtil.STORAGES_PW);
        if (pwd != null && pwd != "undefined") {
            this.password = pwd;
            this.isKeepPw = true;
            this.isMd5 = true;
        }
    }

    /**
     * 输入密码
     */
    public changePwd() {
        this.isMd5 = false;
    }

    public onlogin() {
        const url = HttpClient.NETBAR_AUTH_LOGIN;
        let param = new LoginRequestModel();
        if (!this.isMd5) {
            this.password = Md5(this.password).toString();
        };
        param.user_name = this.username;
        param.password = this.password;
        localStorage.setItem(LocalStorageUtil.STORAGES_USERNAME, this.username);
        if (this.isKeepPw) {
            localStorage.setItem(LocalStorageUtil.STORAGES_PW, this.password);
        } else {
            localStorage.removeItem(LocalStorageUtil.STORAGES_PW);
        }
        this.loginIn(url, param);
    }


}

new Login({}).$mount("#login");

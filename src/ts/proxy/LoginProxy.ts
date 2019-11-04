import HttpClient from '../net/HttpClient';
import {IdataModel} from '../models/IdataModel';
import {IProxy} from '../interface/IProxy';
import {
    areaCodeCaptchaModel,
    CaptchaModel,
    CaptchaRequestModel,
    ImgCaptchaModel,
    ImgCaptchaRequestModel, SmsCaptchaModel, SmsCaptchaRequestModel
} from '../models/CaptchaModel';
import {Vue, Component} from 'vue-property-decorator';
import LocalStorageUtil from '../utils/LocalStorageUtil';
import {BindPhoneRequestModel, LoginModel, LoginRequestModel} from '../models/UserModel';
import {TipsMsgUtil} from '../utils/TipsMsgUtil';
import Md5 from 'md5';
import Util from "@/ts/utils/Util";
import ConfigUtil from "@/ts/utils/ConfigUtil";
import {GetRegincodeModel} from "@/ts/models/NewsModel";

/**
 * 登录proxy
 */
@Component
export class LoginProxy extends Vue implements IProxy {

    public errorMsg: string = "";
    public loginType: number = 0; //0手机登录 1邮箱登录
    public country_code_list = [];//手机区号
    public countryCode = {
        code: "",
        group: "",
        ico: "",
        iso_code: "",
        name: "",
    };//手机号前缀
    public country_code:string = '';
    public phone: string = '';//手机号
    public email: string = '';//邮箱号
    public phonePassword: any = ''; // 手机号密码
    public emailPassword: any = ''; // 邮箱密码
    public isKeepPw: boolean = false;//是否保存密码
    public isPwMd5: boolean = false;//密码是否md5
    public areaCodeList = [];// 手机区号list
    public areaCodeListArr = []; // 手机区号list数组
    public username: string = '';//用户名
    public commonPsaaword: string = '';//密码(可以是手机 也可以是邮箱)

    ///////公共参数
    // http
    public http = new HttpClient();
    public backData: IdataModel<any> | undefined;
    // loading
    public isLoading: boolean = false;
    public loadingMsg: string = ''; // loading的说明文字
    // notif
    public notifTitle: string = TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_SUCCESS_TITLE); //提示信息标题
    public notifMessage: string = ""; //提示信息message
    public notifType: any = "success"; //提示信息类型
    public notifNum: number = 0;//提示次数
    ///////公共参数 END
    public imgCaptchaCode: string = ''; // 输入的图形验证码
    public isimgVerification: number = 0; // 是否需要图片验证
    public imgCaptchaM: ImgCaptchaModel = new ImgCaptchaModel(); // 图形验证码model
    public smscode: string = ''; // 短信code
    public smsCapchaM: SmsCaptchaModel = new SmsCaptchaModel(); // 短信验证码
    public bind_status: string = '';//绑定方式
    public voiceShow: boolean = false;//发送语音是否显示
    public smsCountDownNum: number = 0; // 短信倒计时
    public init(): void {
        let phone = localStorage.getItem(LocalStorageUtil.STORAGES_PHONE);
        if (phone != null && phone != 'undefined') {
            this.phone = phone;
            this.username = phone;
        }
        let email = localStorage.getItem(LocalStorageUtil.STORAGES_EMAIL);
        if (email != null && email != 'undefined') {
            this.email = email;
            this.username = email;
        }
        this.changeLoginType(0);
    }

    public execute(): void {
        // TODO...
    }

    public setBaseUrl(url: string): void {
        this.http.setBaseUrl(url);
    }

    /**
     * 获取手机区号集合
     */
    public async getAreaCodeList() {
        const url = HttpClient.URL_AUTH_COUNTRY;
        const param = {};

        this.backData = await this.http.get<areaCodeCaptchaModel>(url, param);
        if (this.backData.code == HttpClient.HTTP_SUCCESS_NET_CODE) {
            this.country_code = this.backData.data.now_country;
            let country_code = localStorage.getItem(LocalStorageUtil.STORAGES_PHONE_REGION);
            if(country_code != null && country_code != undefined) {
                this.country_code = country_code;
            }
            for(const key in this.backData.data.list_country){
                this.areaCodeList.push(this.backData.data.list_country[key]);
            }
        }
    }


    /**
     * 获取手机区号
     * @param webUrl 官网路径
     */
    public async getAreaCodeInfoList(webUrl:string) {
        let regionInfos:GetRegincodeModel =await ConfigUtil.getInstance().getRegincode(webUrl);
        this.backData = await ConfigUtil.getInstance().getCounteyCode(webUrl);
        if (this.backData.code == HttpClient.HTTP_SUCCESS_NET_CODE) {
            this.areaCodeListArr=[]
            this.countryCode = this.backData.data.list_country.filter((item)=>{
                return item.code == regionInfos.mobile_code;
            })[0];

            let country_code = localStorage.getItem(LocalStorageUtil.STORAGES_PHONE_REGION);
            if (country_code != null && country_code != 'undefined') {
                this.countryCode = this.backData.data.list_country.filter((item)=>{
                    return item.code == country_code;
                })[0];
            };
            this.country_code = this.countryCode.code;
            //将list_country里面存在的Top里的数据；从list_country过滤掉
            this.backData.data.list_country.map(item=>{
                let find=false
                for(let qq=0;qq<this.backData.data.top_country.length;qq++){
                    if(item.code==this.backData.data.top_country[qq].code){
                        find=true
                    }
                }
                if(!find){
                    this.areaCodeListArr.push(item)
                }
            })
            let n = 0;
            let list = [];
            let arr = {
                label:"",
                options:[]
            };
            for(let i=0; i< this.areaCodeListArr.length ; i++){
                if(i == this.areaCodeListArr.length - 1) {
                    let arr = {
                        label:"",
                        options:[]
                    };
                    arr.label = this.areaCodeListArr[i].group;
                    arr.options = this.areaCodeListArr.slice(n,i+1);
                    list.push(arr);
                } else if(this.areaCodeListArr[i].group != this.areaCodeListArr[i+1].group){
                    let arr = {
                        label:"",
                        options:[]
                    };
                    arr.label = this.areaCodeListArr[i].group;
                    arr.options = this.areaCodeListArr.slice(n,i+1);
                    list.push(arr);
                    n = i+1;
                }
            }
            arr.options = this.backData.data.top_country;
            list.unshift(arr);
            this.country_code_list = list;
        }
    }




    /**
     * 切换登录方式
     */
    public changeLoginType(type: number) {
        this.loginType = type;
        //读取loaclStorage
        let password = null;
        if (type == 0 && !this.isPwMd5) {
            password = localStorage.getItem(LocalStorageUtil.STORAGES_PHONE_PW);
            if (password == null) password = '';
        }
        if (type == 1 && !this.isPwMd5) {
            password = localStorage.getItem(LocalStorageUtil.STORAGES_EMAIL_PW);
            if (password == null) password = '';
        }
        if (password != '') {
            this.isKeepPw = true;
        } else {
            this.isKeepPw = false;
        }
        this.isPwMd5 = false;
        if (type == 0) {
            this.phonePassword = password;
        }
        if (type == 1) {
            this.emailPassword = password;
        }
    }

    /**
     * 密码修改
     */
    public onPasswordInput(type: number) {
        if (type == 0) {
            let password = localStorage.getItem(LocalStorageUtil.STORAGES_PHONE_PW);
            if (this.phonePassword == password) return;
        }
        if (type == 1) {
            let password = localStorage.getItem(LocalStorageUtil.STORAGES_EMAIL_PW);
            if (this.emailPassword == password) return;
        }
        this.isPwMd5 = true;
    }

    /**
     * 手机登录
     */
    public onPhoneLogin() {
        const url = HttpClient.URL_AUTH_LOGIN;
        let password = this.phonePassword;
        if (this.isPwMd5) {
            password = Md5(this.phonePassword).toString();
        }
        ;
        let param = new LoginRequestModel();
        param.country_code = this.country_code;
        param.username = this.phone;
        param.password = password;
        param.src_channel = LocalStorageUtil.getSrcChannel();
        localStorage.setItem(LocalStorageUtil.STORAGES_PHONE, this.phone);
        localStorage.setItem(LocalStorageUtil.STORAGES_USERNAME, this.phone);
        localStorage.setItem(LocalStorageUtil.STORAGES_PHONE_REGION, this.country_code);
        if (this.isKeepPw) {
            localStorage.setItem(LocalStorageUtil.STORAGES_PHONE_PW, password);
            localStorage.setItem(LocalStorageUtil.STORAGES_PW, password);
        } else {
            localStorage.removeItem(LocalStorageUtil.STORAGES_PHONE_PW);
            localStorage.removeItem(LocalStorageUtil.STORAGES_PHONE_REGION);
        }
        this.loginIn(url, param);
    }

    /**
     * 邮箱登录
     */
    public onEmaillLogin() {
        const url = HttpClient.URL_AUTH_LOGIN;
        let password = this.emailPassword;
        if (this.isPwMd5) {
            password = Md5(this.emailPassword).toString();
        }
        let param = new LoginRequestModel();
        param.username = this.email;
        param.password = password;
        param.src_channel = LocalStorageUtil.getSrcChannel();
        localStorage.setItem(LocalStorageUtil.STORAGES_EMAIL, this.email);
        localStorage.setItem(LocalStorageUtil.STORAGES_USERNAME, this.email);
        if (this.isKeepPw) {
            localStorage.setItem(LocalStorageUtil.STORAGES_EMAIL_PW, password);
            localStorage.setItem(LocalStorageUtil.STORAGES_PW, password);
        } else {
            localStorage.removeItem(LocalStorageUtil.STORAGES_EMAIL_PW);
        }
        this.loginIn(url, param);
    }

    /**
     * 登录
     */
    public async loginIn(url: string, param: any) {
        this.isLoading = true;
        this.loadingMsg = TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_LOADING);
        this.backData = await this.http.post<LoginModel>(url, param);
        if (this.backData.code == HttpClient.HTTP_SUCCESS_NET_CODE) {
            this.isLoading = false;
            const loginM: LoginModel = this.backData.data;
            LocalStorageUtil.addUserToken(loginM.login_info);
            LocalStorageUtil.addUserInfo(loginM.user_info);
            this.onLoginSuccess();
        } else {
            this.isLoading = false;
            this.onLoginFaild(this.backData)
        }
    }

    /**
     * 登录成功
     * TODO... 此方法可以重写，处理登录成功后的ui逻辑
     */
    onLoginSuccess() {
    }

    /**
     * 登录失败
     * TODO... 此方法可以重写，处理登录失败后的ui逻辑
     */
    onLoginFaild(data: any) {
    }
    /**
     * 是否需要图形验证码
     */
    public async registerIsCaptcha() {
        const url = HttpClient.URL_IS_CAPTCHA_LIST;
        const param = new CaptchaRequestModel();
        // 是否需要 手机注册 的验证码
        param.path_method = param.getPhoneRegisterPath();
        this.backData = await this.http.post<CaptchaModel>(url, param);
        if (this.backData.code == HttpClient.HTTP_SUCCESS_NET_CODE) {
            this.isimgVerification = this.backData.data.is_validate as number;
            if (this.isimgVerification == 1) {
                this.onGetCaptcha();
            }
        }
    }

    /**
     * 获取图形验证码
     */
    public async onGetCaptcha() {
        this.isimgVerification = 1;
        const url = HttpClient.URL_CODE_CAPTCHA;
        const param = new ImgCaptchaRequestModel();

        this.backData = await this.http.get<ImgCaptchaModel>(url, param);
        if (this.backData.code == HttpClient.HTTP_SUCCESS_NET_CODE) {
            this.imgCaptchaM = this.backData.data;
        }
    }
    /**
     * 获取短信/语音验证码
     * @param type 0短信 1语言
     */
    public async onGetSmscode(type: number,state: number) {
        let url = '';
        if (type == 0) {
            url = HttpClient.URL_CODE_SMSCODE;
        } else if (type == 1) {
            url = HttpClient.URL_CODE_VOICE;
        }
        let param = new SmsCaptchaRequestModel();
        param.phone = this.phone;
        param.country_code = this.country_code;
        param.state = state;
        param.checkcode = this.imgCaptchaCode;
        param.checkcode_key = this.imgCaptchaM.key;
        //loading
        this.isLoading = true;
        this.loadingMsg = TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_LOADING);
        //
        this.backData = await this.http.post<SmsCaptchaModel>(url, param);
        this.isLoading = false;
        if (this.backData.code == HttpClient.HTTP_SUCCESS_NET_CODE) {
            // 正确返回
            this.smsCapchaM = this.backData.data;
            this.bind_status = this.backData.data.bind_status;
            this.voiceShow=true;//显示
            this.onGetSmscodeSuccess();
        } else {
            this.onGetSmscodeFaild(this.backData)
            // 获取图形验证码
            this.onGetCaptcha();
        }
    }
    // 获取短信验证码成功
    public onGetSmscodeSuccess(){
        this.smsCountDownNum = 60;
        const sefl = this;
        Util.countDown(this.smsCountDownNum, 1, (n: number) => {
            sefl.smsCountDownNum = n;
        });
        this.SmscodeSuccessTip()
    }
    // 获取短信验证码成功提示-重写
    SmscodeSuccessTip(){

    }
    // 获取短信验证码失败-重写
    onGetSmscodeFaild(data: any) {

    }
    // 绑定手机号的动作
    public async bindPhone() {
        this.isLoading = true;
        let token =LocalStorageUtil.getUserToken().account_token;
        let url = HttpClient.URL_USER_BIND_PHONE;
        let param = new BindPhoneRequestModel();
        param.account_token = token;
        param.phone = this.phone;
        param.smscode = this.smscode;
        param.smscode_key = this.smsCapchaM.smscode_key;
        param.country_code = this.country_code;

        this.backData = await this.http.post(url, param);
        this.isLoading = false;
        if (this.backData.code == HttpClient.HTTP_SUCCESS_NET_CODE) {
            this.bindPhoneSuccess(this.backData.msg)
        }else {
            this.bindPhoneFaild(this.backData)
        }
    }
    /**
     * 绑定手机成功ui逻辑
     * todo 此方法需在UI逻辑文件中重写
     */
    public bindPhoneSuccess(msg:string) {

    }

    /**
     * 绑定手机失败ui逻辑
     * todo 此方法需在UI逻辑文件中重写
     */
    public bindPhoneFaild(data: any) {

    }
    /**
     * TODO... 需要重写此方法
     * token过期处理
     * @param param
     */
    public tokenExpired(param: string = ''): void {

    }

}

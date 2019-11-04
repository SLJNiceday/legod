import {Vue} from "vue-property-decorator";
import {UserInfo} from "@/ts/models/UserModel";
import {LanguageConfig, LanguageInfo} from "@/ts/utils/Language";
import HttpClient from "@/ts/net/HttpClient";
import {IdataModel} from "@/ts/models/IdataModel";
import JumpWebUtil from "@/ts/utils/JumpWebUtil";
import LocalStorageUtil from "@/ts/utils/LocalStorageUtil";
import {IProxy} from "@/ts/interface/IProxy";
import Component from "vue-class-component";
import {GetRegincodeModel} from "@/ts/models/NewsModel";
import ConfigUtil from "@/ts/utils/ConfigUtil";

@Component
export default class HeadProxy extends Vue implements IProxy {

    public isLogin: boolean = false; //是否登录
    public userInfo: UserInfo = new UserInfo();
    public pageName: string = ''; // 当前的页面
    public seleteLng: LanguageInfo = new LanguageInfo(); //选择的语言
    public seleteCode: string = '';
    public selectPage: string = '更多';
    public languageList: LanguageInfo[] = [];
    private _lanConfig: LanguageConfig = null;
    public styleType: number = 0; //0默认透明 1白色
    public nowCountryObj={
        code: "",
        group: "",
        ico: "",
        iso_code: "",
        name: "",
    };
    public codeList=[]
    public http = new HttpClient();
    public backData: IdataModel<any> | undefined;

    public init(): void {
        this.onSetLanguage();
        this.checkLogin();
    }

    public setBaseUrl(url: string): void {
        this.http.setBaseUrl(url);
    }

    public execute(): void {
    }

    /**
     * 设置语言类，每个项目都有一个语言类，切勿搞错
     * @param value
     */
    public set lanConfig(value: LanguageConfig) {
        this._lanConfig = value;
        this.languageList = this.lanConfig.getLanguageList();
    }

    public get lanConfig() {
        return this._lanConfig;
    }

    /**
     * 退出登录
     */
    public async onLoginOut() {
        const tokenInfo = LocalStorageUtil.getUserToken();
        const url = HttpClient.URL_AUTH_LOGOUT;
        const param = {
            account_token: tokenInfo.account_token,
        };

        this.backData = await this.http.post(url, param);
        if (this.backData.code == HttpClient.HTTP_SUCCESS_NET_CODE
            || this.backData.code == HttpClient.HTTP_TOKEN_EXPIRE) {
            LocalStorageUtil.loginOut();
            this.onLoginOutSuccess();
        } else {
            //退出登录失败
            this.onLoginOutError();
        }
    }
    /**
     * 退出登录成功,返回首页
     * TODO...可以重写此方法
     */
    public backHome(){
        JumpWebUtil.backHome();
    }
    /**
     * 退出登录成功
     * TODO...可以重写此方法
     */
    public onLoginOutSuccess() {

    }

    /**
     * 退出登录错误
     * TODO...可以重写此方法
     */
    public onLoginOutError() {
    }

    /**
     * 检测是否登录
     */
    public checkLogin() {
        const info = LocalStorageUtil.getUserInfo();
        if (info != null) {
            this.userInfo = info;
            this.isLogin = true;
        }else {
            this.isLogin = false;
        }
    }

    /**
     * 通过地址栏获取当前页面
     */
    public getPageIndex() {
        const href = window.location.href;
        const arr = href.split("/");
        this.pageName = arr[arr.length - 1].split('?')[0];
        if (this.pageName == '') {
            this.pageName = 'index.html'
        }
    }

    /**
     * 切换页面状态
     */
    public changeIndex(pageIndex: number) {
    }

    /**
     * 切换语言
     */
    onSetLanguage(ln: string = '') {
        if (ln == '' || ln == null) {
            ln = LocalStorageUtil.getLanguage();
        }
        this.seleteLng = this.lanConfig.getLanguageInfo(ln, this.languageList);
        this.seleteCode = this.seleteLng.code;
    }
    /**
     * 获取手机区号
     */
    public async getAreaCodeInfoList(webUrl:string) {
        let regionInfos:GetRegincodeModel =await ConfigUtil.getInstance().getRegincode(webUrl);
        this.backData = await ConfigUtil.getInstance().getCounteyCode(webUrl);
        if (this.backData.code == HttpClient.HTTP_SUCCESS_NET_CODE) {
            let  tempCodeList=[]
            this.nowCountryObj = this.backData.data.list_country.filter((item)=>{
                return item.code == regionInfos.mobile_code;
            })[0];

            let country_code = localStorage.getItem(LocalStorageUtil.STORAGES_PHONE_REGION);
            if (country_code) {
                this.nowCountryObj = this.backData.data.list_country.filter((item)=>{
                    return item.code == country_code;
                })[0];
            };

            //将list_country里面存在的Top里的数据；从list_country过滤掉
            this.backData.data.list_country.map(item=>{
                let find=false
                for(let qq=0;qq<this.backData.data.top_country.length;qq++){
                    if(item.code==this.backData.data.top_country[qq].code){
                        find=true
                    }
                }
                if(!find){
                    tempCodeList.push(item)
                }
            })
            let n = 0;
            let list = [];
            let arr = {
                label:"",
                options:[]
            };
            for(let i=0; i< tempCodeList.length ; i++){
                if(i == tempCodeList.length - 1) {
                    let arr = {
                        label:"",
                        options:[]
                    };
                    arr.label = tempCodeList[i].group;
                    arr.options = tempCodeList.slice(n,i+1);
                    list.push(arr);
                } else if(tempCodeList[i].group != tempCodeList[i+1].group){
                    let arr = {
                        label:"",
                        options:[]
                    };
                    arr.label = tempCodeList[i].group;
                    arr.options = tempCodeList.slice(n,i+1);
                    list.push(arr);
                    n = i+1;
                }
            }
            arr.options = this.backData.data.top_country;
            list.unshift(arr);
            this.codeList=list
        }
    }
}

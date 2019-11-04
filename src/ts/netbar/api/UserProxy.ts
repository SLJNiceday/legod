import {Vue, Component} from "vue-property-decorator";
import "babel-polyfill";
import HttpClient from "@/ts/net/HttpClient";
import Util from "@/ts/utils/Util";
import LocalStorageUtil from "@/ts/netbar/utils/LocalStorageUtil";
import {
    UserInfoModel
} from "@/ts/netbar/model/userModel";
import JumpWebUtil from "@/ts/utils/JumpWebUtil";
import {BaseVue} from "@/ts/netbar/api/baseVue";

@Component
export default class UserProxy extends BaseVue {
    public curNavIndex: number = 2;//tabnav选中index
    public userInfo: UserInfoModel = new UserInfoModel();
    public account_token: string = LocalStorageUtil.getCookie(LocalStorageUtil.STORAGES_TOKEN) || '';
    public localPackage: any = [];
    public packageList:any = {};

    /**
     * 获取用户信息
     */
    public async getUserInfo() {
        let account_token = this.account_token;
        let url = HttpClient.NETBAR_ACCOUNT_INFO;
        let param = {account_token};
        this.backData = await this.http.post<UserInfoModel>(url,param);
        if(this.backData.code == HttpClient.HTTP_SUCCESS_NET_CODE) {
            this.userInfo = this.backData.data as UserInfoModel;
            UserInfoModel.getUserAvatar(this.userInfo);
            LocalStorageUtil.setCookie(LocalStorageUtil.STORAGES_USER_INFO,JSON.stringify(this.userInfo));
            localStorage.setItem(LocalStorageUtil.STORAGES_USER_INFO,JSON.stringify(this.userInfo));
            this.getUserInfoSuccess()
        }else if(this.backData.code == HttpClient.HTTP_TOKEN_EXPIRE) {
            this.tokenExpired();
        }else {
            this.$message.error(this.backData.msg);
        }
    }

    /**
     * 获取用户信息成功
     */
    public getUserInfoSuccess() {
        (this.$refs.component as any).initA();
    }

    /**
     * 获取网吧当前套餐
     */
    public async getLocalPackage() {
        let account_token = this.account_token;
        let url = HttpClient.NETBAR_ACCOUNT_PACKAGE;
        let param = {account_token};
        this.backData = await this.http.post(url,param);
        if(this.backData.code == HttpClient.HTTP_SUCCESS_NET_CODE) {
            this.localPackage = this.backData.data;
        }else if(this.backData.code == HttpClient.HTTP_TOKEN_EXPIRE) {
            this.tokenExpired();
        }else {
            this.$message.error(this.backData.msg);
        }
    }

    /**
     * 获取网吧可购买套餐
     */
    public async getPackageList() {
        let account_token = this.account_token;
        let url = HttpClient.NETBAR_ACCOUNT_PACKAGE_LIST;
        let param = {account_token};
        this.backData = await this.http.post(url,param);
        if(this.backData.code == HttpClient.HTTP_SUCCESS_NET_CODE) {
            this.packageList = this.backData.data;
            this.getPackageListSuccess(this.backData.data);
        }else if(this.backData.code == HttpClient.HTTP_TOKEN_EXPIRE) {
            this.tokenExpired();
        }else {
            this.$message.error(this.backData.msg);
        }
    }

    /**
     * 获取套餐列表成功
     * todo 需重写ui逻辑
     */
    public getPackageListSuccess(data:any) {

    }

    /***
     * 修改用户信息
     */
    public async onSaveUserInfo(param: any) {
        const url = HttpClient.NETBAR_ACCOUNT_EDIT;
        this.backData = await this.http.post(url,param);
        if(this.backData.code == HttpClient.HTTP_SUCCESS_NET_CODE) {
            this.saveUserInfoSuccess();
        }else if(this.backData.code == HttpClient.HTTP_TOKEN_EXPIRE) {
            this.tokenExpired();
        }else {
            this.$message.error(this.backData.msg);
        }
    }

    /**
     * 修改用户信息成功
     * todo 需重写UI逻辑
     */
    public saveUserInfoSuccess() {

    }

    /**
     * 购买套餐(生成订单)
     */
    public async onBuyPackage(param: any) {
        const url = HttpClient.NETBAR_ACCOUNT_PACKAGE_BUY;
        this.backData = await this.http.post(url,param);
        if(this.backData.code == HttpClient.HTTP_SUCCESS_NET_CODE) {
            this.onBuyPackageSuccess(this.backData.data);
        }else if(this.backData.code == HttpClient.HTTP_TOKEN_EXPIRE) {
            this.tokenExpired();
        }else {
            this.$message.error(this.backData.msg);
        }
    }

    /**
     * 生成订单成功
     * todo 需重写UI逻辑
     */
    public onBuyPackageSuccess(data: any) {

    }

    /**
     * 获取订单支付状态
     */
    public async checkOrderStatus(order_id: string) {
        const url = HttpClient.NETBAR_INVOICE_STATE;
        let param = {
            account_token:this.account_token,
            invoice_id:order_id
        };
        this.backData = await this.http.post(url,param);
        if(this.backData.code == HttpClient.HTTP_SUCCESS_NET_CODE) {
            this.orderPaySuccess(this.backData.data);
        }else if(this.backData.code == HttpClient.HTTP_TOKEN_EXPIRE) {
            this.tokenExpired();
        }else {
            this.$message.error(this.backData.msg);
        }
    }

    /**
     * 订单支付成功
     * todo 需重写ui逻辑
     */
    public orderPaySuccess(data: any) {

    }

    /**
     * token失效
     */
    public tokenExpired() {
        this.$message.error('登录已过期,请重新登录!')
    }

    /**
     * 退出登录
     */
    public LoginOut() {
        LocalStorageUtil.removeCookie(LocalStorageUtil.STORAGES_TOKEN);
        window.location.href = '/login.html';
    }
}

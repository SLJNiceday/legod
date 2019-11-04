import {BaseVue} from "@/ts/netbar/api/baseVue";
import XmlHttpClient from "@/ts/net/XmlHttpClient";
import {
    PCWxCheckloginRequestModel,
    PCWxloginRequestModel,
    SubuserGetCatListBackModel,
    SubuserGetOrderBackModel, SubuserGetOrderRequestModel,
    SubuserOrderNewBackModel,
    SubuserOrderNewRequestModel,
    SubuserSendBindSmsBackModel,
    SubuserSendBindSmsRequestModel,
    SubuserSendBindTelBackModel,
    SubuserSendBindTelRequestModel,
    WxloginBackModel,
    WxloginCheckBackModel
} from "@/ts/netbar/model/WxLoginModel";
import {ImgCaptchaModel, ImgCaptchaRequestModel} from "@/ts/netbar/model/RegModel";

export class PcProxy extends BaseVue {
    public imgCaptchaM = new ImgCaptchaModel();//图片验证码对象
    public imgCaptchaKey = '';//图片验证码key
    public phone = '';//手机号
    public smscode = '';//短信验证码
    public checkcode = '';//图形验证码
    public notifMessage = '';//提示信息
    public smsCountDownNum = 0;//倒计时
    public subuserid = 0;//用户子账号id
    public password = '';//密码
    public addHours = 0;//充值后新增的时间

    public xmlHttp = new XmlHttpClient();

    /**
     * 获取登录二维码
     * @param param
     */
    async getLoginScan(params: PCWxloginRequestModel) {
        let url = XmlHttpClient.GET_WXLOGIN;
        let d = await this.xmlHttp.post<WxloginBackModel>(url, params);
        console.log(d)
        if (d.code == XmlHttpClient.HTTP_SUCCESS_NET_CODE) {
            this.getLoginScanSuccess(d)
        } else {
            this.getLoginScanFail(d)
        }
    }

    /**
     * 获取登录二维码成功
     * @param d
     */
    async getLoginScanSuccess(d: WxloginBackModel) {
    }

    /**
     * 获取登录二维码
     * @param d
     */
    async getLoginScanFail(d: WxloginBackModel) {

    }

    /**
     * 检查扫码登录结果
     * @param param
     */
    async checkoutLoginScan(params: PCWxCheckloginRequestModel) {
        let url = XmlHttpClient.GET_CHECK_WXLOGIN;
        let d = await this.xmlHttp.post<WxloginCheckBackModel>(url, params);
        console.log(d)
        if (d.code == XmlHttpClient.HTTP_SUCCESS_NET_CODE) {
            this.checkoutLoginScanSuccess(d);
        } else if (d.dcode == XmlHttpClient.HTTP_PCWXWAIT_SCAN) {//等待扫码 不做处理

        } else {
            this.checkoutLoginScanFail(d);
        }
    }

    /**
     * 检查扫码登录结果成功
     * @param d
     */
    async checkoutLoginScanSuccess(d: WxloginCheckBackModel) {
    }

    /**
     * 检查扫码登录结果失败
     * @param d
     */
    async checkoutLoginScanFail(d: WxloginCheckBackModel) {

    }

    /**
     * 子账号发送绑定手机短信验证码
     * @param param
     */
    async subuserSendBindSms(params: SubuserSendBindSmsRequestModel) {
        let url = XmlHttpClient.SUBUSER_SENDBINDSMS;
        let d = await this.xmlHttp.post<SubuserSendBindSmsBackModel>(url, params);
        console.log(d)
        if (d.code == XmlHttpClient.HTTP_SUCCESS_NET_CODE) {
            this.subuserSendBindSmsSuccess(d);
        } else {
            this.subuserSendBindSmsFail(d);
        }
    }

    /**
     * 子账号发送绑定手机短信验证码成功
     * @param d
     */
    async subuserSendBindSmsSuccess(d: SubuserSendBindSmsBackModel) {
    }

    /**
     * 子账号发送绑定手机短信验证码失败
     * @param d
     */
    async subuserSendBindSmsFail(d: SubuserSendBindSmsBackModel) {

    }

    /**
     * 获取图形验证码
     */
    public async onGetCaptcha() {
        const url = XmlHttpClient.GETCHECK_CODE;
        const param = new ImgCaptchaRequestModel();
        let d = await this.xmlHttp.get<ImgCaptchaModel>(url, param);
        if (d.code == XmlHttpClient.HTTP_SUCCESS_NET_CODE) {
            this.imgCaptchaM = d;
            this.imgCaptchaKey = this.imgCaptchaM.key;
        }
    }

    /**
     *  刷新图形验证码
     */
    public getCaptcha() {
        //TODO...需要验证输入
        this.onGetCaptcha();
    }

    /**
     * 子账号绑定手机号
     * @param param
     */
    async subuserSendBindTel(params: SubuserSendBindTelRequestModel) {
        this.isLoading = true;
        let url = XmlHttpClient.SUBUSER_BINDTEL;
        let d = await this.xmlHttp.post<SubuserSendBindTelBackModel>(url, params);
        console.log(d)
        this.isLoading = false;
        if (d.code == XmlHttpClient.HTTP_SUCCESS_NET_CODE) {
            this.subuserSendBindTelSuccess(d);
        } else {
            this.subuserSendBindTelFail(d);
        }
    }

    /**
     * 子账号绑定手机号成功
     * @param d
     */
    async subuserSendBindTelSuccess(d: SubuserSendBindTelBackModel) {
    }

    /**
     * 子账号绑定手机号失败
     * @param d
     */
    async subuserSendBindTelFail(d: SubuserSendBindTelBackModel) {

    }


    /**
     * 获取子账号套餐列表
     * @param param
     */
    async subuserGetCatList() {
        this.isLoading = true;
        let url = XmlHttpClient.GET_SUBUSER_CAT_LIST;
        let params = {}
        let d = await this.xmlHttp.get<SubuserGetCatListBackModel>(url, params);
        console.log(d)
        this.isLoading = false;
        if (d.code == XmlHttpClient.HTTP_SUCCESS_NET_CODE) {
            this.subuserGetCatListSuccess(d);
        } else {
            this.subuserGetCatListFail(d);
        }
    }

    /**
     * 获取子账号套餐列表成功
     * @param d
     */
    subuserGetCatListSuccess(d: SubuserGetCatListBackModel) {
    }

    /**
     * 获取子账号套餐列表失败
     * @param d
     */
    subuserGetCatListFail(d: SubuserGetCatListBackModel) {
    }


    /**
     * 子账号生成订单
     * @param param
     */
    async subuserOrderNew(params: SubuserOrderNewRequestModel) {
        this.isLoading = true;
        let url = XmlHttpClient.GET_SUBUSER_ORDER_NEW;
        let d = await this.xmlHttp.post<SubuserOrderNewBackModel>(url, params);
        console.log(d)
        this.isLoading = false;
        if (d.code == XmlHttpClient.HTTP_SUCCESS_NET_CODE) {
            this.subuserOrderNewSuccess(d);
        } else {
            this.subuserOrderNewFail(d);
        }
    }

    /**
     * 获取子账号套餐列表成功
     * @param d
     */
    subuserOrderNewSuccess(d: SubuserOrderNewBackModel) {
    }

    /**
     * 获取子账号套餐列表失败
     * @param d
     */
    subuserOrderNewFail(d: SubuserOrderNewBackModel) {
    }

    /**
     * 查询订单支付结果
     * @param param
     */
    async subuserOrderList(params: SubuserGetOrderRequestModel) {
        // this.isLoading = true;
        let url = XmlHttpClient.GET_SUBUSER_ORDER_RESULT;
        let d = await this.xmlHttp.post<SubuserGetOrderBackModel>(url, params);
        console.log(d)
        // this.isLoading = false;
        if (d.code == XmlHttpClient.HTTP_SUCCESS_NET_CODE) {
            this.subuserOrderListSuccess(d);
        } else {
            if (d.dcode == 10001) {//订单尚未支付

            } else {
                this.subuserOrderListFail(d);
            }
        }
    }

    /**
     * 查询订单支付结果成功
     * @param d
     */
    subuserOrderListSuccess(d: SubuserGetOrderBackModel) {
    }

    /**
     * 查询订单支付结果失败
     * @param d
     */
    subuserOrderListFail(d: SubuserGetOrderBackModel) {
    }

}

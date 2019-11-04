import {Vue, Component} from "vue-property-decorator";
import 'babel-polyfill';
import './less/pc.less';
import {PcProxy} from "@/ts/netbar/api/PcProxy";
import GlobalConfig from "./global_config";
import {Loading} from 'element-ui'
import {
    SubuserGetCatListArrModel, SubuserGetOrderRequestModel,
    SubuserOrderNewRequestModel
} from "@/ts/netbar/model/WxLoginModel";
import Util from "@/ts/utils/Util";

Vue.use(Loading);

@Component
class Recharge extends PcProxy {
    public catlist = {};//套餐列表
    public selectIndex = 0;//选中套餐索引
    public selectedPackage = new SubuserGetCatListArrModel();//选中套餐
    public payType = 0;//支付方式 0 微信 1支付宝
    public rechargeStep = 1;//充值步骤 1 充值选择   2 扫码   3 结果
    public payStatus = 0;//充值状态 0 成功  1失败
    public netbarid = Number(Util.getUrlParam('userid'));//网吧id
    public subuserid = Number(Util.getUrlParam('subuserid'));//子账户id
    public imgCodeUrl = ""//二维码地址;
    private timer = null;//定时器


    async created() {
        this.setBaseUrl(GlobalConfig.getBaseUrl());
        await this.init()
    }

    /**
     * 页面初始化
     */
    public async init() {
        this.subuserGetCatList();

    }

    /**
     * 获取套餐成功
     */
    subuserGetCatListSuccess(d) {
        let lists = d.items.item;
        this.catlist = lists;
        this.selectedPackage = this.catlist[0];
        console.log(this.selectedPackage)
    }

    /**
     * 选中套餐
     * @param items
     * @param index
     */
    onselectPackage(items, index) {
        this.selectIndex = index;
        this.selectedPackage = items;
    }

    /**
     * 选择支付方式
     * @param type 0 微信  1支付宝
     */
    selectPaytype(type: number = 0) {
        this.payType = type;
        this.onpay()
    }

    /**
     * 返回支付首页
     */
    backIndex() {
        this.rechargeStep = 1;
        clearInterval(this.timer)
    }

    /**
     * 唤起支付
     */
    onpay() {
        let params = new SubuserOrderNewRequestModel();
        params.catid = this.selectedPackage.id;
        params.netbarid = this.netbarid;
        params.subuserid = this.subuserid;
        params.pay = this.payType == 0 ? 'weixin_native' : 'alipay';
        this.subuserOrderNew(params);
    }

    /**
     * 生成订单成功
     */
    subuserOrderNewSuccess(d) {
        this.rechargeStep = 2;
        this.imgCodeUrl = d.code_img_url;
        let params = new SubuserGetOrderRequestModel();
        params.orderid = d.orderid;
        params.token = d.token;
        this.timer = setInterval(() => {
            this.subuserOrderList(params);
        }, 3000)
    }

    /**
     * 查询订单成功
     * @param d
     */
    subuserOrderListSuccess(d) {
        this.payStatus = 0;
        this.rechargeStep = 3;
        this.addHours = d.hours;
        clearInterval(this.timer);
        let updataUrl="core://game/subuser_fee_success:"+this.subuserid+":"+d.expirestr;
        window.location.href=updataUrl;
    }

    /**
     * 查询订单失败
     * @param d
     */
    subuserOrderListFail(d) {
        this.payStatus = 1;
        this.rechargeStep = 3;
        clearInterval(this.timer);
    }
}

new Recharge().$mount('#app');
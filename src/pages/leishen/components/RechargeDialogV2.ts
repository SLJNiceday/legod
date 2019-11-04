import 'babel-polyfill';
import {Component, Vue, Prop} from 'vue-property-decorator';
import Util from '@/ts/utils/Util';
import {
    PayModel,
    PayRequestModel,
    payTransfer,
    UserDiscountList,
    UserRechargeInfo
} from '@/ts/models/UserModel';
import GlobalConfig from '../global.config';
import HttpClient from "@/ts/net/HttpClient";
import LocalStorageUtil from "@/ts/utils/LocalStorageUtil";
import {Dialog} from 'element-ui'
import PaymentDialog from './PaymentDialog';
import PayDialog from './PayDialog.vue';
import {TipsMsgUtil} from "@/ts/utils/TipsMsgUtil";
import {IdataModel} from "@/ts/models/IdataModel";

Vue.use(Dialog);

@Component({
    components: {
        'pay-step1': PaymentDialog,
        'pay-step2': PayDialog,
    }
})
export default class RechargeDialog extends Vue {

    public http = new HttpClient();
    public payDialogVisible: boolean = false; //是否显示付款的两步弹框
    public backData: IdataModel<any> | undefined; //返回的通用数据结构
    public userDiscountList: Array<UserDiscountList> = [];//请求回的全部折扣码列表
    public payTrans = new payTransfer(); //付款的第一步传递的付款参数
    public payModal = new PayRequestModel(); //发起请求付款的参数
    public discountList = [];//页面显示的折扣码列表
    public showType: number = 4; //控制显示支付第一步还是第二部； 4：设置支付方式（第一步） 5：二维码支付（第二步）
    public payObj: PayModel = new PayModel(); //支付成功返回的参数
    public payType: number = 1; //支付类型 1微信 2支付宝 3qq支付 5paypal  12银联支付
    public zheCode: string = ''; //折扣码
    public activity_package_id: number = 0; //发起付款的buy接口的package_id参数
    public created() {
        this.setBaseUrl(GlobalConfig.getBaseUrl());
        // 修复IE9中调用window.performance.now()报错的问题
        if (typeof window.performance.now !== 'function') {
            window.performance.now = function () {
                return ((+new Date()) - performance.timing.navigationStart)
            }
        }
    }
    /**
     * 必须是用户已经成功登录，才可以调用该方法
     * 可以购买-获取折扣码
     * 不可以购买-emit-cannotbuy事件
     */
   async init(){
      let canbuy=await this.getUserPackage();
      if(canbuy){
          this.getUserDiscount()
      }else{
          this.$emit('cannotbuy')
      }
    }
    /**
     * 获取用户的套餐信息,在用户登录成功以后，才可以调用
     * 返回true-代表可以购买
     * 返回false-代表不可以购买
     */
    public async getUserPackage() {
        const token = LocalStorageUtil.getUserToken().account_token;
        let url = HttpClient.URL_USER_PACKAGE;
        let param = {
            account_token: token,
            region_code: LocalStorageUtil.getRegionCodes()
        };
        let backData = await this.http.post<Array<UserRechargeInfo>>(url, param);
        if (backData.code == HttpClient.HTTP_SUCCESS_NET_CODE) {
            let userinfo=LocalStorageUtil.getUserInfo();
            let packageList=backData.data as Array<UserRechargeInfo>
            let region_code='1'
            for(let i=0;i<packageList.length;i++){
                if(packageList[i].package_id==userinfo.package_id){
                    region_code=packageList[i].include_region_codes
                    break
                }
            }
            if(userinfo.is_switch_package==1){
                return true
            }else if(region_code=='1'){
                return true
            }else{
                return false
            }
        } else {
            return true
        }
    }
    /**
     * 支付，调用buy接口的时候token过期
     */
    payLogout() {
        this.payDialogVisible = false;
        this.$emit('loginout',TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_LOGIN_FAILURE).toString());
    }

    /**
     * 获取用户套餐折扣信息
     */
    public async getUserDiscount() {
        const token = LocalStorageUtil.getUserToken().account_token;
        let url = HttpClient.URL_USER_DISCOUNT;
        let param = {
            account_token: token,
            region_code: LocalStorageUtil.getRegionCodes()
        };
        this.backData = await this.http.post<Array<UserDiscountList>>(url, param);
        if (this.backData.code == HttpClient.HTTP_SUCCESS_NET_CODE) {
            this.userDiscountList = this.backData.data;
        } else if (this.backData.code == HttpClient.HTTP_TOKEN_EXPIRE) {
            // this.tokenExpired();
        } else {
            // this.getUserDiscountError();
        }
    }
    /**
     * 根据用户所有的折扣列表,
     * 只有用户登录了以后，才可以调用
     */
    public filterDisount(payinfo:payTransfer) {
        this.discountList = [];
        this.userDiscountList.map(useritem => {
            if (useritem.price_ids.length > 0) {
                for (let qq = 0; qq < useritem.price_ids.length; qq++) {
                    if (useritem.price_ids[qq] == payinfo.price_id) {
                        if(useritem.discount_type==0){
                            //如果是折扣优惠券
                            let discount_value=parseFloat(payinfo.price_num)*(useritem.discount_value)
                            this.discountList.push({
                                value: useritem.title,
                                label: useritem.discount_code,
                                money_unit_fen:discount_value,
                                expired_time: useritem.expired_time
                            })
                        }else{
                            this.discountList.push({
                                value: useritem.title,
                                label: useritem.discount_code,
                                money_unit_fen:useritem.discount_value,
                                expired_time: useritem.expired_time
                            })
                        }

                    }
                }
            }
        });
        if(this.discountList.length>0){
            this.discountList.sort((itemA,itemB)=>{
                return itemB.money_unit_fen-itemA.money_unit_fen
            })
        }
    }

    /**
     *点击活动页面的支付按钮，初始化选择支付方式和选择折扣码弹框。
     */
    public setPayWay(id: number,data: any) {
        this.payDialogVisible = true;
        this.payTrans.price_id = data.price_id;
        this.payTrans.price_num = data.price_num;
        this.payTrans.price_title = data.price_title;
        this.activity_package_id = id;
        this.filterDisount(this.payTrans);
        this.payTrans.zheCodeList = this.discountList;
        this.$nextTick(() => {
            (this.$refs.paycomponentRef as any).init();
        })
    }


    /**
     * plan 支付返回的二维码显示方式 1官网二维码 2移动端需要的二维码 3官网pc端支付宝打开的控制台页面
     * 请求支付
     */
    public async onBuyActivityPackage() {
        let refer_code = Util.getUrlParam('refer_code');
        const url = HttpClient.URL_USER_PACKAGE_BUY;
        const token = LocalStorageUtil.getUserToken().account_token;
        let param = new PayRequestModel();
        param.account_token = token;
        param.invoice_from = param.switchFrom(0);
        param.package_id = this.activity_package_id;
        param.pay_type = this.payType;
        if(this.payType==2){
            //如果是支付宝支付
            param.qr_type='ali_qr'
        }
        param.price_id = this.payTrans.price_id;
        param.pay_plat = 1;
        param.src_channel = LocalStorageUtil.getSrcChannel();
        param.os_type = localStorage.getItem(LocalStorageUtil.STORAGES_OS_TYPE);
        if(refer_code){
            param.refer_code = refer_code;
        }

        if (this.zheCode != "" && this.zheCode != null) {
            param.discount_code = this.zheCode;
        }
        //
        this.backData = await this.http.post<PayModel>(url, param);
        this.payObj.pay_url = '';
        //
        if (this.backData.code == HttpClient.HTTP_SUCCESS_NET_CODE) {
            this.payObj = this.backData.data;
            this.onBeginpaySuccess();
        } else if (this.backData.code == HttpClient.HTTP_TOKEN_EXPIRE) {
            this.payLogout()
        } else {
            this.onBeginpayError(this.backData.msg);
        }
    }


    /**
     * 登陆成功
     */
    get paycomponent() {
        switch (this.showType) {
            case 4:
                return 'pay-step1';
                break;
            case 5:
                return 'pay-step2';
                break;
        }
    }

    /**
     * 点击 去支付
     * 完成了支付的第一步，支付方式和折扣码，
     * 准备跳转的支付的二维码
     */
    finishStep1(payType: number, zhekou: string) {
        this.payType = payType;
        this.zheCode = zhekou;
        this.onBuyActivityPackage();
    }

    /**
     * 请求支付成功
     */
    onBeginpaySuccess() {
        this.showType = 5; //弹出支付框
        // paypal支付自动刷新页面
        if (this.payType == 5) {
            //打开支付页面
            window.location.href = this.payObj.pay_url;
        }
        this.payObj.payType = this.payType;
        setTimeout(() => {
            (this.$refs.paycomponentRef as any).init();
        }, 0)
    }

    /**
     * 请求支付失败
     * TODO... 此方法可以重写，处理请求支付成功后的ui逻辑
     */
    onBeginpayError(msg: string) {
        this.$notify({
            title: TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_ERROR_TITLE),
            message: msg,
            type: "warning"
        });
    }

    /**
     * 支付成功点击确认
     */
    payDoned() {
        this.showType = 4;
        this.payDialogVisible = false;
        this.$emit('paysuccess');
    }

    /**
     * 关闭支付弹窗
     */
    public onClosePyaDialog() {
        this.payObj = new PayModel();
        if (this.showType == 5) {
            (this.$refs.paycomponentRef as any).onClose();
            this.showType = 4
        }
    }

    /**
     * 返回设置支付方式
     */
    goBack() {
        (this.$refs.paycomponentRef as any).onClose();
        this.showType = 4
    }

    /**
     * 设置后台请求的api
     */
    public setBaseUrl(url: string): void {
        this.http.setBaseUrl(url);
    }
}

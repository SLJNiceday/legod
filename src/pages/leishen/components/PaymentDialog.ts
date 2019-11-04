import {Component, Vue, Prop} from 'vue-property-decorator';
import {PayModel, payTransfer, UserInfo} from "@/ts/models/UserModel";
import {Form, FormItem, Input, Button, Autocomplete} from "element-ui";
import {RadioGroup, Radio, Checkbox, CheckboxGroup} from 'vant';
import alifont from '@/components/alifont_leishen.vue'
import LocalStorageUtil from "@/ts/utils/LocalStorageUtil";
import GlobalConfig from "@/pages/leishen/global.config";
import JumpWebUtil from "@/ts/utils/JumpWebUtil";

Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Button);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(Autocomplete);
Vue.use(Checkbox);
Vue.use(CheckboxGroup);
@Component({
    components: {
        alifont
    }
})
export default class PaymentDialog extends Vue {
    @Prop(payTransfer) paytrans!: payTransfer;
    public payway: number = 2 //默认支付方式，支付宝 //支付类型 1微信 2支付宝 3qq支付 5paypal
    public zheCode: string = ''
    public payObj: PayModel = new PayModel();
    public isLoading: boolean = false;
    public payDialogVisible: boolean = false;
    public zheCodeChecked: boolean = false
    public payType: number = 2; //支付类型 1微信 2支付宝 3qq支付 5paypal
    public userInfo: UserInfo = new UserInfo();
    public discountList = [];//页面显示的折扣码列表
    public zheCodeCopy: string = '';
    public memberItemLink=GlobalConfig.getWebBaseUrl()+"/"+JumpWebUtil.HTML_NAME_USERSERVER;//会员服务条款链接地址


    public init() {
        this.payType = this.payway//设置默认的支付方式为支付宝
        this.userInfo = LocalStorageUtil.getUserInfo();
        if (this.paytrans.zheCodeList.length > 0) {
            this.zheCodeChecked = true
            this.zheCodeCopy = this.paytrans.zheCodeList[0].value
            this.zheCode = this.paytrans.zheCodeList[0].label
        } else {
            this.zheCodeCopy = ''
            this.zheCode = ''
            this.zheCodeChecked = false
        }
    }

    /**
     * 获取用户私有折扣码
     */

    /**
     * 处理要显示的折扣码列表
     */
    public querySearch(queryString, cb) {
        let restaurants = this.paytrans.zheCodeList.filter(item=>{
            if(item.value==queryString||item.label==queryString){
                return true
            }
        })
        if(restaurants.length==0){
            this.zheCode=queryString
        }
        cb(this.paytrans.zheCodeList);
    }

    /**
     * 选择折扣码
     */
    public checkDiscount(item) {
        this.zheCode = item.label;
    }

    /**
     * 点击单选框
     */
    payWay(way: number) {
        this.payType = way
    }

    /**
     * 点击去支付
     */
    goToPay() {
        setTimeout(()=>{
            let zhekou = ''
            if (this.zheCodeChecked && this.zheCode.trim()) {
                zhekou = this.zheCode
            }
            this.$emit('paystep1', this.payType, zhekou)
        },500)
    }
}

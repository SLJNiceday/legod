<template>
    <div>
        <div >
            <p style="text-align:center;font-size: 16px;margin-bottom: 16px;">{{$t('user.b89')}}</p>
            <el-form ref="form" label-width="80px" style="background: #F5F5F5; border-radius:4px; padding: 5px 0;">
                <el-form-item :label="$t('user.b81')" style="margin-bottom: 0px;">
                    <div style="text-align: right;margin-right:16px;">
                        <span>{{paytrans.price_title}}</span>
                        <span>{{$t('recharge.c19')}}</span>
                    </div>
                </el-form-item>
                <el-form-item :label=" $t('recharge.c1')" style="margin-bottom: 0px;">
                    <div style="text-align: right;margin-right:16px;">
                    <span>￥{{paytrans.price_num}}</span>
                    </div>
                </el-form-item>
            </el-form>

            <div id="payElradioGroup">
                <van-radio-group v-model="payType" >
                    <van-radio :name="2" @click="payWay(2)">
                        <alifont name="zhifubao" class="payAli" ></alifont><span class="payTip">{{$t("user.b91")}}</span>
                    </van-radio>
                    <van-radio :name="1" @click="payWay(1)">
                        <alifont name="weixin" class="payWechart"></alifont> <span class="payTip">{{$t("user.b90")}}</span>
                    </van-radio>
                    <van-radio :name="3" @click="payWay(3)">
                        <alifont name="QQ" class="payQQ"></alifont><span class="payTip">{{$t("user.b92")}}</span>
                    </van-radio>
                </van-radio-group>
                <div  style="padding:16px;text-align: left;" id="payzhekou" v-if="userInfo.first_invoice_discount != 1">
                    <van-checkbox v-model="zheCodeChecked" shape="square" checked-color="#ffd33e">{{$t('recharge.c29')}}</van-checkbox><br/>
                    <el-autocomplete style="width:100%;" v-if="zheCodeChecked"
                            v-model="zheCodeCopy"
                            :fetch-suggestions="querySearch"
                            :placeholder="$t('recharge.c30')"
                            @select="checkDiscount"
                    ></el-autocomplete>
<!--                    <el-input v-model="zheCode" v-if="zheCodeChecked" :placeholder="$t('recharge.c30')"></el-input>-->
                </div>
                <div v-else>
                    <img src="../images/off_5.png" alt="">
                </div>
                <div class="leishen_memberItemsBox">
                    <span>{{$t("recharge.c5_1")}}</span>
                    <a :href="memberItemLink" target="_blank">{{$t("recharge.c5")}}</a>
                </div>
            </div>
            <p style="text-align: center;">
                <a class="public_btn checkbtn_font" style="padding: 6px 115px;border-radius: 30px;" @click="goToPay">
                    {{$t("recharge.c3_0")}}
                </a>
            </p>
        </div>
    </div>
</template>
<script lang="ts">
    import {Component, Vue, Prop} from 'vue-property-decorator';
    import {PayModel, payTransfer,UserInfo} from "@/ts/models/UserModel";
    import RechargeProxy from "@/ts/proxy/RechargeProxy";
    import {Form, FormItem, Input,  Button,Autocomplete} from "element-ui";
    import { RadioGroup, Radio,Checkbox, CheckboxGroup } from 'vant';
    import alifont from '@/components/alifont_leishen.vue'
    import GlobalConfig from "../global.config";
    import LocalStorageUtil from "@/ts/utils/LocalStorageUtil";
    import JumpWebUtil from "@/ts/utils/JumpWebUtil";

    Vue.use(Form)
    Vue.use(FormItem)
    Vue.use(Input)
    Vue.use(Button)
    Vue.use(Radio)
    Vue.use(RadioGroup)
    Vue.use(Autocomplete)
    Vue.use(Checkbox);
    Vue.use(CheckboxGroup);
    @Component({
        components:{
            alifont
        }
    })
    export default class wwwBill extends Vue {
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
        public zheCodeCopy:string='';
        public memberItemLink=GlobalConfig.getWebBaseUrl()+"/"+JumpWebUtil.HTML_NAME_USERSERVER;//会员服务条款链接地址
        public init() {
            this.payType = this.payway//设置默认的支付方式为支付宝
            this.userInfo = LocalStorageUtil.getUserInfo();
            if(this.paytrans.zheCodeList.length>0){
                this.zheCodeChecked=true
                this.zheCodeCopy=this.paytrans.zheCodeList[0].value
                this.zheCode=this.paytrans.zheCodeList[0].label
            }else{
                this.zheCodeCopy=''
                this.zheCode=''
                this.zheCodeChecked=false
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
                if(item.value.indexOf(queryString)!=-1||item.label.indexOf(queryString)!=-1){
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
        public checkDiscount(item){
            this.zheCode = item.label;
        }
        /**
         * 点击单选框
         */
        payWay(way:number){
           this.payType=way
        }
        /**
         * 点击去支付
         */
        goToPay() {
            setTimeout(()=>{
                let zhekou=''
                if(this.zheCodeChecked){
                    if(this.zheCode.trim()==''){
                        this.$emit('zhekouerror')
                        return
                    }else{
                        zhekou=this.zheCode
                    }
                }
                this.$emit('paystep1',this.payType,zhekou)
            },500)
        }

    }
</script>

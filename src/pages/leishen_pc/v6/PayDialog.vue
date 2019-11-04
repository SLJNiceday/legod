<template>
    <div>
        <div class="flex_column_center" style="position: relative;" v-if="!paySuccessShow">
            <!--支付详情-->
            <p class="pay_title">
                <span style="font-size: 0.14rem;color: #666;">{{$t('recharge.c35')}}: </span>
                <span style="font-size: 0.22rem;color: #333333;font-weight: normal">{{payobj.price_title}}{{$t('recharge.c19')}}</span>
                <span style="font-size: 0.14rem;color: #666;" v-if="!discount_show">
                    <!--<span>{{$t('recharge.c36')}}: </span>-->
                    <span>（</span>
                    <span style="color: #f4712c;">{{$t('recharge.c37_1')}}:¥{{payobj.amount}}&nbsp;&nbsp;</span>
                    <s>{{oldprice}}</s>
                    <span>）</span>
                </span>
                <span style="font-size: 0.14rem;color: #666;" v-if="discount_show">
                    <span>（</span>
                    <s>{{$t('recharge.c37_1')}}:¥{{choosenprice}}</s>
                </span>
                <span style="font-size: 0.14rem;color: #f4712c;margin-left: 0.1rem;" v-if="discount_show">
                    <span>{{$t('recharge.c37')}}: </span>
                    <span>¥{{payobj.amount}}）</span>
                </span>
            </p>
            <!--折扣码部分-->
            <div class="pay_discountcode">
                <el-tooltip class="item" effect="dark" :content="zhecodecopy" :disabled="!zhecodecopy" placement="top">
                    <div style="position: relative;">
                            <el-autocomplete
                                    class="inline-input"
                                    v-model="zhecodecopy"
                                    :fetch-suggestions="querySearch"
                                    :placeholder="$t('recharge.c30')"
                                    @select="checkDiscount"
                                    width="70"
                                    v-if="discount_show"
                            ></el-autocomplete>
                        <a class="v6_user_discount" v-if="discount_show" @click="useZhecode">{{$t('recharge.c39')}}</a>
                    </div>
                </el-tooltip>
                <div>
                    <label @click="useDiscount">
                        <img src="../images/discount_check_off.png" style="width: .19rem;height: .19rem;margin-right: 0.05rem;" alt="" v-if="!discount_show">
                        <img src="../images/discount_check_on.png" style="width: .19rem;height: .19rem;margin-right: 0.05rem;" alt="" v-if="discount_show">
                    </label>
                    <span style="display: inline-block;vertical-align: middle;margin-right: .05rem;color: #999;">{{$t('user.b83')}}</span>
                </div>
                <!--<el-tooltip effect="light" placement="bottom">-->
                    <!--<i class="iconfont iconic_wenhao"></i>-->
                    <!--<div slot="content">-->
                        <!--<p style="font-size: 0.14rem;">{{$t('recharge.c38')}}</p>-->
                    <!--</div>-->
                <!--</el-tooltip>-->
                <!--<input class="form_input" type="text" style="width: 1.29rem;margin-right: .05rem;">-->
            </div>
            <div style="width: 50%;">
                <!--支付方式-->
                <ul class="v6_pay_type flex_row_between">
                    <li class="v6_pay_type_li" :class="{'v6_pay_type_li_active':pay_type == 1}" @click="onChoosePayType(1)">
                        <!--<label>-->
                            <!--<img src="../images/pay_type_check_off.png" style="width: .18rem;height: .18rem;" v-if="pay_type != 1" alt="">-->
                            <!--<img src="../images/pay_type_check_on.png" style="width: .18rem;height: .18rem;" v-if="pay_type == 1" alt="">-->
                        <!--</label>-->
                        <i class="iconfont iconweixin"></i>
                        <span style="vertical-align: middle">{{$t('user.b90')}}</span>
                    </li>
                    <li class="v6_pay_type_li" :class="{'v6_pay_type_li_active':pay_type == 2}" @click="onChoosePayType(2)">
                        <!--<label>-->
                            <!--<img src="../images/pay_type_check_off.png" style="width: .18rem;height: .18rem;" v-if="pay_type != 2" alt="">-->
                            <!--<img src="../images/pay_type_check_on.png" style="width: .18rem;height: .18rem;" v-if="pay_type == 2" alt="">-->
                        <!--</label>-->
                        <i class="iconfont iconalipay"></i>
                        <span style="vertical-align: middle">{{$t('user.b91')}}</span>
                    </li>
                    <li class="v6_pay_type_li" :class="{'v6_pay_type_li_active':pay_type == 3}" @click="onChoosePayType(3)">
                        <!--<label>-->
                            <!--<img src="../images/pay_type_check_off.png" style="width: .18rem;height: .18rem;" v-if="pay_type != 3" alt="">-->
                            <!--<img src="../images/pay_type_check_on.png" style="width: .18rem;height: .18rem;" v-if="pay_type == 3" alt="">-->
                        <!--</label>-->
                        <i class="iconfont iconQQ"></i>
                        <span style="vertical-align: middle">{{$t('user.b92')}}</span>
                    </li>
                    <!--<li @click="onChoosePayType(12)">-->
                        <!--<label>-->
                            <!--<img src="../images/pay_type_check_off.png" style="width: .18rem;height: .18rem;" v-if="pay_type != 12" alt="">-->
                            <!--<img src="../images/pay_type_check_on.png" style="width: .18rem;height: .18rem;" v-if="pay_type == 12" alt="">-->
                        <!--</label>-->
                        <!--<img src="../images/bank_pay.png" style="width: .26rem;height: .26rem;margin: 0 .04rem;" alt="">-->
                        <!--<span>银联支付</span>-->
                    <!--</li>-->
                </ul>
                <!--二维码-->
                <div class="pay_ewm_box" v-if="pay_type != 12">
                    <p style="margin: 0.05rem auto 0.07rem;color:#000;font-size: 0.14rem;">
                        <span v-if="pay_type == 2">
                            {{$t('recharge.c41')}}
                            <span style="font-weight: 900;">{{$t('recharge.c41_0')}}</span>
                            <span>{{$t('recharge.c41_1')}}</span>
                        </span>
                        <span v-if="pay_type == 1">
                            {{$t('recharge.c41')}}
                            <span style="font-weight: 900;">{{$t('recharge.c42')}}</span>
                            {{$t('recharge.c41_1')}}
                        </span>
                        <span v-if="pay_type == 3">
                            {{$t('recharge.c41')}}
                            <span style="font-weight: 900;">{{$t('recharge.c43')}}</span>
                            <span>{{$t('recharge.c41_1')}}</span>
                        </span>
                    </p>
                    <iframe frameborder="0" width="166px" height="166px" security="restricted" scrolling="no" :src="payobj.pay_url"></iframe>
                    <p style="color: #999;">
                        <span>{{$t('recharge.c40')}}</span>
                    </p>
                    <div class="leishen_memberItemsBox">
                        <span>{{$t("recharge.c5_1")}}</span>
                        <a @click="gotoMemberItems">{{$t("recharge.c5")}}</a>
                    </div>
                </div>
                <!--<p v-if="pay_type != 12">30分钟后二维码将失效</p>-->
                <!--<p v-if="pay_type != 12"> 订单号：{{payobj.order_no}}</p>-->
                <!--银联支付-->
                <!--<p v-if="pay_type == 12 && !uniPay_begin" style="height: 1.66rem;line-height: 1.66rem;">温馨提示：去中国银联官网，用银行卡在线支付</p>-->
                <!--<a class="round_btn buy_btn" style="margin: 0;" @click="uniPay" v-if="pay_type == 12 && !uniPay_begin">去支付</a>-->
                <!--<p v-if="pay_type == 12 && uniPay_begin" style="font-size: 12px;color:#666;margin-top: .4rem;"> 订单号：{{payobj.order_no}}</p>-->
                <!--<p v-if="pay_type == 12 && uniPay_begin" style="margin-top: .1rem;">温馨提示：支付成功后，请点击【完成支付】进行确认，</p>-->
                <!--<p v-if="pay_type == 12 && uniPay_begin"> 若支付失败可【再试一次】重新支付。</p>-->
                <!--<p v-if="pay_type == 12 && uniPay_begin" style="margin-top: .4rem;">-->
                    <!--<a class="round_btn buy_btn" style="margin: 0;margin-right: .2rem;" @click="uniPayDone" v-if="pay_type == 12 && uniPay_begin">完成支付</a>-->
                    <!--<a class="round_white_btn buy_btn" style="margin: 0;" @click="uniPay" v-if="pay_type == 12 && uniPay_begin">再试一次</a>-->
                <!--</p>-->

            </div>
        </div>
        <!--支付成功显示-->
        <div class="flex_column_center" v-if="paySuccessShow">
            <div v-if="pay_status == 0" style="width: 100%;height: .4rem;"></div>
            <div class="flex_row_center" style="align-items: center;margin-top: .15rem;">
                <img src="../images/success_icon.png" alt="" v-if="pay_status == 1" style="width: .48rem;height: .48rem;">
                <img src="../images/faild_icon.png" alt="" v-if="pay_status == 0" style="width: .48rem;height: .48rem;">
                <p style="font-size: .16rem;margin-left: 0.08rem;max-width: 3.2rem;" v-if="pay_status == 1">{{$t('recharge.c44')}}</p>
                <p style="font-size: .16rem;margin-left: 0.08rem;max-width: 3.2rem;" v-if="pay_status == 0">{{$t('recharge.c45')}}</p>
            </div>
            <div class="pay_order_info">
                <div class="flex_row_between" style="width: 100%;">
                    <p>{{$t("recharge.c14")}}</p>
                    <p>¥{{payobj.amount}}</p>
                </div>
                <div class="flex_row_between" style="width: 100%;">
                    <p>{{$t("recharge.c15")}}</p>
                    <p>{{payobj.order_no}}</p>
                </div>
                <div class="flex_row_between" style="width: 100%;">
                    <p>{{$t("recharge.c16")}}</p>
                    <p v-if="pay_status == 1">{{$t("recharge.c17")}}</p>
                    <p v-if="pay_status == 0">{{$t("recharge.c17_1")}}</p>
                </div>
            </div>
            <p style="font-size: .12rem;color: #999;">{{$t('recharge.c46')}}</p>
            <div class="flex_row_center" style="width: 100%;margin: .1rem 0;min-height: .3rem;">
                <img v-if="pay_status == 1" src="../images/v6_wxewm.png" alt="">
                <p v-if="pay_status == 1" style="margin-left: .08rem;max-width: 3.2rem;">{{$t('recharge.c47')}}，<br>{{$t('recharge.c48')}}</p>
            </div>
            <a class="round_btn buy_btn" style="margin: 0;" v-if="pay_status == 1" @click="goHome">{{$t('recharge.c49')}}</a>
            <a class="round_btn buy_btn" style="margin: 0;" v-if="pay_status == 0" @click="getService">{{$t('recharge.c50')}}</a>
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Prop } from "vue-property-decorator";
    import CheckPayStatusProxy from "../../../ts/proxy/CheckPayStatusProxy";
    import GlobalConfig from "../global.config";
    import { PayModel } from '@/ts/models/UserModel';
    import AppParamModel from '@/ts/models/AppModel';
    import { ExtrnalFactory } from '@/ts/factory/ExtrnalFactory';
    import {Autocomplete, Tooltip} from "element-ui";
    import JumpWebUtil from "@/ts/utils/JumpWebUtil";

    @Component({
        components:{
            'el-autocomplete': Autocomplete,
            'el-tooltip': Tooltip
        }
    })
    export default class PayDialog extends CheckPayStatusProxy {
        @Prop() public payobj!: PayModel;
        @Prop() public oldprice!: string;
        @Prop() public zhecodetitle!: string;
        @Prop() public choosenprice!: string;
        @Prop() public discountlist;//页面显示的折扣码列表
        public paySuccessShow: boolean = false;//是否支付成功
        public appParam: AppParamModel = AppParamModel.getInstace();
        public discount_show: boolean = false;//是否显示折扣码输入框
        public zhecodecopy: string = ''; //折扣码title
        public zhecode: string = ''; //折扣码
        public pay_status: number = -1;//0 未支付  1 已支付
        public pay_type: number = 0;
        public uniPay_begin: boolean = false;

        /**
         *
         */
        public created() {
            this.setBaseUrl(GlobalConfig.getBaseUrl());
            this.pay_type = this.payobj.payType;
        }

        /**
         * 请求支付成功时调用
         */
        public init(): void {
            if(this.discountlist.length>0) {
                this.zhecode = this.discountlist[0].label;
            }
            if(this.pay_type != 12) {
                this.timingUpdateInvoiceState();
            };
            if(this.zhecodetitle != '') {
                this.discount_show = true;
                this.zhecodecopy = this.zhecodetitle;
            }else {
                if(this.zhecode) {
                    this.zhecodecopy = this.discountlist[0].value;
                }else {
                    this.zhecodecopy = '';
                }
            }
        }

        /**
         * 是否使用折扣码
         */
        public useDiscount() {
            this.onCleanInvoiceState();
            this.discount_show = !this.discount_show;
            if(this.discount_show) {
                // if(!this.zhecode) return;
                // this.$emit('checkdiscount',this.zhecode);
            }else {
                this.$emit('checkdiscount','');
            }
        }

        /**
         * 更换支付方式
         */
        public onChoosePayType(type: number) {
            this.onCleanInvoiceState();
            this.pay_type = type;
            if(type == 12) return;
            this.$emit('changepaytype',type);
        }

        /**
         * 银联支付
         */
        public uniPay() {
            this.onCleanInvoiceState();
            this.$emit('changepaytype',this.pay_type);
        }

        /**
         * 完成支付
         */
        public uniPayDone() {
            this.onCleanInvoiceState();
            this.checkInvoiceState();
        }

        /**
         * 处理要显示的折扣码列表
         */
        public querySearch(queryString, cb) {
            let restaurants = this.discountlist.filter(item=>{
                if(item.value == queryString||item.label == queryString){
                    return true
                }
            });
            if(restaurants.length==0){
                this.zhecode=queryString;
            }
            // let results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
            // 调用 callback 返回建议列表的数据
            cb(this.discountlist);
        }

        /**
         * 输入折扣码
         */
        public useZhecode() {
            this.onCleanInvoiceState();
            this.$emit('checkdiscount',this.zhecode);
        }

        /**
         * 选择折扣码
         */
        public checkDiscount(item){
            this.onCleanInvoiceState();
            this.zhecodecopy = item.value;
            this.zhecode = item.label;
        }

        /**
         * 支付成功
         */
        public paySuccess() {
            this.onClose();
            this.pay_status = 1;
            this.paySuccessShow = true;
            this.$emit('paysuccess');
            const factory = ExtrnalFactory.getInstance().getFactory(this.appParam.platform);
            factory.rechargeSuccess();
        }

        /**
         * 支付失败
         */
        public payFaild() {
            this.onCleanInvoiceState();
            this.uniPay_begin = false;
            this.paySuccessShow = false;
            this.pay_status = 0;
            this.paySuccessShow = true;
            this.$emit('payfaild');
        }

        /**
         * 返回
         */
        public resetPayBack() {
            if(this.pay_status == 0) {
                this.uniPay_begin = true;
                this.paySuccessShow = false;
                this.pay_status = -1;
            }else {
                this.closePayDialog();
            }
        }

        /**
         * 关闭刷新
         */
        public onClose() {
            this.onCleanInvoiceState();
            this.uniPay_begin = false;
            this.paySuccessShow = false;
            this.discount_show = false;
            this.zhecode = '';
            this.zhecodecopy = '';
        }

        /**
         * 关闭支付弹窗
         */
        public closePayDialog(){
            this.onClose();
            this.$emit('closepaydialog')
        }

        /**
         * 前往首页
         */
        public goHome() {
            this.closePayDialog();
            const factory = ExtrnalFactory.getInstance().getFactory(this.appParam.platform);
            factory.gotoWebHome();
        }

        /**
         * 联系客服
         */
        public getService() {
            this.closePayDialog();
            const factory = ExtrnalFactory.getInstance().getFactory(this.appParam.platform);
            factory.gotoServiceCenter();
        }

        /**
         * 去用户会员条款
         */
        public gotoMemberItems() {
            const factory = ExtrnalFactory.getInstance().getFactory(this.appParam.platform);
            factory.jumpUrl(GlobalConfig.getWebBaseUrl()+'/'+JumpWebUtil.HTML_NAME_USERSERVER);
        }
    }
</script>

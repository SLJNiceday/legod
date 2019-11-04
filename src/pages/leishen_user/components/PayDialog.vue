<template>
    <div style="height:100%">
        <div class="flex_row_around" v-show="!paySuccessShow" style="height:90%">
            <div class="flex_column_center">
                <div class="pay_icon_box">
                    <img v-show="payobj.payType == 1" src="../images/wechat_logo@2x.png" alt="" class="img_filter">
                    <img v-show="payobj.payType == 3" src="../images/qqqianbao_logo@2x.png" alt="" class="img_filter">
                    <img v-show="payobj.payType == 2" src="../images/alipay_logo@2x.png" alt="" class="img_filter">
                </div>
                <div class="erweima_box" style="text-align: center;">
                    <iframe frameborder="0" height="166px;" width="166px;" scrolling="no"
                            :src="payobj.pay_url"></iframe>
                </div>
                <p class="">{{$t("recharge.c7")}}</p>
                <div style="text-align: center;">
                    <p>
                        <span>{{$t("recharge.c8")}}</span>
                        <span>{{payobj.order_no}}</span>
                    </p>
                    <div class="pay_price" style="margin:12px 0px;">
                        <span style="font-size:16px;">￥</span>
                        <span style="font-weight: bolder;">{{payobj.amount}}</span>
                    </div>
                    <div class="flex_row_center" style="text-align: center;">
                        <div class="saoyisao_box" style="display: inline-block;">
                            <img class="img_filter" src="../images/saoyisao.png" alt="">
                        </div>
                        <div>
                            <p v-show="payobj.payType == 1">
                                {{$t("recharge.c9")}}
                            </p>
                            <p v-show="payobj.payType == 2">
                                {{$t("recharge.c10")}}
                            </p>
                            <p v-show="payobj.payType == 3">
                                {{$t("recharge.c11")}}
                            </p>
                            <p>
                                {{$t("recharge.c12")}}
                            </p>
                        </div>
                    </div>
                    <a class="checkbtn_font paybtn"  v-show="showprevios" @click="gotoPrevious">
                        {{$t("user.b59")}}
                    </a>
                </div>
            </div>
        </div>
        <div class="flex_column_between" v-show="paySuccessShow" style="height: 90%;">
            <div class="flex_column_center">
                <div class="pay_result_box" style="margin:0px auto 8px;"></div>
                <p>{{$t("recharge.c13")}}</p>
            </div>
            <div class="pay_order_info" style=" width:100%;margin:20px 0;">
                <div class="flex_row_between" style="padding:5px 10px;">
                    <span class="payResult-left">{{$t("recharge.c14")}}</span>
                    <span class="payResult-right">{{payobj.amount}}</span>
                </div>
                <div class="flex_row_between" style="padding:5px 10px;">
                    <span class="payResult-left">{{$t("recharge.c15")}}</span>
                    <span class="payResult-right">{{payobj.order_no}}</span>
                </div>
                <div class="flex_row_between" style="padding:5px 10px;">
                    <span class="payResult-left">{{$t("recharge.c16")}}</span>
                    <span class="payResult-right" style="color: #00c800;">{{$t("recharge.c17")}}</span>
                </div>
            </div>
            <p>
                {{$t("recharge.c18")}}
            </p>
            <div class="flex_row_center" style="margin-top:18px;">
                <img src="../images/wechartCode.png" width="80">
                <div style="text-align: left;">
                    <span class="llz_userCenterWechart">{{$t("recharge.c47")}}</span>
                    <br>
                    <span class="llz_userCenterWechart">{{$t("recharge.c48")}}</span>
                </div>
            </div>
            <a class="checkbtn_font" style="background: #fff;margin-top: 32px;
                    padding: 8px 100px;border-radius: 26px;border: 1px solid #cac0c0;" @click="payDone">
                {{$t("user.b60")}}
            </a>
        </div>
    </div>
</template>
<script lang="ts">
    import {Component, Prop} from "vue-property-decorator";
    import CheckPayStatusProxy from "../../../ts/proxy/CheckPayStatusProxy";
    import GlobalConfig from "../global.config";
    import {PayModel} from '@/ts/models/UserModel';

    @Component
    export default class PayDialog extends CheckPayStatusProxy {
        public paySuccessShow: boolean = false;//是否支付成功
        @Prop(Boolean)showprevios!: Boolean;
        /**
         *
         */
        public created() {
            this.setBaseUrl(GlobalConfig.getBaseUrl());
        }

        /**
         * 支付成功
         */
        public paySuccess() {
            this.onClose();
            this.paySuccessShow = true;
        }

        /**
         * 点击上一步
         * 跳转到上一步的设置支付方式的页面
         */
        gotoPrevious() {
            this.$emit('goback')
        }
        /**
         * 支付成功以后，点击确认
         * 关闭所有弹框
         */
        payDone() {
            this.paySuccessShow = false;
            this.$emit('paydone')
        }
        /**
         * 关闭
         */
        public onClose() {
            this.paySuccessShow = false;
            this.onCleanInvoiceState();
        }
    }
</script>

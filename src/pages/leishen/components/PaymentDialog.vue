<template>
    <div>
        <p style="text-align:center;font-size: 16px;margin-bottom: 16px;">{{$t('user.b89')}}</p>
        <el-form ref="form" label-width="80px" style="background: #F5F5F5; border-radius:4px;">
            <el-form-item :label="$t('user.b81')" style="margin-bottom: 0px;">
                <div style="text-align: right;margin-right:16px;">
                    <span>{{paytrans.price_title}}</span>
                    <span>{{$t('recharge.c19')}}</span>
                </div>
            </el-form-item>
            <el-form-item :label=" $t('recharge.c1')">
                <div style="text-align: right;margin-right:16px;">
                    <span>￥{{paytrans.price_num}}</span>
                </div>
            </el-form-item>
        </el-form>

        <div id="payElradioGroup">
            <van-radio-group v-model="payType">
                <van-radio :name="2" @click="payWay(2)">
                    <alifont name="zhifubao" class="payAli"></alifont>
                    <span class="payTip">{{$t("user.b91")}}</span>
                </van-radio>
                <van-radio :name="1" @click="payWay(1)">
                    <alifont name="weixin" class="payWechart"></alifont>
                    <span class="payTip">{{$t("user.b90")}}</span>
                </van-radio>
                <van-radio :name="3" @click="payWay(3)">
                    <alifont name="QQ" class="payQQ"></alifont>
                    <span class="payTip">{{$t("user.b92")}}</span>
                </van-radio>
            </van-radio-group>
            <div style="padding:16px;text-align: left;" id="payzhekou" v-if="userInfo.first_invoice_discount != 1">
                <van-checkbox v-model="zheCodeChecked" shape="square" checked-color="#ffd33e">{{$t('recharge.c29')}}
                </van-checkbox>
                <el-autocomplete style="width:100%;" v-if="zheCodeChecked" v-model="zheCodeCopy" :fetch-suggestions="querySearch" :placeholder="$t('recharge.c30')" @select="checkDiscount"></el-autocomplete>
<!--                <el-input v-model="zheCode" v-if="zheCodeChecked" :placeholder="$t('recharge.c30')"></el-input>-->
            </div>
            <div v-else>
                <img src="../images/off_5.png" alt="">
            </div>
            <div class="leishen_memberItemsBox">
                <span>{{$t("recharge.c5_1")}}</span>
                <a target="_blank" :href="memberItemLink">{{$t("recharge.c5")}}</a>
            </div>
        </div>
        <p style="text-align: center;">
            <a class="public_btn checkbtn_font" style="padding: 8px 0;border-radius: 26px; width: 100%;"
               @click="goToPay">
                {{$t("recharge.c3_0")}}
            </a>
        </p>
    </div>
</template>
<script lang="ts" src="./PaymentDialog.ts">

</script>

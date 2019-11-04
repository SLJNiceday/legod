<template>
    <div :style="{height:(discountshow?fullscreen:'auto')}">
        <div class="llz_huodongpage">
            <div  @click="showZhekou">
                <van-row class="llz_zhekouRow">
                    <van-col span="12" class="llz_zhekouIcon">
                        <img src="../../images/discount.png" alt="折扣码" width="23px">
                        折扣码(选填)
                    </van-col>
                    <van-col span="12" class="llz_zhekouText">
                        <span v-text="zhekouTitle"></span>
                        <img src="../../images/rightArrow.png" alt="" width="12px" style="margin-left: 8px;">
                    </van-col>
                </van-row>
            </div>
            <van-row style="width:100%;margin-top: 37px;text-align: center;"  v-show="isWeixin">
                <button class="llz_wxPay_btn"  type="button" @click="weixinBuy">
                    <img src="../../images/wx.png" height="26px;" class="iconImg">
                    <span class="llz_payWayText">微信支付</span>
                </button>
            </van-row>
            <van-row style="width:100%;margin-top: 24px;" v-show="!isWeixin">
                <van-col span="24" >
                        <button class="llz_wxPay_btn"  type="button" @click="onChooseAndPay(1)">
                            <img src="../../images/wx.png" height="26px;" class="iconImg">
                            <span class="llz_payWayText">微信支付</span>
                        </button>
                </van-col>
                <van-col span="24" style="margin-top:14px;">
                    <button class="llz_zfbPay_btn" type="button" @click="onChooseAndPay(2)">
                        <img src="../../images/zhifb.png" height="26px;" class="iconImg">
                        <span class="llz_payWayText">支付宝支付</span>
                    </button>
                </van-col>
                <!--            <van-col span="12" class="flex_column_center" style="height:80px;" @click="onChooseAndPay(3)">-->
                <!--                <img src="../../images/qq@2x.png" alt="" width="30"/>-->
                <!--                <p>QQ钱包</p>-->
                <!--            </van-col>-->
            </van-row>
        </div>
        <!--选择优惠券-->
        <van-popup v-model="discountshow" position="right" :lazy-render="false" style="width: 100%;" class="llz_zhekouDetails">
            <van-nav-bar title="折扣码管理" left-text="" left-arrow @click-left="onClickBack"></van-nav-bar>
            <div class="discount_list" style="height:calc(100% - 47px)">
                <div class="discount_head">
                    <div class="discount_input" style="border: solid 1px #d8d8d8;">
                        <input type="text" v-model="zhekouTitle" placeholder="请输入折扣码" style="width:70%;height: 100%;">
                        <img src="../../images/nouse.png" @click="deleteDiscount" alt="" width="20px" style="margin-right:16px;">
                        <a class="llzconfirm_btn" @click="confirmZhekou">确定</a>
                    </div>
                </div>
                <p v-show="discountList.length>0" class="llz_zhekouDesc">选择已有折扣码</p>
                <ul class="discounts llz_discount" v-show="discountList.length>0">
                    <li class="flex_row_start llz_zhekouContent" v-for="item in discountList" @click="checkDiscount(item)">
                        <div class="llz_contentTitle">
                            <div style="font-size: 24px;width: 100%;text-align: center;"v-if="item.discount_type==0">
                                <p style="line-height: 74px; font-size: 24px;">
                                    <span>{{(100-item.discount_value)/10}}</span>
                                    <span>折</span>
                                </p>
                            </div>
                            <div style="font-size: 24px;width: 100%;text-align: center;" v-if="item.discount_type==1">
                                <p style="line-height: 74px;font-size: 24px;">
                                    <span>{{item.discount_value/100}}</span>
                                    <span>元</span>
                                </p>
                            </div>
                        </div>
                        <div class="llz_contentDetails">
                            <p style="font-size: 14px;color: #323232;">
                                <span class="llz_detailTitle">{{item.title}}</span>
                                <button class="llz_detailBtn">使用</button>
                            </p>
                            <p style="margin-top: 5px;">有效期至:{{item.expired_time}}</p>
                        </div>
                    </li>
                </ul>
                <a class="discount_foot" @click="clearDiscount" v-show="discountList.length>0">不使用优惠券</a>
                <div style="height:300px;text-align: center;" v-show="discountList.length==0">
                    <img src="../../images/noDiscount.png" alt="" style="margin-top: 200px;">
                    <p style="text-align: center;font-size: 20px;margin-top: 16px;">您暂无折扣码</p>
                </div>
            </div>
        </van-popup>
    </div>
</template>

<script src="./RechargeDialogV2.ts" lang="ts">
</script>

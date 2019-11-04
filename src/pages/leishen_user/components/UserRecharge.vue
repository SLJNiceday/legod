<template>
    <div>
        <div class="components_cell" style="background: #ebebeb;min-height:400px;"  v-loading="isLoading">
            <div class="wrap_package">
                <ul class="webpackage_box_fa" style="box-shadow: none;">
                    <li class="webpackage_user_box" style="padding-top: 40px;" @click="onChoosePrice(index)" :class="{user_webpackage_active:priceIndex == index}" v-for="(item,index) in priceList" :key="index">
                        <div @click="clickPay(item)" >

                            <!--<img class="xianshi_activity" src="../images/xsth.png" alt="" v-show="item.price_is_recommend == 1 && is_change_price == 1">-->
                            <img class="xianshi_activity" :src="activity_jiaobiao_info.jiaobiao_url" alt="" v-show="item.price_is_recommend == 1&&activity_jiaobiao_info.is_show">
                            <p style="position: absolute;top: 20px;text-align: center;width: 100%;left: 0;" v-if="item.price_is_recommend == 1&&xianshi_activity_info.is_show">{{activity_jiaobiao_info.jiaobiao_msg}}</p>
                            <div class="webpackage_top_cell">
                                <!--圆周动画的小icon-->
                                <b class="web_icon_anim"></b>
                                <p class="userpak_title_font" v-text="item.price_title"></p>
                                <p class="package_time_font">{{$t("recharge.c19")}}</p>
                            </div>
                            <div class="flex_row_center" style="margin-top:10px;">
                                <span class="package_symbol_font" :class="{'package_activity_font':xianshi_activity_info.is_show && item.price_is_recommend == 1}">¥</span>
                                <span class="package_amount_font" :class="{'package_activity_font':xianshi_activity_info.is_show&& item.price_is_recommend == 1}">{{item.price_num}}</span>
                                <s style="font-size:12px;margin-left: 8px;color: #999;" v-if="xianshi_activity_info.is_show == 1 && item.price_is_recommend == 1">原价50</s>
                            </div>
                            <div  style="text-align: center;margin-top:10px;color: #999;margin-top:16px;">
                                <p v-text="item.price_short_desc" :class="{'font_red': item.price_is_recommend == 1}" style="text-decoration: line-through"></p>
                                <p v-text="item.price_desc" style="text-align: center;margin-top: 8px;height:16px;"></p>

                                <p v-if="xianshi_activity_info.is_show&& item.price_is_recommend == 1" style="font-size: 14px;">
                                    参与人数:
                                    <span style="color:#FE6637;">{{payUserNum}}</span>
                                </p>
                            </div>
                            <div class="flex_row_center" style="margin-top:16px;">
                                <a class="checkbtn_font userRecharge" :class="{userRechargeActive:priceIndex == index}"  >
                                    {{$t("recharge.c3")}}
                                </a>
                            </div>
                            <!--<div class="user_choose_icon"></div>-->
                        </div>

                    </li>
                </ul>
            </div>
        </div>

        <div class="components_cell" style="margin-top:-10px;">
            <div class="web_zanting_box">
                <p class="zanting_logo_font pos_zanting">{{$t('index.a1')}}</p>
                <p class="zanting_title_font pos_zanting">{{$t('index.a3')}}</p>
                <p class="zanting_buy_font pos_zanting">{{$t('index.a4')}}</p>
                <p class="zanting_detail_font">{{$t('recharge.c31')}}</p>
                <p class="zanting_detail_font">{{$t('index.a15')}}</p>
            </div>
        </div>
        <el-dialog class="userform" :visible.sync="dialogVisible" width="400px"  :close-on-click-modal="false" :close-on-press-escape="false">
            <pay-step1 :paytrans="payTrans" ref="payStep1" @paystep1="finishStep1" @zhekouerror="zhekouError"></pay-step1>
        </el-dialog>
    </div>
</template>
<script lang="ts">
    import {Component, Prop} from "vue-property-decorator";
    import RechargeProxy from "@/ts/proxy/RechargeProxy";
    import {TipsMsgUtil} from "@/ts/utils/TipsMsgUtil";
    import GlobalConfig from "../global.config";
    import {PayConfigModel} from '@/ts/models/UserModel';
    import LocalStorageUtil from "@/ts/utils/LocalStorageUtil";
    import JumpWebUtil from "@/ts/utils/JumpWebUtil";
    import AppParamModel from '@/ts/models/AppModel';
    import Util from "@/ts/utils/Util";
    import ConfigUtil from "@/ts/utils/ConfigUtil";
    import {  payTransfer, UserInfo,UserDiscountList} from '@/ts/models/UserModel';
    import payStep1 from './setPayWay.vue'
    import HttpClient from '@/ts/net/HttpClient';
    @Component({
        components:{
            'pay-step1':payStep1
        }
    })
    export default class UserRecharge extends RechargeProxy {
        public isInit: boolean = false;
        public serviceAgreen: boolean = false;//是否勾选会员服务条款
        public webParam = AppParamModel.getInstace(); // 浏览器参数
        public payUserNum: number = 0;
        @Prop() public payshowobj: PayConfigModel;//支付方式显示配置
        @Prop() public xianshiactivityinfo: any;//是否显示限时活动标题
        @Prop() public userinfo!: UserInfo;
        public start_time: string = '';//首单特惠开始时间
        public end_time: string = '';//首单特惠结束时间
        public sc_timer = null;//首冲用户定时器
        dialogVisible:boolean=false
        public payTrans=new payTransfer()
        public userDiscountList: Array<UserDiscountList> = [];//请求回的全部折扣码列表
        public xianshi_activity_info = {}; // 活动信息
        public activity_jiaobiao_info={};  // 角标信息
        /**
         * 初始化
         */
        public created() {
            this.setBaseUrl(GlobalConfig.getBaseUrl());
            this.getDownloadUrl();
            this.payType = 2;
        }
        /**
         * 折扣码错误，选择了折扣码，却没有获取到折扣码，
         */
        zhekouError(){
            //@ts-ignore
            let msg=this.$t('recharge.c34').toString()
            this.$notify({
                title: TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_ERROR_TITLE),
                message: msg,
                type: "warning"
            });
        }
        /**
         * 获取首冲特惠时间
         * @param url
         */
        public async getDownloadUrl() {
            const jsonConfig = await ConfigUtil.getInstance().download(true);
            this.xianshi_activity_info = jsonConfig.leigod[this.webParam.region_code].is_show_xianshi_activity;
            // this.start_time = this.xianshi_activity_info.start_time.replace(/\-/g,'/');
            // this.end_time = this.xianshi_activity_info.end_time.replace(/\-/g,'/');
            this.activity_jiaobiao_info=jsonConfig.leigod[this.webParam.region_code].jiaobiao_is_show
        }

        /**
         * 获取系统时间成功
         */
        public getSystemTimeSuccess(){
            let startDate = new Date(this.start_time).getTime();
            let endDate = new Date(this.end_time).getTime();
            let nowDate = new Date(this.now_time).getTime();
            if(nowDate < startDate || nowDate > endDate) return;
            this.payUserNum = Util.getPayUserNum(this.start_time,this.now_time,15);
            const that = this;
            this.sc_timer = setInterval(()=>{
                let num = Math.round((Math.random()*90 + 30)/60);
                that.payUserNum += num;
                let end = new Date(that.end_time).getTime();
                let now = new Date().getTime();
                if(now >= end) {
                    clearInterval(that.sc_timer)
                }
            },6000)
        }

        /**
         * token过期的处理
         */
        public tokenExpired() {
            LocalStorageUtil.loginOut();
            let param = window.location.search;
            JumpWebUtil.wapJump(GlobalConfig.getUserBaseUrl(), JumpWebUtil.HTML_NAME_LOGIN, param);
        }

        /**
         *
         */
        public initA() {
            this.getUserDiscount();
            // 这里做缓存处理，不用每次点击都发送请求
            if (this.isInit) return;
            this.isInit = true;
            this.init();
        }
        /**
         *获取用户所有的折扣码
         */
        public async getUserDiscount() {
            this.isLoading = true;
            const token = LocalStorageUtil.getUserToken().account_token;
            let url = HttpClient.URL_USER_DISCOUNT;
            let param = {
                account_token: token,
                region_code: LocalStorageUtil.getRegionCodes()
            };
            this.backData = await this.http.post<Array<UserDiscountList>>(url, param);
            this.isLoading = false;
            if (this.backData.code == HttpClient.HTTP_SUCCESS_NET_CODE) {
                this.userDiscountList = this.backData.data;
                this.userDiscountList = this.userDiscountList.sort((a,b)=> {
                    let value1 = a.discount_value;
                    let value2 = b.discount_value;
                    return value2 - value1;
                });
                this.getUserDiscountSuccess();
            } else if (this.backData.code == HttpClient.HTTP_TOKEN_EXPIRE) {
                this.tokenExpired();
            } else {
                this.getUserDiscountError();
            }
        }
        /**
         * 获取优惠券成功
         * TODO... 需重写此方法
         */
        public getUserDiscountSuccess() {
            // console.log(this.userDiscountList)
        }

        /**
         * 获取优惠券失败
         * TODO... 需重写此方法
         */
        public getUserDiscountError() {
        }
        /**
         * 点击立即支付
         */
        public clickPay(item) {
            this.payTrans.price_num=item.price_num
            this.payTrans.price_title=item.price_title
            this.payTrans.zheCodeList=[]
            this.userDiscountList.map(useritem=>{
                if(useritem.price_ids.length>0){
                    for(let qq=0;qq<useritem.price_ids.length;qq++){
                        if(useritem.price_ids[qq]==item.price_id){
                            this.payTrans.zheCodeList.push({label:useritem.discount_code,value:useritem.title})
                        }
                    }
                }
            })
            this.dialogVisible=true
            this.$nextTick(()=>{
                //@ts-ignore
                this.$refs.payStep1.init()
            })
        }
        /**
         * 点击 去支付
         * 完成了支付的第一步，支付方式和折扣码，
         * 准备跳转的支付的二维码
         */
        finishStep1(payType:number,zhekou:string){
            this.payType=payType
            this.zheCode=zhekou
            this.onPay();
        }

        /**
         * 返回到支付的第一步;重新设置支付方式和折扣码
         */
        backStep1(){
            this.dialogVisible=true
        }
        /**
         * 获取套餐成功
         */
        public getUserPackageSuccess() {
            if(this.userInfo.is_switch_package == 0){
                this.onChoosePackageTypeA(null);
            }else {
                for(var i = 0; i<this.packageList.length;i++){
                    if (this.packageList[i].include_region_codes == this.webParam.region_code+''){
                        this.onChoosePackageType(i);
                    }
                }
            }
        }

        /**
         * 选择套餐
         */
        public onChoosePackageTypeA(type: any) {
            if (this.packageList.length <= 0) return;
            if (type == this.czTypeIndex) return;
            if (this.czTypeUserIndex != type && type != null && this.userInfo.is_switch_package == 0) {
                return;
            }
            this.onChoosePackageType(type);
        }

        /**
         * 请求支付成功
         */
        public onBeginpaySuccess() {
            this.dialogVisible=false
            // paypal支付自动刷新页面
            if (this.payType == 5) {
                //打开支付页面
                window.location.href = this.payObj.pay_url;
            }
            this.payObj.payType = this.payType;
            this.$emit("onbeginpay", this.payObj,true);
        }

        /**
         * 请求支付失败
         */
        public onBeginpayError(msg: string) {
            this.$notify({
                title: TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_ERROR_TITLE),
                message: msg,
                type: "warning"
            });
        }

    }
</script>


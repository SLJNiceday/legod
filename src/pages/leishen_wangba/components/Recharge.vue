<template>
    <div>
        <!--充值记录-->
        <p class="leigod_mb25 leigod_ml15 leigod_user_tit leigod_mt35">当前套餐</p>
        <div class="leigod_dashedbottom"></div>
        <div class="leigod_mt25">
            <el-table :data="tableData" stripe border style="width: 100%;">
                <el-table-column label="网吧名称" prop="title" width="177"></el-table-column>
                <el-table-column label="机器数量(台)" prop="number" width="177"></el-table-column>
                <el-table-column label="套餐名称" prop="catname" width="177">
                    <template slot-scope="scope">
                        <span>{{scope.row.catname ? scope.row.catname : '暂无套餐'}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="充值时间" prop="cathours" width="177">
                    <template slot-scope="scope">
                        <span>{{scope.row.cathours ? scope.row.cathours + '小时' : '暂无套餐'}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="结束时间" prop="expiretime" width="177"></el-table-column>
            </el-table>
        </div>
        <!--购买套餐-->
        <p class="leigod_mb25 leigod_ml15 leigod_user_tit leigod_mt45">购买套餐</p>
        <div class="leigod_dashedbottom"></div>
        <div class="leigod_mt25">
            <span class="leigod_mr5">机器数量：</span>
            <el-select v-model="number" @change="choosePackageNumber" placeholder="全部">
                <el-option v-for="item in numberOptions" :key="item.value" :label="item.label"
                           :value="item.value"></el-option>
            </el-select>
        </div>
        <div class="leigod_mt25">
            <span class="leigod_mr5">套餐时间：</span>
            <el-select v-model="packageTime" @change="choosePackageTime" placeholder="全部">
                <el-option v-for="item in packageOptions" :key="item.label" :label="item.label"
                           :value="item.value"></el-option>
            </el-select>
        </div>
        <div class="leigod_mt25">
            <span class="leigod_mr5">支付方式：</span>
            <span class="recharge_paytype" @click="choosePaytype(2)" :class="{'recharge_paytype_active': pay_type == 2}">
                <img src="../images/alipay.png" style="vertical-align: middle" alt="">
                <span style="margin-left: 10px">支付宝</span>
            </span>
            <span class="recharge_paytype leigod_ml20" @click="choosePaytype(1)" :class="{'recharge_paytype_active': pay_type == 1}">
                <img src="../images/wechat.png" style="vertical-align: middle" alt="">
                <span style="margin-left: 10px">微信</span>
            </span>
        </div>
        <div class="leigod_mt25 leigod_mb40">
            <span class="leigod_mr5">金&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;额：</span>
            <span>{{packagePrice}}元</span>
        </div>
        <div class="leigod_dashedbottom"></div>
        <div class="leigod_text_center leigod_mt25">
            <button class="user_common_btn" @click="buy">充值</button>
        </div>
        <!--支付弹窗-->
        <el-dialog :visible.sync="payDialogVisible" width="492px" title="扫码充值" class="pay_dialog" @close="closePayDialog" :close-on-click-modal="false" :close-on-press-escape="false">
            <div>
                <span class="leigod_mr5">订单号：</span>
                <span>{{payInfo.order_no}}</span>
            </div>
            <div class="leigod_mt25">
                <span class="leigod_mr5">套餐：</span>
                <span>{{payInfo.package_title}}</span>
            </div>
            <div class="leigod_mt25 recharge_ewm_box">
                <p>
                    <span>支付金额：</span>
                    <span class="price_font">{{payInfo.amount}}</span>
                    <span>元</span>
                </p>
                <div class="recharge_ewm" v-if="!pay_success">
                    <!--<img :src="payInfo" width="142" alt="">-->
                    <iframe frameborder="0" height="142px;" width="142px;" scrolling="no"
                            :src="payInfo.pay_url"></iframe>
                </div>
                <p v-if="!pay_success">打开{{payInfo == 1? '微信' : '支付宝'}}，扫码支付</p>
                <img v-if="pay_success" src="../images/paysuccess.png" alt="">
                <p v-if="pay_success" style="color: #60c508;">支付成功！</p>
            </div>
            <button class="user_common_btn pay_btn" @click="closePayDialog" v-if="!pay_success">返回</button>
            <button class="user_common_btn pay_btn" @click="closePayDialog" v-if="pay_success">关闭</button>
        </el-dialog>

        <!--转换套餐弹窗-->
        <!--<el-dialog :visible.sync="changePackageTypeVisible" width="492px" title="转换套餐" class="pay_dialog" @close="closePackageTypeDialog" :close-on-click-modal="false" :close-on-press-escape="false">-->
            <!--<div class="leigod_text_center">-->
                <!--<p>是否确定转换为包月套餐？</p>-->
            <!--</div>-->
            <!--<div class="leigod_text_center leigod_mt45">-->
                <!--<button class="user_common_btn change_package_btn" @click="onChangePackageFee">确定</button>-->
                <!--<button style="margin-left: 75px;" class="user_common_btn change_package_btn" @click="closePackageTypeDialog">取消</button>-->
            <!--</div>-->
        <!--</el-dialog>-->

    </div>
</template>

<script lang="ts">
    import {Vue, Component, Prop} from "vue-property-decorator";
    import GlobalConfig from "../global_config";
    import Util from "../../../ts/utils/Util";
    import LocalStorageUtil from "../../../ts/netbar/utils/LocalStorageUtil";
    import UserProxy from "../../../ts/netbar/api/UserProxy";
    import {
        BuyRequestModel, BuyResponseModel,
    } from "../../../ts/netbar/model/userModel";
    @Component({})
    export default class Recharge extends UserProxy {
        public tableData: any = [];//网吧当前套餐
        public number: number = null;//套餐链接数
        public numberOptions = [];//连接数可选配置
        public packageTime: number = null;//选择的套餐时长
        public packageOptions = [];//套餐可选配置
        public pay_type: number = 1;//支付方式
        public packagePrice: number = null;//所选套餐的价格
        public packageTitle: string = '';//所选套餐名称
        public payInfo: BuyResponseModel = new BuyResponseModel();//支付套餐详情
        public payDialogVisible: boolean = false;//支付弹窗
        public pay_success: boolean = false;//是否支付成功
        public number_ratio: number = 0;//连接数折扣
        public time_ratio: number = 0;//时长折扣
        public check_payStatus_timer = null;

        created() {
            this.setBaseUrl(GlobalConfig.getBaseUrl());
            this.userInfo = JSON.parse(LocalStorageUtil.getCookie(LocalStorageUtil.STORAGES_USER_INFO));
            this.getLocalPackage();
            this.getPackageList();
        }

        initA() {

        }

        /**
         * 获取套餐列表成功
         */
        public getPackageListSuccess(data:any) {
            data.machine_list.map((item)=> {
                item['label'] = item.value;
            });
            data.month_list.map((item)=> {
                item['label'] = item.value + '个月';
            })
            this.numberOptions = data.machine_list;
            this.packageOptions = data.month_list;
        }

        /**
         * 选择支付状态
         */
        public choosePaytype(type) {
            this.pay_type = type;
        }

        /**
         * 选择连接数
         */
        public choosePackageNumber(value: any) {
            this.number_ratio = this.packageList.machine_list.filter((item)=> {
                return item.value == value;
            })[0].ratio/100;
            if(!this.number || !this.packageTime) return;
            this.packagePrice = Math.round(this.userInfo.monthly_price*this.number*this.number_ratio*this.packageTime*this.time_ratio)/100;
        }

        /**
         * 选择套餐时长
         */
        public choosePackageTime(value: any) {
            this.time_ratio = this.packageList.month_list.filter((item)=> {
                return item.value == value;
            })[0].ratio/100;
            if(!this.number || !this.packageTime) return;
            this.packagePrice = Math.round(this.userInfo.monthly_price*this.number*this.number_ratio*this.packageTime*this.time_ratio)/100;
        }

        /**
         * 购买套餐(生成订单)
         */
        public buy() {
            let param = new BuyRequestModel();
            param.account_token = this.account_token;
            param.buy_time_num = this.packageTime;
            param.machine_num = this.number;
            param.payment_type = this.pay_type;
            param.width = 142;
            if(this.pay_type==2){
                //如果是支付宝支付
                param.qr_type='ali_qr'
            }
            this.onBuyPackage(param);
        }

        /**
         * 生成订单成功
         * todo 需重写UI逻辑
         */
        public onBuyPackageSuccess(data: any) {
            this.payInfo = data;
            this.payDialogVisible = true;
            this.onCheckOrderStatus();
        }

        /**
         * 轮询支付状态
         */
        public onCheckOrderStatus() {
            this.check_payStatus_timer = setInterval(()=> {
                this.checkOrderStatus(this.payInfo.invoice_id);
            },2000)
        }

        /**
         * 订单支付成功
         */
        public orderPaySuccess(data: any) {
            if(data.status == 1) {
                this.closePayDialog();
                this.getLocalPackage();
                this.$emit('getuserinfo');
            }
        }

        /**
         * 关闭支付弹窗
         */
        public closePayDialog() {
            this.payDialogVisible = false;
            this.payInfo = new BuyResponseModel();
            clearInterval(this.check_payStatus_timer);
        }

    }
</script>

<style lang="less" scoped>
    .recharge_paytype {
        display: inline-block;
        width: 118px;
        height: 34px;
        text-align: center;
        cursor: pointer;
        line-height: 36px;
        background-color: #ffffff;
        border-radius: 3px;
        border: solid 1px #eeeeee;
    }
    .recharge_paytype_active {
        border: solid 1px #35a7d3;
    }
    .recharge_ewm_box {
        width: 100%;
        height: 272px;
        background-color: #f5fcff;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
    }
    .price_font {
        font-size: 21px;
        font-weight: 600;
        color: #35a7d3;
    }
    .recharge_ewm {
        width: 158px;
        height: 158px;
        padding-left: 8px;
        padding-top: 8px;
        box-sizing: border-box;
        background: url("../images/ewm_border.png");
    }
    .pay_btn {
        padding: 10px 55px;
        display: block;
        margin: 20px auto 0;
    }
    .change_package_btn {
        padding: 5px 18px;
    }
</style>

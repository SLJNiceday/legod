<template>
    <div class="order_manage">
        <p class="leigod_mb25 leigod_ml15 leigod_user_tit">
            <span>按条件查找</span>
        </p>
        <div class="leigod_dashedbottom"></div>
        <!-- 查询订单-->
        <div class="user_find_order">
            <span class="leigod_mr5">下单时间：</span>
            <el-date-picker v-model="start_time" type="date" placeholder="开始日期"></el-date-picker>
            <span class="leigod_mh15">--</span>
            <el-date-picker v-model="end_time" type="date" placeholder="结束日期"></el-date-picker>
            <span class="leigod_mr5 leigod_ml25">订单状态：</span>
            <el-select v-model="order_status" placeholder="全部">
                <el-option v-for="item in orderStatusOptions" :key="item.value" :label="item.label"
                           :value="item.value"></el-option>
            </el-select>
            <el-button class="leigod_ml15" type="primary" @click="checkOrderList">查找</el-button>
            <!-- 订单表格-->
            <div class="leigod_mt25">
                <!--包月套餐列表-->
                <el-table :data="orderData" stripe border style="width: 100%;">
                    <el-table-column label="网吧名称" :width="110">
                        <template slot-scope="scope">
                            <span>{{userInfo.bar_name}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="机器数量(台)" prop="machine_num" :width="110"></el-table-column>
                    <el-table-column label="支付方式" :width="110">
                        <template slot-scope="scope">
                            <span v-if="scope.row.payment_type">
                                {{scope.row.payment_type == 1 ? '微信支付' : '支付宝支付'}}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="套餐名称" prop="package_title" :width="167"></el-table-column>
                    <el-table-column label="订单号" prop="invoice_no" :width="167"></el-table-column>
                    <el-table-column label="订单状态" :width="110">
                        <template slot-scope="scope">
                            <span>
                                {{scope.row.status == 0 ? '未完成' : '完成'}}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="支付时间" prop="create_time" :width="110"></el-table-column>
                </el-table>
            </div>
            <!-- 分页器-->
            <div class="leigod_mt45 leigod_text_center">
                <el-pagination background layout="prev, pager, next" :current-page="currentPage" :page-size="pageSize" @current-change="changePage" :total="pageNum"></el-pagination>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Vue, Component, Prop} from "vue-property-decorator";
    import {OrderListRequsetModel, UserInfoModel} from "../../../ts/netbar/model/userModel";
    import LocalStorageUtil from "../../../ts/netbar/utils/LocalStorageUtil";
    import {BaseVue} from "../../../ts/netbar/api/baseVue";
    import GlobalConfig from "../global_config";
    import XmlHttpClient from "../../../ts/net/XmlHttpClient";
    import Util from "../../../ts/utils/Util";
    import UserProxy from "../../../ts/netbar/api/UserProxy";
    import {XmlDataModel} from "../../../ts/models/IdataModel";
    import HttpClient from "../../../ts/net/HttpClient";

    @Component({})
    export default class OrderManage extends BaseVue {
        public userInfo: UserInfoModel = new UserInfoModel();
        public start_time: string = '';//查询条件-开始时间
        public end_time: string = '';//查询条件-结束时间
        public order_status: string = '';//订单状态
        public account_token: string = LocalStorageUtil.getCookie(LocalStorageUtil.STORAGES_TOKEN) || '';
        public orderData:any = [];//订单列表
        public currentPage: number = 1;//当前页
        public pageNum: number = 0;//订单总数
        public pageSize: number = 6;//分页单页条目数
        public orderStatusOptions = [
            {
                label:'完成',
                value:1
            },
            {
                label:'未完成',
                value:0
            }
        ]

        created() {
            this.setBaseUrl(GlobalConfig.getBaseUrl());
            this.userInfo = JSON.parse(LocalStorageUtil.getCookie(LocalStorageUtil.STORAGES_USER_INFO))
            this.getOrderList(1);
        }

        initA() {

        }

        /**
         * 获取订单列表
         */
        public async getOrderList(page: number) {
            const url = HttpClient.NETBAR_INVOICE_LIST;
            let param = new OrderListRequsetModel();
            param.account_token = this.account_token;
            param.start_time = this.start_time;
            param.end_time = this.end_time;
            param.invoice_status = this.order_status;
            param.size = this.pageSize;
            param.page = page;
            this.backData = await this.http.post(url,param);
            if(this.backData.code == HttpClient.HTTP_SUCCESS_NET_CODE) {
                console.log(this.backData)
                this.orderData = this.backData.data.list;
                this.pageNum = this.backData.data.total;
            }else if(this.backData.code == HttpClient.HTTP_TOKEN_EXPIRE) {
                this.tokenExpired();
            }else {
                this.$message.error(this.backData.msg);
            }
        }

        /**
         * 筛选订单
         */
        public checkOrderList() {
            this.getOrderList(0);
        }

        /**
         * 翻页
         */
        public changePage(page: number) {
            this.currentPage = page;
            this.getOrderList(this.currentPage);
        }

        /**
         * token失效
         */
        public tokenExpired() {
            this.$message.error('登录已过期,请重新登录!')
        }
    }
</script>

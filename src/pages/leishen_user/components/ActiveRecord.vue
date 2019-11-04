<template>
    <div style="margin-bottom:50px;" v-loading="isLoading">
        <div style="color: #000;padding:15px;" class="components_cell">
            <p class="web_news_title web_safty_font">{{$t("user.b114")}}</p>
            <el-table :data="ActiveRecordList" border style="width: 100%" stripe :highlight-current-row="true">
                <el-table-column show-overflow-tooltip prop="activity_title" :label="$t('user.b115')"
                                 min-width="180"></el-table-column>
                <el-table-column prop="create_time" :label="$t('user.b116')" width="160"></el-table-column>
                <el-table-column prop="present_title" :label="$t('user.b117')" min-width="120"></el-table-column>
                <el-table-column prop="status_title" :label="$t('user.b118')" width="120"></el-table-column>
                <el-table-column :label="$t('user.b87')" width="140" header-align="center" align="center">
                    <template slot-scope="scope">
                        <a @click="onChooseOrderPayType(scope.row)" style="padding: 2px 8px"
                           v-show="scope.row.status == 0" class="public_btn">{{$t("user.b119")}}</a>
                        <a @click="onChooseOrderPayType(scope.row)" style="padding: 2px 8px"
                           v-show="scope.row.status != 0" class="public_btn">{{$t("user.b120")}}</a>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div style="text-align:center;">
            <el-pagination class="user_pag" ref="elPagination" background @prev-click="pervOrderList"
                           @next-click="nextOrderList" @current-change="currentChange" :page-size="rowsPerPage"
                           layout="prev, pager, next" :total="total"></el-pagination>
        </div>
        <el-dialog width="500px" :visible.sync="payTypeDialogVisible" :title="dialogTitle">
            <div v-show="dialogType=='1'">
                <ul class="login_box">
                    <li>
                        <label class="inputLabel">{{$t('user.b136')}}</label>
                        <input v-model="username" class="inputName" style="width:300px;">
                    </li>
                    <li style="width:100%;" class="flex_row_start">
                        <label class="inputLabel" style="margin-bottom: 15px;">{{$t('public.share2')}}</label>
                        <div class="form_input_box flex_row_between" style="margin-bottom:15px;width: 300px;">
                            <div class="select_box" style="width:40%;    border: 1px solid #ccc;">
                                <el-select @change="onSelectCountryCode" :value="countryCode.code"
                                           placeholder="" style="width:100%;">
                                    <div slot="prefix"> <img :src="countryCode.ico" alt="" style="margin-top:5px;"></div>
                                    <el-option-group
                                            v-for="group in country_code_list"
                                            :key="group.label"
                                            :label="group.label">
                                        <el-option v-for="(val,index) in group.options" :key="index"
                                                   :value="val.code" :label="'+'+val.code">
                                            <img :src="val.ico" alt="">
                                            <span style="color:#666;">{{val.name}}</span>
                                        </el-option>
                                    </el-option-group>
                                </el-select>
                            </div>
                            <div class="form_input_box" style="width:55%">
                                <input v-model="phone" class="inputName" type="text" name="" style="width: 100%;"
                                       :placeholder="$t('public.share2')">
                            </div>
                        </div>
                    </li>
                    <li>
                        <label v-if="is_miandan" class="inputLabel">{{$t('user.b91_1')}}</label>
                        <label v-if="!is_miandan" class="inputLabel">{{$t('user.b91_2')}}</label>
                        <input v-if="!is_miandan" style="width: 300px;" v-model="address" class="inputName">
                        <input v-if="is_miandan" style="width: 300px;" v-model="alipay_address" class="inputName">
                    </li>
                    <li>
                        <label class="inputLabel">{{$t('public.share63')}}</label>
                        <input v-model="email" class="inputName" style="width:300px;">
                    </li>
                    <li style="text-align:center;">
                        <!-- 提交按钮 -->
                        <el-button style="background-color:#ffd33e;padding: 6px 24px;" @click="sendUserInfo">
                            {{$t('user.b133')}}
                        </el-button>
                    </li>
                </ul>
            </div>
            <div v-show="dialogType=='2'" style="text-align:center;">
                <!-- 客服尽快为你发出奖品，请注意查收 -->
                <img src="../images/huowu.png">
                <p class="chongzhi" style="text-align: center;">{{$t('user.b122')}}</p>
            </div>
            <div v-show="dialogType=='3'">
                <!-- 第三方充值卡 -->
                <p class="chongzhi">{{otherCard}}</p>
                <!-- 如果是密码为空，就只显示CDKEY码-->
                <p class="chongzhi" v-show="cardInfo.card_password==''">
                    <span>{{$t('user.b67_13')}}:</span>
                    {{cardInfo.card_no}}
                </p>
                <!-- 如果是密码不为空，就只显示卡号和密码-->
                <p class="chongzhi" v-show="cardInfo.card_password!=''">{{$t('user.b126')}}：{{cardInfo.card_no}}</p>
                <p class="chongzhi" v-show="cardInfo.card_password!=''">{{$t('user.b127')}}：{{cardInfo.card_password}}</p>
            </div>
            <div v-show="dialogType=='4'">
                <!-- 卡密充值 -->
                <p class="chongzhi">{{$t('user.b121')}}</p>
                <!-- 如果是密码为空，就只显示CDKEY码-->
                <p class="chongzhi" v-show="cardInfo.card_password==''">
                    <span>{{$t('user.b67_13')}}:</span>
                    {{cardInfo.card_no}}
                </p>
                <!-- 如果是密码不为空，就只显示卡号和密码-->
                <p class="chongzhi" v-show="cardInfo.card_password!=''">
                    <span>{{$t('user.b126')}}：</span>
                    {{cardInfo.card_no}}
                </p>
                <p class="chongzhi" v-show="cardInfo.card_password!=''">
                    <span>{{$t('user.b127')}}：</span>
                    {{cardInfo.card_password}}
                </p>
            </div>
            <div v-show="dialogType=='5'">
                <!-- 优惠券，折扣码 -->
                <p class="chongzhi flex_row_start" style="padding: 0 20px;align-items: flex-start;text-align: left">
                    <span style="width: 35%;text-align: center">{{$t('user.b67_16')}}:</span>
                    <span style="width: 65%;">{{discount_title}}</span>
                </p>
                <p class="chongzhi flex_row_start" style="padding: 0 20px;align-items: flex-start;text-align: left">
                    <span style="width: 35%;text-align: center">{{$t('user.b67_14')}}:</span>
                    <span style="width: 65%;">{{discount}}</span>
                </p>
                <p class="chongzhi flex_row_start" style="padding: 0 20px;align-items: flex-start;text-align: left">
                    <span style="width: 35%;text-align: center">{{$t('user.b67_15')}}:</span>
                    <span style="width: 65%;">{{desc}}</span>
                </p>
                <p class="chongzhi">
                    {{details}}
                </p>
                <p style="text-align: center;">
                    <a class="public_btn" @click="goUseDiscount">{{$t('user.b67_17')}}</a>
                </p>
            </div>
            <div v-show="dialogType=='6'">
                <ul>
                    <li style="text-align:center;">
                        <label class="inputLabel">{{$t('user.b142')}}</label>
                        <el-select v-model="card_id" :placeholder="$t('public.share25')" style="width:300px;">
                            <el-option v-for="item in card_list" :key="item.id" :label="item.title" :value="item.id">
                            </el-option>
                        </el-select>
                    </li>
                    <li style="text-align:center;margin-top:8px;">
                        <!-- 提交按钮 -->
                        <el-button style="background-color:#ffd33e;padding: 6px 24px;" @click="confirmGiftType">
                            {{$t('user.b133')}}
                        </el-button>
                    </li>
                </ul>
            </div>
            <div v-show="dialogType=='7'">
                <!-- 第三方充值卡 -->
                <p class="chongzhi">{{otherCard}}({{desc}})</p>
                <!-- 如果是密码为空，就只显示CDKEY码-->
                <p class="chongzhi" v-show="cardInfo.card_password==''">
                    <span>{{$t('user.b67_13')}}:</span>
                    {{cardInfo.card_no}}
                </p>
                <!-- 如果是密码不为空，就只显示卡号和密码-->
                <p class="chongzhi" v-show="cardInfo.card_password!=''">{{$t('user.b126')}}：{{cardInfo.card_no}}</p>
                <p class="chongzhi" v-show="cardInfo.card_password!=''">{{$t('user.b127')}}：{{cardInfo.card_password}}</p>
<!--                <p class="chongzhi flex_row_start" style="padding: 0 20px;align-items: flex-start;text-align: left">-->
<!--                    <span style="width: 35%;text-align: center">{{$t('user.b67_15')}}:</span>-->
<!--                    <span style="width: 65%;">{{desc}}</span>-->
<!--                </p>-->
            </div>
        </el-dialog>
    </div>
</template>

<script lang="ts">
    import {Vue, Component} from "vue-property-decorator";
    import {
        Table,
        TableColumn,
        Button,
        OptionGroup,
        Pagination,
        Select,
        Option
    } from "element-ui";
    import ActiveRecordProxy from "@/ts/proxy/ActiveRecordProxy";
    import GlobalConfig from "@/pages/leishen_user/global.config";
    import LocalStorageUtil from "@/ts/utils/LocalStorageUtil";
    import JumpWebUtil from "@/ts/utils/JumpWebUtil";
    import AppParamModel from "@/ts/models/AppModel";
    import {cardInfo} from "@/ts/models/UserModel";


    @Component({
        components: {
            "el-table": Table,
            "el-table-column": TableColumn,
            "el-button": Button,
            "el-pagination": Pagination,
            "el-select": Select,
            "el-option-group": OptionGroup,
            "el-option": Option
        }
    })
    export default class ActiveRecord extends ActiveRecordProxy {
        public webParam = AppParamModel.getInstace(); // 浏览器参数
        public dialogTitle: string = ""; //弹出框的title
        public dialogType: string = "1"; //弹出框的类型1:实物/红包 2:实物/红包已领取3：第三方充值卡（含CDKEy）4：雷神充值卡（含CDKEy）5：优惠券,6:大礼包
        public prizeBoxCopy:any={}
        /**
         * token过期的处理
         */
        public tokenExpired() {
            LocalStorageUtil.loginOut();
            let param = window.location.search;
            JumpWebUtil.wapJump(
                GlobalConfig.getUserBaseUrl(),
                JumpWebUtil.HTML_NAME_LOGIN,
                param
            );
        }

        created() {
            this.setBaseUrl(GlobalConfig.getBaseUrl());
        }

        /**
         * 改变手机区号
         */
        public onSelectCountryCode(val:number) {
            this.country_code_list.map(item=>{
                for(let qq=0;qq<item.options.length;qq++){
                    if(val==item.options[qq].code){
                        this.countryCode=Object.assign({},item.options[qq])
                        this.country_code=val.toString()
                    }
                }
            })
        }
        // 当提交用户信息领取实物的时候
        sendUserInfo() {
            this.confirmUserInfo();
        }

        // 点击待兑奖或者查看详情的时候
        onChooseOrderPayType(row) {
            // 这里首先判断该行的奖品是否过期，如果过期，就提示用户
            //@ts-ignore
            if (row.status.toString() == '-1') {
                this.$emit('showtip', 'public.share1', 'user.b135');
            } else {
                this.payTypeDialogVisible = true;
                //@ts-ignore
                switch (row.award_type) {
                    case 0:
                        // 是充值卡
                        this.dialogType = "4";
                        this.dialogTitle = this.$t("user.b120").toString();
                        if (row.status == 0) {
                            // 如果是待领取状态
                            this.chargeCard(row);
                        } else {
                            // 用processMsg处理row.message里面的卡号和密码
                            this.processMsg(row.message);
                        }
                        break;
                    case 1:
                        // 现金红包
                        break;
                    case 2:
                        // 实物或红包
                        //@ts-ignore
                        if (row.status === 0) {
                            // 如果是待兑换状态填写信息，否则提示
                            this.dialogType = "1";
                            this.is_miandan = false;
                            this.dialogTitle = this.$t("user.b123_0").toString();
                            this.currentActiveRecordModel = row;
                        } else {
                            this.dialogType = "2";
                            this.dialogTitle = this.$t("user.b120").toString();
                        }
                        break;
                    case 3:
                        // 第三方充值卡
                        this.dialogTitle = this.$t("user.b120").toString();
                        this.otherCard = row.present_title;
                        this.dialogType = "3";
                        if (row.status == 0) {
                            // 如果是待领取状态
                            this.chargeCard(row);
                        } else {
                            // 用processMsg处理row.message里面的卡号和密码
                            this.processMsg(row.message);
                        }
                        break;
                    case 4:
                        // 优惠券/折扣码
                        if (row.status == 0) {
                            // 如果是待领取状态
                            this.getDiscount(row);
                        }
                        this.dialogTitle = this.$t("user.b120").toString();
                        this.discount_title = row.present_title;
                        this.discount=row.message;
                        this.details = row.details;
                        this.desc = row.desc;
                        this.dialogType = "5";
                        break;
                    case 5:
                        this.otherCard = row.present_title;
                        // 大礼包
                        this.card_id=''
                        if (row.status == 0) {
                            // 如果是待领取状态
                            this.dialogType = "6";
                            this.dialogTitle=this.$t('public.share25').toString()+this.$t('user.b142').toString();
                            this.card_list=row.card_package.slice(0)

                            this.prizeBoxCopy=Object.assign({},row)
                        }else{
                            this.dialogTitle = this.$t("user.b120").toString();
                            this.dialogType = "7";
                            this.desc=row.desc
                            this.processMsg(row.message.toString());
                        }

                        break;
                    case 6:
                        // 免单
                        if (row.status === 0) {
                            // 如果是待兑换状态填写信息，否则提示
                            this.dialogType = "1";
                            this.is_miandan = true;
                            this.dialogTitle = this.$t("user.b123").toString();
                            this.currentActiveRecordModel = row;
                        } else {
                            this.dialogType = "2";
                            this.dialogTitle = this.$t("user.b120").toString();
                        }
                        break;
                }
            }

        }
        // 确认礼包类型
        confirmGiftType(){
            if(this.card_id!=''){
                // 如果是待领取状态
                this.chargeCard(this.prizeBoxCopy,this.card_id);
            }else{
                //@ts-ignore
                this.$notify({
                    title:this.$t('public.share25').toString()+this.$t('user.b142').toString(),
                    type: "warning"
                });
            }
        }
        // 上一页
        pervOrderList(val: number) {
            //@ts-ignore
        }

        // 下一页
        nextOrderList(val: number) {
        }

        currentChange(val: number) {
            //@ts-ignore
            this.getActiveRecordList(val, this.rowsPerPage);
        }

        //页面初始化调用的方法
        public initA() {
            //获取表内的数据
            this.getActiveRecordList(1, this.rowsPerPage);
            //获取地区的区域编码
            this.getAreaCodeInfoList(GlobalConfig.getWebBaseUrl());
        }

        /**
         * 其他卡的领取成功，如爱奇艺第三方卡
         * @param msg
         */
        getOtherCardSuccess(msg: string, row: any,isKabao:boolean) {
            if(isKabao){
                this.dialogType='7'
            }else{
                this.dialogType='3'
            }
            this.dialogTitle = this.$t("user.b120").toString();
            this.getActiveRecordList(this.curentPage);
            //@ts-ignore
            this.$notify({
                title: msg,
                type: "success"
            });
        }
        /**
         *
         */
        public getDiscountSuccess(msg: string) {
            this.getActiveRecordList(this.curentPage);
            //@ts-ignore
            this.$notify({
                title: msg,
                type: "success"
            });
        }
        //提示用户输入的信息的错误
        validateInfoFaild(title:string,msg:string){
            this.$notify({
                title: title,
                message:msg,
                type: "warning"
            });
        }
        /**
         * 提交用户信息成功提示
         */
        userInfoOk(title:string,msg:string){
            this.getActiveRecordList(this.curentPage);
            this.$notify({
                title: title,
                message:msg,
                type: "success"
            });
        }
        /**
         * 充值卡自动充值失败
         * @param msg
         */
        public chargeCardFail(msg: string) {
            //@ts-ignore
            this.$notify({
                title: msg,
                type: "warning"
            });
        }

        /**
         * 提交用户快递信息失败
         * @param msg
         */
        public confirmUserInfoFail(msg: string) {
            //@ts-ignore
            this.$notify({
                title: msg,
                type: "warning"
            });
        }
        /**
         * 充值卡自动充值成功
         * @param msg
         */
        public chargeCardSuccess(msg: string, row: any) {
            this.dialogTitle = this.$t("user.b120").toString();
            this.dialogType='4'
            this.getActiveRecordList(this.curentPage);
            this.$emit("refreshuserinfo");
            //@ts-ignore
            this.$notify({
                title: msg,
                type: "success"
            });
        }
        /**
         * 充值卡自动充值成功
         * @param msg
         */
        public chargeCardTip(msg: string, row: any) {
            this.dialogTitle = this.$t("user.b120").toString();
            this.dialogType='4'
            this.getActiveRecordList(this.curentPage);
        }
        closeDialog() {
            this.payTypeDialogVisible = false;
            this.username = '';
            this.address = '';
            this.phone = '';
            this.cardInfo = new cardInfo();
            this.otherCard = '';
            this.discount_title = '';
            this.discount = '';
            this.details = '';
            this.desc = '';
        }

        /**
         * 使用优惠券
         */
        public goUseDiscount() {
            this.closeDialog();
            this.$emit('gorecharge');
        }
    }
</script>

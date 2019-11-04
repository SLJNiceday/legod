<template>
    <div style="margin-bottom:0.5rem;" v-loading="isLoading">
        <div style="color: #000;padding:0.15rem;" class="components_cell record_table">
            <el-table :data="showActiveRecordList" border style="width: 100%" height="2.9rem"  stripe  :highlight-current-row="true">
                <el-table-column show-overflow-tooltip prop="activity_title" :label="$t('user.b115')" label-class-name="v6_llz-activityHeaderTr"
                                 min-width="180" class-name="v6_llz-activityTr"></el-table-column>
                <el-table-column prop="present_title" show-overflow-tooltip class-name="v6_llz-activityTr" label-class-name="v6_llz-activityHeaderTr" :label="$t('user.b117')" min-width="120"></el-table-column>
                <el-table-column prop="status_title" show-overflow-tooltip class-name="v6_llz-activityTr" label-class-name="v6_llz-activityHeaderTr"  :label="$t('user.b118')" width="120">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status.toString()=='0'" style="color: #49c17e">
                            {{scope.row.status_title}}
                        </span>
                        <span v-else>
                             {{scope.row.status_title}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('user.b87')" show-overflow-tooltip width="140" class-name="v6_llz-activityTr" label-class-name="v6_llz-activityHeaderTr" header-align="center" align="center">
                    <template slot-scope="scope">
                        <a @click="onChooseOrderPayType(scope.row)" style="padding: 0.02rem 0.08rem;cursor:pointer; color: #f4712c;"
                           v-show="scope.row.status == 0">
                            <i class="iconfont iconic_liwu"></i>
                            {{$t("user.b119")}}
                        </a>
                        <a @click="onChooseOrderPayType(scope.row)" style="padding: 0.02rem 0.08rem;cursor:pointer;color: #4e84f1;"
                           v-show="scope.row.status != 0">
                            <i class="iconfont iconic_zhengyan"></i>
                            {{$t("user.b120")}}
                        </a>
                    </template>
                </el-table-column>
                <div slot="append">
                    <p v-show="showMore" class="v6_llz-activityTrBottom">
                        <span v-show="isLoaded" @click="loadMore" style="width:100%; cursor:pointer;">{{$t("user.b150")}}</span>
                        <span v-show="!isLoaded" style="width:100%;">{{$t("user.b151")}}</span>
                    </p>
                    <p v-show="!showMore&&isLoaded&&showActiveRecordList.length > 6" class="v6_llz-activityTrBottom">{{$t("user.b149")}}</p>
                </div>
            </el-table>
        </div>
        <div  id="v6_llzAwardDialog" v-show="payTypeDialogVisible" class="update_avtar_box" :style="'background:url('+bgimage+') no-repeat'">
            <ul class="v6_tab_nav" style="justify-content: space-between;">
                <li class="v6_tab_nav_li v6_goback cursor" @click="closeDialog">
                    <i class="iconfont iconic_fanhui"></i>
                    {{$t("wallpaper.wall18")}}
                </li>
                <li class="v6_tab_nav_li cursor">{{dialogTitle}}</li>
                <li class="v6_tab_nav_li cursor" @click="closeDialog">
                    <i class="iconfont iconic_guanbi"></i>
                </li>
            </ul>
            <div v-show="dialogType=='1'">
                <p class="v6_llzaAwardBox">{{$t('user.b152')}}</p>
                <ul class="v6_llzActivityBox flex_column_center">
                    <li>
                        <label class="inputLabel">{{$t('user.b136')}}</label>
                        <input v-model="username" class="inputName">
                    </li>
                    <li>
                        <label class="inputLabel">{{$t('public.share2')}}</label>
                                <el-select @change="onSelectCountryCode" :value="countryCode.code"
                                           placeholder="" class="v6_llzPhoneCode">
                                    <div slot="prefix"> <img :src="countryCode.ico" class="counrtyIcon" alt=""></div>
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
                                <input v-model="phone" class="inputName" type="text" name="" style="width: 2.18rem;"
                                       :placeholder="$t('public.share2')">
                    </li>
                    <li>
                        <label v-if="!is_miandan" class="inputLabel">{{$t('user.b91_2')}}</label>
                        <input v-if="!is_miandan" v-model="address" class="inputName">
                        <label v-if="is_miandan" class="inputLabel">{{$t('user.b91_1')}}</label>
                        <input v-if="is_miandan" v-model="alipay_address" class="inputName">
                    </li>
                    <li>
                        <label class="inputLabel">{{$t('public.share63')}}</label>
                        <input v-model="email" class="inputName">
                    </li>
                    <li>
                        <label class="inputLabel">{{$t('user.b116')}}</label>
                        <span class="v6_llzPrizeTime" style="width: 3.34rem;display: inline-block;">{{nowTime}}</span>
                    </li>
                    <li>
                        <!--<label class="inputLabel"></label>-->
                        <!-- 提交按钮 -->
                        <a class="round_btn v6_round_btn" @click="sendUserInfo" style="padding: 0.06rem 0.35rem;font-size: 0.14rem;">{{$t('user.b133')}}</a>
                        <!--<el-button class="v6_llzSubmitBtn">-->
                            <!---->
                        <!--</el-button>-->
                    </li>
                </ul>
            </div>
            <div v-show="dialogType=='2'" style="text-align:center;">
                <!-- 客服尽快为你发出奖品，请注意查收 -->
                <img src="../images/present.png" style="margin: 0.56rem auto 0.49rem;width: 1.1rem;">
                <p class="v6_llzPrizeTitle" style="margin:0 auto;">{{$t('user.b122')}}</p>
                <p style="margin: 0.13rem auto 0.22rem;" class="v6_llzPrizeTime"><span>{{$t('user.b116')}}:</span>{{nowTime}}</p>
            </div>
            <div v-show="dialogType=='3'" style="text-align:center;">
                <!-- 第三方充值卡 -->
                <p style="margin: 0.5rem auto 0.1rem;" class="v6_llzPrizeTitle">{{otherCard}}</p>
                <p style="margin: 0rem auto 0.29rem;" class="v6_llzPrizeTime"><span>{{$t('user.b116')}}:</span>{{nowTime}}</p>
                <div v-show="cardInfo.card_password==''" class="v6_llz_card">
                    <!-- 如果是密码为空，就只显示CDKEY码-->
                    <p style="margin:0.18rem auto 0.18rem;">
                        <span>{{$t('user.b67_13')}}:</span>
                        {{cardInfo.card_no}}
                    </p>
                </div>
               <div v-show="cardInfo.card_password!=''" class="v6_llz_card">
                   <!-- 如果是密码不为空，就只显示卡号和密码-->
                   <p style="margin:0.18rem auto 0.06rem;">{{$t('user.b126')}}：{{cardInfo.card_no}}</p>
                   <p style="margin-bottom: 0.18rem;" >{{$t('user.b127')}}：{{cardInfo.card_password}}</p>
               </div>

            </div>
            <div v-show="dialogType=='4'" style="text-align: center">
                <!-- 卡密充值 -->
                <p style="margin: 0.5rem auto 0.1rem;" class="v6_llzPrizeTitle">{{$t('user.b121')}}</p>
                <p style="margin: 0rem auto 0.29rem;" class="v6_llzPrizeTime"><span>{{$t('user.b116')}}:</span>{{nowTime}}</p>
                <div class="v6_llz_card" v-show="cardInfo.card_password==''">
                    <!-- 如果是密码为空，就只显示CDKEY码-->
                    <p style="margin:0.18rem auto 0.18rem;" >
                        <span>{{$t('user.b67_13')}}:</span>
                        {{cardInfo.card_no}}
                    </p>
                </div>
                <div class="v6_llz_card" v-show="cardInfo.card_password!=''">
                    <!-- 如果是密码不为空，就只显示卡号和密码-->
                    <p style="margin:0.18rem auto 0.06rem;">
                        <span>{{$t('user.b126')}}：</span>
                        {{cardInfo.card_no}}
                    </p>
                    <p style="margin-bottom: 0.18rem;" v-show="cardInfo.card_password!=''">
                        <span>{{$t('user.b127')}}：</span>
                        {{cardInfo.card_password}}
                    </p>
                </div>
            </div>
            <div v-show="dialogType=='5'" style="text-align: center;">
                <!-- 优惠券，折扣码 -->
                <p style="font-size: 0.18rem;color: #333; margin-top: 0.18rem;">
                    <span>{{discount_title}}</span>
                </p>
                <div class="v6_llz_card" style="margin:0.18rem auto 0.18rem;padding: 0.16rem 0;">
                    <span>{{$t('user.b67_14')}}:</span>
                    <span>{{discount}}</span>
                </div>
                <p style="margin:0.18rem auto 0.18rem;">
                    <span>{{$t('user.b67_15')}}:</span>
                    <span>{{desc}}</span>
                </p>
                <p class="chongzhi">
                    {{details}}
                </p>
                <p style="text-align: center;">
                    <el-button class="v6_llzSubmitBtn" @click="goUseDiscount">
                        {{$t('user.b67_17')}}
                    </el-button>
                </p>
            </div>
            <div v-show="dialogType=='6'">
                <ul style="margin-top: 1rem;">
                    <li style="text-align:center;">
                        <label class="v6_llz-kabao_label">{{$t('user.b142')}}</label>
                        <el-select v-model="card_id" :placeholder="$t('public.share25')">
                            <el-option v-for="item in card_list" :key="item.id" :label="item.title" :value="item.id">
                            </el-option>
                        </el-select>
                    </li>
                    <li style="text-align:center;margin-top:0.3rem;">
                        <label class="v6_llz-kabao_label"></label>
                        <!-- 提交按钮 -->
                        <el-button class="v6_llzSubmitBtn" @click="confirmGiftType">
                            {{$t('user.b133')}}
                        </el-button>
                    </li>
                </ul>
            </div>
            <div v-show="dialogType=='7'" style="text-align:center;">
                <!-- 卡包大礼包 -->
                <p class="v6_llzPrizeTitle" style="margin: 0.5rem auto 0.1rem;">{{otherCard}}</p>
                <p class="v6_llzPrizeTime" style="margin: 0rem auto 0.12rem;"><span>{{$t('user.b116')}}:</span>{{nowTime}}</p>
                <p class="v6_llzPrizeTime" style="margin: 0rem auto 0.29rem;">
                    <span>{{$t('user.b67_15')}}:</span>
                    <span>{{desc}}</span>
                </p>
                <div v-show="cardInfo.card_password==''" class="v6_llz_card">
                    <!-- 如果是密码为空，就只显示CDKEY码-->
                    <p style="margin:0.18rem auto 0.18rem;">
                        <span>{{$t('user.b67_13')}}:</span>
                        {{cardInfo.card_no}}
                    </p>
                </div>
                <div v-show="cardInfo.card_password!=''" class="v6_llz_card">
                    <!-- 如果是密码不为空，就只显示卡号和密码-->
                    <p style="margin:0.18rem auto 0.06rem;">{{$t('user.b126')}}：{{cardInfo.card_no}}</p>
                    <p style="margin-bottom: 0.18rem;" >{{$t('user.b127')}}：{{cardInfo.card_password}}</p>
                </div>

            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Vue, Component, Prop} from "vue-property-decorator";
    import {
        Table,
        TableColumn,
        Button,
        OptionGroup,
        Pagination,
        Select,
        Option,
        Form,
        Dialog,
        FormItem
    } from "element-ui";
    import ActiveRecordProxy from "@/ts/proxy/ActiveRecordProxy";
    import GlobalConfig from "@/pages/leishen_user/global.config";
    import LocalStorageUtil from "@/ts/utils/LocalStorageUtil";
    import JumpWebUtil from "@/ts/utils/JumpWebUtil";
    import AppParamModel from "@/ts/models/AppModel";
    import {cardInfo} from "@/ts/models/UserModel";
    import {Toast,List} from "vant";
    import Util from "@/ts/utils/Util";
    import {ExtrnalFactory} from "../../../ts/factory/ExtrnalFactory";
    Vue.use(Toast);
    Vue.use(List);
    @Component({
        components: {
            "el-table": Table,
            "el-table-column": TableColumn,
            "el-button": Button,
            "el-pagination": Pagination,
            "el-select": Select,
            "el-option-group": OptionGroup,
            "el-option": Option,
            "el-form":Form,
            "el-dialog":Dialog,
            "el-form-item":FormItem
        }
    })
    export default class ActiveRecord extends ActiveRecordProxy {
        @Prop() public bgimage!: string;

        public webParam = AppParamModel.getInstace(); // 浏览器参数
        public dialogTitle: string = ""; //弹出框的title
        public dialogType: string = "1"; //弹出框的类型1:实物/红包 2:实物/红包已领取3：第三方充值卡（含CDKEy）4：雷神充值卡（含CDKEy）5：优惠券
        prizeBoxCopy:any={}  //领取大礼包的时候的row的copy值
        public showActiveRecordList=[]; //显示在表格里的数据
        public pageSize:number=5; //每次请求的数量

        public showMore:boolean=false //默认不显示加载更多
        public isLoaded:boolean=false //默认显示加载中
        public isClickGet:boolean=false //默认没有点击领取奖品的按钮
        nowTime:string=''
        /**
         * token过期的处理
         */
        public tokenExpired() {
            const factory = ExtrnalFactory.getInstance().getFactory(this.webParam.platform);
            factory.loginExpire();
        }

        created() {
            this.setBaseUrl(GlobalConfig.getBaseUrl());
            //获取表内的数据
            this.getActiveRecordList(1, this.pageSize);
            //获取地区的区域编码
            this.getAreaCodeInfoList(GlobalConfig.getWebBaseUrl());
        }
        // 加载更多数据
        loadMore(){
            this.getActiveRecordList(this.curentPage+1, this.pageSize);
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
            this.isClickGet=true
            this.confirmUserInfo();
        }
        // 当确认大礼包类型
        confirmGiftType(){
            if(this.card_id!=''){
                // 如果是待领取状态
                this.isClickGet=true
                this.chargeCard(this.prizeBoxCopy,this.card_id);
            }else{
                Toast.fail(this.$t('public.share25').toString()+this.$t('user.b142').toString())
            }
        }
        // 点击待兑奖或者查看详情的时候
        onChooseOrderPayType(row) {
            // 这里首先判断该行的奖品是否过期，如果过期，就提示用户
            //@ts-ignore
            if (row.status.toString() == '-1') {
                this.$emit('showtip', 'public.share1', 'user.b135');
            } else {
                this.payTypeDialogVisible = true;
                this.nowTime=row.create_time
                //@ts-ignore
                switch (row.award_type) {
                    case 0:
                        // 是充值卡
                        this.dialogType = "4";
                        this.dialogTitle = this.$t("user.b120").toString();
                        if (row.status == 0) {
                            // 如果是待领取状态
                            this.chargeCard(row);
                            this.isClickGet=true
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
                            this.dialogTitle = this.$t("user.b123").toString();
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
                            this.isClickGet=true
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
                            this.isClickGet=true
                        }
                        this.dialogTitle = this.$t("user.b120").toString();
                        this.discount_title = row.present_title;
                        this.discount=row.message;
                        this.details = row.details;
                        this.desc = row.desc;
                        this.dialogType = "5";
                        break;
                    case 5:
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
                            this.otherCard = row.present_title;
                            this.desc=row.desc;
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
        //获取列表成功
        getActiveRecordListSuccess() {
            this.isLoaded=true
           if(!this.isClickGet){
               //如果没有点击立即兑奖或者立即领取
               if(this.total>=this.curentPage*this.pageSize){
                   this.showMore=true
               }else{
                   this.showMore=false
               }
               this.llzUpdateTableData()
           }else{
               // 数据全部加载完成
                this.llzUpdateTableData()
           }
           // 恢复初始的状态
            this.isClickGet=false
        }
        //更新表格里的数据
        llzUpdateTableData(){
            for (const item of this.ActiveRecordList) {
                let isRepeat=false;
                let repeatIndex=-1;
                let repeatObj={}
                for(let pp=0;pp<this.showActiveRecordList.length;pp++){
                    if(item.id==this.showActiveRecordList[pp].id){
                        isRepeat=true;
                        repeatIndex=pp;
                        repeatObj=Object.assign({},item)
                    }
                }
                if(!isRepeat){
                    this.showActiveRecordList.push(item);
                }else{
                    this.showActiveRecordList.splice(repeatIndex,1,repeatObj)
                }
            }
        }
        /**
         * 其他卡的领取成功，如爱奇艺第三方卡
         * @param msg
         */
        getOtherCardSuccess(msg: string, row: any,isKabao:boolean) {
            if(isKabao){
                //如果是卡包的抽奖
                this.otherCard=row.present_title
                this.dialogType='7'
            }else{
                this.dialogType='3'
            }
            this.dialogTitle = this.$t("user.b120").toString();
            //获取成功
            let pageIndex=-1
            for(let qq=1;qq<=this.showActiveRecordList.length;qq++){
                //@ts-ignore
                if(row.id==this.showActiveRecordList[qq-1].id){
                    pageIndex=Math.ceil(qq/this.pageSize)
                }
            }
            if(pageIndex!=-1){
                this.getActiveRecordList(pageIndex, this.pageSize)
            }
            Toast.success('领取成功');
        }
        /**
         *
         */
        public getDiscountSuccess(msg: string,row:any) {
            let pageIndex=-1
            for(let qq=1;qq<=this.showActiveRecordList.length;qq++){
                //@ts-ignore
                if(row.id==this.showActiveRecordList[qq-1].id){
                    pageIndex=Math.ceil(qq/this.pageSize)
                }
            }
            if(pageIndex!=-1){
                this.getActiveRecordList(pageIndex, 6)
            }
            Toast.success('领取成功');
        }
        //提示用户输入的信息的错误
        validateInfoFaild(title:string,msg:string){
            //用户输入得消息错误
            Toast.fail({
                message:msg,
                className:'v6_llz_ToastWidth'
            })
        }
        /**
         * 提交用户信息成功提示
         */
        userInfoOk(title:string,msg:string){
            //提示用户提交信息成功
            Toast.success(msg);
        }
        //更新当前行的数据,将当前行的数据状态更新为1
        UpdateCurentData(id:number){
            let pageIndex=-1
            for(let qq=1;qq<=this.showActiveRecordList.length;qq++){
                //@ts-ignore
                if(id==this.showActiveRecordList[qq-1].id){
                    pageIndex=Math.ceil(qq/this.pageSize)
                }
            }
            if(pageIndex!=-1){
                this.getActiveRecordList(pageIndex, this.pageSize)
            }
        }
        /**
         * 充值卡自动充值失败
         * @param msg
         */
        public chargeCardFail(msg: string) {
            //提示充值卡自动充值失败
            Toast.fail(msg);
        }

        /**
         * 提交用户快递信息失败
         * @param msg
         */
        public confirmUserInfoFail(msg: string) {
            //提交用户快递信息失败
            Toast.fail(msg);
        }
        /**
         * 充值卡自动充值成功
         * @param msg
         */
        public chargeCardSuccess(msg: string, row: any) {
            this.dialogTitle = this.$t("user.b120").toString();
            this.dialogType='4'

            let pageIndex=-1
            for(let qq=1;qq<=this.showActiveRecordList.length;qq++){
                //@ts-ignore
                if(row.id==this.showActiveRecordList[qq-1].id){
                    pageIndex=Math.ceil(qq/this.pageSize)
                }
            }
            if(pageIndex!=-1){
                this.getActiveRecordList(pageIndex, this.pageSize)
            }
            Toast.success('领取成功');
            this.$emit("refreshuserinfo");
            //提示充值卡自动充值成功
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
            this.card_id=''
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

import {Component,Prop} from "vue-property-decorator";
import {
    Table,
    TableColumn,
    Button,
    OptionGroup,
    Pagination,
    Select,
    Option,
    Popover
} from "element-ui";
import ActiveRecordProxy from "@/ts/proxy/ActiveRecordProxy";
import GlobalConfig from '../global.config';
import LocalStorageUtil from "@/ts/utils/LocalStorageUtil";
import JumpWebUtil from "@/ts/utils/JumpWebUtil";
import {cardInfo} from "@/ts/models/UserModel";
import Vue from "vue";
import VueI18n from "vue-i18n";
import WebParamModel from "@/ts/models/WebModel";
import Util from "@/ts/utils/Util";
import {LsLanguage} from "@/pages/leishen/util/LsLanguage";

//语言包
Vue.use(VueI18n);
const webParam = WebParamModel.getInstace(Util.REGION_CODE_1, Util.ZH_CN);
let lang = LsLanguage.getInstance();
lang.init();

@Component({
    components: {
        "el-table": Table,
        "el-table-column": TableColumn,
        "el-button": Button,
        "el-pagination": Pagination,
        "el-select": Select,
        "el-option-group": OptionGroup,
        "el-option": Option,
        "el-popover": Popover
    }
})
export default class RecordDialog extends ActiveRecordProxy {
    public webParam = WebParamModel.getInstace(); // 浏览器参数
    public recordDialogVisible: boolean = false; // 是否显示兑奖弹框
    public dialogTitle: string = ""; //弹出框的title
    public dialogType: string = "1"; //弹出框的类型1:实物/红包 2:实物/红包已领取3：第三方充值卡（含CDKEy）4：雷神充值卡（含CDKEy）5：优惠券
    public rowsPerPage: number = 5;
    public prizeBoxCopy:any={};
    @Prop() themeclass:string;
    created() {
        this.setBaseUrl(GlobalConfig.getBaseUrl());
        this.rowsPerPage = 5;
    }

    /**
     * token过期的处理
     */
    public tokenExpired() {
        this.$emit('loginout')
    }

    /**
     * 关闭兑奖弹框
     */
    public CloseRecordDialog() {
        this.recordDialogVisible = false;
    }

    /**
     * 改变手机区号
     */
    public onSelectCountryCode(val: number) {
        this.country_code_list.map(item => {
            for (let qq = 0; qq < item.options.length; qq++) {
                if (val == item.options[qq].code) {
                    this.countryCode = Object.assign({}, item.options[qq])
                    this.country_code = val.toString()
                }
            }
        })
    }

    /**
     * 当提交用户信息领取实物的时候
     */
    public sendUserInfo() {
        this.confirmUserInfo();
    }

    /**
     * 点击待兑奖或者查看详情的时候
     * @param row
     */
    public onChooseOrderPayType(row) {
        // 这里首先判断该行的奖品是否过期，如果过期，就提示用户
        if (row.status.toString() == '-1') {
            this.$emit('showtip', 'public.share1', 'user.b135');
        } else {
            this.payTypeDialogVisible = true;
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
                    this.discount = row.message;
                    this.details = row.details;
                    this.desc = row.desc;
                    this.dialogType = "5";
                    this.payTypeDialogVisible = true;
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

    // 确认礼包类型
    confirmGiftType(){
        if(this.card_id!=''){
            // 如果是待领取状态
            this.chargeCard(this.prizeBoxCopy,this.card_id);
            this.dialogTitle = this.$t("user.b120").toString();
            this.dialogType = '3';
        }else{
            this.payTypeDialogVisible = false;
            //@ts-ignore
            this.$notify({
                title:this.$t('public.share25').toString()+this.$t('user.b142').toString(),
                type: "warning"
            });
        }
    }

    // 上一页
    pervOrderList(val: number) {
    }

    // 下一页
    nextOrderList(val: number) {
    }

    currentChange(val: number) {
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
        this.getActiveRecordList(this.curentPage, 5);
        // @ts-ignore
        this.$notify({
            title: msg,
            type: "success"
        });
    }

    /**
     *
     */
    public getDiscountSuccess(msg: string) {
        this.getActiveRecordList(this.curentPage, 5);
        // @ts-ignore
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
    userInfoOk(title:string,msg: string) {
        this.email = '';
        this.address = '';
        this.phone = '';
        this.username = '';
        this.getActiveRecordList(this.curentPage, 5);
        // @ts-ignore
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
        // @ts-ignore
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
        this.getActiveRecordList(this.curentPage, 5);
        // @ts-ignore
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
        this.getActiveRecordList(this.curentPage, 5);
        this.$emit("refreshuserinfo");
        // @ts-ignore
        this.$notify({
            title: msg,
            type: "success"
        });
    }
    /**
     * 充值卡未自动充值成功，刷新活动记录的状态
     * @param msg
     */
    public chargeCardTip(msg: string, row: any){
        this.getActiveRecordList(this.curentPage, 5);
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

import '../../assets/css/animate.min.css';
import '@/assets/less/leishen.less';
import './assets/less/activity_dota2.less';
import 'babel-polyfill';
import {Component, Vue} from 'vue-property-decorator';
import HeadNav from './components/HeadNav.vue';
import FootNav from './components/FootNav.vue';
import DownloadBox from './components/DownloadBox.vue';
import RechargeDialog from './components/RechargeDialogV2';
import RecordDialog from './components/RecordDialog';
import VueI18n from 'vue-i18n';
import WebParamModel from '@/ts/models/WebModel';
import {LsLanguage} from './util/LsLanguage';
import GlobalConfig from './global.config';
import Util from '@/ts/utils/Util';
import LocalStorageUtil from "@/ts/utils/LocalStorageUtil";
import {Dialog, Loading,MessageBox, Notification} from "element-ui";
import ActivityProxyV2 from "@/ts/proxy/ActivityProxyV2";
import ActivityFactory from "@/ts/factory/activity.factory";
import $ from "jquery";
import HttpClient from "@/ts/net/HttpClient";
import {PriceList, UserInfo, UserRechargeInfo,payTransfer} from "@/ts/models/UserModel";

Vue.config.productionTip = false;
// Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$notify = Notification;
Vue.use(Loading);

//语言包
Vue.use(VueI18n);
const webParam = WebParamModel.getInstace(Util.REGION_CODE_1, Util.ZH_CN);
let lang = LsLanguage.getInstance();
lang.init();
const i18n = new VueI18n(lang);

@Component({
    components: {
        'head-nav': HeadNav,
        'foot-nav': FootNav,
        'recharge-dialog': RechargeDialog,
        'record-dialog': RecordDialog,//兑奖纪录
        'el-dialog': Dialog,
        'download-box': DownloadBox
    }
})
class activityModel extends ActivityProxyV2 {

    public activity_id = 220;
    public activity_json = ActivityFactory.getInstace('pc', this.activity_id);
    public webParam = WebParamModel.getInstace(); // 浏览器参数
    // public package_index: number = 1;//默认选择第二个推荐套餐
    public isLoading: boolean = false;

    public activityPackageId: number = 0;
    public canbuyTwice:boolean=true;
    public currentPacakge = new UserRechargeInfo();
    /**
     *  页面初始化调用
     */
    public async created() {
        this.imageHeadUrl = GlobalConfig.getImgBaseUrl();
        this.setBaseUrl(GlobalConfig.getBaseUrl());
        Util.checkIsMobile();
        this.getUserInfo('pc');
        this.getActivityDetail();
        this.getActivityPackage(HttpClient.URL_ACTIVITY_SPECIAL_PACKAGE)
    }

    public async mounted() {
        window.onscroll = () => {
            this.pageScroll(942);
        };
        this.getAwardList();
    }
    /**
     * 成功获取套餐
     */
    getActivityPackageSuccess(packageData:UserRechargeInfo){
        this.activityPackageId=packageData.package_id;
        let tempPrice=packageData.price.sort((a,b)=>{
            return b.price_is_recommend-a.price_is_recommend
        })
        this.currentPacakge=packageData
        this.currentPacakge.price=tempPrice.slice(0)

    }
    /**
     * 登录成功
     */
    public async logined() {
        this.needtoCheck=false;
        this.getUserInfo('pc');
        this.getActivityDetail();
    }
    /**
     * 支付成功
     */
    paySuccess(){
        this.getActivityDetail();
        if(this.canbuyTwice){
            (this.$refs.to_recharge as any).getUserDiscount()
        }
    }
    /**
     * 退出登录
     */
    public logout() {
        this.aCount = 0;
    }
    /**
     * 用户不满足购买套餐的条件
     */
    cannotBuy(){
        if(!this.dialog_error){
            this.isValidUser=false
            this.dialog_error=true
            this.dialog_msg=this.tipinvalidUser;
        }
    }
    /**
     * 获取用户信息成功
     */
    getUserinfoSuccess(){
        (this.$refs.headnav as any).checkLogin();
        (this.$refs.to_recharge as any).init();
    }
    /**
     * 获取用户信息失败
     */
    public getUserinfoFail(data) {
        this.$notify({
            title: '温馨提示',
            message: data.msg.toString(),
            type: 'warning'
        });
        (this.$refs.headnav as any).isLogin = false;
    }

    /**
     * 初始化中奖列表名单
     */
    public initAwardList() {
        if (this.awardList.length <= 10) return;
        $(function () {
            setInterval(function () {
                var $ul = $("#jilu_box");
                $ul.animate({
                    marginTop: "-30px"
                }, 400, function () {
                    $ul.find("li").eq(0).appendTo($ul);
                    $ul.css("margin-top", "0")
                })
            }, 2000);
        });
    }
    // 点击中奖列表时
    public onClickAward(){
        if (!Util.easyIsLogined()) {
            //提示登录
            this.gotoLogin();
            return;
        }else{
            if(this.isKaishi&&!this.isJieshu){
                this.closeDialog()
                //@ts-ignore
                this.$refs.activeRecordList.recordDialogVisible=true;
                //@ts-ignore
                this.$refs.activeRecordList.initA()
            }else{
                if(!this.isKaishi){
                    this.dialog_msg ='活动暂未开始'
                }else{
                    this.dialog_msg='活动以结束'
                }
                this.dialog_error = true;
            }
        }
    }

    /**
     * 登录
     */
    public gotoLogin() {
        $('body').removeClass('body_fixed');
        if (!Util.easyIsLogined()) {
            (this.$refs.headnav as any).toLogin();
        }
    }

    /**
     * 充值
     */
    public gotoRecharge(data: any) {
        if (!Util.easyIsLogined()) {
            this.gotoLogin();
        } else {
            if(!this.canClick()){
                if(!this.dialog_error){
                    this.dialog_error=true
                    this.dialog_msg=this.activity_ErrorTip;
                }
            }else{
                //  支付请求
                this.paytrans.price_id = data.price_id;
                this.paytrans.price_num = data.price_num;
                this.paytrans.price_title = data.price_title;
                (this.$refs.to_recharge as any).setPayWay(this.activityPackageId,this.paytrans);
            }
        }
    }

    /**
     * token过期
     * @param param
     */
    public  tokenExpired() {
        LocalStorageUtil.loginOut();
        (this.$refs.headnav as any).checkLogin();
    }

    /**
     * 切换语言
     */
    public onChangeLanguage(ln: string) {
        lang.changeLanguage(ln);
        i18n.locale = lang.locale;
        this.webParam.language = ln;
    }
}

new activityModel({i18n}).$mount('#app')

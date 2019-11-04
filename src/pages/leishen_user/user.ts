import "@/assets/less/leishen.less";
import "babel-polyfill";
import {Component, Vue} from "vue-property-decorator";
import HeadNavTwo from "./components/HeadNavTwo.vue";
import FootNav from "./components/FootNav.vue";
import UserAd from "./components/UserAd.vue";
import UserNotify from "./components/UserNotify.vue";
import UserAgreement from "./components/UserAgreement.vue";
import UserSafety from "./components/UserSafety.vue";
import UserOrder from "./components/UserOrder.vue";
import UserCard from "./components/UserCard.vue";
import UserInfo from "./components/UserInfo.vue";
import PayDialog from "./components/PayDialog.vue";
import ActiveRecord from "./components/ActiveRecord.vue";
import UserRecharge from "./components/UserRecharge.vue";
import {Carousel, CarouselItem, Dialog, Loading, MessageBox,Alert, Notification, Tooltip} from "element-ui";
import VueI18n from "vue-i18n";
import UserProxy from "@/ts/proxy/UserProxy";
import LocalStorageUtil from "@/ts/utils/LocalStorageUtil";
import JumpWebUtil from "@/ts/utils/JumpWebUtil";
import Util from "@/ts/utils/Util";
import {
    NewResetpwdRequestModel,
    PayModel,
    SendVerificationCodeRequestModel,
    SetSecondPwdRequestModel,
    UpdateInfos
} from "@/ts/models/UserModel";
import {TipsMsgUtil} from "@/ts/utils/TipsMsgUtil";
import HttpClient from "@/ts/net/HttpClient";
import ConfigUtil from "@/ts/utils/ConfigUtil";
import {TdappModel} from "@/ts/models/TdappModel";
import AppParamModel from "@/ts/models/AppModel";
import GlobalConfig from "./global.config";
import {LsLanguage} from "@/pages/leishen_user/util/LsLanguage";

Vue.prototype.$notify = Notification;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.use(Dialog);
Vue.use(Tooltip);
Vue.use(Loading);

//语言包
Vue.use(VueI18n);
const webParam = AppParamModel.getInstace(Util.REGION_CODE_1, Util.ZH_CN);
let lang = LsLanguage.getInstance();
lang.init();
const i18n = new VueI18n(lang);

@Component({
    components: {
        "head-nav-two": HeadNavTwo,
        "foot-nav": FootNav,
        "user-ad": UserAd,
        "user-notify": UserNotify,
        "user-agreement": UserAgreement,
        "user-safety": UserSafety,
        "user-order": UserOrder,
        "user-card": UserCard,
        "user-info": UserInfo,
        "user-recharge": UserRecharge,
        "el-carousel": Carousel,
        "el-carousel-item": CarouselItem,
        "pay-dialog": PayDialog,
        "el-dialog": Dialog,
        "el-tooltip": Tooltip,
        "active-record": ActiveRecord
    }
})
class User extends UserProxy {
    public webParam = AppParamModel.getInstace(); // 浏览器参数
    public timeHours: number = 0; //剩余时间的小时数
    public timeMinutes: number = 0; //剩余时间的分钟数
    public timeSeconds: number = 0; //剩余时间的秒数
    public windowsDownloadUrl: string = ""; //windows客户端下载配置
    public macDownloadUrl: string = ""; //mac客户端下载配置
    public isInit: boolean = true; //是否初次获取用户信息
    public getUserInfoCount: number = 0;//刷新用户信息倒计时
    public timer: any = null;//倒计时计时器
    public xianshi_activity_info = null;
    public timeFontRed: boolean = false;//时间字体是否变红
    public showPrevios:boolean=false;
    public shouchong_banner_img: string = '';//首冲活动图片
    /**
     * vue初始化完成
     */
    public created() {
        this.imageHeadUrl = GlobalConfig.getImgBaseUrl();
        this.setBaseUrl(GlobalConfig.getBaseUrl());
        this.init();
        this.getDownloadUrl();
        let thirdBindError = localStorage.getItem('third_bind_error');
        if (thirdBindError == '1'){
            this.$confirm(TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_THIRDBIND_FAILD), "", {
                confirmButtonText: TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_YES),
                type: "warning",
                showCancelButton: false
            }).then(() => {

            });
            localStorage.removeItem('third_bind_error');
        }
    }

    /**
     * 获取下载url
     * @param url
     */
    public async getDownloadUrl() {
        const jsonConfig = await ConfigUtil.getInstance().download(true);
        const downConfig = jsonConfig.leigod.down_platform[this.webParam.from];
        this.windowsDownloadUrl = downConfig.windows.download_url;
        this.macDownloadUrl = downConfig.mac.download_url;
        this.xianshi_activity_info = jsonConfig.leigod.is_show_xianshi_activity;
        if(this.userInfo.is_pay_user == 0) {
            let data = jsonConfig.leigod.shouchong_banner_img;
            let start_time = new Date(data.start_time).getTime();
            let end_time = new Date(data.end_time).getTime();
            let now_time = new Date().getTime();
            if(start_time<=now_time && now_time<=end_time) {
                this.shouchong_banner_img = data.url;
            }
        }
    }
    public showTip(title:string,msg:string){
        this.$notify({
            title: this.$i18n.t(title).toString(),
            message: this.$i18n.t(msg).toString(),
            type : 'warning'
        })
    }
    /**
     * 下载windows客户端
     * @param ln
     */
    public windowsDownload() {
        let tdModel = new TdappModel();
        tdModel.getBrowser();
        window.location.href = this.windowsDownloadUrl;
    }

    /**
     * 打开绑定账号弹窗
     */
    public onBindAccount() {
        (this.$refs.safety as any).bindAccountShow();
    }

    /**
     * 格式化时间
     * @param h
     * @param m
     * @param s
     */
    public formatTime(time: number) {
        if (time <= 0 || time == null || isNaN(time)) return;
        this.timeHours = Math.floor(time / 3600);
        this.timeMinutes = Math.floor((time % 3600) / 60);
        this.timeSeconds = time % 60;
    }

    /**
     * 切换语言
     */
    public onChangeLanguage(ln: string) {
        lang.changeLanguage(ln);
        i18n.locale = lang.locale;
        this.getUserInfo()
        GlobalConfig.log("切换语言:" + lang.locale);
    }

    /**
     * token过期的处理
     */
    public tokenExpired() {
        LocalStorageUtil.loginOut();
        JumpWebUtil.webGotoUser(GlobalConfig.getUserBaseUrl(), JumpWebUtil.HTML_NAME_LOGIN);
    }

	/**
	 * 用户信息请求成功
	 */
	public getUserinfoSuccess() {
		const page = parseInt(Util.getUrlParam("page"));
		// @ts-ignore
		this.$refs.userHead.nickname=this.userInfo.nickname
        // @ts-ignore
        this.$refs.userHead.avatar=this.userInfo.avatar_new||this.userInfo.avatar
		if (!isNaN(page) && this.isInit) {
			this.changePage(page);
		} else {
			this.changePage(this.pageIndex);
		}
		// 修改head
		if (this.$refs.head != null) {
			(this.$refs.head as any).checkLogin();
		}
        if (this.userInfo.master_account == 1 && this.userInfo.email == "" && this.isInit) {
            //第一行是原来的代码逻辑，根据master_account主账号类型，且判断主账号是否为空，第二行保留是因为李利周觉得这样的绑定方式更好
            // if ((this.userInfo.master_account == 0 && this.userInfo.mobile == "" && this.isInit) || (this.userInfo.master_account == 1 && this.userInfo.email == "" && this.isInit)) {
            // if ((this.userInfo.region_code == 1 && this.userInfo.mobile == "" && this.isInit) || (this.userInfo.master_account == 1 && this.userInfo.email == "" && this.isInit)) {
            (this.$refs.safety as any).bindAccountShow();
        };
        //这行是针对上面代码的修改二座的补偿措施，对手机号的绑定跳转到登录页面进行判断；
        if(this.userInfo.region_code == 1 && this.userInfo.mobile == "" && this.isInit){
            //如果是国内账号regionc_code=1,mobile字段为空
            // 如果用户是国内登录，且手机号为空；
            let alterTitle=this.$t('public.share67').toString()
            let alterp=this.$t('public.share68').toString()
            let btnText=this.$t('public.share69').toString()
            this.$alert(alterp, alterTitle, {
                confirmButtonText: btnText,
                showClose:false,
                customClass:'llz_bindMobile',
                callback: action => {
                    let regionc_code=Util.getUrlParam('region_code');
                    let lang=Util.getUrlParam('language');
                    let loginParams='?region_code='+regionc_code+'&language='+lang+'&'
                    let url=GlobalConfig.getUserBaseUrl()+'/'+JumpWebUtil.HTML_NAME_LOGIN+loginParams+'bind=bindMobile&to='+window.location.href
                    JumpWebUtil.toPage(url,-1,-1)
                }
            });
        }
        if(this.userInfo.expiry_time_samp < 0) {
            this.userInfo.expiry_time_samp = 0;
        }
        let allTimes = this.userInfo.expiry_time_samp + this.userInfo.experience_time;
        this.isInit = false;
        if(this.userInfo.is_pay_user == 0 && allTimes <= 1800) {
            this.timeFontRed = true;
        } else if(this.userInfo.is_pay_user == 1 && allTimes <= 72000) {
            this.timeFontRed = true;
        } else {
            this.timeFontRed = false;
        };
        this.remainTimer(this.userInfo.expiry_time_samp + this.userInfo.experience_time);
		this.formatTime(this.userInfo.expiry_time_samp + this.userInfo.experience_time);
    }

    // /**
    //  * 加载头像失败时触发
    //  */
    // public onErrorAvatar() {
    //     this.userInfo.avatar_new = './images/default_avatar.png';
    //     this.userInfo.avatar = this.userInfo.avatar_new;
    //     LocalStorageUtil.addUserInfo(this.userInfo)
    // }

    /**
     * 刷新用户信息
     */
    public reGetUserInfo() {
        if (this.getUserInfoCount > 0) return;
        this.getUserInfo();
        this.getUserInfoCount = 10;
        const sefl = this;
        Util.countDown(this.getUserInfoCount, 1, (n: number) => {
            sefl.getUserInfoCount = n;
        });
    }

    /**
     * 剩余时间倒计时
     */
    public remainTimer(time: number) {
        if (this.userInfo.pause_status_id != 0) return;
        if (time <= 0 || time == null || isNaN(time)) {
            this.timeHours = 0;
            this.timeMinutes = 0;
            this.timeSeconds = 0;
            return;
        }
        if (this.timer != null) clearInterval(this.timer);
        this.timer = setInterval(() => {
            time--;
            if (time == 0) {
                clearInterval(this.timer);
                return;
            }
            this.formatTime(time);
            let now_date = new Date().getTime();
            let date = new Date(this.userInfo.experience_expiry_time).getTime();
            if(now_date >= date && this.userInfo.experience_time != 0) {
                this.getUserInfo();
            };
            if(this.userInfo.is_pay_user == 0 && time <= 1800) {
                this.timeFontRed = true;
            };
            if(this.userInfo.is_pay_user == 1 && time <= 72000) {
                this.timeFontRed = true;
            };
        }, 1000)
    }

    /**
     * 关闭剩余时间倒计时
     */
    public remainTimerStop() {
        clearInterval(this.timer);
    }

    /**
     * 暂停计时
     */
    public onSuspended() {
        this.onTimeSuspended();
    }

    /**
     * 暂停计时成功
     */
    public onTimeSuspendedSuccess() {
        this.$notify({
            title: TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_SUCCESS_TITLE),
            message: TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_TIME_SUSPEND_SUCCESS),
            type : 'success'
        })
        this.remainTimerStop();
    }

    /**
     * 暂停计时失败
     */
    public onTimeSuspendedFaild(data: any) {
        this.$notify({
            title: TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_ERROR_TITLE),
            message: data.msg,
            type: 'warning'
        })
    }

    /**
     * 恢复计时
     */
    public onRestore() {
        this.onTimeRestore();
    }

    /**
     * 恢复计时成功
     */
    public onTimeRestoreSuccess() {
        this.$notify({
            title: TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_SUCCESS_TITLE),
            message: TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_TIME_RESTORE_SUCCESS),
            type: 'success'
        })
        this.remainTimer(this.userInfo.expiry_time_samp);
    }

    /**
     * 恢复计时失败
     */
    public onTimeRestoreFaild(data: any) {
        this.$notify({
            title: TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_ERROR_TITLE),
            message: data.msg,
            type: 'warning'
        })
    }

	/**
	 * 选择服务
	 */
	public changePage(index: number) {
		this.pageIndex = index;
		switch (index) {
            case 0:
                (this.$refs.orderList as any).initA();
                break;
			case 1:
				(this.$refs.userinfo as any).init();
				break;
            case 2:
                (this.$refs.activeRecordList as any).initA();
                break;
            case 3:
                (this.$refs.recharge as any).initA();
                break;
            case 4:
                (this.$refs.userRechergeCard as any).getInit();
                break;
			case 5:
				(this.$refs.safety as any).init();
				break;
			default:
				break;
		}
	}

    /**
     * 开始支付
     */
    public onBeginPay(data: PayModel,showprevios:boolean) {
        this.payObj = data;
        this.showPrevios=showprevios;
        this.payDialogVisible = true;
    }

    /**
     * 打开支付
     */
    public onOpenPyaDialog() {
        (this.$refs.payDialogCom as any).init();
    }
    /**
     * 返回设置支付方式
     */
    goBack(){
        this.payDialogVisible = false;
        (this.$refs.recharge as any).backStep1();
    }
    /**
     * 支付成功点击确认
     */
    payDoned(){
        this.payDialogVisible = false;
    }
    /**
     * 关闭支付弹窗
     */
    public onClosePyaDialog() {
        this.payDialogVisible = false;
        this.payObj = new PayModel();
        (this.$refs.payDialogCom as any).onClose();
        this.getUserInfo();
    }

    /**
     * 支付成功
     */
    public paySuccess() {
        this.payDialogVisible = false;
        this.$confirm(TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_PAY_PACKAGE_SUCCESS), "", {
            confirmButtonText: TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_BUTTON_BACK),
            type: "success",
            showCancelButton: false
        })
            .then(() => {
                this.getUserInfo();
            })
            .catch(() => {
                this.getUserInfo();
            });
    }

    /**
     * 退出登录弹窗
     */
    public loginOut() {
        this.$confirm(TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_LOGIN_OUT), "提示", {
            confirmButtonText: TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_YES),
            cancelButtonText: TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_NO)
        })
            .then(() => {
                this.onLoginOut();
            })
            .catch(() => {
            });
    }

    /**
     * 退出登录
     */
    public async onLoginOut() {
        this.isLoading = true;
        const tokenInfo = LocalStorageUtil.getUserToken();
        const url = HttpClient.URL_AUTH_LOGOUT;
        const param = {
            account_token: tokenInfo.account_token
        };
        this.backData = await this.http.post(url, param);
        this.isLoading = false;
        if (this.backData.code == HttpClient.HTTP_SUCCESS_NET_CODE || this.backData.code == HttpClient.HTTP_TOKEN_EXPIRE) {
            LocalStorageUtil.loginOut();
            JumpWebUtil.userGotoWeb(GlobalConfig.getWebBaseUrl(), JumpWebUtil.HTML_NAME_INDEX);
        } else {
            //退出登录失败
        }
    }

    /**
     * 上传用户信息
     */
    public onUploadUserInfo(data: UpdateInfos) {
        if (data.nickname) this.updateInfos.nickname = data.nickname;
        this.updateInfos.address = data.address;
        if (data.sex) this.updateInfos.sex = data.sex;
        if (data.birthday) this.updateInfos.birthday = data.birthday;
        if (data.user_url != "") {
            this.uploadAvatar(data.user_url);
        } else {
            this.saveUserInfo(data);
        }
    }

    /**
     * 修改用户信息成功
     */
    public onSaveUserInfosSuccess() {
        (this.$refs.userinfo as any).resetInfoSuccess();
        (this.$refs.userHead as any).updateHeader();
    }

    /**
     * 发送修改密码验证码
     */
    public onSendVerificationCode() {
        let param = new SendVerificationCodeRequestModel();
        param.account_token = LocalStorageUtil.getUserToken().account_token;
        this.onSendVerification(param);
    }

    /**
     * 发送修改密码验证码成功
     */
    public onSendVerificationSuccess(data: any) {
        (this.$refs.safety as any).sendVerifySuccessBack(data);
    }

    /**
     * 修改密码
     */
    public onResetPwd(param: NewResetpwdRequestModel) {
        this.onResetPasswordNew(param);
    }

    /**
     * 修改密码成功
     */
    public onResetPasswordSuccess(data: any) {
        (this.$refs.safety as any).resetPwdSuccess(data);
    }

    /**
     * 修改密码失败
     */
    public onResetPasswordFaild(data: any) {
        (this.$refs.safety as any).resetPwdFaild(data);
    }

    /**
     * 修改二级密码
     */
    public onSetSecondPwd(param: SetSecondPwdRequestModel) {
        this.onSetSecondPassword(param);
    }

    /**
     * 修改二级密码成功
     */
    public onSetSecondPasswordSuccess(data: any) {
        (this.$refs.safety as any).setSecondPwdSuccessBack(data);
    }

    /**
     * 修改二级密码失败
     */
    public onSetSecondPasswordFaild(data: any) {
        (this.$refs.safety as any).setSecondPwdFaildBack(data);
    }
}

new User({
    i18n
}).$mount("#app");

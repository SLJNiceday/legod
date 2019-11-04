import '../../assets/css/animate.min.css';
import '@/assets/less/leishen.less';
import './assets/less/summer.less';
import 'babel-polyfill';
import {Component, Vue} from 'vue-property-decorator';
import HeadNav from './components/HeadNav.vue';
import FootNav from './components/FootNav.vue';
import DownloadBox from './components/DownloadBox.vue';
import RechargeDialog from './components/RechargeDialog';
import RecordDialog from './components/RecordDialog';
import VueI18n from 'vue-i18n';
import WebParamModel from '@/ts/models/WebModel';
import {LsLanguage} from './util/LsLanguage';
import GlobalConfig from './global.config';
import Util from '@/ts/utils/Util';
import LocalStorageUtil from "@/ts/utils/LocalStorageUtil";
import {Dialog, Loading, Notification} from "element-ui";
import ActivityProxy from "@/ts/proxy/ActivityProxy";
import Clipboard from "clipboard";
import ActivityFactory from "@/ts/factory/activity.factory";
import $ from "jquery";
import HttpClient from "@/ts/net/HttpClient";
import {PriceList, UserInfo} from "@/ts/models/UserModel";
import ConfigUtil from "@/ts/utils/ConfigUtil";
import {TipsMsgUtil} from "@/ts/utils/TipsMsgUtil";

Vue.config.productionTip = false;
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
class activityModel extends ActivityProxy {

    public activity_id = 213;
    public activity_json = ActivityFactory.getInstace('pc', this.activity_id);
    public webParam = WebParamModel.getInstace(); // 浏览器参数
    public package_index: number = 1;//默认选择第二个推荐套餐
    public isLoading: boolean = false;
    public up_btn_show_timer = null;
    public default_awardList = [];
    public summer_weibo_show: boolean = true;
    public summer_weixin_show: boolean = true;
    public summer_weibo_dialog: boolean = false;
    public summer_weixin_dialog: boolean = false;
    public count_min: number = 10;
    public weibo_guanzhu_is_show: boolean = true;
    public weixin_guanzhu_is_show: boolean = true;
    public summer_choujiang_deng_show: boolean = true;

    /**
     *  页面初始化调用
     */
    public async created() {
        this.activityJson = this.activity_json;
        this.imageHeadUrl = GlobalConfig.getImgBaseUrl();
        this.account_token = LocalStorageUtil.getUserToken().account_token;
        this.setBaseUrl(GlobalConfig.getBaseUrl());
        // this.getPriceList();
        this.getActivityId();
        this.getActivityDetail();
        await this.getUserInfo();
        this.getGuanzhuStatus();
        // this.changePackageIndex(1);
        if (this.account_token == '') {
            this.refer_code = '';
            this.refer_code_link = '';
        }
        Util.checkIsMobile();
    }

    public async mounted() {
        window.onscroll = () => {
            this.pageScroll(942);
        };
        this.luck.init('prize','.summer_choujiang_li');
        this.getAwardList();
        this.summerDengFlash();
    }

    /**
     * 登录成功
     */
    public async logined() {
        this.needtoCheck=false;
        await this.getUserInfo();
        this.account_token = LocalStorageUtil.getUserToken().account_token;
        this.getActivityDetail();
        this.getGuanzhuStatus();
        await (this.$refs.to_recharge as any).getUserDiscount();
        await (this.$refs.to_recharge as any).getUserPackage();
    }

    /**
     * 退出登录
     */
    public logout() {
        this.account_token = LocalStorageUtil.getUserToken().account_token;
        this.aCount = 0;
        this.refer_code = '请先登录!';
        this.refer_code_link = '请先登录!';
    }

    /**
     * 抽奖区背景灯闪烁
     */
    public summerDengFlash() {
        setInterval(()=> {
            this.summer_choujiang_deng_show = !this.summer_choujiang_deng_show;
        },300)
    }

    /**
     * 关注微博倒计时
     */
    public clickWeibo() {
        if (this.account_token == '' || this.account_token == null) {
            this.gotoLogin();
            return;
        }
        if(this.userInfo.is_pay_user == 0) {
            this.dialog_msg = '当前活动仅限雷神超级会员参与！';
            this.dialog_error = true;
            return;
        }
        this.summer_weibo_dialog = true;
        let timer = setInterval(()=> {
            this.count_min--;
            if(this.count_min == 0) {
                this.weibo_guanzhu_is_show = false;
                this.count_min = 10;
                clearInterval(timer)
            }
        },1000)
    }

    /**
     * 关注微信倒计时
     */
    public clickWeixin() {
        if (this.account_token == '' || this.account_token == null) {
            this.gotoLogin();
            return;
        }
        if(this.userInfo.is_pay_user == 0) {
            this.dialog_msg = '当前活动仅限雷神超级会员参与！';
            this.dialog_error = true;
            return;
        }
        this.summer_weixin_dialog = true;
        let timer = setInterval(()=> {
            this.count_min--;
            if(this.count_min == 0) {
                this.weixin_guanzhu_is_show = false;
                this.count_min = 10;
                clearInterval(timer)
            }
        },1000)
    }

    /**
     * 关闭关注弹窗
     */
    public closeGuanzhu() {
        this.summer_weixin_dialog = false;
        this.summer_weibo_dialog = false;
    }

    /**
     * 获取用户参与关注领时长状态
     */
    public async getGuanzhuStatus() {
        let token = Util.getUrlParam("account_token") || LocalStorageUtil.getUserToken().account_token;
        const url = HttpClient.URL_ATTENTION_ISJOIN;
        const param = {
            account_token: token
        };
        this.backData = await this.http.post(url, param);
        if (this.backData.code == HttpClient.HTTP_SUCCESS_NET_CODE) {
            if(this.backData.data.length > 0) {
                this.summer_weibo_show = false;
                this.summer_weixin_show = false;
                this.backData.data.forEach((item)=> {
                    switch(item.type) {
                        case 1:
                            this.summer_weibo_show = true;
                            break;
                        case 2:
                            this.summer_weixin_show = true;
                            break;
                        default:
                            break;
                    }
                });
            }else {
                this.summer_weibo_show = false;
                this.summer_weixin_show = false;
            }
        }else if (this.backData.code == HttpClient.HTTP_TOKEN_EXPIRE) {
            this.tokenExpired(this.backData.msg);
        }else {
        }
    }

    /**
     * 领取关注微博时长
     */
    public async getGuanzhuPrize(type: number) {
        this.closeGuanzhu();
        let token = Util.getUrlParam("account_token") || LocalStorageUtil.getUserToken().account_token;
        const url = HttpClient.URL_ATTENTION_JOIN;
        const param = {
            account_token: token,
            type:type,
            activity_id:this.activity_id
        };
        this.backData = await this.http.post(url, param);
        if (this.backData.code == HttpClient.HTTP_SUCCESS_NET_CODE) {
            console.log(this.backData)
            this.dialog_error = true;
            this.dialog_msg = '领取成功';
            if(type == 1) {
                this.summer_weibo_show = false;
            }else if(type == 2) {
                this.summer_weixin_show = false;
            }
        }else if (this.backData.code == HttpClient.HTTP_TOKEN_EXPIRE) {
            this.tokenExpired(this.backData.msg);
        }else {
        }
    }

    /**
     * 获取活动套餐
     */
    public async getPriceList() {
        let lang=LocalStorageUtil.getLanguage().toString();
        let pacakgeJson=await ConfigUtil.getInstance().getRechargeJson(GlobalConfig.getWebBaseUrl());
        this.priceList = pacakgeJson['1__'+lang].price;
        // this.priceList.reverse();
        this.priceList.sort((itemA, itemB) => {
            return itemB.price_is_recommend - itemA.price_is_recommend
        });
    }

    /**
     * 页面点击获取固定套餐
     * @param index
     */
    public changePackageIndex(index: number) {
        this.package_index = index;
    }

    /**
     * 登录成功后调用户信息接口，获取用户信息
     */
    public async getUserInfo() {
        try {
            this.isLoading = true;
            let token = Util.getUrlParam("account_token") || LocalStorageUtil.getUserToken().account_token;
            if (token == "") {
                // this.tokenExpired(TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_LOGIN_FAILURE));
                return;
            } else {
                const url = HttpClient.URL_USER_INFO;
                const param = {
                    account_token: token
                };
                this.backData = await this.http.post<UserInfo>(url, param);
                this.isLoading = false;
                if (this.backData.code == HttpClient.HTTP_SUCCESS_NET_CODE) {
                    (this.$refs.headnav as any).isRealLogin = true;
                    this.userInfo = this.backData.data;
                    UserInfo.getUserName(this.userInfo);
                    UserInfo.getUserAvatar(this.userInfo);
                    UserInfo.updateUserInfo(this.userInfo);
                    (this.$refs.headnav as any).checkLogin();//重新更新header的状态
                    // (this.$refs.to_recharge as any).getUserinfoSuccess();//登录成功获取用户套餐
                    if(this.needtoCheck){
                        this.checkisBinbMobile(this.userInfo,'pc')
                    }
                } else if (this.backData.code == HttpClient.HTTP_TOKEN_EXPIRE) {
                    this.tokenExpired(this.backData.msg);
                    (this.$refs.headnav as any).isLogin = false;
                } else {
                    (this.$refs.headnav as any).isLogin = false;
                    this.getUserinfoFail(this.backData);
                }
            }
        } catch (e) {

        }
    }

    /**
     * 获取用户信息失败
     */
    public getUserinfoFail(data) {
        this.tokenExpired(data.msg);
    }

    /**
     * 初始化中奖列表名单
     */
    public initAwardList() {
        if (this.awardList.length <= 6) return;
        $(function () {
            setInterval(function () {
                var $ul = $("#jilu_box");
                $ul.animate({
                    marginTop: "-80px"
                }, 400, function () {
                    $ul.find("li").eq(0).appendTo($ul);
                    $ul.css("margin-top", "0")
                })
            }, 2000);
        });
    }

    /**
     * 点击翻牌
     */
    public clickReverse(index: number) {
        if(this.isBengin) return;
        this.kp_index = index;
        this.onClickDraw();
    }

    /**
     * 生成推荐链接
     * @param refer_code
     */
    public generateRefercodeLink(refer_code: string) {
        this.refer_code_link = Util.getOrigin() + '/leigod/kapai.html?refer_code=' + refer_code + '#recharge';
    }

    /**
     * 复制推荐链接
     */
    public copyRefercodeLink() {
        if (this.account_token == "") {
            //提示登录
            this.gotoLogin();
            return;
        }
        const that = this;
        let clipboard = new Clipboard("#copyRefercodeLink", {
            text: function () {
                return that.refer_code_link;
            }
        });
        clipboard.on("success", function (e) {
            e.clearSelection();
            that.dialog_error = true;
            that.dialog_msg = '邀请链接已复制到剪切板！快去邀请好友充值获取时长卡吧！';
        });
    }

    /**
     * 立即充值
     */
    public gotoInvite() {
        this.onCloseRecharge();
        this.gotoRecharge();
    }

    /**
     * 登录
     */
    public gotoLogin() {
        this.dialog_no_login = false;
        $('body').removeClass('body_fixed');
        if (this.account_token == '' || this.account_token == null) {
            (this.$refs.headnav as any).toLogin();
        }
    }

    /**
     * 充值
     */
    public gotoRecharge() {
        if (this.account_token == '' || this.account_token == null) {
            this.gotoLogin();
        } else {
            if(this.userInfo.is_switch_package == 0 && (this.$refs.to_recharge as any).packageList[(this.$refs.to_recharge as any).czTypeIndex].include_region_codes == '0') {
                this.$notify({
                        title: TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_ERROR_TITLE).toString(),
                        message: "此活动只针对于雷神超级会员，海外会员不在此活动范围内！",
                        type: 'warning'
                    });
                return false;
            }
            (this.$refs.to_recharge as any).onChoosePrice(0);
            (this.$refs.to_recharge as any).buyDefaultPrice();
        }
    }

    /**
     * 兑奖
     */
    public gotoDuijiang(status: number = 0) {
        this.closeDialog();
        if (this.account_token == '' || this.account_token == null) {
            this.gotoLogin();
        } else {
            if (status != 3) {
                // JumpWebUtil.webGotoUser(GlobalConfig.getUserBaseUrl(), JumpWebUtil.HTML_NAME_USER, 'page=7');
                (this.$refs.activeRecordList as any).recordDialogVisible = true;
                (this.$refs.activeRecordList as any).initA();
            }
        }
    }

    /**
     * token过期
     * @param param
     */
    public tokenExpired(param: string = null): void {
        LocalStorageUtil.loginOut();
        this.account_token = '';
        this.userInfo = null;
        (this.$refs.headnav as any).checkLogin();
        // this.$notify({
        //     title: TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_ERROR_TITLE).toString(),
        //     message: param,
        //     type: 'warning'
        // });
        // this.gotoLogin();
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

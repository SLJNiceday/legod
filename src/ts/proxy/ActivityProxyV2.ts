import Component from "vue-class-component";
import Vue from "vue";
import {IActivity} from "@/ts/interface/IActivity";
import HttpClient from "@/ts/net/HttpClient";
import LocalStorageUtil from "@/ts/utils/LocalStorageUtil";
import {
    ActivityDetailRequestModel,
    ActivityDrawModel,
    ActivityModel, ActivityPackageRequestModel,
    PresentListRequestModel,
    referList,
    referOutput, timeClock
} from "@/ts/models/NewsModel";
import {IdataModel} from "@/ts/models/IdataModel";
import Util from "@/ts/utils/Util";
import {
    ActiveRecordListModel,
    ActiveRecordRequestModel, payTransfer, PriceList,
    ReferCodeModel,
    ReferCodeRequestModel, UserInfo, UserRechargeInfo
} from "@/ts/models/UserModel";
import Clipboard from "clipboard";
import $ from "jquery";
import {Luck} from "@/ts/models/Luck.ts";
import JumpWeiXin from "@/pages/leishen_app/util/jump";
import JumpWebUtil from "../utils/JumpWebUtil";
import GlobalConfig from "@/pages/leishen/global.config";
import {Toast} from "vant";

Vue.use(Toast);
@Component
export default class ActivityProxyV2 extends Vue implements IActivity {
    //提示类常量
    tipNotKaishi: string = '活动暂未开始'
    tipisjieshu: string = '活动已经结束'
    tipinvalidUser: string = '当前活动只针对雷神超级会员，海外会员暂不可参与!'
    // 工具类
    public http: HttpClient = new HttpClient();
    public backData: IdataModel<any> | undefined;
    public isLoading: boolean = false;

    //活动相关的数据属性
    public activity_id = 0; // 活动id
    isKaishi: boolean = true;//活动是否还未开始,true-未开始，false-已开始-默认为true
    isJieshu: boolean = false //  //活动是否已经结束true-已结束，false-为结束-默认为false
    isValidUser: boolean = true//判断用户是否可以参与活动，true,可以参与活动，false,不能参与活动,默认可以参与活动
    activity_ErrorTip: string = ''//判断活动是否开始（活动暂未开始），活动是否结束（活动已经结束），用户是否可以参与活动的提示（当前活动只针对雷神超级会员，海外会员
    public activity_json = null;//活动的json数据
    public activityDetails: ActivityModel = null; //活动详情
    public points: number = 0; //我的抽象积分
    public aCount: number = 0; // 可抽奖次数
    public clock = new timeClock(); //活动倒计时
    public canbuyTwice:boolean=false //活动的套餐是否可以多次购买，默认为false-不可多次购买，配置这个参数，是为了检测用户支付成功以后，是否需要刷新折扣码，
    //绑定手机号的属性
    public needtoCheck: boolean = true //是否需要检查用户的国内区，但是没有绑定手机号-默认需要检查,但是登录成功以后，不用检查

    //抽奖相关的数据属性
    public luck: Luck = new Luck() // 九宫格式的抽奖样式
    public roll_deg: number = 0;//转盘式的抽奖，代表转盘的角度
    public kp_index: number = 0;//所翻卡牌的index
    public isBengin = false;//是否可以开始抽奖，如果用户点击了抽奖按钮，符合条件（isBengin==false&&登录&&抽奖次数>0）,置为true,防止用户多次点击
    public awardInfo = null;//后台返回的调取抽奖接口的返回数据
    public prize_name: string = ''; //抽奖成功的时候-抽奖接口的返回数据的奖品名称
    public prize_id: number = -1; //抽奖成功的时候-抽奖接口的返回数据的奖品id标识


    //推荐链接相关数据属性
    public refer_code_link: string = '邀请链接';//推荐码的链接
    public refer_code: string = '邀请码'; //推荐码的链接
    public myReferList: Array<referOutput> = [];//登录用户已经推荐的用户列表

    // 弹出框的数据
    public dialog_error = false;//活动未开始，活动已经结束，没有抽中任何礼品，成功复制邀请链接-弹出框的开关
    public dialog_msg: string = '';//活动未开始，活动已经结束，没有抽中任何礼品，成功复制邀请链接 -dialog_error弹出框的提示内容分类
    public dialog_recharge = false;  //提示用户需要充值的弹框，关闭是需要跳转到id=recharge的锚点
    public dialog_win = false; //用户抽中奖品的弹框

    //页面布局的相关属性
    public tabIndex = 0; //用户抽奖页面以Tab形式展现。
    public joinleftfix: number = 0; //用户分享页面右侧固定 0 不固定  1固定

    //套餐有关属性
    priceList: Array<PriceList> = []; //要显示的用户套餐的列表
    paytrans = new payTransfer()

    //以下的属性是接口未定义的地方
    public awardList = []; //中奖列表
    imageHeadUrl: string = ''
    public awardRecordList = []; //我的中奖列表
    public dialog_copy_ref_link = false; //复制剪切板(推荐链接)
    public dialog_copy_ref: boolean = false;//复制剪切板(推荐码)
    public prize_img: string = '';//奖品图片
    public kp_list = [
        {
            prize_img_url: '',
            is_reverse: false,
            btn_is_hide: false
        },
        {
            prize_img_url: '',
            is_reverse: false,
            btn_is_hide: false
        },
        {
            prize_img_url: '',
            is_reverse: false,
            btn_is_hide: false
        },
        {
            prize_img_url: '',
            is_reverse: false,
            btn_is_hide: false
        },
        {
            prize_img_url: '',
            is_reverse: false,
            btn_is_hide: false
        },
        {
            prize_img_url: '',
            is_reverse: false,
            btn_is_hide: false
        }
    ]//页面可被翻卡牌列表

    /**
     * 设置网路请求的base_url
     * @param url
     */
    public setBaseUrl(url: string): void {
        this.http.setBaseUrl(url);
    }

    /**
     * 判断用户是否可以点击
     * @param url
     */
    public canClick(): boolean {
        if (this.isKaishi && !this.isJieshu && this.isValidUser) {
            //如果活动已经开始
            return true
        } else {
            if (!this.isKaishi) {
                this.activity_ErrorTip = this.tipNotKaishi
            } else if (this.isJieshu) {
                this.activity_ErrorTip = this.tipisjieshu
            } else {
                this.activity_ErrorTip = this.tipinvalidUser
            }
            return false
        }
    }

    /**
     * 获取当前设备环境，分为Android、iOS、微信公众号
     * 只有app端才有，
     */
    checkEnvironment(): void {}
    /**
     * 登录成功后调用户信息接口，获取用户信息
     * platform:如果是leishen_app不用传递参数，如果是电脑端请传递'pc'
     */
    public async getUserInfo(platform: string) {
        try {
            this.isLoading = true;
            let token = Util.getUrlParam("account_token") || LocalStorageUtil.getUserToken().account_token;
            if (token == "") {
                this.tokenExpired();
            } else {
                const url = HttpClient.URL_USER_INFO;
                const param = {
                    account_token: token
                };
                this.backData = await this.http.post<UserInfo>(url, param);
                this.isLoading = false;
                if (this.backData.code == HttpClient.HTTP_SUCCESS_NET_CODE) {
                    UserInfo.getUserName(this.backData.data);
                    UserInfo.getUserAvatar(this.backData.data);
                    UserInfo.updateUserInfo(this.backData.data);
                    if (this.needtoCheck) {
                        this.checkisBinbMobile(this.backData.data, platform);
                    }
                    this.getUserinfoSuccess();
                } else if (this.backData.code == HttpClient.HTTP_TOKEN_EXPIRE) {
                    this.tokenExpired();
                } else {
                    this.getUserinfoFail(this.backData);
                }
            }
        } catch (e) {

        }
    }

    /**
     *需要重写-获取用户信息-成功，检测header-nav的登录状态
     * 重新更新header-nav的状态(this.$refs.headnav as any).checkLogin()
     */
    getUserinfoSuccess() {
    }

    /**
     *需要重写-获取用户信息失败，检测header-nav的登录状态
     *  (this.$refs.headnav as any).isLogin = false;
     */
    getUserinfoFail(data: any) {
    }

    /**
     *需要重写
     * 重新更新header-nav的状态(this.$refs.headnav as any).isLogin = false;
     */
    public tokenExpired(): void {
    }

    /**
     *检测用户是否是国内区且没有绑定手机号
     * user:是指用户信息；
     * platform:平台；如果是手机(leishen_app平台,传递参数app，电脑web传递pc
     */
    public checkisBinbMobile(user: UserInfo, platform: string) {
        let userInfo;
        if (user) {
            userInfo = Object.assign({}, user)
        } else {
            userInfo = LocalStorageUtil.getUserInfo();
        }
        if (userInfo && userInfo.region_code == 1 && userInfo.mobile == '') {
            if (platform == 'app') {
                Toast('为确保您账户的安全及正常使用，依《网络安全法》相关要求，即日起个人账户需绑定手机。')
                setTimeout(() => {
                    JumpWeiXin.gotoLogin('bind=bindMobile')
                }, 2000)
            } else if (platform == 'pc') {
                let alterTitle = this.$t('public.share67').toString()
                let alterp = this.$t('public.share68').toString()
                let btnText = this.$t('public.share69').toString()
                this.$alert(alterp, alterTitle, {
                    confirmButtonText: btnText,
                    showClose: false,
                    customClass: 'llz_bindMobile',
                    callback: action => {
                        JumpWebUtil.webGotoUser(GlobalConfig.getUserBaseUrl(), JumpWebUtil.HTML_NAME_LOGIN, 'bind=bindMobile&to=' + window.location.href);
                    }
                });
            }
        }
    }

    /**
     *获取用户的推荐码，根据推荐码，生成推荐链接
     * 如果有推荐码-直接生成推荐链接（generateRefercodeLink）
     * 如果没有推荐码-调取接口生成推荐码（getRefercode），在生成推荐链接
     */
    public async getReferActivitys() {
        const url = HttpClient.URL_USER_REFER_ACTIVITY;
        let param = {
            account_token: LocalStorageUtil.getUserToken().account_token
        }
        this.backData = await this.http.get(url, param);
        if (this.backData.code == HttpClient.HTTP_SUCCESS_NET_CODE) {
            const list = this.backData.data;
            let info = null;
            let user_code = null;
            for (var i in list) {
                info = list[i].activity_info;
                user_code = list[i].user_code;
                if (info.id == this.activity_id) {
                    if (user_code.length <= 0) {
                        //需要重新生成推荐码
                        this.getRefercode(info.type);
                    } else {
                        this.refer_code = user_code.refer_code;
                        this.generateRefercodeLink(this.refer_code);
                    }
                    break;
                }
            }
        } else if (this.backData.code == HttpClient.HTTP_TOKEN_EXPIRE) {
            this.tokenExpired();
        }
    }

    /**
     * 生成用户推荐码
     */
    public async getRefercode(type: number) {
        const url = HttpClient.URL_USER_REFER;
        let param = new ReferCodeRequestModel();
        param.activity_id = this.activity_id;
        param.type = type;
        param.account_token = LocalStorageUtil.getUserToken().account_token;
        this.backData = await this.http.post<ReferCodeModel>(url, param);
        if (this.backData.code == HttpClient.HTTP_SUCCESS_NET_CODE) {
            this.refer_code = this.backData.data.refer_code;
            this.generateRefercodeLink(this.refer_code);
        }
    }

    /**
     * 生成链接
     * TODO... 需要重写此方法，生成对应项目的链接
     */
    public generateRefercodeLink(refer_code: string) {
    }

    /**
     * 获取抽奖活动详情
     */
    public async getActivityDetail() {
        if (this.activity_id == 0) {
            return;
        }
        let url = HttpClient.URL_ACTIVITY_DETAIL + this.activity_id;
        let param = new ActivityDetailRequestModel();
        param.type = 1;
        param.id = this.activity_id;
        param.plat_type = 1;
        param.region_code = LocalStorageUtil.getRegionCodes();
        param.account_token = LocalStorageUtil.getUserToken().account_token;
        this.backData = await this.http.get<ActivityModel>(url, param);
        if (this.backData.code == HttpClient.HTTP_SUCCESS_NET_CODE) {
            this.activityDetails = this.backData.data.detail as ActivityModel;
            this.points = this.backData.data.points;
            let now_time = new Date().getTime();
            let end_time = new Date(Util.formateTime(this.backData.data.detail.end_time)).getTime();
            let start_time = new Date(Util.formateTime(this.backData.data.detail.start_time)).getTime();
            if (now_time >= end_time) {
                this.dialog_msg = this.tipisjieshu;
                this.dialog_error = true;
                this.isJieshu = true
            } else if (now_time < start_time) {
                this.dialog_msg = this.tipNotKaishi;
                this.dialog_error = true;
                this.isKaishi = false
            }
            this.getActivityDetailSuccess(this.backData.data.detail);
            this.getActivityCount();
        } else if (this.backData.code == HttpClient.HTTP_TOKEN_EXPIRE) {
            this.tokenExpired();
        }
    }

    /**
     * 获取活动详情成功
     * TODO... 需要重写此方法
     */
    public getActivityDetailSuccess(data: any) {
    }

    /**
     * 获取我的抽奖次数
     */
    public getActivityCount() {
        this.aCount = Math.floor(this.points / this.activityDetails.fee);
    }

    /**
     * 获取用户需要购买的套餐
     */
    public async getActivityPackage(url: string) {
        let param = new ActivityPackageRequestModel();
        param.activity_id = this.activity_id;
        param.lang = 'zh_CN';
        param.region_code = 1;
        param.account_token = LocalStorageUtil.getUserToken().account_token;
        this.backData = await this.http.get(url, param);
        if (this.backData.code == HttpClient.HTTP_SUCCESS_NET_CODE) {
            this.getActivityPackageSuccess(this.backData.data[0] as UserRechargeInfo)
        } else if (this.backData.code == HttpClient.HTTP_TOKEN_EXPIRE) {
            this.tokenExpired();
        }
    }

    /**
     * 需要重写
     * 成功获取用户需要购买的套餐
     */
    getActivityPackageSuccess(data: UserRechargeInfo) {
    }

    /**
     * 用户支付成功回调的方法
     */
    paySuccess() {
    }

    /**
     * 获取中奖列表
     * 参数1，height-获奖列表中一行的高度，
     * 参数2，id-获奖的ul的id的名称；
     * 参数3-动画的速度，单位毫秒；
     * 参数4-interval-setInterval函数的延迟，单位毫秒
     */
    public async getAwardList() {
        let url = HttpClient.URL_ACTIVITY_PRESENT_LIST;
        let param = new PresentListRequestModel();
        param.activity_id = this.activity_id;
        param.present_type = 0;
        param.size = 50;
        this.backData = await this.http.post<PresentListRequestModel>(url, param);
        if (this.backData.code == HttpClient.HTTP_SUCCESS_NET_CODE) {
            this.awardList = this.backData.data.list;
            //昵称问题
            for (var i in this.awardList) {
                let name = '';
                if (name == '' && this.awardList[i]['nickname'] != '') {
                    name = this.awardList[i]['nickname'];
                }
                if (name == '' && this.awardList[i]['mobile_num'] != '') {
                    name = this.awardList[i]['mobile_num'];
                }
                if (name == '' && this.awardList[i]['mail'] != '') {
                    name = this.awardList[i]['mail'];
                }
                if (name == '' && this.awardList[i]['user_name'] != '') {
                    name = this.awardList[i]['user_name'];
                }
                this.awardList[i]['nickname'] = name;
            }
            this.getAwardListSuccess();
        } else {
        }
    }

    /**
     * TODO... 需要重写
     * 成功获取获奖列表
     */
    public getAwardListSuccess() {
        this.initAwardList();
    }

    /**
     * TODO... 需要重写
     * 初始化中奖列表名单
     */
    public initAwardList() {
    }

    /**
     * 获取用户已经邀请的用户的列表
     */
    public async getReferList(activity_type: number) {
        const url = HttpClient.URL_ACTIVITY_REFER_LIST;
        let param = new referList()
        param.account_token = LocalStorageUtil.getUserToken().account_token
        param.activity_id = this.activity_id
        param.type = activity_type
        this.backData = await this.http.post(url, param);
        if (this.backData.code == HttpClient.HTTP_SUCCESS_NET_CODE) {
            this.myReferList = this.backData.data.list;
            this.getReferListSuccess()
        } else if (this.backData.code == HttpClient.HTTP_TOKEN_EXPIRE) {
            this.tokenExpired();
        }
    }

    /**
     * 成功获取用户已经推荐的列表
     * TODO... 需要重写此方法
     */
    public getReferListSuccess() {
    }

    /**
     * 发送抽奖请求
     * @param delay_win 成功延迟时间
     * @param delay_lose 失败延迟显示
     */
    public async onDraw(delay_win: number = 0, delay_lose: number = 0) {
        const url = HttpClient.URL_ACTIVITY_DRAW;
        const token = LocalStorageUtil.getUserToken().account_token;
        let param = new ActivityDrawModel();
        param.activity_id = this.activity_id;
        param.account_token = token;
        this.backData = await this.http.post(url, param);
        const that = this;
        if (this.backData.code == HttpClient.HTTP_SUCCESS_NET_CODE) {
            this.awardInfo = this.backData.data;
            setTimeout(function () {
                that.onDrawWin(that.backData);
            }, delay_win);
        } else if (this.backData.code == HttpClient.HTTP_TOKEN_EXPIRE) {
            this.tokenExpired();
            this.isBengin = false;
        } else {
            setTimeout(function () {
                that.onDrawLose(that.backData);
            }, delay_lose);
        }
    }

    /**
     * 中奖
     * 参数backData；抽中奖品返回的数据
     * TODO... 需要重写此方法
     */
    public onDrawWin(backData: IdataModel<any>) {
        //播放奖品动画
        if (this.activity_json.choujiang_type == 1) {
            this.luck.speed = 100;
            this.roll();
        }
        if (this.activity_json.choujiang_type == 0) {
            this.isBengin = false;
            this.dialog_win = true;//弹出奖品图片动画
            this.prize_name = backData.data.title;
            this.prize_id = backData.data.present_id;
        }
        if (this.activity_json.choujiang_type == 2) {
            let num = Math.ceil(Math.random() * 3) + 5;
            let angel = 0;
            switch (backData.data.present_id) {
                case 109:
                    angel =0 + Math.random() * 0;
                    break;
                case 108:
                    angel =0 + Math.random() * 0 + 60;
                    break;
                case 107:
                    angel =0 + Math.random() * 0 + 120;
                    break;
                case 106:
                    angel =0 + Math.random() * 0 + 180;
                    break;
                case 105:
                    angel =0 + Math.random() * 0 + 240;
                    break;
                case 110:
                    angel =0 + Math.random() * 0 + 300;
                    break;
            }
            this.roll_deg = this.roll_deg + (360 - this.roll_deg % 360) + 360 * num + angel;
            $('#roll_table').css({'transform': 'rotate(' + this.roll_deg + 'deg)', 'transition': '4s'});
            setTimeout(() => {
                this.dialog_win = true;//弹出奖品图片动画
                this.isBengin = false;
            }, 4000);
            this.prize_name = backData.data.title;
            this.prize_id = backData.data.present_id;
        }
        if (this.activity_json.choujiang_type == 3) {
            if (Util.getOrigin().indexOf('localhost') != -1 || Util.isMobile()) {
                switch (backData.data.present_id) {
                    case 83:
                        this.kp_list[this.kp_index].prize_img_url = '/images/kapai/kp_prize01.png';
                        this.kp_list[this.kp_index].btn_is_hide = true;
                        this.kp_list[this.kp_index].is_reverse = true;
                        break;
                    case 82:
                        this.kp_list[this.kp_index].prize_img_url = '/images/kapai/kp_prize02.png';
                        this.kp_list[this.kp_index].btn_is_hide = true;
                        this.kp_list[this.kp_index].is_reverse = true;
                        break;
                    case 80:
                        this.kp_list[this.kp_index].prize_img_url = '/images/kapai/kp_prize03.png';
                        this.kp_list[this.kp_index].btn_is_hide = true;
                        this.kp_list[this.kp_index].is_reverse = true;
                        break;
                    case 79:
                        this.kp_list[this.kp_index].prize_img_url = '/images/kapai/kp_prize04.png';
                        this.kp_list[this.kp_index].btn_is_hide = true;
                        this.kp_list[this.kp_index].is_reverse = true;
                        break;
                    case 81:
                        this.kp_list[this.kp_index].prize_img_url = '/images/kapai/kp_prize05.png';
                        this.kp_list[this.kp_index].btn_is_hide = true;
                        this.kp_list[this.kp_index].is_reverse = true;
                        break;
                    case 78:
                        this.kp_list[this.kp_index].prize_img_url = '/images/kapai/kp_prize06.png';
                        this.kp_list[this.kp_index].btn_is_hide = true;
                        this.kp_list[this.kp_index].is_reverse = true;
                        break;
                }
            } else {
                switch (backData.data.present_id) {
                    case 83:
                        this.kp_list[this.kp_index].prize_img_url = './images/kapai/kp_prize01.png';
                        this.kp_list[this.kp_index].btn_is_hide = true;
                        this.kp_list[this.kp_index].is_reverse = true;
                        break;
                    case 82:
                        this.kp_list[this.kp_index].prize_img_url = './images/kapai/kp_prize02.png';
                        this.kp_list[this.kp_index].btn_is_hide = true;
                        this.kp_list[this.kp_index].is_reverse = true;
                        break;
                    case 80:
                        this.kp_list[this.kp_index].prize_img_url = './images/kapai/kp_prize03.png';
                        this.kp_list[this.kp_index].btn_is_hide = true;
                        this.kp_list[this.kp_index].is_reverse = true;
                        break;
                    case 79:
                        this.kp_list[this.kp_index].prize_img_url = './images/kapai/kp_prize04.png';
                        this.kp_list[this.kp_index].btn_is_hide = true;
                        this.kp_list[this.kp_index].is_reverse = true;
                        break;
                    case 81:
                        this.kp_list[this.kp_index].prize_img_url = './images/kapai/kp_prize05.png';
                        this.kp_list[this.kp_index].btn_is_hide = true;
                        this.kp_list[this.kp_index].is_reverse = true;
                        break;
                    case 78:
                        this.kp_list[this.kp_index].prize_img_url = './images/kapai/kp_prize06.png';
                        this.kp_list[this.kp_index].btn_is_hide = true;
                        this.kp_list[this.kp_index].is_reverse = true;
                        break;
                }
            }
            setTimeout(() => {
                this.dialog_win = true;//弹出奖品图片动画
                this.isBengin = false;
            }, 1500);
            this.prize_name = backData.data.title;
            this.prize_id = backData.data.present_id;
        }
        //计算次数
        this.points = backData.data.points;
        this.getActivityCount();
    }

    /**
     * 未中奖
     * 参数backData；未抽中奖品返回的数据
     * TODO... 需要重写此方法
     */
    public onDrawLose(backData: IdataModel<any>) {
        this.isBengin = false;
        //提示
        this.dialog_error = true;
        this.dialog_msg = backData.msg;
        //计算次数
        this.points = backData.data.points;
        this.getActivityCount();
    }

    /**
     * 点击中奖记录的时候，需要重写
     */
    public onClickAward() {
    }

    /**
     * 切换tab页，需要重写
     */
    public changeTabPage(index: number) {
    }

    /**
     * 点击查看活动详情，需要重写
     */
    public onClickGuize() {
    }

    /**
     * 点击关闭活动详情，需要重写
     */
    public onCloseGuize() {
    }

    /**
     * 点击关闭充值提示，需要重写
     */
    public onCloseRecharge() {
        this.dialog_recharge = false;
        $('body').removeClass('body_fixed');
    }

    /**
     * 需要重写
     * 点击关闭活动未开始，活动已经结束，没有抽中任何礼品，成功复制邀请链接-弹出框的开关提示，抽中礼品的弹框
     */
    public closeDialog() {
        this.dialog_msg = ''
        this.dialog_win = false
        this.dialog_error = false
        $('body').removeClass('body_fixed');
    }

    /**
     * 关闭提示未登录弹窗，需要重写
     */
    public onCloseNologin() {
    }

    /**
     * 点击继续抽奖
     */
    public continueDraw() {
        this.isBengin = false;
        this.dialog_win = false;
        this.dialog_msg = '';
    }

    /**
     * 复制推荐链接
     */
    public copyRefercodeLink() {
        if (!Util.easyIsLogined()) {
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
            that.dialog_msg = '邀请链接已复制到剪切板！快去邀请好友注册获取抽奖机会吧！';
        });
    }

    /**
     * 复制推荐码
     */
    public copyRefercode() {
        if (!Util.easyIsLogined()) {
            //提示登录
            this.gotoLogin();
            return;
        }
        // Util.copyToClipboard(this.refer_code);
        const that = this;
        let clipboard = new Clipboard("#copyRefercode", {
            text: function () {
                return that.refer_code;
            }
        });
        clipboard.on("success", function (e) {
            e.clearSelection();
            that.dialog_error = true;
            that.dialog_msg = '邀请码已复制到剪切板！快去邀请好友注册获取抽奖机会吧！';
        });
    }


    /**
     * @param h 小于这个高度 登录分享模块成绝对定位  否则为固定定位
     * @param num 左侧列表内容数量+1
     */
    public pageScroll(h) {
        let scrT = Util.scroll().top;
        if (scrT < h) {
            this.joinleftfix = 0;
        } else {
            this.joinleftfix = 1;
        }
    }

    /**
     * 弹出登录框，需要重写
     */
    public gotoLogin() {
    }

    /**
     * 点击去充值，需要重写
     */
    public gotoRecharge(data: any) {
    }

    /**
     * 点击抽奖
     */
    public onClickDraw() {
        if (this.isBengin) return;
        if (!Util.easyIsLogined()) {
            //提示登录
            this.gotoLogin();
            return;
        }
        if (this.aCount <= 0) {
            //提示次数不足
            $('body').addClass('body_fixed');
            this.dialog_recharge = true;
            return;
        }
        if (this.canClick()) {
            this.isBengin = true;
            this.onDraw(1000, 1000);
        } else {
            this.dialog_msg = this.activity_ErrorTip;
            this.dialog_error = true;
        }
    }

    public roll() {
        this.luck.times += 1;
        this.luck.roll();
        if (this.luck.times > this.luck.cycle + 10 && this.luck.prize == this.luck.index) {
            clearTimeout(this.luck.timer);
            this.luck.prize = -1;
            this.luck.times = 0;
            const that = this;
            setTimeout(function () {
                $('body').addClass('body_fixed');
                that.isBengin = false;
                that.dialog_win = true;
                that.dialog_msg = that.awardInfo.title;
                that.prize_name = that.awardInfo.title;
            }, 500);
        } else {
            if (this.luck.times < this.luck.cycle) {
                this.luck.speed -= 10;
            } else if (this.luck.times == this.luck.cycle) {
                var index = 4;
                switch (this.awardInfo.present_id) {
                    case 94:
                        index = 0;
                        break;
                    case 92:
                        index = 1;
                        break;
                    case 93:
                        index = 2;
                        break;
                    case 95:
                        index = 3;
                        break;
                    case 97:
                        index = 4;
                        break;
                    case 91:
                        index = 5;
                        break;
                    case 98:
                        index = 6;
                        break;
                    case 96:
                        index = 7;
                        break;
                    default:
                        break;
                }
                this.luck.prize = index;//最终中奖位置
            } else {
                if ((this.luck.times > this.luck.cycle + 10 && this.luck.prize == 0 && this.luck.index == 7) || this.luck.prize == this.luck.index + 1) {
                    this.luck.speed += 110;
                } else {
                    this.luck.speed += 20;
                }
            }
            if (this.luck.speed < 40) {
                this.luck.speed = 40;
            }
            ;

            this.luck.timer = setTimeout(this.roll, this.luck.speed);
        }
        return false;
    }
}

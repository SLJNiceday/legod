import HttpClient from "@/ts/net/HttpClient";
import {
    referOutput, timeClock
} from "@/ts/models/NewsModel";
import {Luck} from "@/ts/models/Luck.ts";
import {UserInfo,PriceList,payTransfer} from '@/ts/models/UserModel'
import {IdataModel} from "@/ts/models/IdataModel";
export interface IActivity{

    //工具类属性
    http:HttpClient;//http请求的工具
    backData: IdataModel<any>; //返回的数据的通用格式
    isLoading:boolean; //是否加载中

    //活动相关的数据属性
    activity_id:number;//活动id
    //活动是否还未开始,true-未开始，false-已开始-默认为true
    isKaishi:boolean;
    //活动是否已经结束true-已结束，false-为结束-默认为false
    isJieshu:boolean;
    isValidUser:boolean;//判断用户是否可以参与活动，true,可以参与活动，false,不能参与活动
    activity_ErrorTip:string; //判断活动是否开始（活动暂未开始），活动是否结束（活动已经结束），用户是否可以参与活动的提示（当前活动只针对雷神超级会员，海外会员暂不可参与!）
    activity_json:any;//活动的json数据
    activityDetails:any;//活动详情获取的数据
    points:number;//活动的积分
    aCount:number //用户可以抽奖的次数
    clock: timeClock; //活动倒计时

    //绑定手机号的属性
    needtoCheck:boolean; //是否需要检查用户的国内区，但是没有绑定手机号-默认需要检查,但是登录成功以后，不用检查

    //抽奖相关的数据属性
    luck :Luck; // 九宫格式的抽奖样式
    roll_deg: number;//转盘式的抽奖，代表转盘的角度
    kp_index: number;//翻卡牌的抽奖，所翻卡牌的index
    isBengin:boolean;//是否可以开始抽奖，如果用户点击了抽奖按钮，符合条件（isBengin==false&&登录&&抽奖次数>0）,置为true,防止用户多次点击
    awardInfo:any;//后台返回的调取抽奖接口的返回数据
    prize_name:string; //抽奖成功的时候-抽奖接口的返回数据的奖品名称
    prize_id:number; //抽奖成功的时候-抽奖接口的返回数据的奖品id标识
    canbuyTwice:boolean; //该活动的套餐是否可以多次购买，

    //推荐链接相关数据属性
    refer_code_link:string; //推荐码的链接
    refer_code:string; //推荐码
    myReferList:Array<referOutput>;//登录用户已经推荐的用户列表

    // 弹出框的数据
    dialog_error:boolean;//活动未开始，活动已经结束，没有抽中任何礼品，成功复制邀请链接-弹出框的开关
    dialog_msg:string; //活动未开始，活动已经结束，没有抽中任何礼品，成功复制邀请链接 -dialog_error弹出框的提示内容分类
    dialog_recharge:boolean //提示用户需要充值的弹框，关闭是需要跳转到id=recharge的锚点
    dialog_win:boolean; //用户抽中奖品的弹框

    //页面布局的相关属性
    tabIndex:number; //用户抽奖页面以Tab形式展现。
    joinleftfix:number //用户分享页面右侧固定 0 不固定  1固定

    //套餐有关属性
    priceList:Array<PriceList>; //要显示的用户套餐的列表
    paytrans:payTransfer
    /**
     * 设置网路请求的base_url
     * @param url
     */
    setBaseUrl(url: string): void;
    /**
     * 设置网路请求的base_url
     * @param url
     */
    canClick(): boolean;

    /**
     * 获取当前设备环境，分为Android、iOS、微信公众号
     * 只有app端才有，
     */
    checkEnvironment?(): void;
    /**
     * 获取用户信息的方法；
     * platform:如果是leishen_app不用传递参数，如果是电脑端请传递'pc'
     */
    getUserInfo(platform:string):void;
    //获取用户信息-成功的回调
    getUserinfoSuccess():void;
    //获取用户信息-失败的回调
    getUserinfoFail(data:any):void
    //用户token失效的回调
    tokenExpired():void
    /**
     *检测用户是否是国内区且没有绑定手机号
     * user:是指用户信息；
     * platform:平台；如果是手机(leishen_app平台,传递参数app，电脑web传递pc
     */
    checkisBinbMobile(userinfo:UserInfo,platform:string):void;
    /**
     *获取用户的推荐码，根据推荐码，生成推荐链接
     * 如果有推荐码-直接生成推荐链接（generateRefercodeLink）
     * 如果没有推荐码-调取接口生成推荐码（getRefercode），在生成推荐链接
     */
     getReferActivitys():void
    /**
     * getReferActivitys,获取到type的字段，生成推荐码
     */
     getRefercode(type:number):void
    /**
     * getReferActivitys,获取到的refer_code字段，生成推荐链接
     */
     generateRefercodeLink(refer_code:string):void;
    /**
     * 获取活动详情，一个是获取活动是否过期信息，一个是获取参与本次活动所需要的最低积分
     */
     getActivityDetail(): void;
     //获取活动详情-成功回调
     getActivityDetailSuccess(data:any):void
     //获取用户可以用抽奖次数，根据活动详情返回的points和fee的字段；
     getActivityCount():void
    /**
     * 获取活动的套餐，根据url来请求不同的方法
     */
     getActivityPackage(url:string):void
     //成功获取活动的套餐
     getActivityPackageSuccess(data:any):void
    /**
     * 获取中奖列表
     */
     getAwardList():void;
     //成功获取中奖列表
     getAwardListSuccess():void;
     //初始化已经获奖列表，并形成滚动动画；
     initAwardList():void
    //获取用户已经推荐的用户列表
     getReferList(activity_type: number):void
}

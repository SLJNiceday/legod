import {XmlDataModel} from "@/ts/models/IdataModel";

//注册需要的参数
export class RegRequestModel {
    username: string;
    tel: string;
    password: string;
    key: string; //获取验证码的同时会返回key,用于跟之前的验证码信息前后关联
    checkcode?: string; //图形验证码
    smscode?: string; //短信验证码
    groupid: string; //用户组ID
    number?: number; //连接数
    business_type: number;//商户类型
    business_free: number;//付费模式
}

//修改用户资料传的值
export class ImproveRequestModel {
    account_token: string = ""; //用户令牌
    bar_name?: string = ''; //网吧名称
    bar_ip?: string = ''; //网吧Ip
    business_phone?: string = ''; //联系电话
    business_user?: string = ''; //联系人
    password?: string = '';//密码
}

export class onloadImproveRequestModel {
    token: string = ""; //用户令牌
    title?: string = ""; //网吧名称
    locked_ip?: string = ""; //网吧Ip
    qq?: string = ""; //QQ
    tel?: string = ""; //联系电话
    mail?: string = ""; //电子邮件
}

//发送短信验证码需要的参数
export class SmsCaptchaRequestModel {
    key: string = "";
    tel: string = "";
    regcode: string = "";
}

//发送短信验证码返回值
export class SmsCaptchaModel extends XmlDataModel {
}

//忘记密码需要的参数
export class PhoneFindPwdRequestModel {
    key: string = "";
    tel: string = "";
    newpassword: string = "";
    smscode: string = "";
}

//忘记密码返回值
export class PhoneFindPwdModel extends XmlDataModel {
}

//登录请求接口
export class LoginRequestModel {
    user_name: string;
    password: string;
    checkcode?: string;
    bindweixin?: number; //1绑定,仅在微信公众环境有效
}

/**
 * 登录成功返回参数
 */
export class LoginModel {
    public account_token?: string;//用户token
    public user_name: string;//用户名
    public user_status: number;//审核状态
}

//壁纸
export class WallPaperModel extends XmlDataModel {
    wallpapercount: number; //壁纸列表数量
    wallpapers; //壁纸详情列表，仅在wallpapercount大于0时候存在
}

//壁纸列表模型
export class WallPaperListModel {
    id = "";
    image_src = ""; //壁纸地址
    status = 0; // 0 正常 1
    timestp = "";
    image_size = ""; //图片尺寸 1920*1080....
}

//获取用户信息返回的值
export class UserInfoModel {
    public user_name: string = ""; //用户名
    public user_type: string = ""; //用户账户类型
    public proxy_type: string = ""; //代理类型
    public business_user: string = ""; //联系人
    public business_phone: string = ""; //联系电话
    public user_status: string = ""; //用户状态（状态0，未审核，1：已入住；2，审核中，3：拒绝审核 4，已过期 5,已禁用）
    public create_time: string = ""; //注册时间
    public parent_id: string = ""; //上级id
    public monthly_price: number = 0; //包月价格
    public cps_percent: string = ""; //cps分成比例
    public enable_proxy: string = ""; //是否能代理
    public is_delete: number = 1; //是否删除（0正常1删除）
    public bar_name: string = ""; //网吧名称
    public expired_time: string = ""; //套餐过期时间
    public active_code: string = ""; //激活码
    public last_login_time: string = ""; //最后登录时间
    public last_login_ip: string = ""; //最后登录ip
    public expiry_time: string = ""; //登录过期时间
    public ip_list: Array<any> = []; //网吧ip列表
    public country_code?:string;//暂不使用
    public mobile_num?:string;//暂不使用
    public user_avatar: string = '';
    public bar_scope: number = 0;//网吧规模

    public static getUserAvatar(userInfo: UserInfoModel) {
        if (!userInfo.user_avatar) {
            userInfo.user_avatar = "/images/wangba_default.png";
        }

        return userInfo;
    }
}

//壁纸
export class UploadAvatarRequestModel {
    token: string; //名称
    image: File; //头像图片
}

//获取在线列表
export class OnlineModel extends XmlDataModel {
    onlinecount?: number; //在线列表数量
    onlines?; //在线终端详情列表，仅在onlinecount大于0时候存在
}

//在线列表模型
export class OnlineListModel {
    id = ""; //用户id
    lastlogin = ""; //最后登录时间
    lastcomm = ""; //活跃时间
    recvx = ""; //接受流量
    sendx = ""; //发送流量
    hardid? = ""; //硬件id
    public_ip? = ""; //公网ip
    ip? = ""; //ip
    game? = ""; //游戏
}

//添加网吧请求参数
export class addWangbaRequestModel {
    title: string = ""; //网吧名称
    locked_ip: string = ""; //网吧Ip
    number?: number;//网吧规模
    groupid: number = 0;//组ID
    biztoken: string = '';//经销商令牌
    business_free: number;//付费类型
    business_manager: string = ""; //网吧负责人
    business_license: any = null; //营业执照图片
    business_id: string = ""; //营业执照id
    logo = null;//logo
}

//添加网吧请求参数
export class resetWangbaRequestModel {
    title: string = ""; //网吧名称
    locked_ip: string = ""; //网吧Ip
    biztoken: string = '';//经销商令牌
    logo: any;//logo
    address: string = "";//地址
    netbarid: number = 0;//网吧id
}

//生成订单请求参数
export class BuyRequestModel {
    account_token: string = ""; //用户令牌
    payment_type: number = 1; //支付方式 1微信 2支付宝
    machine_num: number;//网吧用户购买机器数量
    buy_time_num: number = 0;//网吧用户购买月份数量（传月）
    width?: number = 142;//二维码宽度
    qr_type?: string = '';//支付宝支付时传递此参数  ali_qr
}

//生成订单返回参数
export class BuyResponseModel {
    amount: string = ""; //支付金额
    amount_type: number = 1; //支付币种
    invoice_id: string = '';//订单id
    order_no: string = '';//订单号
    package_title: string = '';//套餐名称
    pay_url: string = '';//二维码地址
    timeout_express: string = '';//过期时间
}

//生成订单请求参数(网吧用户)
export class OrderListRequsetModel {
    account_token: string = ""; //用户令牌
    invoice_status?: string; //订单状态
    start_time?: string;//开始时间
    end_time?: string;//结束时间
    size: number = 0;//单页条数
    page: number = 0;//
}

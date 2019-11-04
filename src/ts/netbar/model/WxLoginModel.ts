//注册需要的参数
import {XmlDataModel} from "@/ts/models/IdataModel";

//生成登录二维码
export class PCWxloginRequestModel {
    userid: number;//网吧主账户ID


}

//生成登录二维码返回的值
export class WxloginBackModel extends XmlDataModel {
    scene_str: string = "";//请求序列号
    qrcodeUrl: string = "";//生成的二维码图片地址
}

//检查扫码登录结果
export class PCWxCheckloginRequestModel {
    scene_str: string = '';//请求序列号


}

//检查扫码登录结果返回的值
export class WxloginCheckBackModel extends XmlDataModel {
    userid: string = "";//网吧主账户ID
    subuserid: string = "";//用户子账号ID
    redirect: any = ""//扫码结果：(客户端内嵌的情况下，支持直接重定向，客户端内核会劫持并处理)

}

//子账号发送绑定手机短信验证码
export class SubuserSendBindSmsRequestModel {
    bindcode: string = '';//图像验证码
    key: string = '';//图像验证码key
    tel: string = '';//手机号


}

//子账号发送绑定手机短信验证码返回的值
//code: 1 已发送2 获取操作太频繁3 手机格式错误4 短信平台错误5 需要登录6 手机号已占用9 图像验证码错误10 帐号不存在
export class SubuserSendBindSmsBackModel extends XmlDataModel {
}

//子账号发送绑定手机短信验证码
export class SubuserSendBindTelRequestModel {
    userid: number = 0;//网吧主账户id
    subuserid: number = 0;//子账户ID
    smscode: string = '';//短信验证码
    key: string = '';//图像验证码key
    tel: string = '';//手机号
    password=""
}

//子账号发送绑定手机短信验证码返回的值
//绑定成功并且用户时长正常：core://game/subuser_success:11:1482小时13分钟
//绑定成功，无需用户付费模式：core://game/subuser_success:11
//绑定成功，需要用户付费：core://game/ subuser_fee:11

export class SubuserSendBindTelBackModel extends XmlDataModel {
    redirect: any;
}


//获取子账号套餐列表返回的值
export class SubuserGetCatListBackModel extends XmlDataModel {
    count: number = 0;
    items: { item: SubuserGetCatListArrModel[] };
}

//获取子账号套餐列表数组
export class SubuserGetCatListArrModel extends XmlDataModel {
    hours: string = '';
    id: number = 0;
    number: string = '';
    price: string = '';
    title: string = '';
}

//子账号生成订单
export class SubuserOrderNewRequestModel {
    netbarid: number = 0;//网吧id
    subuserid: number = 0;//子账户ID
    pay: string = '';//支付方式  weixin_native 微信 或 alipay  支付宝
    catid: number = 0;//套餐ID
}

//子账号生成订单返回的值
export class SubuserOrderNewBackModel extends XmlDataModel {
    orderid: string = '';//订单号
    code_url: string = "";//支付url代码
    code_img_url: string = '';//二维码图片地址
    token: string = '';//临时令牌，用于查订单状态
}

//查询订单支付结果
export class SubuserGetOrderRequestModel {
    token: string = '';//token
    orderid: number = 0;//订单号
}

//查询订单支付结果返回的值
export class SubuserGetOrderBackModel extends XmlDataModel {
    hours:number;
    expirestr:string;//剩余时间  支付成功后需要调用重定向 刷新客户端显示的用户时间
}

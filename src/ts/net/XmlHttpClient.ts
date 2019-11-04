import {IHttp} from "@/ts/interface/IHttp";
import axios from "axios";
import XmlToJsonUtil from "@/ts/utils/XmlToJsonUtil";

export default class XmlHttpClient implements IHttp {
    public static HTTP_ERROR_NEW_CODE = -50000; // 网络错误
    public static HTTP_SUCCESS_NET_CODE = 0; // 成功
    public static HTTP_TOKEN_EXPIRE = 400006; // 过期
    public static HTTP_PCWXWAIT_SCAN = 10001 ; // 等待用户扫码
    public static HTTP_PCWXTOKEN_EXPIRE = 10002 ; // 会话已经失效

    //登陆注册
    public static URL_WBOP_DO_LOGIN = "/api/do_login"; //登录
    public static URL_WBOP_DO_REG = "/api/do_reg"; //注册
    public static GETCHECK_CODE = "/api/get_checkcode"; //获取图片验证码
    public static DOSENDREGSMS = "/api/dosendregsms"; //注册账号的时候发送短信验证码
    public static DOCHANGEPASAWORD = "/api/dochangepasswordsms"; //找回密码
    public static DOSENDPWDSMS = "/api/dosendpwdsms"; //找回密码发送短信验证码
    public static DO_LOGINOUT = "/api/do_logout"; //退出
    public static BUSINESS_DO_LOGINOUT = "/business/do_logout"; //经销商退出

    //user
    public static URL_WBOP_GETUSERINFO = "/api/get_userinfo"; //获取用户信息
    public static URL_WBOP_GETONLINE_LIST = "/api/get_online_list"; //获取当前在线列表
    public static URL_DO_OFFLINE = "/api/do_offline"; //踢下线

    public static DO_SERVEFACE = "/api/do_saveuserface"; //上传头像
    public static DO_MODI = "/api/do_modi"; //修改用户资料
    public static DO_SAVE_BUSINESSLICENCE = "/api/do_save_businesslicense"; //上传营业执照

    //壁纸
    public static GET_WALLPAPER_LIST = "/api/get_wallpaper_list"; //2.2.1获取壁纸列表
    public static GET_WALLPAPER = "/api/get_wallpaper"; //2.2.1获取壁纸下载链接

    //微信 PC内嵌扫码登录
    public static GET_WXLOGIN = "/weixin/wechatMpLogin"; //生成登录二维码
    public static GET_CHECK_WXLOGIN = "/weixin/wechatMpCheckLogin"; //检查扫码登录结果
    public static SUBUSER_SENDBINDSMS = "/weixin/weixin_subuser_sendbindsms"; //子账号发送绑定手机短信验证码
    public static SUBUSER_BINDTEL = "/weixin/weixin_subuser_bindtel"; //子账号绑定手机号

    //pc 内嵌扫码充值
    public static GET_SUBUSER_CAT_LIST = "/subuser/get_cat_list"; //获取子账号套餐列表
    public static GET_SUBUSER_ORDER_NEW = "/subuser/order_new"; //子账号生成订单
    public static GET_SUBUSER_ORDER_RESULT = "/subuser/get_order_result"; //查询订单支付结果

    //充值续费
    public static GET_CAT_NUMBER_LIST = "/api/get_cat_number_list";//获取网吧规模列表(网吧用户)
    public static GET_BUSINESS_CAT_NUMBER_LIST = "/business/get_cat_number_list";//获取网吧规模列表(网吧用户)
    public static GET_CAT_LIST = "/api/get_cat_list";//获取套餐列表(网吧用户)
    public static GET_BUSINESS_CAT_LIST = "/business/get_cat_list";//获取套餐列表(经销商用户)
    public static GET_ORDER_NEW = "/api/order_new";//生成订单(网吧用户)
    public static GET_BUSINESS_ORDER_NEW = "/business/order_new";//生成订单(经销商用户)
    public static GET_ORDER_RESULT = "/api/get_order_result";//查询订单支付结果
    public static DO_CHANGE_FEETYPE = "/api/do_change_feetype";//转换套餐

    //订单管理
    public static GET_ORDER_LIST = "/api/get_order_list";//获取订单(网吧用户包月套餐)
    public static GET_BUSINESS_ORDER_LIST = "/business/get_order_list";//获取订单(经销商用户包月套餐)
    public static GET_SUBUSER_ORDER_LIST = "/business/get_subuser_order_list";//获取订单(经销商用户个人套餐)

    //网吧管理
    public static GET_NETBAR_LIST = "/business/get_netbar_list";//获取网吧列表
    public static ADD_NETBAR = "/business/add_netbar";//添加网吧
    public static GET_NETBAR_INFO = "/business/get_netbar_info";//获取网吧详情
    public static MODI_NETBAR = "/business/modi_netbar";//修改网吧详情
    public static BUSINESS_DEL_NETBAR = "/business/del_netbar";//删除网吧

    //账号管理
    public static CHANGE_USERNAME = "/api/do_change_username";//修改账号

    protected BASE_URL = "";
    protected xmlParse = new XmlToJsonUtil();

    public setBaseUrl(url: string): void {
        this.BASE_URL = url;
    }

    /**
     * get请求
     * @param url
     * @param params
     */
    public async get<T>(url: string, params: any) {
        // url = this.BASE_URL + "api.aspx?op=" + url;
        url = this.BASE_URL + url;
        params = {params};
        try {
            // url = 'http://sandboxie-user.leigod.com/api.aspx?op=do_login&mini_username=shamo1&mini_password=shamo1';
            // url = 'http://sandboxie-user.leigod.com/api.aspx?op=get_online_list&token=MjE5LjE0MC4xNTIuMjM4fDExNTE0MzA4NHwyMDE4LzEyLzMgMTY6MDA6MDB8ZGRmNTA1OTM1NzJiMjQxMGJjZGRlOGQyY2RmOWI2Mjg=';
            const backData = await axios.get(url, params);
            let xml = backData.data;
            xml = this.xmlParse.parseXML(xml);
            let backData1 = xml.xml.items;
            backData1.dcode = backData1.code;
            backData1.code = backData1.result;
            backData1.msg = backData1.message;
            delete backData1.message;
            delete backData1.result;
            return backData1 as T;
        } catch (e) {
            const errorData: any = {
                code: XmlHttpClient.HTTP_ERROR_NEW_CODE,
                msg: "网络错误"
            };

            return errorData as T;
        }
    }

    /**
     * post请求
     * @param url
     * @param params
     */
    public async post<T>(url: string, params: any) {
        // url = this.BASE_URL + "api.aspx?op=" + url;
        url = this.BASE_URL + url;
        // console.log(url, params);
        // params["lang"] = LocalStorageUtil.getLanguage();
        try {
            let t = typeof params;
            let post_args = "";
            if (t.toLowerCase() == "object") {
                let p = [];
                for (const key in params) {
                    p.push(key + "=" + params[key]);
                }
                post_args = p.join("&");
            } else {
                post_args = params;
            }
            const backData = await axios.post(url, post_args);
            let xml = backData.data;
            xml = this.xmlParse.parseXML(xml);
            let backData1 = xml.xml.items;
            backData1.dcode = backData1.code;
            backData1.code = backData1.result;
            backData1.msg = backData1.message;
            delete backData1.message;
            delete backData1.result;

            return backData1 as T;
        } catch (e) {
            const errorData: any = {
                code: XmlHttpClient.HTTP_ERROR_NEW_CODE,
                msg: "网络错误"
            };

            return errorData as T;
        }
    }
}

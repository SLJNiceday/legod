import { XmlDataModel } from '@/ts/models/IdataModel';

/**
 * 图形验证码
 */
export class ImgCaptchaRequestModel {
    public captcha_type: string = 'default';
}


/**
 * 图形验证码服务端返回
 */
export class ImgCaptchaModel extends XmlDataModel {
    public imgage?: string | undefined;
    public key?: string = '';
}

/**
 * 入驻请求
 */
export class RegisterModel {
    public user_name: string = '';//账号
    public password: string = '';//密码
    public bar_name: string = '';//网吧名称
    public business_user: string ='';//负责人
    public business_phone: string = '';//联系电话
}

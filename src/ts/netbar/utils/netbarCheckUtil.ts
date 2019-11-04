export default class netbarCheckUtil {
    /**
     * 验证IP
     */
    public static checkIP(IP: string) {
        let IpReg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
        if (IpReg.test(IP)) {
            //ip格式正确
            return true;
        } else {
            //ip格式不正确
            return false;
        }
    }

    /**
     *验证用户名
     */
    public static checkUsername(username: string) {
        let reg = /^[a-zA-Z][a-zA-Z0-9_]{6,18}$/;
        if (reg.test(username)) {
            //账号格式正确
            return true;
        } else {
            //账号格式不正确
            return false;
        }
    }

    /**
     *验证用户名
     */
    public static checkPwd(pwd: string) {
        let reg = /^[a-zA-Z][a-zA-Z0-9_]{6,20}$/;
        if (reg.test(pwd)) {
            //密码格式正确
            return true;
        } else {
            //密码格式不正确
            return false;
        }
    }

    /**
     *验证网吧名称
     */
    public static checkNetbar(bar_name: string) {
        if (bar_name.length > 0 && bar_name.length <= 20) {
            //密码格式正确
            return true;
        } else {
            //密码格式不正确
            return false;
        }
    }

    /**
     * 验证手机号
     */
    public static checkPhone(phoneNum: string) {
        let phoneReg = /^1\d{10}$/;
        if (phoneReg.test(phoneNum)) {
            //手机号码格式正确
            return true
        } else {
            //手机号码格式不正确
            return false
        }
    }
}

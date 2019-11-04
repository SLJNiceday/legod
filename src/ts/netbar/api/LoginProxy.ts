import {BaseVue} from "@/ts/netbar/api/baseVue";
import {TipsMsgUtil} from "@/ts/utils/TipsMsgUtil";
import {LoginModel} from "@/ts/netbar/model/userModel";
import HttpClient from "@/ts/net/HttpClient";
import LocalStorageUtil from "@/ts/netbar/utils/LocalStorageUtil";

export class LoginProxy extends BaseVue {
/**
 * 登录
 */

public async loginIn(url: string, param: any) {
    this.isLoading = true;
    this.loadingMsg = TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_LOADING);
    this.backData = await this.http.post<LoginModel>(url, param);
    if (this.backData.code == HttpClient.HTTP_SUCCESS_NET_CODE) {
        this.isLoading = false;
        const loginM: LoginModel = this.backData.data;
        let token = loginM.account_token;
        LocalStorageUtil.setCookie(LocalStorageUtil.STORAGES_TOKEN, token);
        this.onLoginSuccess();
    } else {
        this.isLoading = false;
        this.onLoginFaild(this.backData);
    }
}

/**
 * 登录成功
 * TODO... 此方法可以重写，处理登录成功后的ui逻辑
 */
onLoginSuccess() {
    window.location.href = "user/#/WangbaManager";
}

/**
 * 登录失败
 * TODO... 此方法可以重写，处理登录失败后的ui逻辑
 */
onLoginFaild(data: any) {
    this.$message({
        message: data.msg,
        type: "error"
    });
}
}

import {Vue, Component, Prop} from "vue-property-decorator";
import XmlHttpClient from "@/ts/net/XmlHttpClient";
import { XmlDataModel } from "@/ts/models/IdataModel";
import GlobalConfig from "../global_config";
import {
    OnlineModel,
    OnlineListModel,
    UserInfoModel,
    SmsCaptchaRequestModel,
    SmsCaptchaModel, PhoneFindPwdRequestModel
} from "@/ts/netbar/model/userModel";
import UserProxy from "@/ts/netbar/api/UserProxy";
import LocalStorageUtil from "@/ts/netbar/utils/LocalStorageUtil";
import {ImgCaptchaModel, ImgCaptchaRequestModel} from "@/ts/netbar/model/RegModel";
import CheckUtil from "@/ts/utils/CheckUtil";
import {TipsMsgUtil} from "@/ts/utils/TipsMsgUtil";
import Util from "@/ts/utils/Util";
import JumpWebUtil from "@/ts/utils/JumpWebUtil";
@Component({})
export default class AccountManage extends UserProxy {

}

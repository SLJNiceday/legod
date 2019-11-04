import '@/assets/less/leishen_app.less';
import './assets/less/hostAccelerate.less';
import 'babel-polyfill';
import { Component, Vue } from 'vue-property-decorator';
import VueI18n from 'vue-i18n';
import { LsLanguage } from '../util/LsLanguage';
import GlobalConfig from '../global.config';
import Util from '@/ts/utils/Util';
import AppParamModel from "@/ts/models/AppModel";
import Load from "../components/Loading.vue";
import {Loading} from "vant";
import JumpWeiXin from "@/pages/leishen_app/util/jump";

Vue.config.productionTip = false;
Vue.use(Loading);

//语言包
Vue.use(VueI18n);
const appParam: AppParamModel = AppParamModel.getInstace(Util.REGION_CODE_1, Util.ZH_CN);
let lang = LsLanguage.getInstance();
lang.init();
const i18n = new VueI18n(lang);

@Component({
    components:{
        'loading': Load
    }
})
class hostAccelerate extends Vue {
    public appParam = AppParamModel.getInstace(); // 浏览器参数

    /**
     * 充值
     */
    public gotoRecharge() {
        let param = "platform=" + this.appParam.platform;
        JumpWeiXin.gotoRecharge(param);
    }
}
new hostAccelerate({ i18n }).$mount('#app')

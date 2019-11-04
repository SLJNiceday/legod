import "./less/pc.less";
import "babel-polyfill";
import VueI18n from "vue-i18n";
import { Vue, Component } from "vue-property-decorator";
import AppParamModel from "@/ts/models/AppModel";
import HttpClient from "@/ts/net/HttpClient";
import {
  NewModel,
  NewsModel, NewsRequestModel
} from "@/ts/models/NewsModel";
import GlobalConfig from "./global_config";
import { ExtrnalFactory } from "@/ts/factory/ExtrnalFactory";
import Util from "@/ts/utils/Util";
import { Loading } from "vant";
import XmlHttpClient from "@/ts/net/XmlHttpClient";

Vue.config.productionTip = false;
Vue.use(Loading);

//语言包
Vue.use(VueI18n);
const appParam: AppParamModel = AppParamModel.getInstace(
  Util.REGION_CODE_1,
  Util.ZH_CN
);

@Component({
  components: {

  }
})
class Notify extends Vue {
  public appParam: AppParamModel = AppParamModel.getInstace();
  public isLoading: boolean = false; //loading显示

  public newsList: Array<NewModel> = [];
  public http = new HttpClient();

  public created() {
    this.setBaseUrl(GlobalConfig.getBaseUrl());
    this.onGetNewsList();
  }

  public setBaseUrl(url: string): void {
    this.http.setBaseUrl(url);
  }

  /**
   * 最新资讯
   */
  public async onGetNewsList() {
    let params=new NewsRequestModel();
    params.size=8;
    params.page=1;
    params.region_code=1;
    let url = GlobalConfig.getWWWBaseUrl()+'/api/news';

    let d = await new HttpClient().get<NewsModel>(url, params);
    console.log(d)
    if (d.code == XmlHttpClient.HTTP_SUCCESS_NET_CODE) {
      this.newsList=d.data.list
    } else {
    }
  }
  /**
   * 点击公告的时候，进行的跳转
   */
  public async getDetail(item) {
    if (this.appParam.platform == 4) {
      const url = window.location.origin + "/details.html?id=" + item.id;
      window.location.href = url;
    } else {
      const url = window.location.origin + "/details.html?id=" + item.id;
      const factory = ExtrnalFactory.getInstance().getFactory(
        this.appParam.platform
      );
      factory.jumpUrl(url);
    }
  }
}

new Notify().$mount("#app");

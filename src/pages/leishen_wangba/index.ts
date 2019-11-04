import { Vue, Component } from "vue-property-decorator";
import "babel-polyfill";
import Header from "./components/Headnav.vue";
import Footer from "./components/Footer.vue";
import "./less/leigodwangba.less";
import XmlHttpClient from "@/ts/net/XmlHttpClient";
import ConfigUtil from "@/ts/utils/ConfigUtil";
import {BaseVue} from "@/ts/netbar/api/baseVue";
@Component({
  components: {
    "header-nav": Header,
    "footer-nav": Footer
  }
})
export default class Index extends BaseVue {
  public activeIndex: number = 1;
  public wangbaDownloadUrl: string = '';

  // 公共参数
  public xmlHttp: XmlHttpClient = new XmlHttpClient();

  created(){
      this.getDownloadUrl();
  }
  /**
   * 获取下载列表
   * @param url
   */
  public async getDownloadUrl() {
    const jsonConfig = await ConfigUtil.getInstance().download();
      this.wangbaDownloadUrl = jsonConfig.leigod.wangba.download_url;
  }
}

new Index({}).$mount("#index");

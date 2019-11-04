
import "leigod-lib-flexible";
import "babel-polyfill";
import {Vue, Component} from "vue-property-decorator";
Vue.config.productionTip = false;
@Component
class Appshow extends Vue {

}
new Appshow().$mount("#app");



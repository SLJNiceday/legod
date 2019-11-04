import {Vue, Component} from 'vue-property-decorator';
import "babel-polyfill";
import Header from './components/Headnav.vue';
import Footer from './components/Footer.vue';
import {Input, Checkbox, Row, Col} from "element-ui";
import './less/leigodwangba.less';
import {BaseVue} from "@/ts/netbar/api/baseVue";

Vue.use(Input);
Vue.use(Checkbox);
Vue.use(Row);
Vue.use(Col);
@Component({
    components: {
        'header-nav': Header,
        'footer-nav': Footer,
    }
})
export default class Login extends BaseVue {


}

new Login({}).$mount('#login');

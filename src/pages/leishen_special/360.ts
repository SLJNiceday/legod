import './less/page.less';
import 'babel-polyfill';
import { Component, Vue } from 'vue-property-decorator';
import FootNav from './components/FootNav.vue';
import HeadNav from './components/HeadNav.vue';
import axios from 'axios'
// import util from '@/ts/utils/Util'
Vue.config.productionTip = false;
@Component({
    components:{
        'foot-nav':FootNav,
        'head-nav':HeadNav
    }
})
class activityModel extends Vue {
    public downLink:string=''
    public created(){
      axios.get('https://www.leigod.com/config.json') .then(res=>{
          if(res.data.leigod&&res.data.leigod.down_platform){
              this.downLink= res.data.leigod.down_platform['360'].windows.download_url;
          }
      })
    }
}

new activityModel().$mount('#app')

import router from './router/index'
import "../less/leigodwangba.less"
// import './permission'
import Vue from 'vue'
import "babel-polyfill";

Vue.config.productionTip = false

new Vue({
    router,
    mounted() {
        function checkIE(){
            return '-ms-scroll-limit' in document.documentElement.style && '-ms-ime-align' in document.documentElement.style;
        }
        if (checkIE()) {
            window.addEventListener('hashchange', () => {
                var currentPath = window.location.hash.slice(1);
                if (this.$route.path !== currentPath) {
                    this.$router.push(currentPath)
                }
            },false)
        }
    }
}).$mount('#app');
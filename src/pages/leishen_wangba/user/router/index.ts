import Vue from 'vue'
import Router from 'vue-router'
import Layout from "../views/Layout.vue"
import "babel-polyfill";

Vue.use(Router)

export default new Router({
    // mode: 'history',
    scrollBehavior: (to, from, savedPosition) => {
        return { x: 0, y: 0 }
    },
    routes: [
        {
            path: '/',
            component: Layout,
            redirect: '/ShopManage',
            children: [
                {
                    path: 'ShopManage',
                    name: 'ShopManage',
                    component: () => import( '@/pages/leishen_wangba/components/ShopManage.vue')
                },
                {
                    path: 'AccountManage',
                    name: 'AccountManage',
                    component: () => import( '@/pages/leishen_wangba/components/AccountManage.vue')
                },
                {
                    path: 'WangbaManager',
                    name: 'WangbaManager',
                    component: () => import( '@/pages/leishen_wangba/components/WangbaManager.vue')
                },
                {
                    path: 'OrderManage',
                    name: 'OrderManage',
                    component: () => import( '@/pages/leishen_wangba/components/OrderManage.vue')
                },
                {
                    path: 'Recharge',
                    name: 'Recharge',
                    component: () => import( '@/pages/leishen_wangba/components/Recharge.vue')
                }
            ]
        }
    ]
})

import {Vue, Component} from "vue-property-decorator";

@Component
class Index extends Vue {
    public test: string = 'test222';
    public navList = ['绝地求生', '刺激战场', '王者荣耀', '英雄联盟'];
    public navContent = ['绝地求生content', '刺激战场content', '王者荣耀content', '英雄联盟content'];
}

new Index().$mount('#app');
import { Vue, Component } from 'vue-property-decorator';
import "babel-polyfill";
import HttpClient from "@/ts/net/HttpClient";
import {IdataModel} from "@/ts/models/IdataModel";
@Component
export class BaseVue extends Vue {
    // 公共参数
    public http = new HttpClient();//远程协议
    public isLoading:boolean=false; //数据请求加载动画
    public loadingMsg:string=''; //数据请求加载文字
    public backData: IdataModel<any> | undefined;//接口返回数据
    public setBaseUrl(url: string): void {
        this.http.setBaseUrl(url);
    }

}

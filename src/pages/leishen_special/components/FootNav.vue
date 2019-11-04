<template>
    <div class="footer">
        <div class="footer-container">
            <div class="contianer__qrcodeArea">
                <div class="footer--left footer-down">
                    <div class="down-area">
                        <p class="down__text">下载客户端</p>
                        <ul class="down-contianer">
                            <li><a :href="downlink" class="down__windows">
                                <i class="iconfont icon-windows"></i><br/>
                                <span>Windows</span>
                            </a>
                            </li>
                            <li>
                                <el-tooltip class="item" effect="dark" placement="top">
                                    <div slot="content">
                                        <p>即将上线，敬请期待</p>
                                    </div>
                                    <div>
                                        <i class="iconfont icon-mac"></i>
                                        <p>Mac</p>
                                    </div>
                                </el-tooltip>
                            </li>
                            <li>
                                <el-tooltip class="item" effect="dark" placement="top">
                                    <div slot="content">
                                        <img src="../images/code_1_cn.png" width="98px" height="98px">
                                    </div>
                                    <div>
                                        <i class="iconfont icon-iOS"></i>
                                        <p>iOS</p>
                                    </div>
                                </el-tooltip>
                            </li>
                            <li>
                                <el-tooltip class="item" effect="dark" placement="top">
                                    <div slot="content">
                                        <img src="../images/code_1_cn.png" width="98px" height="98px">
                                    </div>
                                    <div>
                                        <i class="iconfont icon-anzhuo"></i>
                                        <p>Android</p>
                                    </div>
                                </el-tooltip>
                            </li>
                        </ul>
                        <p class="down__company">吴川市新启蒙教育咨询有限公司  版权所有</p>
                    </div>
                    <div class="focus-area">
                       <ul class="focus-container">
                           <li>
                               <img src="../images/wx.png" alt="" width="110px"><br/>
                               <span class="fucus__tip">扫码关注微信公众号</span>
                           </li>
                           <li>
                               <img src="../images/wb.png" alt="" width="110px"><br/>
                               <span class="fucus__tip">扫码关注微博公众号</span>
                           </li>
                       </ul>
                    </div>
                </div>
                <div class="footer--right footer-kefu">
                    <p class="kefu-button">
                        <a class="kefu__alink newmodal">
                        <img src="../images/qq_kfu@2x.png" alt="" width="16" height="16">
                        <span>在线客服</span>
                    </a>
                    </p>
                    <p class="kefu__tip">每天8:00-24:00客服在线 (全年无休)</p>
                </div>
            </div>
            <div class="contianer__qualifyArea" v-show="false">
                <div class="footer--left">
                    <p class="footer_address">
                        沪ICP备18007431号-1 2016年-2036年 上海雷神网络科技有限公司版权所有 并保留所有权利<br/>
                        沪网文(2018)8355-502号 ICP证编号:沪B2-20180795
                    </p>
                </div>
                <div class="footer--right">
                    <ul class="qualify-container">
                        <li>
                            <a id="_pingansec_bottomimagesmall_brand"
                               href="http://si.trustutn.org/info?sn=544171218031154034526&certType=1">
                                <img src="https://v.trustutn.org/images/cert/brand_bottom_small.jpg">
                            </a>
                        </li>
                        <li>
                            <a
                                    key="5a15257a0c909623245ac96b"
                                    href="http://www.cn-ecusc.org.cn/cert/aqkx/site/?site=www.leigod.com">
                                <img src="//static.anquan.org/static/outer/image/aqkx_124x47.png?id=www.leigod.com?t=79">
                            </a>
                        </li>
                        <li>
                            <a
                                    key="5a15257a0c909623245ac96b"
                                    logo_size="124x47"
                                    logo_type="business"
                                    href="https://v.pinpaibao.com.cn/authenticate/cert/?site=www.leigod.com&at=business">
                                <img src="//static.anquan.org/static/outer/image/hy_124x47.png?id=www.leigod.com?t=79">
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import '../less/common.less'
    import {Vue, Component,Prop} from "vue-property-decorator";
    import { Tooltip } from "element-ui";
    @Component({
        components:{
            "el-tooltip": Tooltip
        }
    })
    export default class FootNav extends Vue {
        @Prop(String) downlink:string;
        // public downlink:string=''
        // public kefulink:string=''
    }
</script>

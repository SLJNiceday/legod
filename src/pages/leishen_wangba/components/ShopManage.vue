<template>
    <div class="shop_manage">
        <p class="leigod_mb25 user_title_font">商户管理</p>
        <div class="leigod_dashedbottom"></div>
        <div class="leigod_pv50">
            <el-form status-icon :rules="ShopManageInfo" ref="ruleForm" label-width="108px" label-position="left" class="demo-ruleForm">
                <el-form-item label="账号：" prop="">
                    <!--<el-input type="text" v-model="ShopManageInfo.username" autocomplete="off"></el-input>-->
                    <span class="leigod_ml10">{{ShopManageInfo.username}}</span>
                </el-form-item>
                <el-form-item label="公司名称：" prop="">
                    <el-input type="text" v-model="ShopManageInfo.title" @change="wangbaInfoReset" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="营业执照号：" prop="">
                    <el-input type="text" v-model="ShopManageInfo.business_id" @change="wangbaInfoReset" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="营业执照：" prop="">
                    <el-upload class="avatar-uploader" :action="licenseImgurl" :show-file-list="false" :data="usertoken" :on-success="licenseSuccess"
                               :before-upload="beforeLicenseUpload">
                        <div v-if="ShopManageInfo.business_license">
                            <img width="168" :src="ShopManageInfo.business_license" class="avatar" />
                            <label style="vertical-align: bottom;cursor: pointer;color: #35a7d3;margin-left: 10px;position: relative;top: 18px;">修改</label>
                        </div>
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="地址：" prop="">
                    <el-input type="text" @change="wangbaInfoReset" v-model="ShopManageInfo.address" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="系统名称：" prop="">
                    <el-input type="text" @change="wangbaInfoReset" v-model="ShopManageInfo.business_sysname" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="官网网址：" prop="">
                    <el-input type="text" @change="wangbaInfoReset" v-model="ShopManageInfo.business_homepage" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="规模：" prop="">
                    <span class="leigod_ml10">{{ShopManageInfo.number}}</span>
                </el-form-item>
                <el-form-item label="负责人：" prop="">
                    <el-input type="text" v-model="ShopManageInfo.business_manager" @change="wangbaInfoReset" autocomplete="off"></el-input>
                </el-form-item>
                <!--<el-form-item label="联系手机：" prop="">-->
                    <!--<el-input type="text" v-model="ShopManageInfo.tel" autocomplete="off"></el-input>-->
                <!--</el-form-item>-->
                <!--<el-form-item label="联系QQ：" prop="">-->
                    <!--<el-input type="text" v-model="ShopManageInfo.qq" autocomplete="off"></el-input>-->
                <!--</el-form-item>-->
                <!--<el-form-item label="联系微信：" prop="">-->
                    <!--<el-input type="text" v-model="ShopManageInfo.business_weixin" autocomplete="off"></el-input>-->
                <!--</el-form-item>-->
            </el-form>
        </div>
        <div class="leigod_dashedbottom"></div>
        <div class="leigod_mt45 leigod_text_center">
            <button class="user_common_btn" @click="saveShopInfo">保存</button>
        </div>
    </div>
</template>

<script lang="ts">
    import {Vue, Component, Prop} from "vue-property-decorator";
    import {UserInfoModel} from "../../../ts/netbar/model/userModel";
    import LocalStorageUtil from "../../../ts/netbar/utils/LocalStorageUtil";
    import Util from "../../../ts/utils/Util";
    import XmlHttpClient from "../../../ts/net/XmlHttpClient";
    import UserProxy from "../../../ts/netbar/api/UserProxy";
    import {BaseVue} from "../../../ts/netbar/api/baseVue";
    import GlobalConfig from "../global_config";
    import XmlToJsonUtil from "../../../ts/utils/XmlToJsonUtil";
    import {XmlDataModel} from "@/ts/models/IdataModel";
    @Component({})
    export default class ShopManage extends BaseVue {

    }
</script>

<style lang="less" scoped>
    .shop_manage {
        .el-input {
            width: 440px;
        }
        .el-form-item:last-child {
            margin-bottom: 0;
        }
        .avatar-uploader-icon {
            display: block;
            font-size: 28px;
            color: #8c939d;
            width: 150px;
            height: 150px;
            line-height: 150px;
            text-align: center;
        }
        .el-upload {
            background: #eee;
            border: 1px dashed #d9d9d9;
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
        }
    }
</style>

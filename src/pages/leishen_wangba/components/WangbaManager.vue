<template>
    <div class="wangba_manage">
        <!-- 网吧管理主页-->
        <div>
            <p class="leigod_mb25 leigod_ml15 leigod_user_tit">网吧管理</p>
            <div class="leigod_dashedbottom"></div>
            <el-form status-icon ref="ruleForm" label-width="140px" label-position="right" class="demo-ruleForm leigod_mt45">
                <el-form-item label="网吧名称：">
                    <el-input type="text" @change="resetInfo" v-model="userInfo.bar_name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="账号：">
                    <span class="leigod_ml10">{{userInfo.user_name}}</span>
                    <a class="leigod_ml20 leigod_backlink">修改密码</a>
                </el-form-item>
                <el-form-item label="网吧ip：">
                    <el-input type="textarea" @change="resetInfo" v-model="ip" autocomplete="off" rows="4"></el-input>
                    <p></p>
                </el-form-item>
                <el-form-item label="包月套餐到期时间：">
                    <span class="leigod_ml10">{{userInfo.expired_time}}</span>
                </el-form-item>
                <el-form-item label="机器数量：">
                    <span class="leigod_ml10">{{userInfo.bar_scope}}台</span>
                </el-form-item>
                <el-form-item label="激活码：">
                    <span class="leigod_ml10">{{userInfo.active_code}}</span>
                    <a class="leigod_ml20 leigod_backlink">复制</a>
                </el-form-item>
                <el-form-item label="联系人：">
                    <el-input type="text" @change="resetInfo" v-model="userInfo.business_user" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="手机号：">
                    <el-input type="text" @change="resetInfo" v-model="userInfo.business_phone" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div class="leigod_text_center leigod_mt35 leigod_mb70">
                <button style="padding: 15px 73px;" class="user_common_btn" @click="saveUserInfo">保存</button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Vue, Component, Prop} from "vue-property-decorator";
    import {
        addWangbaRequestModel, ImproveRequestModel,
        resetWangbaRequestModel,
        UserInfoModel
    } from "../../../ts/netbar/model/userModel";
    import LocalStorageUtil from "../../../ts/netbar/utils/LocalStorageUtil";
    import XmlToJsonUtil from "../../../ts/utils/XmlToJsonUtil";
    import XmlHttpClient from "../../../ts/net/XmlHttpClient";
    import GlobalConfig from "../global_config";
    import Util from "../../../ts/utils/Util";
    import UserProxy from "../../../ts/netbar/api/UserProxy";
    import {XmlDataModel} from "@/ts/models/IdataModel";
    @Component({})
    export default class WangbaManager extends UserProxy {
        public ip: string = '';
        public is_resetInfo: boolean = false;//是否改动了用户信息

        created() {
            this.setBaseUrl(GlobalConfig.getBaseUrl());
            this.initA();
        }

        initA() {
            this.userInfo = JSON.parse(LocalStorageUtil.getCookie(LocalStorageUtil.STORAGES_USER_INFO));
            this.ip = this.getIpStr();
        }

        /**
         * 格式化ip
         */
        public getIpStr() {
            let ip = '';
            if(this.userInfo.ip_list.length) {
                if(this.userInfo.ip_list.length == 1) {
                    ip = this.userInfo.ip_list[0];
                }else {
                    this.userInfo.ip_list.forEach((item)=> {
                        ip += (item + ',')
                    })
                }
            }
            return ip;
        }

        /**
         * 改动了用户信息
         */
        public resetInfo() {
            this.is_resetInfo =true;
        }

        /**
         * 修改用户信息
         */
        public saveUserInfo() {
            if(!this.is_resetInfo) return;
            let param = new ImproveRequestModel();
            param.account_token = this.account_token;
            param.bar_ip = this.ip;
            param.bar_name = this.userInfo.bar_name;
            param.business_phone = this.userInfo.business_phone;
            param.business_user = this.userInfo.business_user;
            this.onSaveUserInfo(param);
        }

        /**
         * 修改用户信息成功
         */
        public saveUserInfoSuccess() {
            this.$message.success('修改成功!')
        }
    }
</script>

<style lang="less" scoped>
    .el-textarea {
        width: 440px;
    }
    .el-form-item:last-child {
        margin-bottom: 0;
    }
    .resetPwd_btn {
        padding: 5px 20px;
    }

</style>

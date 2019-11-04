<template>
    <div class="account_manage">
        <p class="leigod_mb25 user_title_font">账号管理</p>
        <div class="leigod_dashedbottom"></div>
        <div class="leigod_pv50">
            <el-form status-icon ref="ruleForm" label-width="108px" label-position="left" class="demo-ruleForm">
                <el-form-item label="账号：">
                    <span class="leigod_ml10">{{AccountManageInfo.username}}</span>
                    <span class="leigod_ml30 cursor" @click="openResetAccountDialog" style="color: #35a7d3;">
                        <img style="margin-top: -3px;" src="../images/icon_edit.png" alt="">修改
                    </span>
                </el-form-item>
                <el-form-item label="登录密码：">
                    <span class="leigod_ml10">**************</span>
                    <span class="leigod_ml30 cursor" @click="openResetPasswordDialog" style="color: #35a7d3;">
                        <img style="margin-top: -3px;" src="../images/icon_edit.png" alt="">修改
                    </span>
                    <p class="user_warn_font">（密码要求包含字母和数字, 且长度为6-20位。建议您经常修改密码,以保证帐号更加安全。）</p>
                </el-form-item>
                <el-form-item label="联系手机：">
                    <el-input type="text" v-model="AccountManageInfo.tel" @change="wangbaInfoReset" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="QQ：">
                    <el-input type="text"  v-model="AccountManageInfo.qq" @change="wangbaInfoReset" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="微信：">
                    <el-input type="text" autocomplete="off" @change="wangbaInfoReset" v-model="AccountManageInfo.business_weixin"></el-input>
                </el-form-item>
            </el-form>
        </div>
        <div class="leigod_mt10 leigod_text_center">
            <button class="user_common_btn" @click="saveAccountInfo">保存</button>
        </div>
        <!--修改密码弹窗-->
        <el-dialog :visible.sync="resetPasswordDialogVisible" width="449px" title="修改密码" class="pay_dialog" @close="closeResetPasswordDialog" :close-on-click-modal="false" :close-on-press-escape="false">
            <div class="leigod_login" >
                <div class="leigod_reg_block">
                    <span>手机号:{{AccountManageInfo.username}}</span>
                </div>
                <div class="leigod_reg_block">
                    <el-input class="leigod_login_cell" placeholder="请输入图形验证码" v-model="checkcode" clearable></el-input>
                    <img @click="onGetCaptcha" :src="imgCaptchaM.image" height="35"
                         class="leigod_reg_verify" alt="">
                </div>
                <div class="leigod_reg_block">
                    <el-input class="leigod_login_cell" placeholder="请输入短信验证码" v-model="smscode"></el-input>
                    <div class="leigod_sendsms" @click="onPwdSmsCode" v-show="smsCountDownNum <= 0">发送短信</div>
                    <div class="leigod_sendsms" style="color:#999;" v-show="smsCountDownNum > 0">已发送{{smsCountDownNum}}s</div>
                </div>
                <div class="leigod_reg_block">
                    <el-input type="password" class="leigod_login_cell" placeholder="请输入密码(6~20位数字加字母组合)"
                              v-model="password" clearable></el-input>
                </div>
                <div class="leigod_mt35 leigod_text_center">
                    <button class="user_common_btn resetPwd_btn" @click="clickFindPassword">确定</button>
                    <button class="user_common_btn leigod_ml30 resetPwd_btn" @click="closeResetPasswordDialog">取消</button>
                </div>
            </div>
        </el-dialog>
        <!--修改账号弹窗-->
        <el-dialog :visible.sync="resetAccountDialogVisible" width="449px" title="修改账号" class="pay_dialog" @close="closeResetAccountDialog" :close-on-click-modal="false" :close-on-press-escape="false">
            <div class="leigod_login" >
                <div class="leigod_reg_block">
                    <el-input type="password" class="leigod_login_cell" placeholder="请输入新手机号"
                              v-model="phone" clearable></el-input>
                </div>
                <div class="leigod_reg_block">
                    <el-input class="leigod_login_cell" placeholder="请输入图形验证码" v-model="checkcode" clearable></el-input>
                    <img @click="onGetCaptcha" :src="imgCaptchaM.image" height="35"
                         class="leigod_reg_verify" alt="">
                </div>
                <div class="leigod_reg_block">
                    <el-input class="leigod_login_cell" placeholder="请输入短信验证码" v-model="smscode"></el-input>
                    <div class="leigod_sendsms" @click="onAccountSmsCode" v-show="smsCountDownNum <= 0">发送短信</div>
                    <div class="leigod_sendsms" style="color:#999;" v-show="smsCountDownNum > 0">已发送{{smsCountDownNum}}s</div>
                </div>
                <div class="leigod_mt35 leigod_text_center">
                    <button class="user_common_btn resetPwd_btn" @click="clickResetAccount">确定</button>
                    <button class="user_common_btn leigod_ml30 resetPwd_btn" @click="closeResetAccountDialog">取消</button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script lang="ts">
    import AccountManage from './AccountControl';

    export default AccountManage;
</script>
<style lang="less" scoped>
    .pay_dialog .el-input {
        width: 100%;
    }
    .resetPwd_btn {
        padding: 5px 20px;
    }
</style>


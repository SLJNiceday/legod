<template>
    <div>
        <div class="v6_reset_account">
            <p class="v6_bind_msg" style="margin-top: .3rem;">{{$t("public.share12")}}</p>
            <div class="dialog_form" style="width:100%">
                <div class="form_item flex_row_start">
                    <!--<span class="form_title">{{$t("public.share2")}}</span>-->
                    <div class="v6_select_box" style="width:40%;">
                        <!--<img :src="country_code.ico" alt="" style="margin-left: 10px;">-->
                        <el-select @change="onSelectCountryCode" :value="country_code.code"
                                   :placeholder="$t('public.share25')" style="width:100%;vertical-align: middle">
                            <div slot="prefix"> <img :src="country_code.ico" alt="" style="margin-top: 0.1rem;"></div>
                            <el-option-group
                                    v-for="group in country_code_list"
                                    :key="group.label"
                                    :label="group.label">
                                <el-option v-for="(val,index) in group.options" :key="index"
                                           :value="val" :label="'+'+val.code">
                                    <img :src="val.ico" alt="">
                                    <span style="color:#666;">{{val.name}}</span>
                                </el-option>
                            </el-option-group>
                        </el-select>
                        <!--<span style="font-size: 14px;">{{'+' + country_code.code}}</span>-->
                    </div>
                    <div class="form_input_box" style="width: 55%;margin-left: 5%;">
                        <input v-model="phone" class="v6_form_input" type="text" name="" :placeholder="$t('public.share2')">
                    </div>
                </div>
                <div class="form_input_box" style="margin-top:0.1rem;" v-show="isimgVerification == 1">
                    <input class="v6_form_input" v-model="imgCaptchaCode" type="text" name=""
                           :placeholder="$t('public.share5')">
                    <span class="verificatioPic" @click="onGetCaptcha">
                        <img v-show="imgCaptchaM.img != null" :src="imgCaptchaM.img" alt="" class="img_filter">
                    </span>
                </div>
                <div class="form_input_box flex_row_start" style="margin-top:0.1rem;">
                    <!--<span class="form_title">{{$t("public.share4")}}</span>-->
                    <div class="form_input_box">
                        <input class="v6_form_input" v-model="smscode" type="text" name="" :placeholder="$t('public.share4')">
                        <span class="send_code">
                            <span class="send cursor" v-show="smsCountDownNum <= 0" @click="getSmscode(0)">{{$t("public.share6")}}</span>
                            <span style="margin: 0 0.05rem" v-show="smsCountDownNum <= 0 && is_show_call">|</span>
                            <span class="send cursor" v-show="smsCountDownNum <= 0 && is_show_call" @click="getSmscode(1)">{{$t("public.share7")}}</span>
                            <span class="send" v-show="smsCountDownNum > 0">{{smsCountDownNum}}</span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <div class="btn_control">
            <a class="round_btn" style="margin-right: 0.2rem;padding: .07rem .28rem;" @click="clickBindPhone">{{$t("public.share8")}}</a>
            <a class="round_white_btn" style="padding: .07rem .28rem;" @click="closeService">{{$t("public.share13")}}</a>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue } from "vue-property-decorator";
    import AppParamModel from '@/ts/models/AppModel';
    import {BindingProxy} from '@/ts/proxy/BindingProxy';
    import GlobalConfig from "../global.config";
    import {TipsMsgUtil} from "../../../ts/utils/TipsMsgUtil";
    import CheckUtil from "../../../ts/utils/CheckUtil";
    import {Message, Select, Option, OptionGroup} from 'element-ui';
    import Util from "../../../ts/utils/Util";

    Vue.prototype.$message = Message;

    @Component({
        components: {
            'el-select': Select,
            'el-option': Option,
            'el-option-group': OptionGroup
        }
    })
    export default class BindMobile extends BindingProxy {
        public appParam: AppParamModel = AppParamModel.getInstace();
        public is_show_call: boolean = false;

        public created(){
            this.setBaseUrl(GlobalConfig.getBaseUrl());
            // this.getAreaCodeList();
            this.getAreaCodeInfoList(GlobalConfig.getWebBaseUrl());
            this.onChangeRegisterType(7);
        }

        /**
         * 改变手机区号
         */
        public onSelectCountryCode(value) {
            this.country_code = value;
            this.countryCode = value.code;
        }

        /**
         * 获取手机验证码
         */
        public getSmscode(type: number) {
            //验手机格式
            if (!CheckUtil.checkPhone(this.phone)) {
                if (this.phone == "") {
                    this.$message({
                        message: TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_PHONE_EMPTY),
                        type: 'warning'
                    });
                    return;
                }
                this.$message({
                    message: TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_PHONE_ERROR),
                    type: 'warning'
                });
                return;
            }

            this.onGetSmscode(type, 2);
        }

        /**
         * 获取短信验证码成功
         */
        public onGetSmscodeSuccess() {
            this.$message({
                message: TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_SMS),
                type: 'success'
            });
            //倒计时
            this.is_show_call = true;
            this.smsCountDownNum = 60;
            const sefl = this;
            Util.countDown(this.smsCountDownNum, 1, (n: number) => {
                sefl.smsCountDownNum = n;
            });
        }

        /**
         * 获取短信验证码失败
         */
        public onGetSmscodeFaild(data: any) {
            this.$message({
                message: data.msg,
                type: 'warning'
            });
        }

        /**
         * 绑定手机
         */
        public clickBindPhone(){
            //验手机格式
            if (!CheckUtil.checkPhone(this.phone)) {
                if (this.phone == "") {
                    this.$message({
                        message: TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_PHONE_EMPTY),
                        type: 'warning'
                    });
                    return;
                }
                this.$message({
                    message: TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_PHONE_ERROR),
                    type: 'warning'
                });
                return;
            }

            //验证图形验证码
            if (this.isimgVerification == 1) {
                if (!CheckUtil.checkimgVerificatioCode(this.imgCaptchaCode)) {
                    if (this.imgCaptchaCode == "") {
                        this.$message({
                            message: TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_IMGCAPTCHACODE_EMPTY),
                            type: 'warning'
                        });
                        return;
                    }
                    this.$message({
                        message: TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_IMGCAPTCHACODE_ERROR),
                        type: 'warning'
                    });
                    return;
                }
            }

            //验证短信验证码
            if (!CheckUtil.checkSmscode(this.smscode)) {
                if (this.smscode == "") {
                    this.$message({
                        message: TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_SMSCODE_EMPTY),
                        type: 'warning'
                    });
                    return;
                }
                this.$message({
                    message: TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_SMSCODE_ERROR),
                    type: 'warning'
                });
                return;
            }

            this.bindPhone();
        }

        /**
         * 绑定手机成功ui逻辑
         */
        public bindPhoneSuccess() {
            this.phone = '';
            this.smscode = '';
            this.imgCaptchaCode = '';
            this.$message({
                message: TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_BINDING_MOBILE),
                type: 'success'
            });
            this.closeService();
            this.$emit('refreshuserinfo');
        }

        /**
         * 绑定手机失败ui逻辑
         */
        public bindPhoneFaild(data: any) {
            this.$message({
                message: data.msg,
                type: 'warning'
            });
        }

        /**
         * 关闭下拉框
         */
        public closeService(){
            this.$emit('closeservice');
        }

    }
</script>


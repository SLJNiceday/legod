<template>
    <div>
        <div class="v6_safety flex_row_between">
            <!--手机主账号-->
            <div class="v6_safety_item flex_column_start" v-if="userinfo.master_account == 0">
                <img src="../images/account_mobile.png" alt="" style="width: .8rem;height: .8rem;margin-top: .2rem;">
                <div class="v6_safety_title" style="margin-top: .07rem;">
                    {{$t("user.b21")}}
                </div>
                <div class="v6_safety_title" style="font-size: .14rem;color: #666;margin-top: .04rem;">
                    {{userinfo.mobile}}
                </div>
                <div class="v6_safety_btn" style="margin-top: .51rem;">
                    <a class="round_white_btn v6_white_btn flex_row_center" style="color: #666;" @click="onResetPhoneShow">
                        <i class="iconic_xiugaishoujihao iconfont"></i>
                        <span>{{$t("public.share9")}}</span>
                    </a>
                </div>
            </div>
            <div class="v6_safety_item flex_column_start" v-if="userinfo.master_account == 0">
                <img src="../images/account_email.png" alt="" style="width: .8rem;height: .8rem;margin-top: .2rem;">
                <div class="v6_safety_title" style="margin-top: .07rem;">
                    {{$t("user.b24")}}
                </div>
                <div class="v6_safety_title" style="font-size: .14rem;color: #666;margin-top: .04rem;">
                    {{userinfo.email}}
                </div>
                <div class="v6_safety_btn" style="margin-top: .51rem;">
                    <a class="round_white_btn v6_white_btn flex_row_center" style="color: #666;" v-show="userinfo.email == ''" @click="onbindEmailShow">
                        <i class="iconic_bangding iconfont"></i>
                        <span>{{$t("public.share8")}}</span>
                    </a>
                    <a class="round_white_btn v6_white_btn flex_row_center" style="color: #666;" v-show="userinfo.email != ''" @click="unbindEmail">
                        <i class="iconjiebang iconfont"></i>
                        <span>{{$t("user.b39")}}</span>
                    </a>
                </div>
            </div>
            <!--手机主账号end-->
            <!--邮箱主账号-->
            <div class="v6_safety_item flex_column_start" v-if="userinfo.master_account == 1">
                <img src="../images/account_mobile.png" alt="" style="width: .8rem;height: .8rem;margin-top: .2rem;">
                <div class="v6_safety_title" style="margin-top: .07rem;">
                    {{$t("user.b24")}}
                </div>
                <div class="v6_safety_title" style="font-size: .14rem;color: #666;margin-top: .04rem;">
                    {{userinfo.email}}
                </div>
                <div class="v6_safety_btn" style="margin-top: .51rem;">
                    <a class="round_white_btn v6_white_btn flex_row_center" style="color: #666;" @click="onResetEmailShow">
                        <i class="iconic_xiugaishoujihao iconfont"></i>
                        <span>{{$t("public.share9")}}</span>
                    </a>
                </div>
            </div>
            <div class="v6_safety_item flex_column_start" v-if="userinfo.master_account == 1">
                <img src="../images/account_email.png" alt="" style="width: .8rem;height: .8rem;margin-top: .2rem;">
                <div class="v6_safety_title" style="margin-top: .07rem;">
                    {{$t("user.b21")}}
                </div>
                <div class="v6_safety_title" style="font-size: .14rem;color: #666;margin-top: .04rem;">
                    {{userinfo.mobile}}
                </div>
                <div class="v6_safety_btn" style="margin-top: .51rem;">
                    <a class="round_white_btn v6_white_btn flex_row_center" style="color: #666;" v-show="userinfo.mobile == ''" @click="onbindPhoneShow">
                        <i class="iconic_bangding iconfont"></i>
                        <span>{{$t("public.share8")}}</span>
                    </a>
                    <a class="round_white_btn v6_white_btn flex_row_center" style="color: #666;" v-show="userinfo.mobile != ''" @click="unbindPhone">
                        <i class="iconjiebang iconfont"></i>
                        <span>{{$t("user.b39")}}</span>
                    </a>
                </div>
            </div>
            <!--邮箱主账号end-->
            <!--登录密码部分-->
            <div class="v6_safety_item flex_column_start">
                <img src="../images/password.png" alt="" style="width: .8rem;height: .8rem;margin-top: .2rem;">
                <div class="v6_safety_title" style="margin-top: .07rem;">
                    {{$t("user.b26")}}
                </div>
                <div class="v6_safety_btn" style="margin-top: .79rem;">
                    <a class="round_white_btn v6_white_btn flex_row_center" style="color: #666;" @click="onResetPasswordShow">
                        <i class="iconic_xiugaishoujihao iconfont"></i>
                        <span>{{$t("public.share9")}}</span>
                    </a>
                </div>
            </div>
        </div>

        <!-- 修改登录密码弹窗 -->
        <div class="update_avtar_box" v-if="resetPasswordShow" :style="'background:url('+bgimage+') no-repeat'">
            <ul class="v6_tab_nav" style="justify-content: space-between;">
                <li class="v6_tab_nav_li v6_goback cursor" @click="onResetPasswordClose">
                    <i class="iconfont iconic_fanhui"></i>
                    {{$t("wallpaper.wall18")}}
                </li>
                <li class="v6_tab_nav_li cursor">{{$t('user.b98')}}</li>
                <li class="v6_tab_nav_li cursor" @click="onResetPasswordClose">
                    <i class="iconfont iconic_guanbi"></i>
                </li>
            </ul>
            <div class="v6_reset_account" style="padding-top: .6rem;">
                <div class="dialog_form">
                    <div class="form_input_box" style="margin-top:0.1rem;">
                        <input class="v6_form_input" v-model="verify_code" type="text" name=""
                               :placeholder="$t('public.share4')">
                        <span class="send_code">
                        <!--发送验证码-->
                        <span class="v6_send cursor" @click="sendVerifyCode" v-show="verifyCountDownNum <= 0">{{$t("public.share66")}}</span>
                        <span class="v6_send" v-show="verifyCountDownNum > 0">{{verifyCountDownNum}}</span>
                    </span>
                    </div>
                    <div class="form_input_box" style="margin-top:0.1rem;">
                        <input class="v6_form_input" v-model="newPassword" type="password" name=""
                               :placeholder="$t('user.b51')">
                    </div>
                    <div class="form_input_box" style="margin-top:0.1rem;">
                        <input class="v6_form_input" v-model="confirmPassword" type="password" name=""
                               :placeholder="$t('user.b52')">
                    </div>
                </div>
                <div class="btn_control" style="margin-top: 0.4rem;">
                    <a class="round_btn v6_round_btn" style="padding: .07rem .28rem;" @click="resetPassword">{{$t("public.share9")}}</a>
                </div>
            </div>
        </div>

        <!-- 绑定邮箱 -->
        <div class="update_avtar_box" v-if="bindEmailShow" :style="'background:url('+bgimage+') no-repeat'">
            <ul class="v6_tab_nav" style="justify-content: space-between;">
                <li class="v6_tab_nav_li v6_goback cursor" @click="onbindEmailClose">
                    <i class="iconfont iconic_fanhui"></i>
                    {{$t("wallpaper.wall18")}}
                </li>
                <li class="v6_tab_nav_li cursor">{{$t('user.b99')}}</li>
                <li class="v6_tab_nav_li cursor" @click="onbindEmailClose">
                    <i class="iconfont iconic_guanbi"></i>
                </li>
            </ul>
            <div class="v6_reset_account" style="padding-top: .3rem;">
                <div class="dialog_form">
                    <div class="form_input_box" style="margin-top:0.1rem;" v-show="stepCount == 1">
                        <input v-model="verify_code" class="v6_form_input" type="text" name=""
                               :placeholder="$t('public.share48')">
                        <span class="send_code">
                            <span class="v6_send cursor" @click="sendVerifyCode" v-show="verifyCountDownNum <= 0">{{$t("public.share66")}}</span>
                            <span class="v6_send" v-show="verifyCountDownNum > 0">{{verifyCountDownNum}}</span>
                        </span>
                    </div>
                    <div class="form_input_box" style="margin-top:0.1rem;">
                        <input class="v6_form_input" v-model="email" type="text" name="" :placeholder="$t('public.share3')">
                    </div>
                    <div class="form_input_box" style="margin-top:0.1rem;" v-show="isimgVerification == 1">
                        <input class="v6_form_input" v-model="imgCaptchaCode" type="text" name=""
                               :placeholder="$t('public.share5')">
                        <span class="verificatioPic" @click="onGetCaptcha">
                        <img v-show="imgCaptchaM.img != null" :src="imgCaptchaM.img" alt="" class="img_filter">
                    </span>
                    </div>
                    <div class="form_input_box" style="margin-top:0.1rem;">
                        <input class="v6_form_input" v-model="emailcode" type="text" name=""
                               :placeholder="$t('public.share49')">
                        <span class="send_code">
                        <span class="v6_send cursor" @click="getEmailcode" v-show="emailCountDownNum <= 0">{{$t("public.share66")}}</span>
                        <span class="v6_send" v-show="emailCountDownNum > 0">{{emailCountDownNum}}</span>
                    </span>
                    </div>
                </div>
                <div class="btn_control" style="margin-top: 0.3rem;">
                    <a class="round_btn v6_round_btn" style="padding: .07rem .28rem;" @click="bindEmail">{{$t("public.share8")}}</a>
                </div>
            </div>
        </div>

        <!-- 绑定手机 -->
        <div class="update_avtar_box" v-if="bindPhoneShow" :style="'background:url('+bgimage+') no-repeat'">
            <ul class="v6_tab_nav" style="justify-content: space-between;">
                <li class="v6_tab_nav_li v6_goback cursor" @click="onbindPhoneClose">
                    <i class="iconfont iconic_fanhui"></i>
                    {{$t("wallpaper.wall18")}}
                </li>
                <li class="v6_tab_nav_li cursor">{{$t('user.b100')}}</li>
                <li class="v6_tab_nav_li cursor" @click="onbindPhoneClose">
                    <i class="iconfont iconic_guanbi"></i>
                </li>
            </ul>
            <div class="v6_reset_account" style="padding-top: .6rem;">
                <div class="dialog_form">
                    <div class="form_input_box flex_row_between" style="margin-top:0.15rem;">
                        <div class="v6_select_box" style="width:40%;border: 0.01rem solid #dcdfe6;">
                            <!--<img :src="country_code.ico" alt="" style="margin-left: .1rem;">-->
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
                            <!--<span style="font-size: 14px;display: inline-block;width: 30%;vertical-align: middle;">{{'+' + country_code.code}}</span>-->
                        </div>
                        <div class="form_input_box" style="width:55%">
                            <input v-model="phone" class="v6_form_input" type="text" name=""
                                   :placeholder="$t('public.share2')">
                        </div>
                    </div>
                    <div class="form_input_box" style="margin-top:0.1rem;" v-show="isimgVerification == 1">
                        <input class="v6_form_input" v-model="imgCaptchaCode" type="text" name=""
                               :placeholder="$t('public.share5')">
                        <span class="verificatioPic" @click="onGetCaptcha">
                        <img v-show="imgCaptchaM.img != null" :src="imgCaptchaM.img" alt="" class="img_filter">
                    </span>
                    </div>
                    <div class="form_input_box" style="margin-top:0.15rem;">
                        <input class="v6_form_input" v-model="smscode" type="text" name="" :placeholder="$t('public.share4')">
                        <span class="send_code">
                        <span class="v6_send cursor" v-show="smsCountDownNum <= 0" @click="getSmscode(0)">{{$t("public.share6")}}</span>
                        <span style="margin: 0 0.05rem" v-show="smsCountDownNum <= 0 && is_show_call">|</span>
                        <span class="v6_send cursor" v-show="smsCountDownNum <= 0 && is_show_call" @click="getSmscode(1)">{{$t("public.share7")}}</span>
                        <span class="v6_send" v-show="smsCountDownNum > 0">{{smsCountDownNum}}</span>
                    </span>
                    </div>
                </div>
                <div class="btn_control" style="margin-top: 0.4rem;">
                    <a class="round_btn v6_round_btn" style="padding: .07rem .28rem;" @click="bindPhone">{{$t("public.share8")}}</a>
                </div>
            </div>
        </div>

        <!-- 修改手机号 -->
        <div class="update_avtar_box" v-if="resetPhoneShow" :style="'background:url('+bgimage+') no-repeat'">
            <ul class="v6_tab_nav" style="justify-content: space-between;">
                <li class="v6_tab_nav_li v6_goback cursor" @click="onResetPhoneClose">
                    <i class="iconfont iconic_fanhui"></i>
                    {{$t("wallpaper.wall18")}}
                </li>
                <li class="v6_tab_nav_li cursor">{{$t('user.b101')}}</li>
                <li class="v6_tab_nav_li cursor" @click="onResetPhoneClose">
                    <i class="iconfont iconic_guanbi"></i>
                </li>
            </ul>
            <div class="v6_reset_account">
                <ul class="flex_row_center" style="margin-top: .29rem;">
                    <li class="v6_step_box">
                        <p class="v6_step_count" :class="{'v6_step_count_active': stepCount >= 1}">1</p>
                        <p class="v6_step_msg" :class="{'step_msg_active': stepCount >= 1}">{{$t("user.b30")}}</p>
                    </li>
                    <li class="v6_step_line"  :class="{'v6_step_line_active': stepCount >= 2}"></li>
                    <li class="v6_step_box">
                        <p class="v6_step_count" :class="{'v6_step_count_active': stepCount >= 2}">2</p>
                        <p class="v6_step_msg" :class="{'step_msg_active': stepCount >= 2}">{{$t("user.b31")}}</p>
                    </li>
                    <li class="v6_step_line" :class="{'v6_step_line_active': stepCount >= 3}"></li>
                    <li class="v6_step_box">
                        <p class="v6_step_count" :class="{'v6_step_count_active': stepCount >= 3}">3</p>
                        <p class="v6_step_msg" :class="{'step_msg_active': stepCount >= 3}">{{$t("user.b32")}}</p>
                    </li>
                </ul>
                <div class="dialog_form" :class="{'v6_resetbox_top': isimgVerification != 1 || stepCount != 2}" style="margin-top: .3rem;height: 1.4rem;">
                    <p style="text-align:left;" v-show="stepCount == 1">{{$t("user.b57")}}{{'+' +
                        userinfo.country_code + userinfo.mobile}}</p>
                    <div class="form_input_box flex_row_between" style="margin-top:0.15rem;" v-show="stepCount == 2">
                        <div class="v6_select_box">
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
                            <!--<span style="font-size: 14px;display: inline-block;width: 30%;vertical-align: middle;">{{'+' + country_code.code}}</span>-->
                        </div>
                        <div class="form_input_box" style="width:60%">
                            <input v-model="phone" class="v6_form_input" type="text" name="" :placeholder="$t('user.b55')">
                        </div>
                    </div>
                    <div class="form_input_box" style="margin-top:0.1rem;" v-show="stepCount == 1">
                        <input v-model="verify_code" class="v6_form_input" type="text" name=""
                               :placeholder="$t('public.share4')">
                        <span class="send_code">
                            <span class="v6_send cursor" @click="sendVerifyCode" v-show="verifyCountDownNum <= 0">{{$t("public.share66")}}</span>
                            <span class="v6_send" v-show="verifyCountDownNum > 0">{{verifyCountDownNum}}</span>
                        </span>
                    </div>
                    <div class="form_input_box" style="margin-top:0.15rem;" v-show="isimgVerification == 1 && stepCount == 2">
                        <input class="v6_form_input" type="text" v-model="imgCaptchaCode" name=""
                               :placeholder="$t('public.share5')">
                        <span class="verificatioPic" @click="onGetCaptcha">
                        <img :src="imgCaptchaM.img" alt="" v-show="imgCaptchaM.img != null" class="img_filter">
                    </span>
                    </div>
                    <div class="form_input_box" style="margin-top:0.1rem;" v-show="stepCount == 2">
                        <input v-model="smscode" class="v6_form_input" type="text" name="" :placeholder="$t('public.share4')">
                        <span class="send_code">
                        <span class="v6_send cursor" @click="getSmscode(0)" v-show="smsCountDownNum <= 0">{{$t("public.share6")}}</span>
                        <span v-show="smsCountDownNum <= 0 && is_show_call" style="margin: 0 0.05rem;">|</span>
                        <span class="v6_send cursor" v-show="smsCountDownNum <= 0 && is_show_call" @click="getSmscode(1)">{{$t("public.share7")}}</span>
                        <span class="v6_send" v-show="smsCountDownNum > 0">{{smsCountDownNum}}</span>
                    </span>
                    </div>
                    <div v-show="stepCount == 3">
                        <div class="dialog_tip_img" style="width:.64rem;height: .64rem;">
                            <img class="img_filter" src="../images/success_icon.png" alt="">
                        </div>
                        <p class="v6_dialog_msg">{{$t("user.b33") + $t("user.b34")}}</p>
                    </div>
                </div>
                <div style="text-align: center;">
                    <a class="round_btn v6_round_btn" v-if="stepCount == 1" style="padding: .07rem .28rem;margin-top: .2rem;" @click="oVerifyCodeValidate">{{$t("user.b58")}}</a>
                    <a class="round_white_btn v6_white_btn" v-if="stepCount == 2" style="margin-right:0.2rem;padding: .07rem .28rem;margin-top: .2rem;line-height: unset;" @click="goPreviousStep">{{$t("user.b59")}}</a>
                    <a class="round_btn v6_round_btn" v-if="stepCount == 2" style="padding: .07rem .28rem;margin-top: .2rem;" @click="onModifyPhone">{{$t("user.b60")}}</a>
                    <a class="round_btn v6_round_btn" v-if="stepCount == 3" style="padding: .07rem .28rem;margin-top: .2rem;" @click="reLoginIn">{{$t("public.share20")}}</a>
                </div>
            </div>
        </div>

        <!-- 修改邮箱 -->
        <div class="update_avtar_box" v-if="resetEmailShow" :style="'background:url('+bgimage+') no-repeat'">
            <ul class="v6_tab_nav" style="justify-content: space-between;">
                <li class="v6_tab_nav_li v6_goback cursor" @click="onResetEmailClose">
                    <i class="iconfont iconic_fanhui"></i>
                    {{$t("wallpaper.wall18")}}
                </li>
                <li class="v6_tab_nav_li cursor">{{$t('user.b102')}}</li>
                <li class="v6_tab_nav_li cursor" @click="onResetEmailClose">
                    <i class="iconfont iconic_guanbi"></i>
                </li>
            </ul>
            <div class="v6_reset_account">
                <ul class="flex_row_center" style="margin-top: .29rem;">
                    <li class="v6_step_box">
                        <p class="v6_step_count" :class="{'v6_step_count_active': stepCount >= 1}">1</p>
                        <p class="v6_step_msg" :class="{'step_msg_active': stepCount >= 1}">{{$t("user.b53")}}</p>
                    </li>
                    <li class="v6_step_line"  :class="{'v6_step_line_active': stepCount >= 2}"></li>
                    <li class="v6_step_box">
                        <p class="v6_step_count" :class="{'v6_step_count_active': stepCount >= 2}">2</p>
                        <p class="v6_step_msg" :class="{'step_msg_active': stepCount >= 2}">{{$t("user.b54")}}</p>
                    </li>
                    <li class="v6_step_line" :class="{'v6_step_line_active': stepCount >= 3}"></li>
                    <li class="v6_step_box">
                        <p class="v6_step_count" :class="{'v6_step_count_active': stepCount >= 3}">3</p>
                        <p class="v6_step_msg" :class="{'step_msg_active': stepCount >= 3}">{{$t("user.b32")}}</p>
                    </li>
                </ul>
                <div class="dialog_form" :class="{'v6_resetbox_top': isimgVerification != 1 || stepCount != 2}" style="margin-top: .3rem;height: 1.4rem;">
                    <p style="text-align:left;" v-show="stepCount == 1">
                        {{$t("user.b57")}}{{userinfo.email}}</p>
                    <div class="form_input_box flex_row_between" style="margin-top:0.1rem;" v-show="stepCount == 2">
                        <div class="form_input_box">
                            <input v-model="email" class="v6_form_input" type="text" name="" :placeholder="$t('user.b56')">
                        </div>
                    </div>
                    <div class="form_input_box" style="margin-top:0.1rem;" v-show="stepCount == 1">
                        <input class="v6_form_input" v-model="verify_code" type="text" name=""
                               :placeholder="$t('public.share4')">
                        <span class="send_code">
                        <span class="v6_send cursor" @click="sendVerifyCode" v-show="verifyCountDownNum <= 0">{{$t("public.share66")}}</span>
                        <span class="v6_send" v-show="verifyCountDownNum > 0">{{verifyCountDownNum}}</span>
                    </span>
                    </div>
                    <div class="form_input_box" style="margin-top:0.1rem;" v-show="isimgVerification == 1 && stepCount == 2">
                        <input class="v6_form_input" v-model="imgCaptchaCode" type="text" name=""
                               :placeholder="$t('public.share5')">
                        <span class="verificatioPic" @click="onGetCaptcha">
                        <img :src="imgCaptchaM.img" alt="" v-show="imgCaptchaM.img != null" class="img_filter">
                    </span>
                    </div>
                    <div class="form_input_box" style="margin-top:0.1rem;" v-show="stepCount == 2">
                        <input v-model="emailcode" class="v6_form_input" type="text" name=""
                               :placeholder="$t('public.share4')">
                        <span class="send_code">
                        <span class="v6_send cursor" @click="getEmailcode" v-show="emailCountDownNum <= 0">{{$t("public.share66")}}</span>
                        <span class="v6_send" v-show="emailCountDownNum > 0">{{emailCountDownNum}}</span>
                    </span>
                    </div>
                    <div v-show="stepCount == 3">
                        <div class="dialog_tip_img" style="width:.64rem;height: .64rem;">
                            <img class="img_filter" src="../images/success_icon.png" alt="">
                        </div>
                        <p class="v6_dialog_msg">{{$t("user.b33") + $t("user.b34")}}</p>
                    </div>
                </div>
                <div style="text-align: center;">
                    <a class="round_btn v6_round_btn" v-if="stepCount == 1" style="padding: .07rem .28rem;margin-top: .2rem;" @click="oVerifyCodeValidate">{{$t("user.b58")}}</a>
                    <a class="round_white_btn v6_white_btn" v-if="stepCount == 2" style="margin-right:0.2rem;padding: .07rem .28rem;margin-top: .2rem;line-height: unset;" @click="goPreviousStep">{{$t("user.b59")}}</a>
                    <a class="round_btn v6_round_btn" v-if="stepCount == 2" style="padding: .07rem .28rem;margin-top: .2rem;" @click="onModifyEmail">{{$t("user.b60")}}</a>
                    <a class="round_btn v6_round_btn" v-if="stepCount == 3" style="padding: .07rem .28rem;margin-top: .2rem;" @click="reLoginIn">{{$t("public.share20")}}</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Prop} from "vue-property-decorator";
    import CheckUtil from '@/ts/utils/CheckUtil';
    import {TipsMsgUtil} from '@/ts/utils/TipsMsgUtil';
    import {NewResetpwdRequestModel, UserInfo} from '@/ts/models/UserModel';
    import {Md5} from "ts-md5";
    import LocalStorageUtil from '@/ts/utils/LocalStorageUtil';
    import {Toast} from "vant";
    import { Dialog, Select, Option, OptionGroup} from 'element-ui';
    import HttpClient from '@/ts/net/HttpClient';
    import Util from '@/ts/utils/Util';
    import {BindingProxy} from '@/ts/proxy/BindingProxy';
    import GlobalConfig from '../global.config';
    import AppParamModel from '@/ts/models/AppModel';
    import { ExtrnalFactory } from '@/ts/factory/ExtrnalFactory';

    Vue.use(Toast);

    @Component({
        components: {
            'el-dialog': Dialog,
            'el-select': Select,
            'el-option': Option,
            'el-option-group': OptionGroup
        }
    })
    export default class UserSafety extends BindingProxy {
        @Prop() public userinfo!: UserInfo;
        @Prop() public bgimage!: string;

        public resetPasswordShow: boolean = false;//修改密码弹窗是否显示
        public bindEmailShow: boolean = false;//绑定邮箱弹窗是否显示
        public bindPhoneShow: boolean = false;//绑定手机弹窗是否显示
        public resetPhoneShow: boolean = false;//修改手机号弹窗是否显示
        public resetEmailShow: boolean = false;//修改邮箱号弹窗是否显示
        public newPassword: string = '';//用户新密码
        public confirmPassword: string = '';//用户确认密码
        public stepCount: number = 1;//修改账号步骤
        public appParam: AppParamModel = AppParamModel.getInstace();
        public is_show_call: boolean = true;//是否显示语音获取验证码按钮

        /**
         * 初始化
         */
        public created() {
            this.setBaseUrl(GlobalConfig.getBaseUrl());
            // this.getAreaCodeList();
            this.getAreaCodeInfoList(GlobalConfig.getWebBaseUrl());
        }

        /**
         * 改变手机区号
         */
        public onSelectCountryCode(value) {
            this.country_code = value;
            this.countryCode = value.code;
        }

        /**
         * 关闭下拉框
         */
        public closeService() {
            this.$emit('closeservice');
        }

        /**
         * 打开绑定账号弹窗
         */
        public bindAccountShow(){
            let region_code = LocalStorageUtil.getRegionCodes();
            if(region_code == 1 && this.userinfo.email == ''){
                this.onbindPhoneShow();
            }else if(region_code == 0 && this.userinfo.mobile == ''){
                this.onbindEmailShow();
            }
        }

        /**
         * 打开修改密码弹窗
         */
        public onResetPasswordShow() {
            this.resetPasswordShow = true;
        }

        /**
         * 打开绑定邮箱弹窗
         */
        public onbindEmailShow() {
            this.onChangeRegisterType(6);
            this.bindEmailShow = true;
        }

        /**
         * 打开绑定手机弹窗
         */
        public onbindPhoneShow() {
            this.onChangeRegisterType(7);
            this.bindPhoneShow = true;
        }

        /**
         * 打开修改邮箱弹窗
         */
        public onResetEmailShow() {
            this.resetEmailShow = true;
        }

        /**
         * 打开修改手机弹窗
         */
        public onResetPhoneShow() {
            this.resetPhoneShow = true;
        }

        /**
         * 发送验证码
         */
        public sendVerifyCode() {
            this.$emit('sendverifycode');
        }

        /**
         * 发送验证码成功
         */
        public sendVerifySuccessBack(data: any) {
            this.verify_key = data.data.verify_key;
            let msg = "";
            this.newPassword = '';
            this.confirmPassword = '';
            if (data.data.code_type == 1) {
                msg = TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_SMS);
            } else if (data.data.code_type == 2) {
                msg = TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_EMAIL);
            }
            Toast.success(msg);
            //倒计时
            this.verifyCountDownNum = 60;
            const sefl = this;
            Util.countDown(this.verifyCountDownNum, 1, (n: number) => {
                sefl.verifyCountDownNum = n;
            });
        }

        /**
         * 获取邮箱验证码
         */
        public getEmailcode() {
            //验证邮箱格式
            if (!CheckUtil.checkEmail(this.email)) {
                if (this.email == "") {
                    Toast.fail(TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_EMAIL_EMPTY));
                    return;
                }
                Toast.fail(TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_EMAIL_ERROR));
                return;
            }
            this.onGetEmailcode(2);
        }

        /**
         * 获取邮箱验证码成功
         */
        public onGetEmailcodeSuccess() {
            Toast.success(TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_EMAIL));
            //倒计时
            this.emailCountDownNum = 60;
            const sefl = this;
            Util.countDown(this.emailCountDownNum, 1, (n: number) => {
                sefl.emailCountDownNum = n;
            });
        }

        /**
         * 获取邮箱验证码失败
         */
        public onGetEmailcodeFaild(data: any) {
            Toast.fail(data.msg);
        }

        /**
         * 获取手机验证码
         */
        public getSmscode(type: number) {
            //验手机格式
            if (this.countryCode == '86') {
                if (!CheckUtil.checkPhone(this.phone)) {
                    if (this.phone == "") {
                        Toast.fail(TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_PHONE_EMPTY));
                        return;
                    }
                    Toast.fail(TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_PHONE_ERROR));
                    return;
                }
            }

            this.onGetSmscode(type, 2);
        }

        /**
         * 获取短信验证码成功
         */
        public onGetSmscodeSuccess() {
            Toast.success(TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_SMS));
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
            Toast.fail(data.msg);
        }

        /**
         * 关闭修改密码弹窗
         */
        public onResetPasswordClose() {
            this.resetPasswordShow = false;
            this.newPassword = "";
            this.confirmPassword = "";
            this.verify_code = "";
        }

        /**
         * 关闭绑定邮箱弹窗
         */
        public onbindEmailClose() {
            this.bindEmailShow = false;
            this.email = "";
            this.emailcode = "";
            this.imgCaptchaCode = '';
            this.verify_code = '';
        }

        /**
         * 关闭绑定手机弹窗
         */
        public onbindPhoneClose() {
            this.bindPhoneShow = false;
            this.phone = "";
            this.smscode = "";
            this.imgCaptchaCode = '';
        }

        /**
         * 关闭修改手机弹窗
         */
        public onResetPhoneClose() {
            this.resetPhoneShow = false;
            this.phone = "";
            this.smscode = "";
            this.verify_code = "";
            this.stepCount = 1;
            this.imgCaptchaCode = '';
        }

        /**
         * 关闭修改邮箱弹窗
         */
        public onResetEmailClose() {
            this.resetEmailShow = false;
            this.email = "";
            this.emailcode = "";
            this.verify_code = "";
            this.stepCount = 1;
            this.imgCaptchaCode = '';
        }

        /**
         * 修改登录密码
         */
        public resetPassword() {
            let flag = true;
            let tipMsg = '';
            //验证验证码格式
            if (!CheckUtil.checkSmscode(this.verify_code) && flag) {
                tipMsg = TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_EMPTY_ERROR);
                flag = false;
                if (this.newPassword == "") {
                    tipMsg = TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_EMPTY_ERROR);
                    flag = false;
                }
            }
            //验证新密码
            if (!CheckUtil.checkPwd(this.newPassword) && flag) {
                tipMsg = TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_PASSWORD_ERROR);
                flag = false;
                if (this.newPassword == "") {
                    tipMsg = TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_PASSWORD_EMPTY);
                    flag = false;
                }
            }
            //验证确认密码
            if (!CheckUtil.checkPwdTwo(this.confirmPassword, this.newPassword) && flag) {
                tipMsg = TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_PASSWORDTWO_ERROR);
                flag = false;
                if (this.confirmPassword == "") {
                    tipMsg = TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_PASSWORD_EMPTY);
                    flag = false;
                }
            }
            if (!flag) {
                Toast.fail(tipMsg);
                return;
            }
            const token = LocalStorageUtil.getUserToken().account_token;
            let param = new NewResetpwdRequestModel();
            param.account_token = token;
            param.verify_key = this.verify_key;
            param.verify_code = this.verify_code;
            param.new_password = Md5.hashStr(this.newPassword).toString();
            param.new_password_confirmation = Md5.hashStr(
                this.confirmPassword
            ).toString();

            this.$emit('resetpassword', param);
        }

        /**
         * 修改密码结果ui处理
         */
        public resetPwdBack(data: any) {
            this.newPassword = "";
            this.confirmPassword = "";
            this.verify_code = "";
            this.resetPasswordShow = false;
            Toast.success(TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_RESETPWD_SUCCESS));
        }

        /**
         * 修改密码失败结果ui处理
         */
        public resetPwdFaild(data: any) {
            this.newPassword = "";
            this.confirmPassword = "";
            this.verify_code = "";
            this.resetPasswordShow = false;
            Toast.fail(data.msg);
        }

        /**
         * 绑定邮箱成功ui逻辑
         */
        public bindEmailSuccess() {
            this.userinfo.email = this.email;
            this.email = '';
            this.emailcode = '';
            this.imgCaptchaCode = '';
            this.bindEmailShow = false;
            this.verify_code = '';
            Toast.success(TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_BINDING_EMAIL));
        }

        /**
         * 绑定邮箱失败ui逻辑
         * todo 此方法需在UI逻辑文件中重写
         */
        public bindEmailFaild(data: any) {
            Toast.fail(data.msg);
        }

        /**
         * 绑定手机成功ui逻辑
         */
        public bindPhoneSuccess() {
            this.userinfo.mobile = this.phone;
            this.phone = '';
            this.smscode = '';
            this.imgCaptchaCode = '';
            this.bindPhoneShow = false;
            Toast.success(TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_BINDING_MOBILE));
        }

        /**
         * 绑定手机失败ui逻辑
         */
        public bindPhoneFaild(data: any) {
            Toast.fail(data.msg);
        }

        /**
         * 验证修改账号第一步验证码
         */
        public oVerifyCodeValidate() {
            if(!CheckUtil.checkSmscode(this.verify_code) || this.verify_code == '') {
                Toast.fail(TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_EMPTY_ERROR));
                return;
            }
            this.verifyCodeValidate()
        }

        /**
         * 验证验证码成功ui逻辑
         * todo 此方法需在UI逻辑文件中重写
         */
        public verifyCodeValidateSuccess() {
            this.stepCount = 2;
            if (this.userinfo.master_account == 0) {
                this.onChangeRegisterType(0)
            } else if (this.userinfo.master_account == 1) {
                this.onChangeRegisterType(1)
            }

        }

        /**
         * 验证验证码失败ui逻辑
         * todo 此方法需在UI逻辑文件中重写
         */
        public verifyCodeValidateFaild(data: any) {
            Toast.fail(data.msg);
        }

        /**
         * 返回上一步
         */
        public goPreviousStep() {
            this.stepCount = 1;
        }

        /**
         * 重新登录
         */
        public reLoginIn(){
            const factory = ExtrnalFactory.getInstance().getFactory(this.appParam.platform);
            if(this.userinfo.master_account == 0){
                factory.reLoginIn(this.userinfo.master_account,this.phone);
            } else if(this.userinfo.master_account == 1) {
                factory.reLoginIn(this.userinfo.master_account,this.email);
            }
        }

        /**
         * 解绑邮箱成功ui逻辑
         */
        public unbindEmailSuccess() {
            this.userinfo.email = '';
            Toast.success(TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_EMAIL_UNBIND));
            // this.$emit('refreshuserinfo')
        }

        /**
         * 解绑邮箱失败ui逻辑
         */
        public unbindEmailFaild(data: any) {
            Toast.fail(data.msg);
        }

        /**
         * 解绑手机号成功ui逻辑
         */
        public unbindPhoneSuccess() {
            this.userinfo.mobile = '';
            Toast.success(TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_PHONE_UNBIND));
            // this.$emit('refreshuserinfo')
        }

        /**
         * 解绑手机号失败ui逻辑
         */
        public unbindPhoneFaild(data: any) {
            Toast.fail(data.msg);
        }

        /**
         * 修改邮箱账号成功ui逻辑
         * todo 此方法需在UI逻辑文件中重写
         */
        public onModifyEmailSuccess() {
            this.$emit('refreshuserinfo');
            this.stepCount = 3;
        }

        /**
         * 修改邮箱账号失败ui逻辑
         * todo 此方法需在UI逻辑文件中重写
         */
        public onModifyEmailFaild(data: any) {
            Toast.fail(data.msg);
        }

        /**
         * 修改手机账号成功ui逻辑
         * todo 此方法需在UI逻辑文件中重写
         */
        public onModifyPhoneSuccess() {
            this.$emit('refreshuserinfo');
            this.stepCount = 3;
        }

        /**
         * 修改手机账号失败ui逻辑
         * todo 此方法需在UI逻辑文件中重写
         */
        public onModifyPhoneFaild(data: any) {
            Toast.fail(data.msg);
        }

        /**
         * token过期处理
         * @param param
         */
        public tokenExpired(param: string = ''): void {
            const factory = ExtrnalFactory.getInstance().getFactory(this.appParam.platform);
            factory.loginExpire();
        }
    }
</script>


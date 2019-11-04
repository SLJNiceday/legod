<template>
    <div class="login_app">
        <div class="mui-content regBox newregBox"  v-show="isshowLogin">
            <van-tabs type="card" color="#6F839B" :swipeable=true animated @change="changeLoginType">
                <van-tab title="手机">
                    <form class="mui-input-group nobg">
                        <div class="login">
                            <div class="mui-input-row login_user">

                                <div @click="changeAreaCode" class="leigod_flex_left areaCode" style="width:110px;">
                                    <img :src="country.ico" alt="">
                                    +<span v-text="country.code"></span>
                                    <img src="../../images/weixinjt.png" width="18" alt="">
                                </div>

                                <input type="text" class="mui-input-clear" name="mini_username" placeholder="请输入手机号"
                                       v-model="phone"/>
                            </div>
                            <div class="mui-input-row login_user mui-password">
                                <input type="password" class="leigod_pl15" name="mini_password" placeholder="请输入密码"
                                       v-model="phonePassword"
                                       @input="passwordInput(0)"/>
                            </div>
                        </div>
                    </form>
                </van-tab>
                <van-tab title="邮箱/账号">
                    <form class="mui-input-group nobg">
                        <div class="login">
                            <div class="mui-input-row login_user">
                                <input type="text" class="mui-input-clear" name="mini_username" placeholder="请输入邮箱或账号"
                                       v-model="email"/>
                            </div>
                            <div class="mui-input-row login_user mui-password">
                                <input type="password" class="mui-input-password" name="mini_password"
                                       placeholder="请输入密码" v-model="emailPassword"
                                       @input="passwordInput(1)"/>
                            </div>
                        </div>
                    </form>
                </van-tab>
            </van-tabs>

            <div class="login_forget leigod_flex_between" v-show="platform==4">
                <van-checkbox v-model="bangding" class="leigod_ml5">绑定微信账号</van-checkbox>
                <a @click="goForgetPwd" class=" login_forget_link">忘记密码</a>
            </div>

            <button class="btn login_btn" type="button" @click="onLogin">登录</button>

            <div>
                <a @click="goRegister" class="login_reg_link">没有雷神账号? 立即注册</a>
                <a @click="goForgetPwd" class="login_reg_link" v-show="platform!=4">忘记密码</a>
            </div>
        </div>
        <div class="mui-content regBox newregBox"v-show="!isshowLogin">
            <van-tabs type="card" color="#6F839B"  :swipeable=true animated @change="changeLoginType">
                <van-tab title="绑定手机号">
                    <form class="mui-input-group nobg">
                        <div class="login">
                            <div class="mui-input-row login_user">

                                <div @click="changeAreaCode" class="leigod_flex_left areaCode" style="width:110px;">
                                    <img :src="country.ico" alt="">
                                    +<span v-text="country.code"></span>
                                    <img src="../../images/weixinjt.png" width="18" alt="">
                                </div>

                                <input type="text" class="mui-input-clear" name="mini_username" placeholder="请输入手机号" v-model="phone"/>
                            </div>
                            <div>
                                <div class="mui-input-row login_user leigod_flex_between" v-show="isimgVerification">
                                    <div style="width:70%;">
                                        <input type="text" class="txyzm_input" v-model="imgCaptchaCode" placeholder="图形验证码">
                                    </div>
                                    <img alt="雷神加速器" @click="onGetCaptcha" :src="imgCaptchaM.img" width="78" class="txyzm" />
                                </div>

                                <div class="mui-input-row login_user leigod_flex_between" v-show="!voiceShow">
                                    <div style="width:60%;">
                                        <input type="text" v-model="smscode" class="txyzm_input" placeholder="短信验证码">
                                    </div>
                                    <a class="get_dxyzm" :style="{marginRright:(smsCountDownNum > 0?'0.5rem':'0px')}" @click="getSmscode(0)" v-show="smsCountDownNum <= 0">发送短信</a>
                                    <a class="get_dxyzm" style="color:#999;margin-right:0;" v-show="smsCountDownNum > 0">已发送{{smsCountDownNum}}s</a>
                                </div>

                                <div class="mui-input-row login_user leigod_flex_between" v-show="voiceShow">
                                    <div style="width:60%;">
                                        <input type="text" v-model="smscode" class="txyzm_input" placeholder="短信验证码">
                                    </div>

                                    <div v-show="smsCountDownNum <= 0" class="leigod_flex">
                                        <a class="get_dxyzm" @click="getSmscode(0)">发短信</a>
                                        <div>|</div>
                                        <a class="get_dxyzm leigod_ml5" @click="getSmscode(1)">发语音</a>
                                    </div>
                                    <a class="get_dxyzm" style="color:#999;" v-show="smsCountDownNum > 0">已发送{{smsCountDownNum}}s</a>
                                </div>
                            </div>

                        </div>
                    </form>
                </van-tab>
            </van-tabs>
            <button class="btn login_btn" type="button" @click="bindPhone">绑定手机号</button>
        </div>
        <van-popup v-model="AreaCodeshow" position="right" style="width: 100%;height: 100%;">
            <country-item ref="country_item" :countrycodelist="countrycodelist"
                          @getcountry="getcountry"></country-item>
        </van-popup>
        <!-- loading -->
        <load :isloading="isLoading"></load>
    </div>
</template>

<script lang="ts" src="./LoginDialog.ts">
</script>

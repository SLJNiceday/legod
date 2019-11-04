<template>
    <div>
        <div class="reset_userinfo flex_row_between" style="align-items: flex-start;padding-top: .2rem;">
            <div class="reset_userinfo_left" style="width: 52%;padding-left: .4rem;box-sizing: border-box;">
                <div class="avatar_name flex_row_start" style="align-items: center;">
                    <div @mouseover="avatar_shadow_show = true" @mouseout="avatar_shadow_show = false" style="cursor: pointer;margin-right: .15rem;">
                        <img :src="userinfo.avatar_new" alt="" style="width: .8rem;height: .8rem;border-radius: .8rem;" v-if="!avatar_shadow_show">
                        <img src="../images/huantouxiang@2x.png" alt="" @click="openAvatar" v-if="avatar_shadow_show" style="width: .8rem;height: .8rem;border-radius: .8rem;">
                    </div>
                    <div class="flex_column_start" style="align-items: flex-start">
                        <div style="line-height: .27rem;">
                            <span style="font-size: .18rem;font-weight:600;color: #333;display: inline-block;vertical-align: middle;max-width: 1.2rem;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;" v-if="!show_reset_nickname">{{nickname}}</span>
                            <input type="text" class="form_input" maxlength="16" v-myfocus @keyup.enter="resetUserinfo('')" @input="onResetInfo" @blur="show_reset_nickname = false" v-model="nickname" style="width: 80%;" v-if="show_reset_nickname">
                            <i class="iconfont iconic_bianji" @click="showResetNickname" v-if="!show_reset_nickname"></i>
                        </div>
                        <div style="margin-top: .05rem;">
                            <img src="../images/v6_svip.jpg" v-if="userinfo.is_pay_user == 1" alt="" style="width: .39rem;height: .17rem;">
                            <span style="display: inline-block;vertical-align: middle;color: #999;font-size: .14rem;" v-if="userinfo.is_pay_user == 0">{{$t("user.b144")}}</span>
                            <a class="round_btn v6_round_btn" style="font-size: .12rem;margin-left: .05rem;color: #333;" v-if="userinfo.is_pay_user == 0" @click="goRecharge">{{$t("user.b145")}}</a>
                        </div>
                    </div>
                </div>
                <div style="margin-top: .2rem;color: #666;">
                    <span style="font-size: .12rem;display: inline-block;vertical-align: middle;">{{$t("user.b61") + user_hour}}/10000{{$t("user.b147")}}</span>
                    <span></span>
                    <a class="v6_add_time" @click="goRecharge">{{$t("user.b143")}}</a>
                    <div style="margin-top: .05rem;">
                        <el-progress :stroke-width="10" :percentage="progress_num" :show-text="false"></el-progress>
                    </div>
                </div>
                <p style="margin-top: .2rem;color: #666;font-size: .14rem;">
                    <span>{{$t("user.b146")}}:</span>
                    <img v-show="myAppStatus.paper == 1" src="../images/v6_paper_on.png" style="width: .25rem;margin-left: 0.05rem;" alt="">
                    <img v-show="myAppStatus.paper == 0" src="../images/v6_paper_off.png" style="width: .25rem;margin-left: 0.05rem;" alt="">
                    <img v-show="myAppStatus.nnVoice == 1" src="../images/nn_voice_on.png" style="width: .25rem;margin-left: 0.05rem;" alt="">
                    <img v-show="myAppStatus.nnVoice == 0" src="../images/nn_voice_off.png" style="width: .25rem;margin-left: 0.05rem;" alt="">
                    <img v-show="myAppStatus.nnServer == 1" src="../images/nn_server_on.png" style="width: .25rem;margin-left: 0.05rem;" alt="">
                    <img v-show="myAppStatus.nnServer == 0" src="../images/nn_server_off.png" style="width: .25rem;margin-left: 0.05rem;" alt="">
                </p>
            </div>
            <div class="form_box flex_column_around" style="width:40%;padding: 0 .4rem 0 0;">
                <!--账号-->
                <div class="form_item flex_row_start" style="margin-top:0;">
                    <span class="v6_form_title" style="color: #666;">{{$t("user.b11")}}</span>
                    <div class="form_input_box" style="line-height: .3rem;height: .3rem;">
                        <!--<input v-model="nickname" class="form_input" maxlength="20" type="text" name=""-->
                               <!--@change="onResetInfo">-->
                        {{userinfo.mobile || userinfo.email}}
                    </div>
                </div>
                <!--性别-->
                <div class="form_item flex_row_start" style="margin-top: .2rem;">
                    <span class="v6_form_title" style="color: #666;">{{$t("user.b12")}}</span>
                    <div class="form_input_box flex_row_start">
                        <el-select v-model="sex" @change="onResetInfo" :placeholder="$t('public.share25')">
                            <el-option :label="$t('user.b13')" value="1"></el-option>
                            <el-option :label="$t('user.b14')" value="2"></el-option>
                        </el-select>
                        <!--<input type="radio" id="man" v-model="sex" name="sex" value="1" @change="onResetInfo">-->
                        <!--<label for="man">{{$t("user.b13")}}</label>-->
                        <!--<input type="radio" id="woman" v-model="sex" name="sex" value="2" style="margin-left:0.2rem;"-->
                               <!--@change="onResetInfo">-->
                        <!--<label for="woman">{{$t("user.b14")}}</label>-->
                    </div>
                </div>
                <!--年龄-->
                <div class="form_item flex_row_start" style="margin-top: .2rem;">
                    <span class="v6_form_title" style="color: #666;">{{$t("user.b15")}}</span>
                    <div class="form_input_box" style="height: auto;">
                        <el-date-picker v-model="bornDate" type="date" popper-class="v6_llzDatePicker" :placeholder="$t('user.b76')"
                                        @change="onResetInfo"  :picker-options="pickerOption"></el-date-picker>
                    </div>
                </div>
                <!--地址-->
                <div class="form_item flex_row_start" style="margin-top: .2rem;">
                    <span class="v6_form_title" style="color: #666;">{{$t("user.b16")}}</span>
                    <div class="form_input_box" style="height: 0.3rem;">
                        <input v-show="address.trim()!=''" v-model="address" class="v6_form_input" style="height: 0.3rem;" maxlength="25" type="text" name=""
                               @change="onResetInfo">
                        <provice-com v-show="address.trim()==''" :type="2" @getlabel="getAdress"></provice-com>
                    </div>
                </div>
            </div>
            <!--头像上传部分-->
            <div class="update_avtar_box" v-if="avatar_box_show" :style="'background:url('+bgimage+') no-repeat'">
                <ul class="v6_tab_nav" style="justify-content: space-between">
                    <li class="v6_tab_nav_li v6_goback cursor" @click="closeAvatar">
                        <i class="iconfont iconic_fanhui"></i>
                        {{$t("wallpaper.wall18")}}
                    </li>
                    <li>
                        <ul class="flex_row_center">
                            <li class="v6_tab_nav_li cursor" :class="{'v6_tab_nav_li_active':updateTypeIndex == 0}"
                                @click="chooseUpdateType(0)">{{$t("user.b17")}}
                            </li>
                            <li class="v6_tab_nav_li cursor" :class="{'v6_tab_nav_li_active':updateTypeIndex == 1}"
                                @click="chooseUpdateType(1)">{{$t("user.b18")}}
                            </li>
                        </ul>
                    </li>
                    <li class="v6_tab_nav_li cursor" @click="closeAvatar">
                        <i class="iconfont iconic_guanbi"></i>
                    </li>
                </ul>
                <div class="flex_row_between">
                    <div style="width: 50%;" class="flex_column_center">
                        <div class="v6_update_type_upload" v-if="updateTypeIndex == 0" @mouseover="cameraShow = !cameraShow"
                         @mouseout="cameraShow = !cameraShow">
                            <vue-cropper style="width: 2.56rem;height: 2.56rem;" ref="cropper" v-if="option.img != ''"
                                         :img="option.img" :info="false" :fixedBox="!fixedBox" :high="true"
                                         :original="false" :canScale="false"
                                         :autoCrop="true" :full="true" :fixed="true" :autoCropWidth="256"
                                         :autoCropHeight="256">
                            </vue-cropper>
                            <img v-show="option.img == ''" :src="userinfo.avatar"
                             onerror="javascript:this.src='./images/default_avatar.png'" class="img_filter"/>
                            <div v-show="cameraShow && !userChoose"
                                 style="position:absolute;left:0;top:0;right:0;bottom:0;cursor:pointer;">
                                <img src="../images/huantouxiang@2x.png" alt="" class="img_filter">
                                <input class="update_input" @change="onChooseImage" ref="imageUpInput"
                                       type="file" accept="image/*">
                            </div>
                        </div>
                        <div class="flex_row_between" v-if="userChoose && updateTypeIndex == 0" style="width: 2.56rem;">
                            <div class="v6_upload_btn">
                                {{$t("user.b20")}}
                                <input class="update_input" @change="onChooseImage" ref="imageUpInput" id="imageUpBtn"
                                       type="file" accept="image/*">
                            </div>
                            <div class="v6_scale_btn">
                                <span class="v6_suoxiao_icon" style="margin-right:0.05rem;" @click="scaleSmall"></span>
                                <span class="v6_fangda_icon" @click="scaleBig"></span>
                            </div>
                        </div>
                        <ul class="v6_update_type_preview flex_row_start" v-if="updateTypeIndex == 1"
                            style="flex-wrap: wrap;align-items: flex-start;align-content: start;">
                            <li class="v6_preview_img" v-for="(item,index) in imgUrlList" :key="index">
                                <img :src="item" class="img_filter" @click="chooseImage(item)">
                            </li>
                        </ul>
                    </div>
                    <!--图像预览部分-->
                    <div class="v6_avtar_preview">
                        <p style="padding-left: .7rem;margin-bottom: .15rem;margin-top: .5rem;">{{$t("user.b19")}}</p>
                        <div class="flex_row_center" style="align-items: flex-start">
                            <div>
                                <p style="text-align: center;margin-bottom: .05rem;font-size: .12rem;color: #666666;">80*80</p>
                                <img :src="previewImg" onerror="javascript:this.src='./images/default_avatar.png'" alt=""
                                     class="img_filter" style="width: .8rem;height: .8rem;border-radius: 1rem;">
                            </div>
                            <div style="margin-left: .22rem;">
                                <p style="text-align: center;margin-bottom: .05rem;font-size: .12rem;color: #666666;">60*60</p>
                                <img :src="previewImg" onerror="javascript:this.src='./images/default_avatar.png'" alt=""
                                     class="img_filter" style="width: .6rem;height: .6rem;border-radius: 1rem;">
                            </div>
                        </div>
                        <div style="text-align: center;margin-top: .8rem;">
                            <a class="round_btn v6_round_btn" style="margin-right: 0.2rem;padding: .06rem .35rem;font-size: .14rem;" @click="saveImage">{{$t("public.share14")}}</a>
                            <a class="round_white_btn v6_white_btn" style="padding: .06rem .35rem;font-size: .14rem;border:none;line-height: unset;" @click="closeAvatar">{{$t("public.share13")}}</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!--保存和取消按钮-->
        <div class="btn_control" style="margin-top: .3rem;">
            <a class="round_btn v6_round_btn" style="margin-right: 0.2rem;padding: .06rem .35rem;font-size: .14rem;" @click="resetUserinfo('')">{{$t("public.share14")}}</a>
            <a class="round_white_btn v6_white_btn" style="padding: .06rem .35rem;font-size: .14rem;border:none;line-height: unset;" @click="closeService">{{$t("public.share13")}}</a>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Prop} from "vue-property-decorator";
    import {DatePicker, Select, Option, Progress} from 'element-ui';
    import {UpdateInfos, UserInfo} from '@/ts/models/UserModel';
    import proviceCom from '@/components/proviceCascader.vue'
    import {VueCropper} from "vue-cropper";
    import Util from '@/ts/utils/Util';
    import "babel-polyfill";
    import AppParamModel from '@/ts/models/AppModel';
    import LocalStorageUtil from '@/ts/utils/LocalStorageUtil';
    import GlobalConfig from '@/pages/leishen_pc/global.config';
    import ConfigUtil from '@/ts/utils/ConfigUtil';
    import {IProxy} from '@/ts/interface/IProxy';
    import {TipsMsgUtil} from '@/ts/utils/TipsMsgUtil';
    import {ExtrnalFactory} from '@/ts/factory/ExtrnalFactory';
    import {Toast} from "vant";
    import $ from 'jquery'
    Vue.use(Toast);
    Vue.directive('myfocus', {
        inserted: function(el, binding) {
            $(el).focus().select();
        }
    });

    @Component({
        watch: {
            userinfocount: {
                handler(newVal, oldVal) {
                    this.init();
                },
                immediate: false,
                deep: true
            }
        },
        components: {
            'el-date-picker': DatePicker,
            "vue-cropper": VueCropper,
            'el-select': Select,
            'el-option': Option,
            'el-progress': Progress,
            'provice-com':proviceCom
        }
    })
    export default class ResetUserinfo extends Vue implements IProxy {
        @Prop() public userinfo!: UserInfo;
        @Prop() public userinfocount!: number;
        @Prop() public bgimage!: string;

        public appParam: AppParamModel = AppParamModel.getInstace();
        public nickname: string = '';//昵称
        public bornDate: string = '';//出生年月日
        public sex: string = '';//性别 0保密 1小哥哥 2小姐姐
        public address: string = '';//地址
        public copyAddress: string = '';//地址
        public avatar_str: string = '';//头像文件base64
        public updateTypeIndex: number = 0;//0上传图片 1选择推荐图片
        public previewImg: string = '';//预览图片
        public imageHeadUrl = GlobalConfig.getImgBaseUrl();
        public imgUrlList: object = [];
        public isResetInfo: boolean = false;//是否修改了用户信息
        public cameraShow: boolean = false;
        public userChoose: boolean = false;//是否用户自己上传的图片
        public fixedBox: boolean = false;//裁剪框是否可以调整
        public avatar_box_show: boolean = false;//选择头像是否显示
        public avatar_shadow_show: boolean = false;//头像遮罩层是否显示
        public show_reset_nickname: boolean = false;//是否显示修改昵称input
        public progress_num: number = 0;
        public user_hour: number = 0;
        public myAppStatus = {
            paper:0,
            nnServer:0,
            nnVoice:0
        };



        public option = {
            img: '',
            outputType: "png"
        };

        public pickerOption = {
            disabledDate(time) {
                return time.getTime() > Date.now();
            }
        }

        public created() {
            this.getDownloadUrl();
            this.getMyApp();
        }

        public init() {
            this.nickname = this.userinfo.nickname;
            if (this.userinfo.birthday != '' && this.userinfo.birthday != '1970-01-01') {
                this.bornDate = this.userinfo.birthday;
            }else {
                this.bornDate = null;
            }
            this.address = this.userinfo.address;
            this.previewImg = this.userinfo.avatar;
            if (this.userinfo.sex == 'Male' || this.userinfo.sex == '帅哥') {
                this.sex = '1';
            } else if (this.userinfo.sex == 'Female' || this.userinfo.sex == '美女') {
                this.sex = '2';
            };
            this.progress_num = Math.floor(this.userinfo.expiry_time_samp/3600)/100;
            this.user_hour = Math.floor(this.userinfo.expiry_time_samp/3600);
            if(this.user_hour < 1) {
                this.user_hour = 1;
            }
            if(this.userinfo.expiry_time_samp <= 0) {
                this.user_hour = 0;
            };
            if(this.progress_num > 100) {
                this.progress_num = 100;
            };
            if(this.progress_num <= 0) {
                this.progress_num = 0;
            }
        }

        public execute() {

        };

        public setBaseUrl() {

        }

        /**
         * 获取用户应用下载状态
         */
        public getMyApp(){
            const factory = ExtrnalFactory.getInstance().getFactory(this.appParam.platform);
            this.myAppStatus = factory.getMyApp();
        }

        /**
         * 前往充值
         */
        public goRecharge() {
            const factory = ExtrnalFactory.getInstance().getFactory(this.appParam.platform);
            factory.gotoRecharge();
        }

        /**
         * 获取推荐头像列表
         * @param url
         */
        public async getDownloadUrl() {
            const jsonConfig = await ConfigUtil.getInstance().download();
            this.imgUrlList = jsonConfig.leigod.head_default_img_url;
        }

        showResetNickname() {
            this.show_reset_nickname = true;
        }

        closeResetNickname() {
            this.show_reset_nickname = false;
            this.nickname = this.userinfo.nickname;
        }

        getAdress(val:string){
            this.copyAddress=val
            this.onResetInfo()
        }

        openAvatar() {
            this.avatar_box_show = true;
        }

        closeAvatar (){
            this.avatar_box_show = false;
        }

        /**
         * 选择头像方式
         */
        public chooseUpdateType(index: number) {
            this.updateTypeIndex = index;
        }

        /**
         * 选择推荐头像
         */
        public chooseImage(item) {
            this.isResetInfo = true;
            this.option.img = item;
            this.previewImg = item;
            this.chooseUpdateType(0);
            this.userChoose = false;
            this.fixedBox = false;
        }

        /**
         * 修改用户信息触发
         */
        public onResetInfo() {
            this.isResetInfo = true;
        }

        /**
         * 选择图片
         * @param e
         */
        onChooseImage(e: any) {
            var self = this;
            let files = e.target.files || e.dataTransfer.files;
            if (!files.length) return;
            var file = files[0];
            // 限制500k大小
            if (file.size > 500 * 1024) {
                Toast.fail("图片大小限制500k(Image size limit 500k)!");
                return;
            }
            // 确认选择的文件是图片
            if (file.type.indexOf("image") == 0) {
                var reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function (e) {
                    // 图片base64化
                    let base64: any = this.result;
                    self.previewImg = base64;
                    self.option.img = base64;
                    self.userChoose = true;
                    self.isResetInfo = true;
                    self.fixedBox = true;
                };
            }
            e.target.value = '';
            const factory = ExtrnalFactory.getInstance().getFactory(this.appParam.platform);
            factory.MainBringToFront();
        }

        /**
         * 保存头像
         */
        saveImage() {
            this.avatar_box_show = false;
            if (this.option.img == '') {
                if (this.isResetInfo) {
                    this.resetUserinfo('');
                }
                return;
            }
            // 获取截图的base64 数据
            const self = this;
            let scale = (this.$refs.cropper as any).scale;
            if(scale <= 0.03){
                Toast.fail(TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_IMGSCALE_SMALL));
                return;
            }
            (this.$refs.cropper as any).getCropData((data) => {
                self.avatar_str = data;
                self.resetUserinfo(data);
            });
        }

        /**
         * 修改用户信息
         */
        public resetUserinfo(avatar: string) {
            if(avatar) {
                this.avatar_str = avatar;
            }
            this.show_reset_nickname = false;
            if (!this.isResetInfo) return;
            let param = new UpdateInfos();
            if(this.nickname.length > 0){
                param.nickname = this.nickname;
            }else if (this.nickname == '' && this.nickname != this.userinfo.nickname){
                Toast.fail(TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_NICKNAME_SETEMPTY));
                this.nickname = this.userinfo.nickname;
                return;
            }
            // if(this.address.length > 0){
                param.address = this.address || this.copyAddress;
            // }else if (this.address == '' && this.address != this.userinfo.address){
            //     this.$message({
            //         message: TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_ADDRESS_SETEMPTY),
            //         type: 'warning'
            //     });
            //     return;
            // }
            param.sex = this.sex;
            if (this.bornDate != null) {
                let date = new Date(this.bornDate);
                let time = date.getTime();
                param.birthday = (Util.formatDateTime(time)).substring(0, 10);
            }else if (this.bornDate == null && this.userinfo.birthday != null && this.userinfo.birthday != '1970-01-01'){
                Toast.fail(TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_BIRTHDAY_SETEMPTY));
                return;
            }
            param.user_url = this.avatar_str;
            this.$emit('on-upload-userinfo', param);
        }

        /**
         * 修改用户信息成功
         */
        public resetInfoSuccess() {
            this.isResetInfo = false;
            Toast.success(TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF_RESETNICKNAME_SUCCESS));
        }

        /**
         * 缩小图片
         */
        public scaleSmall() {
            (this.$refs.cropper as any).changeScale(-1)
        }

        /**
         * 放大图片
         */
        public scaleBig() {
            (this.$refs.cropper as any).changeScale(1)
        }

        /**
         * 关闭下拉框
         */
        public closeService() {
            this.$emit('closeservice');
        }

    }
</script>


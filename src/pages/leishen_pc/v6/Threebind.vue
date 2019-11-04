<template>
	<div>
		<ul class="flex_row_between v6_safety" style="margin:0;">
			<li class="v6_safety_item flex_column_start" style="padding:0;">
				<img src="../images/v6_weixin.png" alt  style="width: .8rem;height: .8rem;margin-top: .2rem;">
				<p class="v6_safety_title" style="margin-top: .07rem;">{{$t("user.b44")}}</p>
				<p class="v6_safety_title" style="margin-top: .04rem; color:#666;font-size: 0.14rem;">
					<span v-show="!thirdBindState.wechat">{{$t("user.b148")}}</span>
					<span v-show="thirdBindState.wechat">{{$t("user.b37")}}</span>
				</p>
				<div class="v6_safety_title v6_safety_btn" style="font-size: .12rem;color: #666;margin-top: 0.51rem;" v-show="!thirdBindState.wechat">
					<a class="round_white_btn v6_white_btn flex_row_center" @click="clickThirdBind(2)">
						<i class="iconic_bangding iconfont"></i>
						<span style="color: #666;">{{$t("public.share8")}}</span>
					</a>
				</div>
				<div class="v6_safety_title v6_safety_btn" v-show="thirdBindState.wechat" style="font-size: 0.12rem;color: #666;margin-top: 0.51rem;">
					<a class="round_white_btn v6_white_btn flex_row_center" @click="thirdUntied(2)">
						<i class="iconjiebang iconfont"></i>
						<span style="color: #666;">{{$t("user.b39")}}</span>
					</a>
				</div>
			</li>
			<li class="v6_safety_item flex_column_start">
				<img src="../images/v6_qq.png" alt style="width: .8rem;height: .8rem;margin-top: .2rem;">
				<p class="v6_safety_title" style="margin-top: .07rem;">{{$t("user.b45")}}</p>
				<p class="v6_safety_title" style="margin-top: .04rem; color:#666;font-size: 0.14rem;">
					<span v-show="!thirdBindState.QQ">{{$t("user.b148")}}</span>
					<span v-show="thirdBindState.QQ">{{$t("user.b37")}}</span>
				</p>
				<div class="v6_safety_title v6_safety_btn" style="font-size: .12rem;color: #666;margin-top: 0.51rem;" v-show="!thirdBindState.QQ">
					<a @click="clickThirdBind(1)" class="round_white_btn v6_white_btn flex_row_center">
						<i class="iconic_bangding iconfont"></i>
						<span style="color: #666;">{{$t("public.share8")}}</span>
					</a>
				</div>
				<div class="v6_safety_title v6_safety_btn" v-show="thirdBindState.QQ"  style="font-size: .12rem;color: #666;margin-top: 0.51rem;">
					<a class="round_white_btn v6_white_btn flex_row_center" @click="thirdUntied(3)">
						<i class="iconjiebang iconfont"></i>
						<span style="color: #666;">{{$t("user.b39")}}</span>
					</a>
				</div>
			</li>
			<li class="v6_safety_item flex_column_start" :class="{'border_none': appParam.region_code == 1}">
				<img src="../images/v6_weibo.png" alt style="width: .8rem;height: .8rem;margin-top: .2rem;">
				<p class="v6_safety_title" style="margin-top: .07rem;">{{$t("user.b46")}}</p>
				<p class="v6_safety_title" style="margin-top: .04rem; color:#666;font-size: 0.14rem;">
					<span v-show="!thirdBindState.weibo">{{$t("user.b148")}}</span>
					<span v-show="thirdBindState.weibo">{{$t("user.b37")}}</span>
				</p>
				<div class="v6_safety_title v6_safety_btn" style="font-size: .12rem;color: #666;margin-top: 0.51rem;" v-show="!thirdBindState.weibo">
					<a @click="clickThirdBind(3)" class="round_white_btn v6_white_btn flex_row_center">
						<i class="iconic_bangding iconfont"></i>
						<span style="color: #666;">{{$t("public.share8")}}</span>
					</a>
				</div>
				<div class="v6_safety_title v6_safety_btn" v-show="thirdBindState.weibo"  style="font-size: .12rem;color: #666;margin-top: 0.51rem;">
					<a class="round_white_btn v6_white_btn flex_row_center" @click="thirdUntied(4)">
						<i class="iconjiebang iconfont"></i>
						<span style="color: #666;">{{$t("user.b39")}}</span>
					</a>
				</div>
			</li>
			<!-- <li class="three_bind_item" v-show="appParam.region_code == 0" style="display:none;">
				<img src="../images/facebook.png" alt class="three_bind_icon">
				<p class="three_bind_type">{{$t("user.b47")}}</p>
				<div class="three_bind_btn" v-show="!thirdBindState.facebook" style="display:none;">
					<a class="public_btn three_bind_btn_pd">{{$t("public.share8")}}</a>
				</div>
				<div class="three_bind_btn" v-show="thirdBindState.facebook" style="display:none;">
					<a class="public_btn three_bind_btn_pd" @click="thirdUntied(7)">{{$t("user.b39")}}</a>
				</div>
			</li>
			<li class="three_bind_item" v-show="appParam.region_code == 0" style="display:none;">
				<img src="../images/twitter.png" alt class="three_bind_icon">
				<p class="three_bind_type">{{$t("user.b48")}}</p>
				<div class="three_bind_btn" v-show="!thirdBindState.twitter" style="display:none;">
					<a class="public_btn three_bind_btn_pd">{{$t("public.share8")}}</a>
				</div>
				<div class="three_bind_btn" v-show="thirdBindState.twitter" style="display:none;">
					<a class="public_btn three_bind_btn_pd" @click="thirdUntied(6)">{{$t("user.b39")}}</a>
				</div>
			</li>
			<li
				class="three_bind_item"
				:class="{'border_none': appParam.region_code == 0}"
				v-show="appParam.region_code == 0" style="display:none;"
			>
				<img src="../images/google.png" alt class="three_bind_icon">
				<p class="three_bind_type">{{$t("user.b49")}}</p>
				<div class="three_bind_btn" v-show="!thirdBindState.google" style="display:none;">
					<a class="public_btn three_bind_btn_pd">{{$t("public.share8")}}</a>
				</div>
				<div class="three_bind_btn" v-show="thirdBindState.google" style="display:none;">
					<a class="public_btn three_bind_btn_pd" @click="thirdUntied(5)">{{$t("user.b39")}}</a>
				</div>
			</li> -->
		</ul>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import AppParamModel from "@/ts/models/AppModel";
import { IProxy } from "@/ts/interface/IProxy";
import { BindingProxy } from "@/ts/proxy/BindingProxy";
import GlobalConfig from "@/pages/leishen_pc/global.config";
import { TipsMsgUtil } from "@/ts/utils/TipsMsgUtil";
import Util from "@/ts/utils/Util";
import LocalStorageUtil from '@/ts/utils/LocalStorageUtil';
import { ExtrnalFactory } from '@/ts/factory/ExtrnalFactory';
import {Dialog,Toast} from "vant";
Vue.use(Toast);
Vue.use(Dialog);
@Component
export default class ThreeBind extends BindingProxy implements IProxy {
	public appParam: AppParamModel = AppParamModel.getInstace();
	public languageType: string = "";

	public created() {
		this.setBaseUrl(GlobalConfig.getBaseUrl());
		this.languageType = Util.getLanguageType(this.appParam.language);
        if(Util.getUrlParam("account_token") == '' || Util.getUrlParam("account_token") == undefined) return;
		this.getThirdBindState();
	}

	// /**
	//  * 关闭下拉框
	//  */
	// public closeService() {
	// 	this.$emit("closeservice");
	// }

	/**
	 * 解绑第三方账号
	 */
	public thirdUntied(type: number) {
		Dialog.confirm({
			title: TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_NOTIF),
			message: TipsMsgUtil.getTipsMsg(TipsMsgUtil.KEY_REMOVEBIND_NOTIFY),
			cancelButtonText:TipsMsgUtil.getTipsMsg(
					TipsMsgUtil.KEY_NOTIF_NO
			),
			confirmButtonText: TipsMsgUtil.getTipsMsg(
					TipsMsgUtil.KEY_NOTIF_YES
			),
			className:"v6_llzThridBindConfirm",
		}).then(() => {
			this.onThirdUntied(type);
		}).catch(() => {
			// on cancel
		});
	}

	/**
	 * 用户解绑第三方账号成功
	 */
	public onThirdUntiedSuccess(type) {
		Toast.success(TipsMsgUtil.getTipsMsg(
				TipsMsgUtil.KEY_WEIXIN_REMOVEBING_SUCCEED
		));
		switch (type) {
			case 2:
				this.thirdBindState.wechat = false;
				break;
			case 3:
				this.thirdBindState.QQ = false;
				break;
			case 4:
				this.thirdBindState.weibo = false;
				break;
			case 5:
				this.thirdBindState.google = false;
				break;
			case 6:
				this.thirdBindState.twitter = false;
				break;
			case 7:
				this.thirdBindState.facebook = false;
			default:
				break;
		}
	}

	/**
	 * 用户解绑第三方账号失败
	 */
	public onThirdUntiedFaild(data: any) {
		Toast.fail(data.msg)
    }

    /**
     * 唤起第三方绑定
     */
    public clickThirdBind(type: number){
        const factory = ExtrnalFactory.getInstance().getFactory(this.appParam.platform);
        this.setBindUrlType();
        // let tempUrl='https://graph.qq.com/oauth2.0/show?which=Login&display=pc&response_type=code&client_id=101503698&redirect_uri=http://dev-api1.leigod.com/api/auth/open/qq&state=1_1_cn_2_0&scope=get_user_info'
		factory.bindAccount(type,'');
    }

    /**
     * 设置第三方绑定来源页面
     */
    public setBindUrlType(){
        localStorage.setItem(LocalStorageUtil.STORAGES_THIRDBIND_URL_TYPE,'0');
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


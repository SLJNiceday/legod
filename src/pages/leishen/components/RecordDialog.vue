<template>
    <div class="kp_record">
        <el-dialog :visible.sync="recordDialogVisible" center @close="CloseRecordDialog"
               :close-on-click-modal="false" :close-on-press-escape="false">
        <div v-loading="isLoading">
            <p class="web_news_title web_safty_font kp_dialog_title">{{$t("user.b114")}}</p>
            <el-table :data="ActiveRecordList" border stripe :cell-class-name="themeclass" :header-cell-class-name="themeclass">
                <el-table-column prop="present_title" :label="$t('user.b117')" header-align="center" align="center"
                                 min-width="200px"></el-table-column>
                <el-table-column prop="status_title" :label="$t('user.b118')" header-align="center" align="center"
                                 min-width="200px"></el-table-column>
                <el-table-column :label="$t('user.b87')" min-width="200px" header-align="center" align="center">
                    <template slot-scope="scope">
                        <a @click="onChooseOrderPayType(scope.row)" style="padding: 2px 8px" v-show="scope.row.status != 0" class="public_btn">{{$t("user.b120")}}</a>
                        <a @click="onChooseOrderPayType(scope.row)" style="padding: 2px 8px" v-show="scope.row.status == 0" class="public_btn">{{$t("user.b119")}}</a>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="text_center" style="margin-top: 20px;">
            <el-pagination class="user_pag" ref="elPagination" background @prev-click="pervOrderList"
                           @next-click="nextOrderList" @current-change="currentChange" :page-size="rowsPerPage"
                           layout="prev, pager, next" :total="total"></el-pagination>
        </div>
        <el-dialog :visible.sync="payTypeDialogVisible" width="35%" class="active_record_box" center :title="dialogTitle" append-to-body>
            <div class="active_record text_center">
                <div v-show="dialogType=='1'">
                    <ul class="login_box">
                        <li>
                            <label class="inputLabel">{{$t('user.b136')}}</label>
                            <input v-model="username" class="inputName" style="width:300px;">
                        </li>
                        <li class="flex_row_center" style="align-items: baseline;">
                            <label class="inputLabel">{{$t('public.share2')}}</label>
                            <div class="form_input_box flex_row_between" style="margin-bottom:15px;width: 300px;">
                                <div style="width:40%;height: 30px;">
                                    <el-select @change="onSelectCountryCode" :value="countryCode.code" placeholder="" style="width:100%;">
                                        <div slot="prefix"><img :src="countryCode.ico" alt="" style="margin-top:5px;"></div>
                                        <el-option-group v-for="group in country_code_list" :key="group.label" :label="group.label">
                                            <el-option v-for="(val,index) in group.options" :key="index" :value="val.code" :label="'+'+val.code">
                                                <img :src="val.ico" alt="">
                                                <span style="color:#666;">{{val.name}}</span>
                                            </el-option>
                                        </el-option-group>
                                    </el-select>
                                </div>
                                <div class="form_input_box" style="width:55%">
                                    <input v-model="phone" class="inputName" type="text" name="" style="width: 100%;" :placeholder="$t('public.share2')">
                                </div>
                            </div>
                        </li>
                        <li>
                            <label v-if="is_miandan" class="inputLabel">{{$t('user.b91_1')}}</label>
                            <label v-if="!is_miandan" class="inputLabel">{{$t('user.b91_2')}}</label>
                            <input v-if="!is_miandan" style="width: 300px;" v-model="address" class="inputName">
                            <input v-if="is_miandan" style="width: 300px;" v-model="alipay_address" class="inputName">
                        </li>
                        <li>
                            <label class="inputLabel">{{$t('public.share63')}}</label>
                            <input v-model="email" class="inputName" style="width:300px;">
                        </li>
                        <li style="text-align:center;">
                            <!-- 提交按钮 -->
                            <el-button style="background-color:#ffd33e;padding: 6px 24px;" @click="sendUserInfo">
                                {{$t('user.b133')}}
                            </el-button>
                        </li>
                    </ul>
                </div>
                <div v-show="dialogType=='2'">
                    <!-- 客服尽快为你发出奖品，请注意查收 -->
                    <img src="../images/huowu.png">
                    <p style="text-align: center;font-size: 16px;margin: 15px 0;">{{$t('user.b122')}}</p>
                </div>
                <div v-show="dialogType=='3'">
                    <!-- 第三方充值卡 -->
                    <p class="chongzhi">{{otherCard}}</p>
                    <!-- 如果是密码为空，就只显示CDKEY码-->
                    <p class="chongzhi" v-show="cardInfo.card_password==''">
                        <span>{{$t('user.b67_13')}}:</span>
                        {{cardInfo.card_no}}
                    </p>
                    <!-- 如果是密码不为空，就只显示卡号和密码-->
                    <p class="chongzhi" v-show="cardInfo.card_password!=''">
                        {{$t('user.b126')}}：{{cardInfo.card_no}}</p>
                    <p class="chongzhi" v-show="cardInfo.card_password!=''">
                        {{$t('user.b127')}}：{{cardInfo.card_password}}</p>
                </div>
                <div v-show="dialogType=='4'">
                    <!-- 卡密充值 -->
                    <p class="chongzhi">{{$t('user.b121')}}</p>
                    <!-- 如果是密码为空，就只显示CDKEY码-->
                    <p class="chongzhi" v-show="cardInfo.card_password==''">
                        <span>{{$t('user.b67_13')}}:</span>
                        {{cardInfo.card_no}}
                    </p>
                    <!-- 如果是密码不为空，就只显示卡号和密码-->
                    <p class="chongzhi" v-show="cardInfo.card_password!=''">
                        <span>{{$t('user.b126')}}：</span>
                        {{cardInfo.card_no}}
                    </p>
                    <p class="chongzhi" v-show="cardInfo.card_password!=''">
                        <span>{{$t('user.b127')}}：</span>
                        {{cardInfo.card_password}}
                    </p>
                </div>
                <div v-show="dialogType=='5'">
                    <!-- 优惠券，折扣码 -->
                    <p class="chongzhi flex_row_start"
                       style="padding: 0 20px;align-items: flex-start;text-align: left">
                        <span style="width: 35%;text-align: center">{{$t('user.b67_16')}}:</span>
                        <span style="width: 65%;">{{discount_title}}</span>
                    </p>
                    <p class="chongzhi flex_row_start"
                       style="padding: 0 20px;align-items: flex-start;text-align: left">
                        <span style="width: 35%;text-align: center">{{$t('user.b67_14')}}:</span>
                        <span style="width: 65%;">{{discount}}</span>
                    </p>
                    <p class="chongzhi flex_row_start"
                       style="padding: 0 20px;align-items: flex-start;text-align: left">
                        <span style="width: 35%;text-align: center">{{$t('user.b67_15')}}:</span>
                        <span style="width: 65%;">{{desc}}</span>
                    </p>
                    <p class="chongzhi">
                        {{details}}
                    </p>
                    <p style="text-align: center;">
                        <a class="public_btn" @click="goUseDiscount">{{$t('user.b67_17')}}</a>
                    </p>
                </div>
                <div v-show="dialogType=='6'">
                    <ul>
                        <li style="text-align:center;">
                            <label class="inputLabel">{{$t('user.b142')}}</label>
                            <el-select v-model="card_id" :placeholder="$t('public.share25')" style="width:300px;">
                                <el-option v-for="item in card_list" :key="item.id" :label="item.title" :value="item.id">
                                </el-option>
                            </el-select>
                        </li>
                        <li style="text-align:center;margin-top:8px;">
                            <!-- 提交按钮 -->
                            <el-button style="background-color:#ffd33e;padding: 6px 24px;" @click="confirmGiftType">
                                {{$t('user.b133')}}
                            </el-button>
                        </li>
                    </ul>
                </div>
                <div v-show="dialogType=='7'">
                    <!-- 第三方充值卡 -->
                    <p class="chongzhi">{{otherCard}}({{desc}})</p>
                    <!-- 如果是密码为空，就只显示CDKEY码-->
                    <p class="chongzhi" v-show="cardInfo.card_password==''">
                        <span>{{$t('user.b67_13')}}:</span>
                        {{cardInfo.card_no}}
                    </p>
                    <!-- 如果是密码不为空，就只显示卡号和密码-->
                    <p class="chongzhi" v-show="cardInfo.card_password!=''">{{$t('user.b126')}}：{{cardInfo.card_no}}</p>
                    <p class="chongzhi" v-show="cardInfo.card_password!=''">{{$t('user.b127')}}：{{cardInfo.card_password}}</p>
                </div>
            </div>
        </el-dialog>
    </el-dialog>
    </div>
</template>

<script lang="ts" src="./RecordDialog.ts">
</script>

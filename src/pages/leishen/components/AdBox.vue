<template>
    <div>
        <div class="fixAdBox" v-if="adshow==0">
            <img src="./images/sd_cancel_normal.png" class="cursor closeBtn" @click="closeAd" alt="">
            <a :href="adlink">
                <img :src="adSrc" alt="">
            </a>
        </div>
        <div class="block">
            <span class="demonstration">Click 指示器触发</span>
            <el-carousel trigger="click" height="150px">
                <el-carousel-item v-for="item in 4" :key="item">
                    <h3>{{ item }}</h3>
                </el-carousel-item>
            </el-carousel>
        </div>

    </div>
</template>

<script lang="ts" src="AdBox.ts"></script>


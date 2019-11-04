<template>
    <div class="header">
        <div class="header__logo">
            <img src="../images/logo.png" alt="" class="logo_img">
            <span class="logo__seperator"></span>
            <span class="logo__title">国内首款随时可暂停的网游加速器</span>
        </div>
    </div>
</template>

<script lang="ts">
    import {Vue, Component} from "vue-property-decorator";
    import '../less/common.less'
    @Component
    export default class HeadNav extends Vue {
    }
</script>

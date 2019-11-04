<template>
    <span>
        <i :class="fontclass"></i>
    </span>
</template>
<script lang="ts">
    import {Component, Vue, Prop} from "vue-property-decorator";
    import '../assets/alifont/leishen/iconfont.css'

    @Component({
        props: {
            name: String
        }
    })
    export default class icon extends Vue {
        public fontclass: string = ''

        created() {
            this.fontclass = 'icon-' + this.$props.name
        }
    }
</script>
<style lang="less">
    *[class^="icon-"] {
        font-family: "iconfont" !important;
        font-size: 16px;
        font-style: normal;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
</style>

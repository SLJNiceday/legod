<template>
    <el-dialog :visible.sync="payDialogVisible" width="420px" center @close="onClosePyaDialog"
               :close-on-click-modal="false" :close-on-press-escape="false">
        <keep-alive>
            <component :is="paycomponent" ref="paycomponentRef" :payobj="payObj" :paytrans="payTrans"
                       @paystep1="finishStep1" @goback="goBack" @paydone="payDoned"></component>
        </keep-alive>
    </el-dialog>
</template>

<script src="./RechargeDialog.ts">

</script>

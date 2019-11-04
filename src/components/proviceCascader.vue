<template>
    <div>
        <el-cascader @change="getVal" :options="cascaderData" style="width:100%;" v-model="AddressArr" :placeholder="$t('public.share25')"
                     clearable></el-cascader>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {Cascader} from 'element-ui'
    import jsonData from '@/assets/json/province_config.json'

    Vue.use(Cascader)
    @Component
    export default class HelloWorld extends Vue {
        @Prop(String) address!: String;
        @Prop() public type: number;//地址所需层级
        public AddressArr: Array<String> = []
        public cascaderData:Array<any>;
        public tequ = '北京市天津市上海市重庆市';

        created() {
            this.cascaderData = jsonData;
            if(this.type == 2) {
                this.cascaderData.forEach((item)=> {
                    if(item.children){
                        if(this.tequ.indexOf(item.label) != -1){
                            let arr = [];
                            item.children.forEach((it)=> {
                                arr = arr.concat(it.children)
                            });
                            item.children = arr;
                        }else {
                            item.children.forEach((i)=> {
                                delete  i.children;
                            })
                        }
                    }

                });
            }
        }

        getVal(val:string[]) {
            if(val.length==0){
                this.$emit('getlabel','')
                this.$emit('getvalue',val)
            }else{
                let recycleTime:number=0
                let labelVal:string=''
                let tempObj:Array<any>=this.cascaderData.slice()
                while(recycleTime<val.length){
                    for(let qq=0;qq<tempObj.length;qq++){
                        if(val[recycleTime]==tempObj[qq].value){
                            if(tempObj[qq].children){
                                //@ts-ignore
                                labelVal+=tempObj[qq].label+'/'
                                //@ts-ignore
                                tempObj=(tempObj[qq].children as Array).slice()
                            }else{
                                labelVal+=tempObj[qq].label
                            }
                        }
                    }
                    recycleTime++
                }
                this.$emit('getlabel',labelVal)
                this.$emit('getvalue',val)
            }

        }
    }
</script>

<template>
    <h2>这里是登录页面</h2>
    <div><el-button type="primary" :loading="loading" @click="xxxxxx"> 点击测试进度条1 </el-button></div>
    <div><el-button type="primary" :loading="loading" @click="xxxxxx"> 点击测试进度条2 </el-button></div>
    <div><el-button type="primary" :loading="loading" @click="xxxxxx"> 点击测试进度条3 </el-button></div>
    <br />
    <div>
        <div v-for="item in showMes.artists" :key="item.id">
            {{ item.name }}
            <div>
                <img :src="item.img1v1Url" style="width: 50px; height: 50px" :alt="item.name" />
                <img :src="item.picUrl" style="width: 50px; height: 50px" :alt="item.name" />
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup name="login">
import { reqSingerList } from '@/api/module';
import { onMounted, ref } from 'vue';
import { debounce } from 'lodash-es';
// export interface Result<T = any> {
//   code: number;
//   message: string;
//   data: T;
// }
const loading = ref<boolean>(false);
const type = ref<number>(-1); // 歌手类型
const area = ref<number>(-1); // 歌手地区
const showMes = ref<any>([]);
let limit = 30;
let page = 0;
onMounted(async () => {
    const data = {
        limit: limit,
        offset: page * limit,
        area: area.value,
        type: type.value
    };
    const [err, res] = await reqSingerList(data);
    showMes.value = res;
});
const xxxxxx = async () => {
    const data = {
        limit: limit,
        offset: page * limit,
        area: area.value,
        type: type.value
    };
    const [err, res] = await reqSingerList(data);
    showMes.value = res;
};

const testCkick = debounce(async () => {
    loading.value = true;
    const data = {
        limit: limit,
        offset: page * limit,
        area: area.value,
        type: type.value
    };
    const [err, res] = await reqSingerList(data);
    loading.value = false;
    console.log(res);
}, 500);
</script>

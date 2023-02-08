<template>
    <div>
        <!--      LinkageBetweenProCityCountry-->
        <!-- value绑定的是对象，当改变值的可以取item的值，这时候必须制定value-key的值，标识选择框中显示的字段名称 -->
        <el-select v-model="data.provinceObj" placeholder="请选择" value-key="name" @change="provinceChange">
            <el-option v-for="(item, index) in data.provinceData" :key="index" :label="item.name" :value="item"></el-option> </el-select
        >&nbsp;&nbsp;
        <el-select v-model="data.cityObj" placeholder="请选择" value-key="name" @change="cityChange">
            <el-option v-for="(item, index) in data.cityData" :key="index" :label="item.name" :value="item"></el-option> </el-select
        >&nbsp;&nbsp;
        <el-select v-model="data.countryObj" placeholder="请选择" value-key="name" @change="countryChange">
            <el-option v-for="(item, index) in data.countryData" :key="index" :label="item.name" :value="item"></el-option> </el-select
        >&nbsp;&nbsp;
    </div>
    <div>{{ data.provinceObj.name }} {{ data.cityObj.name }} {{ data.countryObj.name }}</div>
</template>

<script>
import { reactive, ref } from 'vue';
import ProvinceCityCountry from '../json/address.json';
export default {
    setup() {
        const data = reactive({
            provinceObj: { name: '' },
            cityObj: { name: '' },
            countryObj: { name: '' },
            provinceData: ProvinceCityCountry.address,
            cityData: [],
            countryData: []
        });
        // 省份change
        const provinceChange = (value) => {
            data.cityData = value.children; // 市下拉列表
            data.countryData = []; // 清空区县下拉列表数据
            data.cityObj = {}; // 清空市输入框内容
            data.countryObj = {}; // 清空区县输入框内容
        };
        // 市change
        const cityChange = (value) => {
            data.countryData = value.children; // 县区下拉框列表
            data.countryObj = {}; // 清空区县输入框内容
        };
        // 县change
        const countryChange = (value) => {
            console.log(data);
        };
        return {
            data,
            provinceChange,
            cityChange,
            countryChange
        };
    }
};
</script>

<style lang="scss" scoped></style>

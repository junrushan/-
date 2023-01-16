<template>
    <div class="common-layout">
        <el-container>
            <el-header><HeaderIndex></HeaderIndex></el-header>
            <el-main>
                <div style="background-color: orange">11</div>
            </el-main>
            <el-footer><FooterIndex></FooterIndex></el-footer>
        </el-container>
    </div>
</template>

<script setup lang="ts" name="index">
import HeaderIndex from '@/layout/header/index.vue';
import FooterIndex from '@/layout/footer/index.vue';
</script>

<style scoped></style>

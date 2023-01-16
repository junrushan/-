<template>
    <div>footer</div>
    <div>{{ msg }}</div>
</template>

<script setup lang="ts" name="footerIndex">
import { ref } from 'vue';

const msg = ref('我是尾');
</script>

<style scoped lang="less"></style>

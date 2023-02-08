<template>
    <LayoutIndex></LayoutIndex>
</template>

<script lang="ts" setup name="IndexPage">
import LayoutIndex from '@/layout/LayoutIndex.vue';
import { defineProps } from 'vue';

interface Props {
    name: string;
    age?: number;
}
const props = defineProps<Props>();
</script>

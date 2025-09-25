<script lang="ts" setup>
defineOptions({
    name: 'StSayHello',
})

const {name} = defineProps<{
    name: string
}>()

function sayHello() {
    // eslint-disable-next-line no-alert
    console.log(`Hello, ${name}`)
}
</script>

<template>
    <button class="starter-lib-vue3-say-hello" @click="sayHello()">Say Hi!</button>
</template>

<style>@import url('./style.css');</style>
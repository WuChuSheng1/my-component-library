<script lang="ts" setup>
import { defineOptions } from "vue";

defineOptions({
  name: "StSayHello",
});

const { name } = defineProps<{
  name: string;
}>();

function sayHello() {
  console.log(`Hello, ${name}`);
}
</script>

<template>
  <button class="starter-lib-vue3-say-hello" @click="sayHello()">
    Say Hi!
  </button>
</template>

<style>
@import url("./style.css");
</style>

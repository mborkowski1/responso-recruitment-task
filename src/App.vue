<template>
  <Chat />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Chat from './components/Chat.vue';

export default defineComponent({
  name: 'App',
  components: {
    Chat,
  },
});
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body, html {
  margin: 0;
}

* {
  box-sizing: border-box;
}
</style>

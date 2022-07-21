<template>
  <div :class="{ 'my-message': message.userId === userId }"
       class="message">
    {{ message.text }}
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { MessageInterface } from "@/types/message-interface";

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Message",
  props: {
    message: {
      type: Object as PropType<MessageInterface>,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    }
  }
})
</script>

<style lang="scss" scoped>
  .message {
    align-self: flex-start;
    padding: 10px;
    margin-bottom: 10px;
    background-color: palegreen;
    border-radius: 10px 10px 10px 0;
    overflow-wrap: break-word;
    max-width: 80%;

    &.my-message {
      background-color: deepskyblue;
      align-self: flex-end;
      border-radius: 10px 10px 0 10px;
    }
  }
</style>

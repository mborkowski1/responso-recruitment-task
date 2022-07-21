<template>
  <div class="wrapper">
    <font-awesome-icon @click="toggleChat"
                       v-if="!chatToggled"
                       class="chat-icon"
                       size="4x"
                       icon="fa-comment-dots" />
    <div class="chat-container" v-else>
      <div class="chat">
        <div class="chat-header">
          <span>Chat</span>
          <font-awesome-icon @click="toggleChat"
                             class="close-icon"
                             icon="fa-xmark" />
        </div>
        <div class="messages-container">
          <Message :key="i"
                   :message="msg"
                   :user-id="userId"
                   v-for="(msg, i) in messagesList" />
          <div v-if="typing" class="typing-message">
            <span :key="i"
                  v-for="i in 3"
                  class="typing-dot"></span>
          </div>
        </div>
        <div class="form">
          <input @keydown.enter="sendMessage"
                 v-model="message"
                 placeholder="Message"
                 class="message-input" />
          <font-awesome-icon @click="sendMessage"
                             class="input-icon"
                             icon="fa-paper-plane" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, onMounted, reactive, Ref, ref, watch,
} from 'vue';
import { io, Socket } from 'socket.io-client'
import { MessageInterface } from "@/types/message-interface";
import Message from "@/components/Message.vue";

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Chat',
  components: {
    Message,
  },
  setup() {
    const socket: Socket = io('http://localhost:3000');
    const messagesList: MessageInterface[] = reactive([]);
    let chatToggled: Ref<boolean> = ref(false);
    let typing: Ref<boolean> = ref(false);
    let message: Ref<string> = ref('');
    let userId: Ref<string> = ref('');

    onMounted(() => {
      socket.on('connect', () => {
        userId.value = socket.id;
      });

      socket.on('chat message', (msg: MessageInterface) => {
        messagesList.push(msg);
      });

      socket.on('typing message', (isTyping: boolean) => {
        typing.value = isTyping;
      });
    });

    const sendMessage = (): void => {
      if (message.value) {
        const messageData: MessageInterface = {
          text: message.value,
          userId: userId.value,
        }
        socket.emit('send message', messageData);
        message.value = '';
      }
    }

    const toggleChat = (): void => {
      chatToggled.value = !chatToggled.value;
    }

    watch(message, () => {
      socket.emit('typing', !!message.value.length);
    });

    return {
      socket, messagesList, chatToggled, typing, message, userId,
      sendMessage, toggleChat,
    };
  },
});
</script>

<style scoped lang="scss">
  .wrapper {
    margin: 10px;

    .chat-icon {
      color: dodgerblue;
      cursor: pointer;
    }

    .chat-container {
      height: 450px;
      width: 300px;
      background-color: #ECEFF1;
      border: 2px solid #42A5F5;
      border-radius: 10px;

      .chat {
        display: flex;
        flex-direction: column;
        height: 100%;

        .chat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: #64B5F6;
          padding: 10px;
          font-size: 24px;

          .close-icon {
            cursor: pointer;
          }
        }

        .messages-container {
          height: 100%;
          padding: 5px;
          display: flex;
          flex-direction: column;
          overflow: auto;

          .typing-message {
            align-self: flex-start;
            padding: 10px;
            background-color: palegreen;
            border-radius: 10px 10px 10px 0;
            overflow-wrap: break-word;
            max-width: 80%;
            position: relative;

            .typing-dot {
              display:inline-block;
              width: 4px;
              height: 4px;
              border-radius:50%;
              margin-right: 3px;
              background: #000;
              animation: wave 1.3s linear infinite;

              &:nth-child(2) {
                animation-delay: -1.1s;
              }

              &:nth-child(3) {
                animation-delay: -0.9s;
              }

              @keyframes wave {
                0%, 60%, 100% {
                  transform: initial;
                }

                30% {
                  transform: translateY(-10px);
                }
              }
            }
          }
        }

        .form {
          display: flex;
          align-items: center;
          position: relative;
          padding: 5px;

          .message-input {
            padding: 8px 35px 8px 8px;
            font-size: 18px;
            width: 100%;
            border-radius: 5px;
            border: 1px solid #2196F3;
            outline: none;

            &:focus {
              border: 2px solid #2196F3;
            }
          }

          .input-icon {
            cursor: pointer;
            font-size: 20px;
            color: #2196F3;
            position: absolute;
            right: 15px;
          }
        }
      }
    }
  }
</style>

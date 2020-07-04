<!--  -->
<template>
  <div class>
    hello world
    <br />
    <input type="text" v-model="msg" />
    <br />uid :
    <input type="text" v-model="uid" />
    <br />toUid
    <input type="text" v-model="toUid" />
    <br />
    <button @click="connect">连接</button>
    <br />
    <button @click="send">send</button>
    <br />
    <button @click="play">play</button>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

import { voicePrompt } from '@/common/voicePrompt'

export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    //这里存放数据
    return {
      msg: '哈哈哈哈',
      myStompClient: null,
      uid: null,
      toUid: null,
    }
  },
  //监听属性 类似于data概念
  computed: {
    socketUrl() {
      // return 'http://172.16.108.202:5622/im/conn?uid=' + this.uid;
      return 'http://192.168.31.28:8080/im/conn?uid=' + this.uid;
    }
  },
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {
    play() {
      const synth = window.speechSynthesis
      console.log(synth.getVoices())
      const msg = new SpeechSynthesisUtterance()
      msg.voice = synth.getVoices()[22] //设置人声音
      // msg.text = '所以暂时将你眼睛闭了起来,黑暗之中漂浮我的期待'
      msg.text = '故事的小黄花,从出生那年就飘着,童年的荡秋千,随记忆一直晃到现在'

      msg.lang = 'zh-CN'
      msg.volume = 1//0-1 音量大小
      msg.rate = 0.75 //0.1-10 播放语速
      msg.pitch = 1//0-2 音调高低

      synth.speak(msg)


      // voicePrompt('哇,好漂亮的A呀,你是C吗')
    },
    send() {
      var params = {
        toUid: this.toUid,
        content: this.msg
      }
      //'/im'对应setApplicationDestinationPrefixes
      //'send2user' 对应控制器里面MessageMapping
      this.myStompClient.send('/im/send2user', {}, JSON.stringify(params))
    },
    connect() {
      let socket = new SockJS(this.socketUrl);
      let stompClient = Stomp.over(socket);
      stompClient.connect({}, frame => {
        this.myStompClient = stompClient
        //订阅个人消息
        this.subscribeUser()
      }, () => {
        console.log("断开了")
        this.reconnect(this.socketUrl, this.subscribeUser)
      })
    },
    //订阅个人消息
    subscribeUser() {
      this.myStompClient && this.myStompClient.subscribe('/user/' + this.uid + '/msg', function (message) {
        console.log("订阅个人消息");
        console.warn(message.body);
        console.warn(JSON.parse(message.body));
      })
    },
    // 断开重连使用定时器定时连接服务器
    reconnect(socketUrl, successCallback) {
      console.info('开始重连')
      let connected = false
      const reconInv = setInterval(() => {
        console.info('in interval' + Math.random())
        let socket = new SockJS(socketUrl)
        let stompClient = Stomp.over(socket)
        stompClient.connect({}, (frame) => {
          this.myStompClient = stompClient
          console.info('reconnected success')
          // 连接成功，清除定时器
          clearInterval(reconInv)
          connected = true
          successCallback()
        }, () => {
          console.info('reconnect failed')
          console.info('connected:' + connected)
          if (connected) {
            this.reconnect(this.socketUrl, this.subscribeUser)
          }
        })
      }, 5000)
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {

  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {

  },
  beforeCreate() { }, //生命周期 - 创建之前
  beforeMount() { }, //生命周期 - 挂载之前
  beforeUpdate() { }, //生命周期 - 更新之前
  updated() { }, //生命周期 - 更新之后
  beforeDestroy() { }, //生命周期 - 销毁之前
  destroyed() { }, //生命周期 - 销毁完成
  activated() { }, //如果页面有keep-alive缓存功能，这个函数会触发
}
</script>
<style scoped>
</style>
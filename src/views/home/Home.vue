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
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    //这里存放数据
    return {
      msg: '哈哈哈哈',
      myStompClient: null,
      uid: null,
      toUid: null
    }
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {
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
      let socket = new SockJS('http://localhost:8080/im/conn?uid=' + this.uid);
      let stompClient = Stomp.over(socket);
      this.myStompClient = stompClient
      stompClient.connect({}, function (frame) {
        stompClient.subscribe('/user/msg', function (message) {
          console.log("订阅个人消息");
          console.warn(message.body);
          console.warn(JSON.parse(message.body));
        });
      });
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    // let socket = new SockJS('http://localhost:8080/im/conn?uid=' + '0772');
    // let stompClient = Stomp.over(socket);
    // this.myStompClient = stompClient
    // stompClient.connect({}, function (frame) {
    //   stompClient.subscribe('/user/msg', function (message) {
    //     console.warn(message.body);
    //     console.warn(JSON.parse(message.body));
    //   });

    //   // var params = {
    //   //   uid: "0772",
    //   //   toUid: "0772",
    //   //   content: "456465"
    //   // }
    //   // //'/im'对应setApplicationDestinationPrefixes
    //   // //'send2user' 对应控制器里面MessageMapping
    //   // stompClient.send('/im/send2user', {}, JSON.stringify(params))
    // });
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
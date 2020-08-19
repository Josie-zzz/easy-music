import Vue from "vue";
import App from "@/App.vue";
import router from "./router";
import store from "./store";
import './util'                       //工具函数，处理音乐对象，因为多个组件都会用到，所以挂载到prototype上
import './assets/css/reset.scss';
import './assets/css/element-variables.scss';
import './assets/icon/iconfont.css';
import vuescroll from 'vuescroll';

// 你可以在这里设置全局配置
Vue.use(vuescroll, {
  name: 'myScroll',         // 在这里自定义组件名字，默认是vueScroll
  ops: {                    // 在这里设置全局默认配置
    bar: {
      keepShow: true,
      background: 'rgb(207, 207, 209, 0.5)'
    }
  },                  
});

import {
  Input,
  Carousel,
  CarouselItem,
  Button,
  Pagination,
  MessageBox,
  Message,
  Slider
} from 'element-ui';
Vue.use(Input)
Vue.use(Carousel)
Vue.use(CarouselItem)
Vue.use(Button)
Vue.use(Pagination)
Vue.use(Slider)

MessageBox.install = function (Vue) {
  Vue.prototype.$MessageBox = MessageBox
}
Vue.use(MessageBox)

Message.install = function (Vue) {
  Vue.prototype.$Message = Message
}
Vue.use(Message)

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

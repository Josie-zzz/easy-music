import Vue from "vue";
import App from "@/App.vue";
import router from "./router";
import store from "./store";
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
  CarouselItem 
} from 'element-ui';
Vue.use(Input)
Vue.use(Carousel)
Vue.use(CarouselItem)

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

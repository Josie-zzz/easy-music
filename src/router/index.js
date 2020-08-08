import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

import FindMusic from '../views/findMusic'
import SelfFM from '../views/selfFM'
import Look from '../views/look'
import Video from '../views/video'

export default new VueRouter({
  routes: [
    {
      path: '/',
      redirect: '/findMusic'
    },
    {
      path: '/findMusic',
      component: FindMusic
    },
    {
      path: '/selfFM',
      component: SelfFM
    },
    {
      path: '/look',
      component: Look
    },
    {
      path: '/video',
      component: Video
    }
  ]
})
import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

import DiscoverMusic from '@/views/discoverMusic'
import Recommend from '@/views/discoverMusic/recommend'
import SongList from '@/views/discoverMusic/songList'
import Anchor from '@/views/discoverMusic/anchor'
import RankingList from '@/views/discoverMusic/rankingList'
import Singer from '@/views/discoverMusic/singer'
import NewMusic from '@/views/discoverMusic/newMusic'

import SelfFM from '@/views/selfFM'
import Look from '@/views/look'
import Video from '@/views/video'

import PlayList from '@/views/playList'

export default new VueRouter({
  routes: [
    {
      path: '/',
      redirect: '/discoverMusic'
    },
    {
      path: '/discoverMusic',
      component: DiscoverMusic,
      children: [
        {
          path: '/discoverMusic',
          redirect: '/discoverMusic/recommend'
        },
        {
          path: '/discoverMusic/recommend',
          component: Recommend
        },
        {
          path: '/discoverMusic/songList',
          component: SongList
        },
        {
          path: '/discoverMusic/anchor',
          component: Anchor
        },
        {
          path: '/discoverMusic/rankingList',
          component: RankingList
        },
        {
          path: '/discoverMusic/singer',
          component: Singer
        },
        {
          path: '/discoverMusic/newMusic',
          component: NewMusic
        },
      ]
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
    },
    {
      path: '/playList',
      name: 'playList',
      component: PlayList
    }
  ]
})
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
import Mv from '@/views/video/children/mv'
import Video2 from '@/views/video/children/video'

import PlayList from '@/views/playList'
import Artist from '@/views/artist'
import SearchInfo from '@/views/searchInfo'
import Audio from '@/views/audio'

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
      component: Video,
      children: [
        {
          path: '/video',
          redirect: '/video/mv'
        },
        {
          path: '/video/mv',
          component: Mv
        },
        {
          path: '/video/video2',
          component: Video2
        }
      ]
    },
    {
      path: '/playList',
      name: 'playList',
      component: PlayList
    },
    {
      path: '/artist',
      name: 'artist',
      component: Artist
    },
    {
      path: '/searchInfo',
      name: 'searchInfo',
      component: SearchInfo
    },
    {
      path: '/audio',
      name: 'audio',
      component: Audio
    },
  ]
})
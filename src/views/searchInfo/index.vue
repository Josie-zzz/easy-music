<template>
  <div class="searchInfo parent-dom">
    <myScroll>
      <div class="child-dom">
        <div v-if="keyWords" style="font-size:12px;padding:30px;">
          搜索“<span style="color:#0c73c2;">{{ keyWords }}</span>”，
          <span v-if="currentCom === 'Songs'">{{ songsDescr }}</span>
          <span v-if="currentCom === 'AritistList'">{{ aritistListDescr }}</span>
          <span v-if="currentCom === 'PlayList'">{{ playListDescr }}</span>
          <span v-if="currentCom === 'Video'">{{ videoDescr }}</span>
        </div>
        <div>
          <ul class="playList-bar">
            <li :class="[currentCom === 'Songs' ? 'checked2' : '']"  @click="() => switchTo('Songs')">单曲</li>
            <li :class="[currentCom === 'AritistList' ? 'checked2' : '']"  @click="() => switchTo('AritistList')">歌手</li>
            <li :class="[currentCom === 'PlayList' ? 'checked2' : '']" @click="() => switchTo('PlayList')">歌单</li>
            <li :class="[currentCom === 'Video' ? 'checked2' : '']" @click="() => switchTo('Video')">视频</li>
          </ul>
        </div>
        <keep-alive>
          <component 
            :is="currentCom" 
            :keyWords="keyWords"
            @changeDescr="changeDescr"
          ></component>
        </keep-alive>
      </div>
    </myScroll>
  </div>
</template>

<script>
import Songs from '@/components/searchInfo/songs'
import AritistList from '@/components/searchInfo/aritistList'
import PlayList from '@/components/searchInfo/playList'
import Video from '@/components/searchInfo/video'

import { mapState } from 'vuex'

export default {
  data(){
    return {
      currentCom: 'Songs',                        //动态组件的当前组件
      songsDescr: '',                                  //(找到了12首歌)
      aritistListDescr: '',                            //歌手      
      playListDescr: '',                               //歌单
      videoDescr: '',                                  //视频
    }
  },
  computed: {
    ...mapState(['keyWords'])
  },
  components: {
    Songs,
    AritistList,
    PlayList,
    Video
  },
  methods: {
    switchTo(com){
      this.currentCom = com
    },
    changeDescr(str, com){
      switch(com){
        case 'Songs': this.songsDescr = str;break;
        case 'AritistList': this.aritistListDescr = str;break;
        case 'PlayList': this.playListDescr = str;break;
        case 'Video': this.videoDescr = str;break;
      }
    }
  }
}
</script>

<style lang="scss">
.searchInfo {
  width: 100%;
  height: 100%;

  .playList-bar {
    width: 1000px;
    margin: 0 auto;

    li {
      display: inline-block;
      margin-left: 80px;
      font-size: 14px;
      line-height: 34px;

      &:hover {
        color: #cf2f2f;
        cursor: pointer;
      }
    }
  }
}
</style>
<template>
  <div class="search-songs">
    <template v-if="songsNum > 0">
      <Songs :songs="songs" style="margin-bottom:50px;"></Songs>
      <div style="display:flex;flex-direction: row;justify-content: center;">
        <el-pagination
          v-if="songsPage > 1 && songs"
          layout="prev, pager, next"
          :page-count="songsPage"
          :current-page="currentPage"
          @current-change="currentChange"
        ></el-pagination>
      </div>
    </template>
    <div v-if="!songsNum" style="font-size: 12px;padding: 30px;text-align: center;">
      很抱歉，未能搜到与“<span style="color:#0c73c2;">{{ keyWords }}</span>”相关的歌曲
    </div>
  </div>
</template>

<script>
import Songs from '@/components/playList/songs'
import {
  _getSearchInfo
} from '@/ajax/search'

export default {
  data(){
    return {
      songs: null,                                //当前页的单曲
      limit: 50,                                  //单曲一页的限制
      songsNum: -1,                               //单曲搜索数量，如果是-1，则还没请求数据更新
      currentPage: 1,                             //当前页码
    }
  },
  props: ['keyWords'],
  computed: {
    songsPage(){
      if(this.songsNum !== -1){
        return Math.ceil(this.songsNum / this.limit)
      } else {
        return 1
      }
    }
  },
  components: {
    Songs
  },
  created(){
    this.getSearchInfo(this.keyWords, 1, (this.currentPage - 1) * this.limit)
  },
  watch: {
    keyWords(val){
      // console.log(val)
      this.songs = null
      this.currentPage = 1
      this.songsNum = -1
      this.getSearchInfo(val, 1, (this.currentPage - 1) * this.limit)
    }
  },
  methods: {
    getSearchInfo(keywords, type, offset, limit = this.limit){
      _getSearchInfo(keywords, type, offset, limit).then(res => {
        this.songsNum = res.data.result.songCount
        this.setTitle(this.songsNum)
        this.processSongs(res.data.result.songs)
        // console.log(res.data.result.songs)
      }).catch(res => {
        console.log('请求搜索单曲失败！', res)
      })
    },
    processSongs(oldSongs){                    //处理歌曲对象的信息
      let newSongs = []
      oldSongs.forEach((val, index) => {
        index = index + 1
        let obj = {
          id: val.id,
          index: this.$addZero(index),   
          name: val.name,
          alia: val.alias[0] ? val.alias[0] : '',
          singers: this.$transSinger(val.artists),
          album: val.album.name,
          duration: this.$transDuration(val.duration)
        }
        newSongs.push(obj)
      })
      
      this.songs = newSongs
      // console.log(this.songs)
    },
    setTitle(num){
      let str = `找到了 ${num} 首歌`
      this.$emit('changeDescr', str, 'Songs')
    },
    currentChange(page){
      this.currentPage = page
      this.songs = null
      this.getSearchInfo(this.keyWords, 1, (this.currentPage - 1) * this.limit)
    }
  }
}
</script>

<style lang="scss">

</style>
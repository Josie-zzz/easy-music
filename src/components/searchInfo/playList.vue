<template>
  <div class="playListSearch">
    <template v-if="playListNum > 0">
      <div>
        <table v-if="playLists" class="playListTable">
          <tr v-for="(play, index) in playLists" :key="'play' + index" @click="toPath(play.id)">
            <td style="width:20px;"></td>
            <td style="width: 60px;">
              <img :src="play.coverImgUrl">
            </td>
            <td style="color:#000;">{{ play.name }}</td>
            <td style="width: 150px;">{{ play.trackCount }}首</td>
            <td style="width: 300px;">
              <span style="margin-right:10px;">by</span>
              <span>{{ play.creator.nickname }}</span>
            </td>
          </tr>
        </table>
      </div>
      <div style="display:flex;flex-direction: row;justify-content: center;">
        <el-pagination
          v-if="playListPage > 1 && playLists"
          layout="prev, pager, next"
          :page-count="playListPage"
          :current-page="currentPage"
          @current-change="currentChange"
        ></el-pagination>
      </div>
    </template>
    <div v-if="!playListNum" style="font-size: 12px;padding: 30px;text-align: center;">
      很抱歉，未能搜到与“<span style="color:#0c73c2;">{{ keyWords }}</span>”相关的歌单
    </div>
  </div>
</template>

<script>
import {
  _getSearchInfo
} from '@/ajax/search'

export default {
  data(){
    return {
      playLists: null,                              //当前页的单曲
      limit: 15,                                  //单曲一页的限制
      playListNum: -1,                              //单曲搜索数量，如果是-1，则还没请求数据更新
      currentPage: 1,                             //当前页码
    }
  },
  props: ['keyWords'],
  watch: {
    keyWords(val){            //当搜索关键字变化的时候，下面内容必须要跟着变化
      this.playLists = null,
      this.playListNum = -1
      this.currentPage = 1
      this.getSearchInfo(val, 1000, (this.currentPage - 1) * this.limit)
    }
  },
  created(){
    this.getSearchInfo(this.keyWords, 1000, (this.currentPage - 1) * this.limit)
  },
  computed: {
    playListPage(){
      if(this.playListNum !== -1){
        return Math.ceil(this.playListNum / this.limit)
      } else {
        return 1
      }
    },
  },
  methods: {
    currentChange(page){
      this.currentPage = page
      this.playLists = null
      this.getSearchInfo(this.keyWords, 1000, (this.currentPage - 1) * this.limit)
    },
    getSearchInfo(keywords, type, offset, limit = this.limit){
      _getSearchInfo(keywords, type, offset, limit).then(res => {
        // console.log(res.data.result.playlists)
        this.playListNum = res.data.result.playlistCount
        this.setTitle(this.playListNum)
        this.playLists = res.data.result.playlists
      }).catch(res => {
        console.log('请求搜索歌单失败！', res)
      })
    },
    setTitle(num){
      let str = `找到了 ${num} 个歌单`
      this.$emit('changeDescr', str, 'PlayList')
    },
    toPath(id){
      this.$router.push({
        name: 'playList',
        query: {
          id
        }
      })
    }
  }
}
</script>

<style lang="scss">
.playListSearch {
  .playListTable {
    table-layout: fixed;
    width: 100%;
    font-size: 12px;
    color: rgb(37,37,37,0.8);
    border: 1px solid rgb(37,37,37,0.1);
    margin-bottom: 30px;

    img{
      width: 40px;
      height: 40px;
    }

    td {
      padding: 10px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    tr:nth-child(odd){
      background-color: #f5f5f7;
    }

    tr:hover {
      background-color: #ebeced;
    }
  }
}
</style>
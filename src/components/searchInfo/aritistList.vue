<template>
  <div class="artistList">
    <template v-if="artistNum > 0">
      <div class="artists">
        <table v-if="artists" class="artistsTable">
          <tr v-for="(artist, index) in artists" :key="'artist' + index" @click="toPath(artist.id)">
            <td style="width:20px;"></td>
            <td style="width: 60px;">
              <img :src="artist.img1v1Url">
            </td>
            <td>
              <span style="color:#000;">{{ artist.name }}</span>
              <span v-if="artist.alias[0]">（{{ artist.alias[0] }}）</span>
            </td>
          </tr>
        </table>
      </div>
      <div style="display:flex;flex-direction: row;justify-content: center;">
        <el-pagination
          v-if="artistsPage > 1 && artists"
          layout="prev, pager, next"
          :page-count="artistsPage"
          :current-page="currentPage"
          @current-change="currentChange"
        ></el-pagination>
      </div>
    </template>
    <div v-if="!artistNum" style="font-size: 12px;padding: 30px;text-align: center;">
      很抱歉，未能搜到与“<span style="color:#0c73c2;">{{ keyWords }}</span>”相关的歌手
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
      artists: null,                              //当前页的单曲
      limit: 10,                                  //单曲一页的限制
      artistNum: -1,                              //单曲搜索数量，如果是-1，则还没请求数据更新
      currentPage: 1,                             //当前页码
    }
  },
  props: ['keyWords'],
  watch: {
    keyWords(val){            //当搜索关键字变化的时候，下面内容必须要跟着变化
      this.artists = null,
      this.artistNum = -1
      this.currentPage = 1
      this.getSearchInfo(val, 100, (this.currentPage - 1) * this.limit)
    }
  },
  created(){
    this.getSearchInfo(this.keyWords, 100, (this.currentPage - 1) * this.limit)
  },
  computed: {
    artistsPage(){
      if(this.artistNum !== -1){
        return Math.ceil(this.artistNum / this.limit)
      } else {
        return 1
      }
    },
  },
  methods: {
    currentChange(page){
      this.currentPage = page
      this.artists = null
      this.getSearchInfo(this.keyWords, 100, (this.currentPage - 1) * this.limit)
    },
    getSearchInfo(keywords, type, offset, limit = this.limit){
      _getSearchInfo(keywords, type, offset, limit).then(res => {
        // console.log(res.data.result.artists)
        this.artistNum = res.data.result.artistCount
        this.setTitle(this.artistNum)
        this.artists = res.data.result.artists
      }).catch(res => {
        console.log('请求搜索歌手失败！', res)
      })
    },
    setTitle(num){
      let str = `找到了 ${num} 位歌手`
      this.$emit('changeDescr', str, 'AritistList')
    },
    toPath(id){
      this.$router.push({
        name: 'artist',
        query: {
          id
        }
      })
    }
  }
}
</script>

<style lang="scss">
.artistsTable {
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
</style>
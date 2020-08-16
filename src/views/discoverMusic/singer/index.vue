<template>
  <div class="singer">
    <div class="changeParam">
      <div class="tags" style="margin-bottom:20px;">
        <div>语种:</div>
        <div class="tag" v-for="(tag1, index) in areaTags" :key="'tag1' + index">
          <div class="tagName" :class="[tag1.param === area ? 'checked4' : '']" @click="changeTags(tag1.param, 'area')">{{ tag1.name }}</div>
          <div v-if="index < areaTags.length - 1" style="border-left:1px solid rgb(37,37,37,0.6);height:10px;margin:0 5px;"></div>
        </div>
      </div>
      <div class="tags">
        <div>分类:</div>
        <div class="tag" v-for="(tag2, index) in typeTags" :key="'tag2' + index">
          <div class="tagName" :class="[tag2.param === type ? 'checked4' : '']" @click="changeTags(tag2.param, 'type')">{{ tag2.name }}</div>
          <div v-if="index < typeTags.length - 1" style="border-left:1px solid rgb(37,37,37,0.6);height:10px;margin:0 5px;"></div>
        </div>
      </div>
    </div>
    <div v-if="artists" class="artist">
      <div class="artistList">
        <div class="artistBox" v-for="(artist, index) in artists" :key="'artist' + index" @click="toPath(artist.id)">
          <img :src="artist.picUrl">
          <div style="font-size:12px;margin-top:5px;">{{ artist.name }}</div>
        </div>
      </div>
      <div style="display:flex;flex-direction: row;justify-content: center;">
        <el-pagination
          layout="prev, pager, next"
          :page-count="5"
          :current-page="currentPage"
          @current-change="currentChange"
        ></el-pagination>
      </div>
    </div>
    
  </div>
</template>

<script>
import {
  _getArtistList
} from '@/ajax/artist'

let areaTags = [
  {name: '全部', param: -1},
  {name: '华语', param: 7},
  {name: '欧美', param: 96},
  {name: '日本', param: 8},
  {name: '韩国', param: 16},
  {name: '其他', param: 0},
]
let typeTags = [
  {name: '全部', param: -1},
  {name: '男歌手', param: 1},
  {name: '女歌手', param: 2},
  {name: '乐队组合', param: 3},
]

export default {
  data (){
    return {
      area: -1,                      //语种，这两个取值的含义在 @/ajax/artist 里面有解释并与其保持一致
      type: -1,                      //分类
      currentPage: 1,                //当前页码
      artists: null,                 //当前选项当前页的歌手信息
      areaTags,                      
      typeTags,
      limit: 90,                     //限制每页数量，主要用于请求，写在这里比较方便
    }
  },
  created(){
    this.getArtistList(this.area, this.type, (this.currentPage - 1) * this.limit)
  },
  methods: {
    getArtistList(area, type, offset, limit = this.limit, initial = -1){
      _getArtistList(area, type, offset, limit, initial).then(res => {
        if(res.data.code === 200){
          // console.log(res.data.artists)
          this.artists = res.data.artists
        }
      }).catch(res => {
        console.log('获取歌手分类信息失败！', res)
      })
    },
    currentChange(page){
      this.currentPage = page
      this.artists = null
      this.getArtistList(this.area, this.type, (this.currentPage - 1) * this.limit)
    },
    changeTags(param1, param2){
      if(this[param2] === param1){
        return
      }
      this[param2] = param1
      this.artists = null
      this.currentPage = 1

      this.getArtistList(this.area, this.type, (this.currentPage - 1) * this.limit)
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
.singer {
  width: 100%;

  .changeParam {
    padding: 10px 0;
    margin-bottom: 20px;

    .tags {
      display: flex;
      flex-direction: row;
      font-size: 12px;
      line-height: 20px;
      color: rgb(37,37,37,0.8);

      .tag {
        display: flex;
        flex-direction: row;
        align-items: center;
        
        .tagName {
          padding: 0 5px;
          margin: 0 10px;
          text-align: center;
          &:hover {
            cursor: pointer;
            color: #000;
          }
        }
      }
    }
  }

  .artist {
    border-top: solid 1px #e1e1e2;

    .artistList {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: space-between;
      width: 100%;
      margin-bottom: 40px;
    }

    .artistBox {
      width: 150px;
      margin-top: 30px;

      &:hover {
        cursor: pointer;
      }

      img {
        width: 150px;
        height: 150px;
      }
    }
  }
}
.checked4 {
  color: #ffffff;
  background-color: #8f9096;
  border-radius: 2px;

  &:hover {
    color: #ffffff !important;
  }
}
</style>
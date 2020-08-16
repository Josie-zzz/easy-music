<template>
  <div class="songListAll">
    <div class="hotTags" v-if="tags">
      <div style="color:#000;padding:0;border:none;">热门标签:</div>
      <div :class="[currentTag === '全部' ? 'checked3' : '']" @click="changeTag('全部')">全部</div>
      <div v-for="(tag, index) in tags" :class="[currentTag === tag.name ? 'checked3' : '']" :key="'tag' + index" @click="changeTag(tag.name)">{{ tag.name }}</div>
    </div>
    <div class="songListMain" v-if="songList">
      <div class="songListBox">
        <div class="songBox" v-for="(song, index) in songList" :key="'song' + index" @click="showPlayList(song.id)">
          <img :src="song.coverImgUrl" />
          <p>{{ song.name }}</p>
          <div class="playCount">
            <div class="iconfont">&#xe652;</div>
            <div>{{ song.playCount }}</div>
          </div>
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
  _getListHotTags,
  _getTopPlayList
} from '@/ajax/discover'

export default {
  data(){
    return {
      tags: null,                    //热门标签
      currentTag: '全部',            //当前被选中的标签
      songList: null,                //换页或者标签都会替换这个数组
      currentPage: 1,                //当前页码
      limit: 100,                     //限制每页数量，主要用于请求，写在这里比较方便
    }
  },
  created(){
    //请求热门tags
    _getListHotTags().then(res => {
      if(res.data.code === 200){
        // console.log(res.data.tags)
        this.tags = res.data.tags
      }
    }).catch(res => {
      console.log('请求热门标签失败！', res)
    })

    //根据标签请求歌单
    this.getTopPlayList(this.currentTag, (this.currentPage - 1) * this.limit)
  },
  methods: {
    currentChange(page){                                          //当页码变化的时候处理的事件
      this.currentPage = page
      this.songList = null
      this.getTopPlayList(this.currentTag, (page - 1) * this.limit)
    },
    getTopPlayList(cat, offset, limit = this.limit){        //根据当前信息请求当前显示歌单
      _getTopPlayList(cat, offset, limit).then(res => {
        if(res.data.code === 200){
          // console.log(res.data)
          //处理显示听歌单人数的输出格式
          res.data.playlists.forEach(val => {
            val.playCount = val.playCount < 100000 ? val.playCount : Math.floor(val.playCount/10000) + '万'
          });
          // 保存当前请求的数据
          this.songList = res.data.playlists
        }
      }).catch(res => {
        console.log('请求精选歌单失败！', res)
      })
    },
    changeTag(tag){
      if(tag === this.currentTag){
        return
      }
      this.currentTag = tag
      this.songList = null
      this.currentPage = 1
      this.getTopPlayList(this.currentTag, (this.currentPage - 1) * this.limit)
      console.log(this.currentTag)
    },
    showPlayList(id){
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
.songListAll {
  .hotTags {
    display: flex;
    flex-direction: row;
    font-size: 12px;
    color: rgba(37, 37, 37, 0.8);

    div {
      padding: 0 10px;

      &:hover {
        cursor: pointer;
        color: #cf2f2f;;
      }
    }
  }
}
.songListMain {
  .songListBox {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    padding-top: 15px;

    .songBox {
      position: relative;
      width: 180px;
      margin-bottom: 40px;

      &:hover {
        cursor: pointer;
      }

      img {
        width: 180px;
        height: 180px;
      }

      p {
        font-size: 14px;
        line-height: 20px;
        word-break: break-all;
      }

      .playCount {
        position: absolute;
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        top: 0;
        right: 0;
        width: 50%;
        padding-right: 5px;
        font-size: 12px;
        color: #ffffff;
        line-height: 20px;
        background: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.4)); //渐变

        .iconfont {
          font-size: 14px;
          margin-right: 3px;
        }
      }
    }
  }
}
.checked3 {
  color: #cf2f2f;
}
</style>
<template>
  <div class="video">
    <template v-if="videosNum > 0">
      <div class="mv">
        <div class="mvBox" v-for="(video, index) in videos" :key="'video' + index" @click="toPath(video.vid, video.type)">
          <div class="mvImg">
            <img :src="video.coverUrl" />
            <div class="playCount">
              <div class="iconfont">&#xe652;</div>
              <div>{{ video.playTime }}</div>
            </div>
            <div class="duration">{{ video.durationms }}</div>
          </div>
          <p style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">{{ video.title }}</p>
        </div>
      </div>
      <div style="display:flex;flex-direction: row;justify-content: center;">
        <el-pagination
          v-if="videosPage > 1 && videos"
          layout="prev, pager, next"
          :page-count="videosPage"
          :current-page="currentPage"
          @current-change="currentChange"
        ></el-pagination>
      </div>
    </template>
    <div v-if="!videosNum" style="font-size: 12px;padding: 30px;text-align: center;">
      很抱歉，未能搜到与“<span style="color:#0c73c2;">{{ keyWords }}</span>”相关的视频
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
      videos: null,                               //当前页的视频
      limit: 20,                                  //单曲一页的限制
      videosNum: -1,                              //单曲搜索数量，如果是-1，则还没请求数据更新
      currentPage: 1,                             //当前页码
    }
  },
  props: ['keyWords'],
  watch: {
    keyWords(val){            //当搜索关键字变化的时候，下面内容必须要跟着变化
      this.videos = null,
      this.videosNum = -1
      this.currentPage = 1
      this.getSearchInfo(val, 1014, (this.currentPage - 1) * this.limit)
    }
  },
  created(){
    this.getSearchInfo(this.keyWords, 1014, (this.currentPage - 1) * this.limit)
  },
  computed: {
    videosPage(){
      if(this.videosNum !== -1){
        return Math.ceil(this.videosNum / this.limit)
      } else {
        return 1
      }
    },
  },
  methods: {
    getSearchInfo(keywords, type, offset, limit = this.limit){
      _getSearchInfo(keywords, type, offset, limit).then(res => {
        // console.log(res.data.result.artists)
        this.videosNum = res.data.result.videoCount
        this.setTitle(this.videosNum)
        res.data.result.videos.forEach(val => {
          val.playTime = this.$transPlayCount(val.playTime)      
          val.durationms = this.$transDuration(val.durationms)
        });
        this.videos = res.data.result.videos
      }).catch(res => {
        console.log('请求搜索视频失败！', res)
      })
    },
    setTitle(num){
      let str = `找到了 ${num} 个视频`
      this.$emit('changeDescr', str, 'Video')
    },
    currentChange(page){
      this.currentPage = page
      this.videos = null
      this.getSearchInfo(this.keyWords, 1014, (this.currentPage - 1) * this.limit)
    },
    toPath(id, ty){
      let type = ''
      switch(ty){
        case 0: type = 'mv';break;
        case 1: type = 'video';break;
      }
      this.$router.push({
        name: 'audio',
        query: {
          id,
          type
        }
      })
    }
  }
}
</script>

<style lang="scss">
.mv {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 1000px;
  margin: 0 auto;
  padding: 30px;

  .mvBox {
    width: 160px;
    margin-bottom: 40px;

    &:hover {
      cursor: pointer;
    }

    .mvImg {
      position: relative;

      img {
        width: 160px;
        // height: 100px;
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

      .duration {
        position: absolute;
        left: 5px;
        bottom: 3px;
        font-size: 12px;
        color: #ffffff;
      }
    }

    p {
      font-size: 14px;
      line-height: 20px;
      word-break: break-all;
    }

    
  }
}
</style>
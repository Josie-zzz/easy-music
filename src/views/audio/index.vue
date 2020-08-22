<template>
  <div class="audio parent-dom">
    <myScroll>
      <div v-if="details" class="child-dom">
        <div class="left">
          <h2>
            <span style="font-size:18px;margin-right:10px;">{{ details.title }}</span>
            <span style="font-size:12px;">
              <span v-if="type === 'video'" style="margin-right:3px;">by</span>
              <span>{{ details.creator }}</span>
            </span>
          </h2>
          <!-- 注意src是不能动态的改变的，一开始为'',即使后面有了url也不会播放 -->
          <video controls autoplay> 
            <source v-if="url" :src="url" type="video/mp4">
            您的浏览器不支持video标签
          </video>
          <div class="play3">
            <button v-if="details.praisedCount">赞({{ details.praisedCount }})</button>
            <button>收藏({{ details.subscribeCount }})</button>
            <button>分享({{ details.shareCount }})</button>
          </div>
          <div style="font-size: 18px;padding-bottom: 8px;">
            <span>评论</span>
            <span style="font-size:12px;color:rgb(37,37,37,0.6);margin-left:5px;">({{ details.commentCount }})</span>
          </div>
          <Comments :id="id" :commentCount="details.commentCount" :commentType="type" style="padding:20px 0;"></Comments>
        </div>
        <div class="right">
          <!-- 视频介绍 -->
          <div class="videoDesc">
            <div class="title" style="color:#000;">视频介绍</div>
            <div style="display:flex;flex-direction:row;justify-content:space-between;margin-bottom: 20px;">
              <div>
                <span class="titleSmall">发布时间:</span>
                <span>{{ details.publishTime }}</span>
              </div>
              <div>
                <span class="titleSmall">播放次数:</span>
                <span>{{ details.playCount }}</span>
              </div>
            </div>
            <div v-if="details.description" style="margin-bottom:20px;">
              <span class="titleSmall">简介:</span>
              <span>{{ details.description }}</span>
            </div>
            <div v-if="details.tags" style="margin-bottom:20px;">
              <span class="titleSmall">标签:</span>
              <span style="color:rgb(12, 115, 194);">{{ details.tags }}</span>
            </div>
          </div>
        </div>
      </div>
    </myScroll>
  </div>
</template>

<script>
import {
  _getMvDetail,
  _getMvUrl,
  _getVideoDetail,
  _getVideoUrl,
} from '@/ajax/video'
import Comments from '@/components/playList/comments'

export default {
  data(){
    return {
      id: this.$route.query.id,                    //视频id
      type: this.$route.query.type,                //mv/vedio，判断视频类型
      url: '',                                     //视频url
      details: null,                               //视频详情
    }
  },
  created(){
    switch(this.type){       //type这两个值最好不要变，因为也会影响评论那边的判断请求
      case 'mv': this.getMvAll();break;
      case 'video': this.getVideoAll();break;
    }
  },
  components: {
    Comments
  },
  methods: {
    getMvAll(){
      _getMvDetail(this.id).then(res => {
        // console.log(res.data.data)
        this.details = this.processMv(res.data.data)
      }).catch(res => {
        console.log('获取mv详情失败！', res)
      })

      _getMvUrl(this.id).then(res => {
        // console.log(res.data.data)
        this.url = res.data.data.url
      }).catch(res => {
        console.log('获取mv地址失败！', res)
      })
    },
    getVideoAll(){
      _getVideoDetail(this.id).then(res => {
        // console.log(res.data.data)
        this.details = this.processVideo(res.data.data)
      }).catch(res => {
        console.log('获取video详情失败！', res)
      })
      
      _getVideoUrl(this.id).then(res => {
        // console.log(res.data.urls)
        this.url = res.data.urls[0].url
      }).catch(res => {
        console.log('获取video地址失败！', res)
      })
    },
    processVideo(data){
      return {
        title: data.title,
        creator: data.creator.nickname,
        description: data.description,
        publishTime: this.$transDate(data.publishTime),
        playCount: this.$transPlayCount(data.playTime),
        tags: this.$transSinger(data.videoGroup),
        praisedCount: data.praisedCount,
        commentCount: data.commentCount,
        shareCount: data.shareCount,
        subscribeCount: data.subscribeCount
      }
    },
    processMv(data){
      return {
        title: data.name,
        creator: data.artistName,
        description: data.desc,
        publishTime: data.publishTime,
        playCount: this.$transPlayCount(data.playCount),
        tags: '',
        praisedCount: '',                 //mv的点赞需要在请求一个url才能获取到，麻烦，算了
        commentCount: data.commentCount,
        shareCount: data.shareCount,
        subscribeCount: data.subCount
      }
    }
  }  
}
</script>

<style lang="scss">
.audio {
  width: 100%;
  height: 100%;

  .child-dom {
    display: flex;
    flex-direction: row;
    width: 1000px;
    margin: 0 auto;
    padding-top: 30px;
  }

  .left {
    width: 700px;
    height: 500px;
    margin-right: 30px;

    h2 {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-bottom: 8px;
    }

    video {
      width: 100%;
      margin-bottom: 20px;

      &:focus {
        outline: none
      }
    }

    .play3 {
      margin-bottom: 50px;
      font-size: 12px;
      color: rgb(37,37,37);

      button {
        height: 26px;
        padding: 0 10px;
        line-height: 26px;
        margin-right: 10px;
        border-radius: 4px;
        background-color: #fff;
        border: solid 1px #e1e1e2;

        &:hover {
          cursor: pointer;
        }

        &:focus {
          outline: none !important;
        }
      }
    }
  }

  .right {
    height: 400px;
    flex: 1;

    .title {
      font-size: 18px;
      padding-bottom: 7px;
      border-bottom: 1px solid rgb(225 225 226 / 80%);
      margin-bottom: 5px;
    }

    .videoDesc {
      font-size: 12px;
      color: rgb(37,37,37,0.8);

      .titleSmall {
        margin-right: 5px;
      }
    }
  }
}
</style>
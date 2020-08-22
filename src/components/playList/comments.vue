<template>
  <div class="playlist-comments">
    <div class="com-text">
      <el-input
        type="textarea"
        placeholder="快来评论吧！"
        v-model="message"
        minlength="1"
        maxlength="140"
        rows="3"
        resize="none"
        show-word-limit
      ></el-input>
      <el-button type="primary" plain>评论</el-button>
    </div>
    <div v-if="hotComments.length" style="margin-bottom:50px">
      <div style="font-size: 12px;line-height: 30px;">精彩评论</div>
      <div class="comlist" v-for="(hotComment, index) in hotComments" :key="'hotCom' + index">
        <img class="avater" :src="hotComment.user.avatarUrl">
        <div style="flex:1;">
          <div style="line-height:18px;">
            <span style="color:#0c73c2;padding-right: 5px;">{{ hotComment.user.nickname }}:</span>
            <span>{{ hotComment.content }}</span>
          </div>
          <div class="info">
            <div>{{ hotComment.newTime }}</div>
            <div class="iconfont" style="font-size:12px">&#xe60b;<span v-if="hotComment.likedCount">{{ '(' +  hotComment.likedCount + ')'}}</span></div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="comments.length">
      <div style="font-size: 12px;line-height: 30px;">最新评论</div>
      <div class="comlist" v-for="(comment, index) in comments" :key="'comm' + index">
        <img class="avater" :src="comment.user.avatarUrl">
        <div style="flex:1;">
          <div style="line-height:18px;">
            <span style="color:#0c73c2;padding-right: 5px;">{{ comment.user.nickname }}:</span>
            <span>{{ comment.content }}</span>
          </div>
          <div class="info">
            <div>{{ comment.newTime }}</div>
            <div class="iconfont" style="font-size:12px">&#xe60b;<span v-if="comment.likedCount">{{ '(' +  comment.likedCount + ')'}}</span></div>
          </div>
        </div>
      </div>
      <div style="display:flex;flex-direction: row;justify-content: center;">
        <el-pagination
          v-if="commentsPage > 1"
          layout="prev, pager, next"
          :page-count="commentsPage"
          :current-page="currentPage"
          @current-change="currentChange"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import {
  _getSongListComments
} from '@/ajax/discover'
import {
  _getCommentVideo,
  _getCommentMv
} from '@/ajax/video'
 
export default {
  data(){
    return {
      message: '',                            //你想输入的评论
      hotComments: [],                      //热门评论,这里的两个值为数组形式，因为有时候会返回没有评论的[]
      comments: [],                         //评论信息
      currentPage: 1,
      limit: 30,
    }
  },
  props: ['id', 'commentCount', 'commentType'],             //这个comment的组件歌单，视频，mv等都在用，用commentType区分
  computed: {
    commentsPage(){
      if(this.commentCount){
        return Math.ceil(this.commentCount / this.limit)
      } else {
        return 1
      }
    }
  },
  created(){
      this.switchRequest()
  },
  methods: {              //判断完type后在请求
    switchRequest(){
      switch(this.commentType){
        case 'playList': this.getComments(this.id, (this.currentPage - 1) * this.limit);break;   //获取当前歌单评论信息
        case 'mv': this.getCommentMv(this.id, (this.currentPage - 1) * this.limit);break;   //获取当前视频评论信息
        case 'video': this.getCommentVideo(this.id, (this.currentPage - 1) * this.limit);break;   //获取当前mv评论信息
      }
    },  
    getComments(id, offset, limit = this.limit){                             //获取歌单评论
      _getSongListComments(id, offset, limit).then(res => {
        // console.log(res.data)
        if(res.data.hotComments){       //分页的话只有第一页有
          this.hotComments = this.transCommTime(res.data.hotComments)
        }
        this.comments = this.transCommTime(res.data.comments)
        // console.log(this.hotComments, this.comments)
      }).catch(res => {
        console.log('请求歌曲列表评论失败！', res)
      })
    },
    getCommentVideo(id, offset, limit = this.limit){                             //获取视频评论
      _getCommentVideo(id, offset, limit).then(res => {
        // console.log(res.data)
        if(res.data.hotComments){       //分页的话只有第一页有
          this.hotComments = this.transCommTime(res.data.hotComments)
        }
        this.comments = this.transCommTime(res.data.comments)
        // console.log(this.hotComments, this.comments)
      }).catch(res => {
        console.log('请求歌曲列表评论失败！', res)
      })
    },
    getCommentMv(id, offset, limit = this.limit){                             //获取mv评论
      _getCommentMv(id, offset, limit).then(res => {
        // console.log(res.data)
        if(res.data.hotComments){       //分页的话只有第一页有
          this.hotComments = this.transCommTime(res.data.hotComments)
        }
        this.comments = this.transCommTime(res.data.comments)
        // console.log(this.hotComments, this.comments)
      }).catch(res => {
        console.log('请求歌曲列表评论失败！', res)
      })
    },
    transCommTime(arr){                      //处理评论时间格式
      arr.forEach(val => {
        let lastTime = this.timeObj(new Date(val.time))
        let nowTime = this.timeObj(new Date())
        if(nowTime.year > lastTime.year){
          let str = `${lastTime.year}年${lastTime.month}月${lastTime.date}日 ${lastTime.hours}:${lastTime.min}`
          val.newTime = str
        } else if(nowTime.date - lastTime.date === 0){
          let str = `${lastTime.hours}:${lastTime.min}`
          val.newTime = str
          // console.log(str)
        } else if(nowTime.date - lastTime.date === 1){
          let str = `昨天 ${lastTime.hours}:${lastTime.min}`
          val.newTime = str
        } else if(nowTime.date - lastTime.date === 2){
          let str = `前天 ${lastTime.hours}:${lastTime.min}`
          val.newTime = str
        } else {
          let str = `${lastTime.month}月${lastTime.date}日 ${lastTime.hours}:${lastTime.min}`
          val.newTime = str
        }
        // console.log(lastTime, nowTime)
      })
      return arr
    },
    timeObj(obj){
      return {
        year: obj.getFullYear(),
        month: obj.getMonth() + 1,
        date: obj.getDate(),
        hours: this.$addZero(obj.getHours()),
        min: this.$addZero(obj.getMinutes())
      }
    },
    currentChange(page){
      this.currentPage = page
      this.comments = null
      this.switchRequest()
    }
  }
}
</script>

<style lang="scss">
.playlist-comments {
  width: 100%;
  padding: 20px 30px;
  border-top: solid 1px #e1e1e2;
}

.com-text {
  padding: 10px;
  background-color: rgb(240, 240, 242);
  margin-bottom: 30px;

  .el-textarea textarea{
    font-size: 12px;
    border: none;
  }

  .el-button {
    float: right;
    font-size: 12px;
    padding: 5px 10px;
    margin-top: 10px;
  }

  &:after{
    display: block;
    content: '';
    clear: both;
  }
}

.comlist {
  display: flex;
  flex-direction: row;
  padding: 15px 0;
  border-top: 1px solid #efefef;
  font-size: 12px;
  color: rgba(37, 37, 37);

  .avater{
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 20px;
  }

  .info {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    color: rgba(37, 37, 37, 0.6);
    margin-top: 8px;
  }
}


</style>
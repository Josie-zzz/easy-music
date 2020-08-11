<template>
  <div class="playList parent-dom">
    <myScroll>
      <div class="child-dom">
        <!-- 歌单上面基本信息 -->
        <div class="playTitle" v-if="playTitle">
          <img class="avater"  :src="playTitle.coverImgUrl">
          <div class="playRight">
            <div class="play1">
              <div class="playtxt"> 
                <div style="font-size: 12px;color: #cf2f2f;border: 1px solid #cf2f2f;width: 35px;height: 20px;text-align: center;border-radius: 2px;margin-right: 5px;">歌单</div>
                <div style="font-size: 22px;">{{ playTitle.name }}</div>
              </div>
              <div class="playtxt" style="font-size: 12px;color: rgb(37,37,37,0.5);text-align: end;">
                <div style="padding: 0 10px;border-right: 1px solid rgb(37,37,37,0.5);">
                  <div>歌曲数</div>
                  <div style="font-weight:600">{{ playTitle.trackCount }}</div>
                </div>
                <div style="padding: 0 10px;">
                  <div>播放数</div>
                  <div style="font-weight:600">{{ playTitle.playCount }}</div>
                </div>
              </div>
            </div>
            <div class="play2">
              <img class="creator" :src="playTitle.avatarUrl">
              <div style="margin-right: 15px;font-size:14px;color:rgba(37, 37, 37, 1);">{{ playTitle.nickname }}</div>
              <div style="font-size:12px;color:rgba(37, 37, 37, 0.8);">{{ playTitle.birthday }}</div>
            </div>
            <div class="play3">
              <button style="background-color: rgb(198, 47, 47);color: rgb(255, 255, 255);">播放全部</button>
              <button style="background-color: #fff;border: solid 1px #e1e1e2;">收藏({{playTitle.subscribedCount}})</button>
              <button style="background-color: #fff;border: solid 1px #e1e1e2;">分享({{playTitle.shareCount}})</button>
            </div>
            <div class="play4">
              <div style="color: #000;margin-right:10px;">标签:</div>
              <div>{{ playTitle.tags }}</div>
            </div>
            <div class="play5" style="font-size:12px;">
              <div style="display: inline-block;margin-right:10px;">简介:</div>
              <span style="">{{ playTitle.description }}</span>
            </div>
          </div>
        </div>
        <!-- 歌单下面呢详细信息 -->
        <div class="playInfo">
          <ul class="playList-bar">
            <li :class="[currentCom === 'Songs' ? 'checked2' : '']"  @click="() => switchTo('Songs')">歌曲列表</li>
            <li :class="[currentCom === 'Comments' ? 'checked2' : '']" @click="() => switchTo('Comments')">评论{{ commentCount }}</li>
            <li :class="[currentCom === 'Subscribers' ? 'checked2' : '']" @click="() => switchTo('Subscribers')">收藏者</li>
          </ul>
          <keep-alive>
            <component v-bind:is="currentCom" :songs="songs"></component>
          </keep-alive>
        </div>
      </div>
    </myScroll>
    
  </div>
</template>

<script>
import Songs from '@/components/playList/songs'
import Comments from '@/components/playList/comments'
import Subscribers from '@/components/playList/subscribers'
import {
  _getPlayList,
  _getSongDetail
} from '@/ajax/discover'

export default {
  data(){
    return {
      id: this.$route.query.id,               //歌单id
      playTitle: null,                        //歌单基本信息
      commentCount: null,                     //单独写出来避免一开始异步请求没有数据而显示null报错
      currentCom: 'Songs',                    //当前显示的组件
      trackIds: null,                         //当前歌单的所有歌曲的id的对象列表
      songs: null,                            //储存当前歌单所有歌曲详细信息
    }
  },
  components: {
    Songs,
    Comments,
    Subscribers
  },
  created(){
    this.getPlayListAll()
  },
  methods: {
    switchTo(com){
      this.currentCom = com
    },
    async getPlayListAll(){                        //获取歌单所有信息
      //获取歌单详细信息，并储存歌单列表
      if(this.id){
        await _getPlayList(this.id).then(res => {
          // console.log(res.data)
          if(res.data.code === 200){
            this.processPlayList(res.data.playlist)
            this.trackIds = res.data.playlist.trackIds
          }
        }).catch(res => {
          console.log('获取详细信息失败！', res)
        })
      }
      //提取所有歌曲id
      let arr = []
      let trackIds = ''
      this.trackIds.forEach(val => {
        arr.push(val.id)
      })
      trackIds = arr.join()
      // console.log(trackIds)
      //根据歌单列表请求所有歌曲
      _getSongDetail(trackIds).then(res => {
        if(res.data.code === 200){
          // console.log(res)
          //处理songs的信息再储存
          this.processSongs(res.data.songs)
        }
      }).catch(res => {
        console.log('请求歌曲详细信息失败！', res)
      })
      
    },
    processPlayList(playlist){                  //处理返回的信息
      let obj = {
        coverImgUrl: playlist.coverImgUrl,
        name: playlist.name,
        trackCount: playlist.trackCount,
        playCount: this.transCount(playlist.playCount),
        avatarUrl: playlist.creator.avatarUrl,
        nickname: playlist.creator.nickname,
        birthday: this.transDate(playlist.createTime),
        subscribedCount: playlist.subscribedCount,
        shareCount: playlist.shareCount,
        tags: this.transTags(playlist.tags),
        description: playlist.description,
      }
      // console.log(playlist)
      this.playTitle = obj
      //储存当前歌单的所有歌曲
      this.trackIds = playlist.trackIds
      //当前评论数
      this.commentCount = '(' + playlist.commentCount + ')'
      // console.log(this.trackIds)
    },
    transDate(date){                           //处理日期输出格式
      let d = new Date(date)
      return `${d.getFullYear()}-${d.getUTCMonth() + 1}-${d.getUTCDate()}创建`
    },
    transCount(count){                         //处理播放数格式
      return count < 100000 ? count : Math.floor(count / 10000) + '万'
    },
    transTags(tags){
      let str = ''
      let len = tags.length
      tags.forEach((val, index) => {
        if(index < len - 1){
          val = val + '/'
        }
        str = str + val
      })
      return str
    },
    processSongs(oldSongs){
      let newSongs = []
      oldSongs.forEach((val, index) => {
        index = index + 1
        let obj = {
          index: index < 10 ? '0' + index : index,
          musicTitle: val.name,
          musicAlia: val.alia[0],
          singers: this.transSinger(val.ar),
          album: val.al.name,
          timeLen: this.transTimeLen(val.dt)
        }
        newSongs.push(obj)
      })
      this.songs = newSongs
      console.log(this.songs)
    },
    transSinger(ar){
      let str = ''
      let len = ar.length
      ar.forEach((val, index) => {
        let name = val.name
        if(index < len - 1){
          name = name + '/'
        }
        str = str + name
      })
      return str
    },
    transTimeLen(time){
      time = Math.floor(time / 1000)
      let min = Math.floor(time / 60)
      let se = time % 60
      min = min < 10 ? '0' + min : min
      se = se < 10 ? '0' + se : se
      return min + ':' + se
    }
  }
}
</script>

<style lang="scss">
.playList {
  width: 100%;
  height: 100%;

  .playTitle {
    display: flex;
    flex-direction: row;
    width: 1000px;
    margin: 0 auto;
    padding-top: 30px;
    margin-bottom: 60px;

    .avater {
      width: 200px;
      height: 200px;
      margin-right: 30px;
    }

    .playRight {
      flex: 1;
      height: 200px;

      .play1 {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        height: 40px;

        .playtxt {
          display: flex;
          flex-direction: row;
          align-items: center;
        }
      }

      .play2 {
        display: flex;
        flex-direction: row;
        align-items: center;

        .creator {
          width: 30px;
          height: 30px;
          margin-right: 10px;
          border-radius: 50%;
        }
      }

      .play3 {
        margin: 15px 0;
        font-size: 12px;
        color: rgb(37,37,37);

        button {
          height: 26px;
          padding: 0 10px;
          line-height: 26px;
          margin-right: 10px;
          border-radius: 4px;

          &:hover {
            cursor: pointer;
          }
        }
      }

      .play4 div {
        display: inline-block;
        font-size: 12px;
        color: rgb(0 97 180 / 0.8);
      }

      .play5{
        width: 700px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-top: 10px;
      }
    }
  }

  .playInfo {
    width: 100%;

    .playList-bar li {
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

<template>
  <div class="playList parent-dom">
    <myScroll>
      <div class="child-dom">
        <!-- 歌单上面基本信息 -->
        <div class="playTitle" v-if="playTitle">
          <img class="avater"  :src="playTitle.coverImgUrl">
          <div class="playRight">
            <div class="play1">
              <div class="playtxt1" style="width:650px;"> 
                <div style="font-size: 12px;color: #cf2f2f;border: 1px solid #cf2f2f;width: 35px;height: 20px;text-align: center;border-radius: 2px;margin-right: 5px;">歌单</div>
                <div style="font-size: 22px;">{{ playTitle.name }}</div>
              </div>
              <div class="playtxt2" style="font-size: 12px;color: rgb(37,37,37,0.5);text-align: end;">
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
              <div style="font-size:12px;color:rgba(37, 37, 37, 0.8);">{{ playTitle.birthday }}创建</div>
            </div>
            <div class="play3">
              <button style="background-color: rgb(198, 47, 47);color: rgb(255, 255, 255);" @click="addSongListToList(songs)">播放全部</button>
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
          <div>
            <ul class="playList-bar">
              <li :class="[currentCom === 'Songs' ? 'checked2' : '']"  @click="() => switchTo('Songs')">歌曲列表</li>
              <li :class="[currentCom === 'Comments' ? 'checked2' : '']" @click="() => switchTo('Comments')">评论<span v-if="commentCount">{{ '(' + commentCount + ')' }}</span></li>
              <li :class="[currentCom === 'Subscribers' ? 'checked2' : '']" @click="() => switchTo('Subscribers')">收藏者</li>
            </ul>
          </div>
          <keep-alive>
            <component v-bind:is="currentCom" :commentCount="commentCount" :songs="songs" :id="id" commentType="playList"></component>
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
  _getSongDetail,
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
    //获取歌单详细信息，并根据其中歌曲id列表获得所有歌曲详细信息
    this.getPlayListAll()
  },
  methods: {
    switchTo(com){
      this.currentCom = com
    },
    async getPlayListAll(){                      //获取歌单所有信息
      //获取歌单详细信息，并储存歌单列表
      if(this.id){
        await _getPlayList(this.id).then(res => {
          // console.log(res.data)
          this.processPlayList(res.data.playlist)
          this.trackIds = res.data.playlist.trackIds
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
        // console.log('res.data.songs', res.data.songs)
        //处理songs的信息再储存
        this.processSongs(res.data.songs)
      }).catch(res => {
        console.log('请求歌曲详细信息失败！', res)
      })
      
    },
    processPlayList(playlist){                  //处理返回的信息
      let obj = {
        coverImgUrl: playlist.coverImgUrl,
        name: playlist.name,
        trackCount: playlist.trackCount,
        playCount: this.$transPlayCount(playlist.playCount),
        avatarUrl: playlist.creator.avatarUrl,
        nickname: playlist.creator.nickname,
        birthday: this.$transDate(playlist.createTime),
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
      this.commentCount = playlist.commentCount 
      // console.log(this.trackIds)
    },
    transTags(tags){                           //拼接所有tags标签
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
    processSongs(oldSongs){                    //处理歌曲对象的信息
      let newSongs = []
      oldSongs.forEach((val, index) => {
        index = index + 1
        let obj = {
          id: val.id,
          index: this.$addZero(index),   
          name: val.name,
          alia: val.alia[0] ? val.alia[0] : '',
          singers: this.$transSinger(val.ar),
          album: val.al.name,
          duration: this.$transDuration(val.dt)
        }
        newSongs.push(obj)
      })
      this.songs = newSongs
      // console.log(this.songs)
    },
    addSongListToList(songList){
      this.$MessageBox.confirm('点击全部播放会替换掉当前播放列表，是否继续？', '替换播放列表', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.commit('addSongList', songList)
        this.$Message({
          type: 'success',
          message: '替换成功'
        });
      }).catch(() => {
        console.log('取消被点击了')
      })
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
        align-items: flex-start;
        margin-bottom: 15px;

        .playtxt1 {
          display: flex;
          flex-direction: row;
          align-items: center;
        }

        .playtxt2 {
          display: flex;
          flex-direction: row;
          align-items: center;
        }
      }

      .play2 {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-bottom: 15px;

        .creator {
          width: 30px;
          height: 30px;
          margin-right: 10px;
          border-radius: 50%;
        }
      }

      .play3 {
        margin-bottom: 15px;
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

          &:focus {
            outline: none !important;
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
}
</style>

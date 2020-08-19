<template>
  <div class="nav-player">
    <div class="switch">
      <div class="iconfont" @click="() => { selectLast() }">&#xe610;</div>
      <div class="iconParse" @click="switchPlay">
        <div v-show="!isPlay" class="iconfont" style="font-size:34px;">&#xe611;</div>
        <div v-show="isPlay" class="iconfont" style="font-size:34px;">&#xe616;</div>
      </div>
      <div class="iconfont" @click="() => { selectNext() }">&#xe612;</div>
    </div>
    <div class="slider">
      <audio ref="playAudio"
        :loop="loop"
        @play="() => { isPlay = true}"
        @pause="() => { isPlay = false}"
        @ended="palyEnd"
        @timeupdate="timeUpdate"
        @loadedmetadata="loadedMetaData"
      >
        <source src="" type="audio/mpeg">
      </audio> 
      <div style="font-size:12px;margin:0 10px;">{{ currentTimeStr }}</div>
      <el-slider 
        v-model="currentTime" 
        :step="1" 
        :min="0" 
        :max="duration" 
        :show-tooltip="false"
        @change="changeCurrentTime"></el-slider>
      <div style="font-size:12px;margin:0 10px;">{{ durationStr }}</div>
    </div>
    <div class="volume">
      <div class="iconVol" @click="volumeOpenClose">
        <div v-show="!silence" class="iconfont">&#xe60a;</div>
        <div v-show="silence" class="iconfont">&#xe609;</div>
      </div>
      <el-slider 
        v-model="volume" 
        :step="0.1" 
        :min="0" 
        :max="10" 
        :show-tooltip="false"></el-slider>
    </div>
    <div class="palyOrder" @click="changeOrder">
      <div v-show="palyOrder === 1" class="iconfont">&#xe648;</div>
      <div v-show="palyOrder === 2" class="iconfont">&#xe614;</div>
      <div v-show="palyOrder === 3" class="iconfont">&#xe613;</div>
      <div v-show="palyOrder === 4" class="iconfont">&#xe60c;</div>
    </div>
    <div class="navPlayListBtn" @click="show">
      <div class="iconfont">&#xe615;</div>
    </div>
    <div v-show="isShow"  class="navPlayList">    
      <div class="title">播放列表</div>
      <div class="total">
        <span>总共{{ musicList.length }}首</span>
        <span class="iconfont" @click="clearThisList">&#xed4d; 清空</span>
      </div>
      <div class="parent-dom">
        <myScroll>
          <table class="playListTable child-dom">
            <tr v-for="(music, index) in musicList" :key="'music' + index" @dblclick="indexThere(index)">
              <td style="width:30px;">
                <span v-show="nowSongIndex === index" class="iconfont" style="font-size:12px;color:#e83c3c;font-weight:600;">&#xe616;</span>
              </td>
              <td>
                <span style="color:#000;margin-right:10px">{{ music.name }}</span>
                <span>{{ music.alia }}</span>
              </td>
              <td style="width:120px;">{{ music.singers }}</td>
              <td style="width:80px;">{{ music.duration }}</td>
            </tr>
          </table>
        </myScroll>
      </div>
    </div>
  </div>
</template>

<script>
import { 
  mapState, 
  mapMutations 
} from 'vuex'
import {
  _getSongUrl
} from '@/ajax/songs'

let oldVolume = 0       //保存的上一次的音量，便于恢复

export default {
  data(){
    return {
      isShow: false,                 //是否显示歌单列表
      palyOrder: 1,                  //播放顺序，1：顺序播放，2：循环播放，3：随机播放,4:单曲循环
      isPlay: false,                 //true表示播放，false表示暂停
      duration: 0,                   //音频时长,单位是秒,原始值
      currentTime: 0,                //当前播放到的时长，只要在播放都会变化,单位时秒,原始值
      volume: 5,                     //音量
      silence: false,                //是否静音
      loop: false,                   //控制是否循环播放
    }
  },
  mounted(){                      //确保在dom被渲染后请求url，在这请求是因为有时候索引已经有值了，比如在刷新的时候，折后时也要保证有歌曲存在
    if(this.nowSongIndex !== -1){
      this.getSongUrl(this.nowSongIndex)
    }
  },
  computed: {
    durationStr(){                   //显示给用户的处理过的时间格式
      return this.$transDuration(this.duration * 1000)         //*1000是因为要与之前获得的duration格式一致，存成毫秒数，没有任何意义
    },
    currentTimeStr(){                //显示给用户的处理过的时间格式
      return this.$transDuration(this.currentTime * 1000)
    },           
    ...mapState(['musicList', 'nowSongIndex'])
  },
  watch: {
    volume(val){              //让音乐声音时刻与设置的一致
      this.$refs.playAudio.volume = val / 10
      // console.log(val / 10)
      if(val){                //volume与silence互相影响，这里是volume影响silence
        this.silence = false
      } else {
        this.silence = true
      }
    },
    nowSongIndex(val){      //监视当前歌曲index的变化，如果是-1则是没有任何要播放的音乐，否则就是有音乐要播放
      // console.log(this.musicList[val].id)
      if(val === -1){       //监视如果有动态变成-1，比如清空列表
        this.$refs.playAudio.src = ''
        this.duration = 0
        this.currentTime = 0
        this.$refs.playAudio.pause()
        return
      }
      this.getSongUrl(val)
    }
  },
  methods: {
    ...mapMutations(['changeNowSongIndex', 'clearList']),
    show(){                               //显示歌单列表开关
      this.isShow = !this.isShow
    },
    changeOrder(){                       //改变播放顺序开关
      this.palyOrder = this.palyOrder % 4 + 1
      if(this.palyOrder === 4){         //选择循环时设置循环开启
        this.loop = true
      } else {
        this.loop = false
      }
    },
    switchPlay(){                        //单曲播放开关
      if(this.$refs.playAudio.src){
        this.isPlay = !this.isPlay
        if(this.isPlay){
          this.$refs.playAudio.play()
        } else {
          this.$refs.playAudio.pause()
        }
      }
    },
    timeUpdate(e){                       //当前音频播放变化时触发这个事件
      // console.log('timeUpdate', e)
      this.currentTime = e.target.currentTime
    },
    loadedMetaData(e){             //指定的音频/视频的元数据已加载时会触发这个事件，元数据包括：时长、尺寸（仅视频）以及文本轨道
      // console.log('loadedMetaData', e)
      // 设置时长
      this.duration = e.target.duration  
      //加载好音乐就播放
      this.$refs.playAudio.play()
      // 设置音量给audio
      this.$refs.playAudio.volume = this.volume / 10
    },
    volumeOpenClose(){              //音量静音开关，silence影响volume
      this.silence = !this.silence
      if(this.silence){
        oldVolume = this.volume
        this.volume = 0
      } else {
        this.volume = oldVolume
      }
    },
    changeCurrentTime(newVal){           //移动滑块改变当前单曲的时间进度,点击没有没问题，滑动有问题，因为这个change是被封装的，暂时没有办法
      // console.log(newVal)
      this.$refs.playAudio.currentTime = newVal
    },
    palyEnd(){                          //当音乐播放完以后触发的事件,如果设置了loop不会触发这个事件
      // console.log('endding')
      this.selectNext() //选择下一首
    },
    selectNext(){             //选择歌曲下一首
      switch(this.palyOrder){
        case 1:                 //顺序
        case 4:                 //单曲循环
          if(this.nowSongIndex < this.musicList.length - 1){
            this.changeNowSongIndex(this.nowSongIndex + 1)
          } else {
            this.$Message({
              type: 'warning',
              message: '已经是最后一首了哦！'
            });
          }
          break
        case 2:                 //循环
          this.changeNowSongIndex((this.nowSongIndex + 1) % this.musicList.length)
          break
        case 3:                 //随机
          this.changeNowSongIndex(Math.floor(Math.random() * this.musicList.length))
          break
      }
    },
    selectLast(){           //选择歌曲上一首
      switch(this.palyOrder){
        case 1:                 //顺序
        case 4:                 //单曲循环
          if(this.nowSongIndex > 0){
            this.changeNowSongIndex(this.nowSongIndex - 1)
          } else {
            this.$Message({
              type: 'warning',
              message: '已经是第一首了哦！'
            });
          }
          break
        case 2:                 //循环
          this.changeNowSongIndex((this.nowSongIndex + this.musicList.length - 1) % this.musicList.length)
          break
        case 3:                 //随机
          this.changeNowSongIndex(Math.floor(Math.random() * this.musicList.length))
          break
      }
    },
    getSongUrl(val){                      //请求歌曲url
      
      _getSongUrl(this.musicList[val].id).then(res => {
        if(!res.data.data[0].url){                    //比如薛之谦的专辑有些歌曲未上架，但请求的id却存在
          this.$Message({
            type: 'error',
            message: '此音乐没有版权播放，请重新选择其他音乐吧'
          });
          this.$refs.playAudio.src = ''
        }
        this.$refs.playAudio.src = res.data.data[0].url
        // console.log(res)
      }).catch(res => {
        console.log('请求歌曲url失败！', res)
      })
    },
    indexThere(index){                                   //点击列表中的单曲可以切换
      this.changeNowSongIndex(index)
    },
    clearThisList(){
      if(!this.musicList.length){
        return
      }
      this.$MessageBox.confirm('是否要清空播放列表？', '提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.clearList()
        this.$Message({
          type: 'success',
          message: '已清空'
        });
      }).catch(() => {
        console.log('清空播放列表被取消了')
      })
    }
  }
}
</script>

<style lang="scss">
.nav-player {
  z-index: 1000;
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 50px;
  border-top: #e1e1e2 solid 1px;
  background-color: #f6f6f8;

  .switch {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 200px;
    height: 100%;
    padding: 0 30px;

    .iconParse:hover {
      cursor: pointer;
    }

    .iconfont {
      font-size: 30px;
      color: #e83c3c;

      &:hover {
        cursor: pointer;
      }
    }
  }

  .slider {
    display: flex;
    flex-direction: row;
    align-items: center;
    
    .el-slider {
      width: 600px;
    }
  }

  .el-slider__bar {
    background-color: #e83c3c;
  }

  .el-slider__button{
    border-color: #e83c3c;
  }
  .hover {
    cursor: pointer !important;
  }

  .volume  {
    display: flex;
    flex-direction: row;
    align-items: center;

    .el-slider {
      width: 100px;
    }

    .iconVol {
      margin:0 15px;
      &:hover {
        cursor: pointer;
      }
    }
  }

  .palyOrder {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 0 15px;

    &:hover {
      cursor: pointer;
    }

    .iconfont {
      font-size: 20px;
    }
  }

  .navPlayListBtn {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-left: 15px;

    .iconfont {
      font-size: 25px;

      &:hover {
        cursor: pointer;
      }
    }
  }

  .navPlayList {
    position: absolute;
    bottom: 100%;
    right: 0;
    width: 600px;
    background-color: #fff;
    box-shadow: 0px 0px 10px 0px rgb(0,0,0,0.1);
    background-color: #fafafa;
    color:rgba(37, 37, 37, 0.8);

    .title {
      width: 100%;
      height: 35px;
      border-bottom: 1px solid rgb(225 225 226 / 50%);
      font-size: 14px;
      color: rgb(37 37 37 / 0.8);
      font-weight: 600;
      line-height: 35px; 
      text-align: center;
      background-color: #f4f4f6;
    }

    .total {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      padding: 6px 36px;
      border-bottom: 1px solid rgb(238 238 238 / 0.5);
      font-size: 12px;
      background-color: #f9f9f9;

      .iconfont {
        font-size: 12px;

        &:hover {
          cursor: pointer;
        }
      }
    }

    .parent-dom {
      height: 400px;
    }

    .playListTable {
      table-layout: fixed;
      width: 100%;
      font-size: 12px;
      color:rgba(37, 37, 37, 0.8);

      td {
        padding: 6px;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
      }

      tr:nth-child(even){
        background-color: #f5f5f7;
      }

      tr:hover {
        background-color: #ebeced;
      }
    }
  }
}
</style>

<template>
  <div class="newMusic">
    <ul class="tags">
      <li v-for="(tag, index) in areaTags" :key="'tag' + index" :class="[tag.param === type ? 'checked5' : '']" @click="changeTags(tag.param)">{{ tag.name }}</li>
    </ul>
    <div class="newMusicList" v-if="newMusic.length">
      <div class="iconfont palyAll" @click="addSongListToList(newMusic)">&#xe611;播放全部</div>
      <table class="newMusicTable">
        <tr v-for="(music, index) in newMusic" :key="'music' + index" @dblclick="addSongToList(music)">
          <td style="width: 46px;text-align: center;">{{ music.index }}</td>
          <td style="width: 60px;">
            <div class="songPic">
              <img :src="music.picUrl">
              <div class="iconfont">&#xe611;</div>
            </div>
          </td>
          <td>
            <span style="color:#000;">{{ music.name }}</span>
            <span>{{ music.alia }}</span>
          </td>
          <td style="width: 200px;">{{ music.singers }}</td>
          <td style="width:250px;">
            <span>{{ music.album }}</span>
            <span>{{ music.albumAlia }}</span>
          </td>
          <td style="width:80px;">{{ music.duration }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import {
  _getTopSongs
} from '@/ajax/songs'

let areaTags = [
  {name: '全部', param: 0},
  {name: '华语', param: 7},
  {name: '欧美', param: 96},
  {name: '日本', param: 8},
  {name: '韩国', param: 16}
]

export default {
  data(){
    return {
      areaTags,                       //当前页标签
      type: 0,                        //当前的type类型
      newMusic: [],                   //储存当前标签的新歌
    }
  },
  created(){
    this.getTopSongs(this.type)
  },
  methods: {
    getTopSongs(type){
      _getTopSongs(type).then(res => {
        // console.log(res.data.data)
        res.data.data.forEach((val, index) => {
          this.newMusic.push(this.processTopSongs(val, index))
        })
      }).catch(res => {
        console.log('获取新歌速递失败！', res)
      })
    },
    processTopSongs(val, index){
      index = index + 1
      let obj = {
        id: val.id,
        index: this.$addZero(index),
        picUrl: val.album.picUrl,
        name: val.name,
        alia: val.alias[0] ? val.alias[0] : '',
        singers: this.$transSinger(val.artists),
        album: val.album.name,
        albumAlia: val.album.alias[0] ? val.album.alias[0] : '',
        duration: this.$transDuration(val.duration)
      }

      return obj
    },
    changeTags(type){
      this.type = type
      this.newMusic = []
      this.getTopSongs(this.type)
    },
    addSongToList(song){
      // console.log(song)
      this.$store.commit('addSong', song)
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
.newMusic {
  width: 100%;

  .tags {
    border-bottom: 1px solid #e1e1e2;
    margin-bottom: 20px;
  }

  .tags li {
    display: inline-block;
    margin-right: 20px;
    font-size: 14px;
    line-height: 40px;
    color: rgb(37,37,37,0.8);

    &:hover {
      cursor: pointer;
      color: #000;
    }
  }

  .newMusicList {
    width: 100%;

    .palyAll {
      font-size: 14px;
      display: inline-block;
      padding: 5px;
      background-color: #c62f2f;
      border-radius: 4px;
      color: #ffffff;
      margin-bottom: 10px;

      &:hover {
        cursor: pointer;
      }
    }

    .newMusicTable {
      table-layout: fixed;
      width: 100%;
      font-size: 12px;
      color: rgb(37,37,37,0.8);
      border: 1px solid rgb(37,37,37,0.1);
      margin-bottom: 30px;

      .songPic {
        position: relative;
        width: 40px;
        height: 40px;

        img {
          width: 100%;
          height: 100%;
        }

        .iconfont{
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          font-size: 22px;
          line-height: 40px;
          text-align: center;
          color: #ffffff;
          background-color: rgb(0 0 0 / 0.2);
          z-index: 100;
        }
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
}

.checked5 {
  position: relative;
  color: #000 !important;

  &:after {
    position: absolute;
    left: 0;
    bottom: -1px;
    content: '';
    width: 100%;
    border-bottom: 2px solid #999999;
  }
}
</style>
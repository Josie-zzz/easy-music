<template>
  <div class="newMusic">
    <ul class="tags">
      <li v-for="(tag, index) in areaTags" :key="'tag' + index" :class="[tag.param === type ? 'checked5' : '']" @click="changeTags(tag.param)">{{ tag.name }}</li>
    </ul>
    <div class="newMusicList">
      <table v-if="newMusic.length" class="newMusicTable">
        <tr v-for="(music, index) in newMusic" :key="'music' + index">
          <td style="width: 46px;text-align: center;">{{ music.index }}</td>
          <td style="width: 60px;">
            <div class="songPic">
              <img :src="music.picUrl">
              <div class="iconfont">&#xe6a2;</div>
            </div>
          </td>
          <td>
            <span style="color:#000;">{{ music.musicTitle }}</span>
            <span>{{ music.musicAlia }}</span>
          </td>
          <td style="width: 200px;">{{ music.singers }}</td>
          <td style="width:250px;">
            <span>{{ music.album }}</span>
            <span>{{ music.albumAlia }}</span>
          </td>
          <td style="width:80px;">{{ music.timeLen }}</td>
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
        if(res.data.code === 200){
          // console.log(res.data.data)
          res.data.data.forEach((val, index) => {
            this.newMusic.push(this.processTopSongs(val, index))
          })
        }
      }).catch(res => {
        console.log('获取新歌速递失败！', res)
      })
    },
    processTopSongs(val, index){
      index = index + 1
      let obj = {
        index: index < 10 ? '0' + index : index,
        picUrl: val.album.picUrl,
        musicTitle: val.name,
        musicAlia: val.alias[0] ? val.alias[0] : '',
        singers: this.transSinger(val.artists),
        album: val.album.name,
        albumAlia: val.album.alias[0] ? val.album.alias[0] : '',
        timeLen: this.transTimeLen(val.duration)
      }

      return obj
    },
    transSinger(ar){                           //拼接所有歌手
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
    transTimeLen(time){                        //处理时长输出格式
      time = Math.floor(time / 1000)
      let min = Math.floor(time / 60)
      let se = time % 60
      min = min < 10 ? '0' + min : min
      se = se < 10 ? '0' + se : se
      return min + ':' + se
    },
    changeTags(type){
      this.type = type
      this.newMusic = []
      this.getTopSongs(this.type)
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
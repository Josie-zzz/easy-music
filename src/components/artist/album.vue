<template>
  <div class="album">
    <div v-if="newHotSongs.length" class="albumBox">
      <div class="left">
        <img :src="artist.img1v1Url">
      </div>
      <div class="right">
        <div class="title">
          <span>热门50首</span>
          <span class="iconfont" @click="addSongListToList(newHotSongs)">&#xe611;</span>
        </div>
        <table class="songs">
          <tr v-for="(hotSong, index) in newHotSongs" :key="'hotSong' + index" @dblclick="addSongToList(hotSong)">
            <td style="width:36px;text-align:right;">{{ hotSong.index }}</td>
            <td class="iconfont" style="width:60px;">
              <span style="margin-right:5px;">&#xe60f;</span>
              <span>&#xe63a;</span>
            </td>
            <td style="overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">
              <span style="color:#000;margin-right:5px;">{{ hotSong.name }}</span>
              <span>{{ hotSong.alia }}</span>
            </td>
            <td style="width:100px;">{{ hotSong.duration }}</td>
          </tr>
        </table>
      </div>
    </div>
    <template v-if="albumInfos.length">
      <div class="albumBox" v-for="(albumInfo, index) in albumInfos" :key="'album' + index">
        <div class="left">
          <img :src="albumInfo.album.picUrl">
          <div style="font-size: 12px;margin-top: 10px;">{{ albumInfo.album.newPublishTime }}</div>
        </div>
        <div class="right"> 
          <div class="title">
            <span>{{ albumInfo.album.name }}</span>
            <span class="iconfont" @click="addSongListToList(albumInfo.newSongs)">&#xe611;</span>
          </div>
          <table class="songs">
            <tr v-for="(albSong, index) in albumInfo.newSongs" :key="'albSong' + index" @dblclick="addSongToList(albSong)">
              <td style="width:36px;text-align:right;">{{ albSong.index }}</td>
              <td class="iconfont" style="width:60px;">
                <span style="margin-right:5px;">&#xe60f;</span>
                <span>&#xe63a;</span>
              </td>
              <td style="overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">
                <span style="color:#000;margin-right:5px;">{{ albSong.name }}</span>
                <span>{{ albSong.alia }}</span>
              </td>
              <td style="width:100px;">{{ albSong.duration }}</td>
            </tr>
          </table>
        </div>
      </div>
    </template>
    <div style="display:flex;flex-direction: row;justify-content: center;">
      <el-pagination
        v-if="albumLen > 1"
        layout="prev, pager, next"
        :page-count="albumLen"
        :current-page="currentPage"
        @current-change="currentChange"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import {
  _getArtistAlbums,
  _getArtistAlbumsAll
} from '@/ajax/artist'

export default {
  data(){
    return {
      albumId: null,                      //储存专辑当前页专辑id
      albumInfos: [],                     //储存当前页所有专辑信息
      currentPage: 1,                     //当前页码
      limit: 5,                           //限制每页数量，主要用于请求，写在这里比较方便
      newHotSongs: [],                  //处理过格式的hotSongs
    }
  },
  props: ['id', 'hotSongs', 'artist'],
  computed: {
    albumLen(){                           //根据专辑数显示总页数
      if(this.artist){
        return Math.ceil(this.artist.albumSize / this.limit)
      } else {
        return 1
      }
    }
  },
  watch: {
    hotSongs(val){                      //当热门歌曲有值的时候，处理它并存入newHotSongs
      if(val){
        this.processHotSongs(val)
      }
    }
  },
  created(){
    this.getArtistAlbumsAll(this.id, (this.currentPage - 1) * this.limit)
  },
  methods: {
    async getArtistAlbumsAll(id, offset, limit = this.limit){                    
      await _getArtistAlbums(id, offset, limit).then(res => {               //获取专辑id
        // console.log(res.data.hotAlbums)
        let albumId = []
        res.data.hotAlbums.forEach(val => {
          albumId.push(val.id)
        })
        this.albumId = albumId
      }).catch(res => {
        console.log('获取此歌手专辑id失败！', res)
      })
      // console.log(this.albumId)
      this.albumId.forEach(id => {
        _getArtistAlbumsAll(id).then(res => {               //获取专辑详细信息
          // console.log(res.data)
          res.data.newSongs = []                          //给此对象创建一个新的属性储存处理好格式的此专辑的所有歌曲
          this.processAlbumSongs(res.data)                //处理歌曲和转换时间
          this.albumInfos.push(res.data)
        }).catch(res => {
          console.log('获取此歌手专辑详细信息失败！', res)
        })
      })
      
    },
    processAlbumSongs(data){                               
      data.album.newPublishTime = this.$transDate(data.album.publishTime)
      data.songs.forEach((val, index) => {                    //处理每一个专辑的歌曲信息格式，并将新的信息存入data对象，也就是他原来的对象新增了一个属性，和热门歌曲的方式不一样
        data.newSongs.push(this.processSong(val, index))
      })
    },
    processHotSongs(hotSongs){
      hotSongs.forEach((val, index) => {
        this.newHotSongs.push(this.processSong(val, index))
      })
    },
    processSong(val, index){
      index = index + 1
      let obj = {
        id: val.id,
        index: this.$addZero(index),
        name: val.name,
        alia: val.alia[0] ? val.alia[0] : '',
        singers: this.$transSinger(val.ar),
        duration: this.$transDuration(val.dt)
      }

      return obj
    },
    currentChange(page){                                  //当页码发生变化
      this.currentPage = page
      this.albumInfos = []
      this.getArtistAlbumsAll(this.id, (page - 1) * this.limit)
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
.album {
  width: 100%;
  padding-top: 20px;

  .albumBox {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 40px;

    .left {
      width: 150px;
      margin-right: 60px;

      img {
        width: 150px;
        height: 150px;
      }
    }

    .right {
      flex: 1;

      .title {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        font-size: 14px;
        margin-bottom: 10px;

        .iconfont {
          font-size: 18px;
          color: rgba(37, 37, 37, 0.6);

          &:hover {
            cursor: pointer;
            color: #000;
          }
        }
      }

      .songs {
        table-layout: fixed;
        width: 100%;
        border: 1px solid #e1e1e2; 
        font-size: 12px;
        color:rgba(37, 37, 37, 0.8);

        td {
          padding: 6px;
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
}
</style>
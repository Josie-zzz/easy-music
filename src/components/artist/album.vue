<template>
  <div class="album">
    <div v-if="newHotSongs.length" class="albumBox">
      <div class="left">
        <img :src="artist.img1v1Url">
      </div>
      <div class="right">
        <div style="font-size: 14px;margin-bottom: 10px;">热门50首</div>
        <table class="songs">
          <tr v-for="(hotSong, index) in newHotSongs" :key="'hotSong' + index">
            <td style="width:36px;text-align:right;">{{ hotSong.index }}</td>
            <td class="iconfont" style="width:60px;">
              <span style="margin-right:5px;">&#xe60f;</span>
              <span>&#xe63a;</span>
            </td>
            <td style="overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">
              <span style="color:#000;margin-right:5px;">{{ hotSong.musicTitle }}</span>
              <span>{{ hotSong.musicAlia }}</span>
            </td>
            <td style="width:100px;">{{ hotSong.timeLen }}</td>
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
          <div style="font-size: 14px;margin-bottom: 10px;">{{ albumInfo.album.name }}</div>
          <table class="songs">
            <tr v-for="(albSong, index) in albumInfo.newSongs" :key="'albSong' + index">
              <td style="width:36px;text-align:right;">{{ albSong.index }}</td>
              <td class="iconfont" style="width:60px;">
                <span style="margin-right:5px;">&#xe60f;</span>
                <span>&#xe63a;</span>
              </td>
              <td style="overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">
                <span style="color:#000;margin-right:5px;">{{ albSong.musicTitle }}</span>
                <span>{{ albSong.musicAlia }}</span>
              </td>
              <td style="width:100px;">{{ albSong.timeLen }}</td>
            </tr>
          </table>
        </div>
      </div>
    </template>
    <div style="display:flex;flex-direction: row;justify-content: center;">
      <el-pagination
        v-if="albumLen"
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
        return 0
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
        if(res.data.code === 200){
          // console.log(res.data.hotAlbums)
          let albumId = []
          res.data.hotAlbums.forEach(val => {
            albumId.push(val.id)
          })
          this.albumId = albumId
        }
      }).catch(res => {
        console.log('获取此歌手专辑id失败！', res)
      })
      // console.log(this.albumId)
      this.albumId.forEach(id => {
        _getArtistAlbumsAll(id).then(res => {               //获取专辑详细信息
          if(res.data.code === 200){
            // console.log(res.data)
            res.data.newSongs = []                          //给此对象创建一个新的属性储存处理好格式的此专辑的所有歌曲
            this.processAlbumSongs(res.data)                //处理歌曲和转换时间
            this.albumInfos.push(res.data)
          }
        }).catch(res => {
          console.log('获取此歌手专辑详细信息失败！', res)
        })
      })
      
    },
    processAlbumSongs(data){                               
      this.transDate(data.album)
      data.songs.forEach((val, index) => {                    //处理每一个专辑的歌曲信息格式，并将新的信息存入data对象，也就是他原来的对象新增了一个属性，和热门歌曲的方式不一样
        data.newSongs.push(this.processSong(val, index))
      })
    },
    transDate(album){
      let d = new Date(album.publishTime)
      let time = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
      album.newPublishTime = time
    },
    processHotSongs(hotSongs){
      hotSongs.forEach((val, index) => {
        this.newHotSongs.push(this.processSong(val, index))
      })
    },
    processSong(val, index){
      index = index + 1
      let obj = {
        index: index < 10 ? '0' + index : index,
        musicTitle: val.name,
        musicAlia: val.alia[0] ? val.alia[0] : '',
        timeLen: this.transTimeLen(val.dt)
      }

      return obj
    },
    transTimeLen(time){                        //处理时长输出格式
      time = Math.floor(time / 1000)
      let min = Math.floor(time / 60)
      let se = time % 60
      min = min < 10 ? '0' + min : min
      se = se < 10 ? '0' + se : se
      return min + ':' + se
    },
    currentChange(page){                                  //当页码发生变化
      this.currentPage = page
      this.albumInfos = []
      this.getArtistAlbumsAll(this.id, (page - 1) * this.limit)
    },
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
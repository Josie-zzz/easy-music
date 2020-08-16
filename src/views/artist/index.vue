<template>
  <div class="artist parent-dom">
    <myScroll>
      <div class="artistBox child-dom">
        <div v-if="artist" class="artist-Top">
          <img :src="artist.picUrl">
          <div class="topRight">
            <div class="title">
              <div class="title1">歌手</div>
              <div style="font-size:22px;line-height:22px;">{{ artist.name }}</div>
            </div>
            <div style="font-size:14px;color:rgb(37,37,37,0.8);margin-bottom: 5px;">
              <span class="iconfont" style="margin-right:4px;">&#xe602;</span>
              <span style="margin-right:5px">单曲数:</span>
              <span>{{ artist.musicSize }}</span>
            </div>
            <div style="font-size:14px;color:rgb(37,37,37,0.8);margin-bottom: 5px;">
              <span class="iconfont" style="margin-right:4px;">&#xe6a0;</span>
              <span style="margin-right:5px;">专辑数:</span>
              <span>{{ artist.albumSize }}</span>
            </div>
            <div style="font-size:14px;color:rgb(37,37,37,0.8)">
              <span class="iconfont" style="margin-right:4px;">&#xe634;</span>
              <span style="margin-right:5px;">MV数:</span>
              <span>{{ artist.mvSize }}</span>
            </div>
          </div>
        </div>
        <div>
          <ul class="artist-bar">
            <li :class="[currentCom === 'Album' ? 'checked2' : '']"  @click="() => switchTo('Album')">专辑</li>
            <li :class="[currentCom === 'Mv' ? 'checked2' : '']" @click="() => switchTo('Mv')">MV</li>
            <li :class="[currentCom === 'ArtistDesc' ? 'checked2' : '']" @click="() => switchTo('ArtistDesc')">歌手详情</li>
          </ul>
        </div>
        <keep-alive>
          <component :is="currentCom" :id="id" :hotSongs="hotSongs" :artist="artist"></component>
        </keep-alive>
      </div>
    </myScroll>
  </div>
</template>

<script>
import Album from '@/components/artist/album'
import Mv from '@/components/artist/mv'
import ArtistDesc from '@/components/artist/artistDesc'
import {
  _getArtistSongs
} from '@/ajax/artist'

export default {
  data(){
    return {
      id: this.$route.query.id,                       //歌手id
      artist: null,                                   //歌手基本信息
      hotSongs: null,                                 //此歌手的热门歌曲
      currentCom: 'Album',                            //当前显示的组件
    }
  },
  components: {
    Album,
    Mv,
    ArtistDesc,
  },
  created(){
    this.getArtistSongs()
  },
  methods: {
    switchTo(com){
      this.currentCom = com
    },
    getArtistSongs(){
      _getArtistSongs(this.id).then(res => {
        if(res.data.code === 200){
           // console.log(res.data)
          this.artist = res.data.artist
          this.hotSongs = res.data.hotSongs
        }
      }).catch(res => {
        console.log('获取此歌手热门歌曲失败！', res)
      })
    },
  }
}
</script>

<style lang="scss">
.artist {
  width: 100%;
  height: 100%;

  .artistBox {
    width: 1000px;
    margin: 0 auto;
  }

  .artist-Top {
    display: flex;
    flex-direction: row;
    width: 100%;
    padding-top: 30px;
    margin-bottom: 30px;

    img {
      width: 200px;
      height: 200px;
    }

    .topRight {
      flex: 1;
      margin-left: 30px;
      
      .title {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 4px 0;
        margin-bottom: 20px;

        .title1 {
          font-size: 12px;
          line-height: 24px;
          padding: 0 10px;
          color: #ffffff;
          background-color: #c62f2f;
          border-radius: 2px;
          margin-right: 10px;
        }
      }
    }
  }

  .artist-bar {
    width: 100%;
    border-bottom: 1px solid #e1e1e2;

    li {
      display: inline-block;
      margin-left: 50px;
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
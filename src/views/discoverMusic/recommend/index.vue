<template>
  <div class="recommend">
    <!-- 轮播图 -->
    <el-carousel :interval="3000" type="card" height="180px">
      <el-carousel-item v-for="(banner, index) in banners" :key="'banner' + index">
        <img :src="banner.imageUrl">
      </el-carousel-item>
    </el-carousel>
    <!-- 推荐歌单 -->
    <div class="songList">
      <div class="title">
        <div style="font-size: 18px">推荐歌单</div>
        <!-- <div class="more">更多></div> -->
      </div>
      <div class="songListBox">
        <div class="songBox" v-for="(per, index) in personalized" :key="'per' + index" @click="showPlayList(per.id)">
          <img :src="per.picUrl" />
          <p>{{ per.name }}</p>
          <div class="playCount">
            <div class="iconfont">&#xe652;</div>
            <div>{{ per.playCount }}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 独家放送 -->
    <div class="privateContent">
      <div class="title">
        <div style="font-size: 18px">独家放送</div>
        <!-- <div class="more">更多></div> -->
      </div>
      <div class="priConBox">
        <div class="priBox" v-for="(pri, index) in privateContent" :key="'pri' + index">
          <img :src="pri.sPicUrl" />
          <p>{{ pri.name }}</p>
        </div>
      </div>
    </div>
    <!-- 最新音乐 -->
    <div class="newSong">
      <div class="title">
        <div style="font-size: 18px">最新音乐</div>
        <!-- <div class="more">更多></div> -->
      </div>
      <div class="newSongBox">
        <div class="songBoxOne" v-for="(nSong, i) in newSong" :key="'n' + i">
          <div class="song" v-for="(song, j) in nSong" :key="'song' + j">
            <div style="margin-left:4px;width:20px;text-align:center;">{{ i * 5 + j + 1}}</div>
            <div class="songPic">
              <img :src="song.picUrl">
              <div class="iconfont">&#xe6a2;</div>
            </div>
            <div style="line-height: 20px">
              <div style="font-size:14px;">
                <span style="margin-right: 10px;">{{ song.name }}</span>
                <span v-if="song.song.alias[0]" style="color:rgba(37, 37, 37, 0.8);">{{ '(' +  song.song.alias[0]  + ')'}}</span>
              </div>
              <div style="font-size:12px;color:rgba(37, 37, 37, 0.8);">
                <span v-for="(p, index) in song.song.artists" :key="'p' + index" style="margin-right: 5px;">{{p.name}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 推荐MV -->
    <div class="getMv">
      <div class="title">
        <div style="font-size: 18px">推荐MV</div>
        <!-- <div class="more">更多></div> -->
      </div>
      <div class="getMvBox">
        <div class="mvBox" v-for="(mv, index) in getMV" :key="'getmv' + index">
          <img :src="mv.picUrl" />
          <p>{{ mv.name }}</p>
          <p style="font-size:12px;color:rgba(37, 37, 37, 0.8);">{{ mv.artists[0].name }}</p>
          <div class="playCount">
            <div class="iconfont">&#xe634;</div>
            <div>{{ mv.playCount }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  _bannerOne,
  _getPersonalized,
  _privateContent,
  _newSong,
  _getMV
} from '@/ajax/discover'

export default {
  data(){
    return {
      banners: null,                    //轮播图
      personalized: null,               //歌单(未登录)
      privateContent: null,             //独家放送
      newSong: null,                    //推荐新音乐
      getMV: null,                      //推荐MV
    }
  },
  created(){
    //轮播图
    _bannerOne().then(res => {
      // console.log(res)
      if(res.data.code === 200){
        this.banners = res.data.banners
      }
    }).catch(res => {
      console.log('获取推荐的轮播图失败！', res)
    })

    //请求歌单
    _getPersonalized(10).then(res => {
      // console.log(res.data)
      if(res.data.code === 200){
        //处理显示听歌单人数的输出格式
        res.data.result.forEach(val => {
          val.playCount = val.playCount < 100000 ? val.playCount : Math.floor(val.playCount/10000) + '万'
        });
        // console.log('96:', this.personalized)
        this.personalized = res.data.result
      }
    }).catch(res => {
      console.log('请求歌单失败！', res)
    })

    //独家放送
    _privateContent().then(res => {
      // console.log(res)
      if(res.data.code === 200){
        this.privateContent = res.data.result
        // console.log(this.privateContent)
      }
    }).catch(res => {
      console.log('请求独家放送失败！', res)
    })

    //推荐新音乐
    _newSong().then(res => {
      // console.log(res.data.result)
      if(res.data.code === 200){
        let arr = []
        arr.push(res.data.result.slice(0, 5), res.data.result.slice(5, 10))
        this.newSong = arr
        // console.log(this.newSong)
      }
    }).catch(res => {
      console.log('获取推荐新音乐失败！', res)
    })

    //推荐MV
    _getMV().then(res => {
      console.log(res.data)
      if(res.data.code === 200){
        let arr = res.data.result.slice(0, 3)
        arr.forEach(val => {
          val.playCount = val.playCount < 100000 ? val.playCount : Math.floor(val.playCount/10000) + '万'
        });
        this.getMV = arr
        console.log(this.getMV)
      }
    }).catch(res => {
      console.log('获取推荐MV失败！', res)
    })
  },
  methods: {
    showPlayList(id){
      this.$router.push({
        name: 'playList',
        query: {
          id
        }
      })
    }
  }
}
</script>

<style lang="scss">
.el-carousel__item--card:hover{
  cursor: pointer;
}
.is-active button {
  background-color: #c62f2f !important;
}

.recommend {
  display: flex;
  flex-direction: column;

  .title {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
    padding: 8px 0;
    border-bottom: solid 1px #e1e1e2;

    .more {
      font-size: 12px;
      color:rgb(37,37,37,0.8);

      &:hover {
        cursor: pointer;
        color: #000;
      }
    }
  }

  .songList {
    .songListBox {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: space-between;
      padding-top: 15px;

      .songBox {
        position: relative;
        width: 180px;
        margin-bottom: 40px;

        &:hover {
          cursor: pointer;
        }

        img {
          width: 180px;
          height: 180px;
        }

        p {
          font-size: 14px;
          line-height: 20px;
          word-break: break-all;
        }

        .playCount {
          position: absolute;
          display: flex;
          flex-direction: row;
          justify-content: flex-end;
          top: 0;
          right: 0;
          width: 50%;
          padding-right: 5px;
          font-size: 12px;
          color: #ffffff;
          line-height: 20px;
          background: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.4)); //渐变

          .iconfont {
            font-size: 14px;
            margin-right: 3px;
          }
        }
      }
    }

  }

  .privateContent {
    margin-bottom: 50px;
  }
  .priConBox{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding-top: 15px;

    .priBox {
      width: 32%;

      &:hover {
        cursor: pointer;
      }

      img {
        width: 100%;
      }

      p {
        font-size: 14px;
        line-height: 20px;
        word-break: break-all;
      }
    }
  }

  .newSong {
    margin-bottom: 50px;

    .newSongBox {
      width: 100%;
      padding-top: 15px;

      .songBoxOne {
        display: inline-block;
        width: 50%;
        // background-color: bisque;

        .song {
          display: flex;
          flex-direction: row;
          align-items: center;
          width: 100%;
          height: 60px;
          padding: 6px;

          &:hover {
            cursor: pointer;
            background-color: rgb(235, 236, 237);
          }

          .songPic {
            position: relative;
            width: 40px;
            height: 40px;
            margin: 0 10px;

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

        }
      }
    }
  }

  .getMv {
    margin-bottom: 50px;
  }
  .getMvBox{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding-top: 15px;

    .mvBox {
      position: relative;
      width: 32%;

      &:hover {
        cursor: pointer;
      }

      img {
        width: 100%;
      }

      p {
        font-size: 14px;
        line-height: 20px;
        word-break: break-all;
      }

      .playCount {
        position: absolute;
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        top: 0;
        right: 0;
        width: 50%;
        padding-right: 5px;
        font-size: 12px;
        color: #ffffff;
        line-height: 20px;
        background: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.4)); //渐变

        .iconfont {
          font-size: 14px;
          margin-right: 3px;
        }
      }
    }
  }
}

</style>
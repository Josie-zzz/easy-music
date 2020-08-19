<template>
  <div class="nav-search">
    <div class="left">
      <img src="@/assets/img/logo.png" alt="logo">
      <div class="text">Easy Music</div>
      <div class="input-box">
        <el-input
          class="inline-input"
          v-model="searchVal"
          :placeholder="placeholder"
          @focus="showSuggestBox"
          @blur="hiddenShow"
          @input="giveSuggestInfo"
        ></el-input>
        <div class="iconfont" @click="searchMusic">&#xe650;</div>
      </div>
      
    </div>
    <div class="right">
      <img src="@/assets/img/avater.png" alt="logo">
      <div class="status">
        <span>未登录</span>
        <i class="el-icon-caret-bottom"></i>
      </div>
      <div class="iconfont">&#xe63f;</div>
    </div>
    <!-- 搜索建议块 -->
    <div v-if="showSuggest !== 0" class="suggest parent-dom">
      <myScroll> <!-- 你的内容... --> 
        <!-- 热搜 -->
        <div v-if="showSuggest === 1 && hotSearch" class="hot-search child-dom">
          <div style="padding: 15px;padding-left: 20px;color: rgba(0,0,0,0.6);font-size: 14px;line-height: 18px;">热搜榜</div>
          <div v-for="(search, index) in hotSearch" :key="'hot' + index" class="hot">
            <div class="hot-left" :class="[index < 3 ? 'isred' : '']">{{ index + 1}}</div>
            <div class="hot-right">
              <div class="music-base">
                <div style="font-weight: 600;">{{ search.searchWord }}</div>
                <div style="margin-left: 14px;font-size: 10px;color: rgba(0, 0, 0, 0.2);font-weight: 600;">{{ search.score }}</div>
                <img v-if="search.iconUrl" :src="search.iconUrl" style="display:inline-block;height: 12px;margin-left: 15px;">
              </div>
              <div style="color: rgba(0, 0, 0, 0.5);">{{ search.content }}</div>
            </div>
          </div>
        </div>
        <!-- 模糊匹配你需要的搜索-->
        <div v-if="showSuggest === 2" class="give-suggest child-dom">
          <div style="padding: 10px;font-size:12px;color:rgb(37,37,37,0.8);">搜"<span style="color: blue;">{{searchVal}}</span>"相关的结果 ></div>
          <!-- 单曲分类 -->
          <div class="title" v-if="songs">
            <div class="titname">
              <div class="iconfont">&#xe625;</div>
              <div>单曲</div>
            </div>
            <div class="infolist">
              <div class="info" v-for="(song, index) in songs" :key="'song'+index">
                {{song}}
                <!-- <div>{{ song.name }}</div>
                <div style="margin: 0 2px">-</div>
                <div v-for="(son, index) in song.artists" :key="'son'+ index" style="margin-right: 5px">{{ son.name }}</div> -->
              </div>
            </div>
          </div>
          <!-- 专辑分类 -->
          <div class="title" v-if="artists">
            <div class="titname">
              <div class="iconfont">&#xe6df;</div>
              <div>歌手</div>
            </div>
            <div class="infolist">
              <div class="info" v-for="(artist, index) in artists" :key="'artist'+index">{{ artist }}</div>
            </div>
          </div>
          <!-- 歌手分类 -->
          <div class="title" v-if="albums">
            <div class="titname">
              <div class="iconfont">&#xe6a0;</div>
              <div>专辑</div>
            </div>
            <div class="infolist">
              <div class="info" v-for="(album, index) in albums" :key="'album'+index">
                {{album}}
                <!-- <div>{{ album.name }}</div>
                <div style="margin: 0 2px">-</div>
                <div v-for="(art, index) in album.artists" :key="'art'+ index" style="margin-right: 5px">{{ art.name }}</div> -->
              </div>
            </div>
          </div>
        </div>
      </myScroll>
      
    </div>
  </div>
</template>

<script>
import { 
  _getHotSearch,
  _getSuggest
} from '@/ajax/search'

export default {
  data() {
    return {
      searchVal: '',                      //搜索内容
      placeholder: '搜索你喜欢的音乐',
      showSuggest: 0,                     //是否显示建议框,0代表不显示，1代表显示热搜，2代表显示建议
      getFocus: false,                    //搜索框是否获得焦点，因为重复获得焦点会多次请求
      hotSearch: null,                    //储存热搜对象
      giveSuggest: null,                  //储存模糊匹配建议
      searchHistory: [],                  //搜索记录
      songs: null,                        //搜索建议的单曲
      albums: null,                       //搜索建议的专辑
      artists: null,                      //搜索建议的歌手
    };
  },
  methods: {
    showSuggestBox () {         //输入框聚焦时请求热搜信息，并显示
      this.placeholder = ''

      if(this.searchVal === '' && !this.getFocus){   //当输入框没有值并且第一次获得焦点才请求热搜
        _getHotSearch().then(res => {  //获取到热搜信息
          this.hotSearch = res.data.data
          // console.log(this.hotSearch)
        }).catch(res => {
          console.log('请求热搜接口失败！', res)
        });

        this.showSuggest = 1
        this.getFocus = true
      }
      
      if(this.searchVal){
        this.showSuggest = 2
      }
      
    },
    hiddenShow(){                  //搜索框失去焦点
      this.showSuggest = 0
      this.getFocus = false
      this.placeholder = '搜索你喜欢的音乐'
    },
    giveSuggestInfo(){
      if(this.searchVal){
        this.showSuggest = 2

        _getSuggest(this.searchVal).then(res => {
          // console.log(res.data)
          let result = res.data.result
          //先清空这三个值
          this.songs = null
          this.albums = null
          this.artists = null
          if(result.songs){
            let arr = []
            result.songs.forEach(song => {
              let str = `${song.name} - `
              song.artists.forEach(value => {
                str = str + '  ' + value.name
              });
              arr.push(str)
            })

            this.songs = arr
          }
          if(result.albums){
            // console.log(result.albums)
            let arr = []
            result.albums.forEach(album => {
              let str = `${album.name} - ${album.artist.name}`
              arr.push(str)
            })

            this.albums = arr
          }
          if(result.artists){
            let arr = []
            result.artists.forEach(val => {
              arr.push(val.name)
            })

            this.artists = arr
          }
        }).catch(res => {
          console.log('请求搜索建议接口失败！', res)
        })
      } else {
        this.showSuggest = 1
      }
    },
    searchMusic(){              //搜索音乐
      // const info = this.searchVal
      //后面在添加
    }
  }
}
</script>

<style lang="scss">
.nav-search {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  position: relative;
  width: 100%;
  height: 50px;
  background-color: #c62f2f;

  .left {
    display: flex;
    flex-direction: row;
    align-items: center;

    img {
      width: 20px;
      height: 20px;
      margin-left: 15px;
    }

    .text {
      margin-left: 5px;
      font-size: 16px;
      color: #fff;      
    }

    .input-box {
      position: relative;

      .iconfont {
        position: absolute;
        top: 3px;
        right: 10px;
        font-size: 16px;
        color: rgba(255, 255, 255, 0.3);

        &:hover {
          cursor: pointer;
          color: #fff;
        }
      }
    }

    .inline-input {
      margin-left: 125px;
      width: 220px;

      .el-input__inner {
        height: 24px;
        line-height: 24px;
        font-size: 12px;
        color: #fff;
        border: none;
        border-radius: 12px;
        background-color: rgba(168, 40, 40, 0.7);

        &:focus {
          border-color: none;
        }
        &:hover {
          border-color: none;
        }

        &::-webkit-input-placeholder { /* WebKit browsers 适配谷歌 */
            color: rgba(255, 255, 255, 0.3);
        }
        &:-moz-placeholder { /* Mozilla Firefox 4 to 18 适配火狐 */
            color: rgba(255, 255, 255, 0.3);
        }
        &::-moz-placeholder { /* Mozilla Firefox 19+ 适配火狐 */
            color: rgba(255, 255, 255, 0.3);
        }
        &:-ms-input-placeholder { /* Internet Explorer 10+  适配ie*/
            color: rgba(255, 255, 255, 0.3);
        }
      }
    }
  }

  .right {
    display: flex;
    flex-direction: row;
    align-items: center;
    color: rgba(255, 255, 255, 0.7);

    img {
      width: 25px;
      height: 25px;
    }

    .status {
      margin-right: 30px;
      font-size: 12px;

      span {
        margin: 0 5px;
      }

      &:hover {
        cursor: pointer;
        color: #fff;
      }
    }

    .iconfont {
      margin-right: 15px;
      font-size: 16px;

      &:hover {
        cursor: pointer;
        color: #fff;
      }
    }
  }

  .suggest {
    position: absolute;
    top: 50px;
    left: 252px;
    z-index: 1000;
    background-color: #fff;
    box-shadow: 0px 0px 10px 0px rgb(0,0,0,0.3);

    &::before {
      position: absolute;
      top: -18px;
      left: 20px;
      content: "";
      border: 10px solid transparent;
      border-bottom: 12px solid #fff;
    }

    .hot-search {
      width: 400px;
      min-height: 50px;
      max-height: 430px;
      // overflow: scroll;

      .hot {
        display: flex;
        flex-direction: row;
        width: 100%;
        height: 54px;
        padding: 6px 0;

        &:hover {
          cursor: pointer;
          background-color: rgba(237,237,237,0.8);
        }

        .hot-left {
          width: 50px;
          line-height: 38px;
          text-align: center;
          font-size: 16px;
          color: rgba(0, 0, 0, 0.4);
        }

        .hot-right {
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          flex: 1;
          font-size: 12px;

          .music-base div{
            display: inline-block;
            font-size: 12px;
          }
        }
      }
    }

    .give-suggest {
      display: flex;
      flex-direction: column;
      width: 350px;
      min-height: 50px;
      max-height: 400px;

      .title {
        font-size: 12px;
        color:rgb(37,37,37);

        .titname {
          display: flex;
          flex-direction: row;
          align-items: center;
          height: 25px;
          padding-left: 5px;
          background-color: rgb(245 245 247 / 40%);;
          
          div {
            padding-left: 3px;
          }
        }

        .infolist .info {               //超出单行文本显示省略号
          overflow: hidden;
          padding-left: 27px;
          padding-right: 10px;
          line-height: 28px;
          text-overflow:ellipsis;
          white-space: nowrap;

          &:hover {
            cursor: pointer;
            background-color: rgb(238,238,238,0.8);
          }
        }
      }
    }
  }
}
.isred {
  color: #ff3a3a !important;
}
</style>

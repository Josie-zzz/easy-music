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
        <div class="iconfont" @click="searchStart">&#xe650;</div>
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
    <div v-show="showSuggest !== 0" class="suggest parent-dom" @mouseleave="mouseLeaveBox" @mouseenter="mouseEnterBox">
      <myScroll> <!-- 你的内容... --> 
        <!-- 热搜 -->
        <div v-show="showSuggest === 1 && hotSearch" class="hot-search child-dom">
          <div style="padding: 15px;padding-left: 20px;color: rgba(0,0,0,0.6);font-size: 14px;line-height: 18px;">热搜榜</div>
          <div v-for="(search, index) in hotSearch" :key="'hot' + index" class="hot" @click="searchThis(search.searchWord)">
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
        <div v-show="showSuggest === 2" class="give-suggest child-dom">
          <div style="padding: 10px;font-size:12px;color:rgb(37,37,37,0.8);">搜"<span style="color: #0c73c2;">{{searchVal}}</span>"相关的结果 ></div>
          <!-- 单曲分类 -->
          <div class="title" v-if="songs">
            <div class="titname">
              <div class="iconfont">&#xe625;</div>
              <div>单曲</div>
            </div>
            <div class="infolist">
              <div class="info" v-for="(song, index) in songs" :key="'song'+index" @click="searchThis(song)">
                {{song}}
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
              <div class="info" v-for="(artist, index) in artists" :key="'artist'+index" @click="searchThis(artist)">{{ artist }}</div>
            </div>
          </div>
          <!-- 歌手分类 -->
          <div class="title" v-if="albums">
            <div class="titname">
              <div class="iconfont">&#xe6a0;</div>
              <div>专辑</div>
            </div>
            <div class="infolist">
              <div class="info" v-for="(album, index) in albums" :key="'album'+index" @click="searchThis(album)">
                {{album}}
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
      leaveBox: true,                     //鼠标是否离开建议框
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
      
      if(this.searchVal){     //此时也要去请求搜索，因为被选中的val是不会触发input，但是这样会导致每次聚焦都会去请求，如果值没变也会请求
        this.getSuggest()
        this.showSuggest = 2
      }
    },
    hiddenShow(){                  //搜索框失去焦点
      //当输入框失去焦点，并且鼠标移开了选择区域就关闭建议框,因为建议框的内容是要点击的，
      // 如果不加这个判断，会在点击之前失去焦点并隐藏盒子，导致建议和热搜无法点击
      if(this.leaveBox){           
        this.showSuggest = 0
      }
      this.getFocus = false
      this.placeholder = '搜索你喜欢的音乐'
    },
    mouseLeaveBox(){
      // console.log('mouseLeaveBox')
      this.leaveBox = true
    },
    mouseEnterBox (){
      // console.log('mouseEnterBox')
      this.leaveBox = false
    },
    giveSuggestInfo(){      //当输入框内容变化的时候请求模糊搜索，当没有内容的时候显示热搜信息
      if(this.searchVal){
        this.showSuggest = 2
        this.getSuggest()
      } else {
        this.showSuggest = 1
      }
    },
    getSuggest(){
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
    },
    searchStart(){              //搜索被触发,因为用的ui组件无法使用keyup事件，所以只能点击搜索
      if(!this.searchVal){
        return
      }
      // console.log('go....')
      this.$store.commit('changeKeyWords', this.searchVal)
      // console.log(this.$route.name)
      if(this.$route.name !== 'searchInfo'){       //如果当前不在路由页面才跳转
        this.$router.push({
          name: 'searchInfo'
        })
      }
    },
    searchThis(keyWord){               //热搜和模糊匹配的关键词被点击,点击成功后要隐藏盒子
      this.searchVal = keyWord
      this.showSuggest = 0
      this.leaveBox = true         //因为上面的隐藏不会触发mouseleave,所以一定要手动设置一下
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
        padding-right: 30px;
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

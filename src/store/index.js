import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    keyWords: '',                 //搜索的keyWords

    musicList: [],                 //播放列表
    nowSongIndex: -1,              //当前要播放歌曲的索引值，-1表示当前没有歌曲要播放
  },
  mutations: {
    changeKeyWords(state, words){              //改变keyWords
      state.keyWords = words
    },

    addSong(state, song){                     //添加单曲到列表中
      //先判断列表中是否有这首歌,没有才添加单曲,有这首歌将当前索引指向它
      let index = state.musicList.findIndex(val => val.id === song.id)
      if(index !== -1){
        state.nowSongIndex = index
        return
      }
      state.musicList.splice(state.nowSongIndex + 1, 0, song)
      state.nowSongIndex ++
    },
    addSongList(state, songList){                            //添加歌单或者全部播放
      state.nowSongIndex = -1                 //如果连续替换两次，则都是0，那么那边就检测不到变化就不会自动播放
      state.musicList = songList.slice(0)              //替换当前播放列表
      state.nowSongIndex = 0                  //修改当前播放音乐是第一首              
    },
    changeNowSongIndex(state, index){          //通过修改这个值实现播放顺序
      state.nowSongIndex = index
    },
    clearList(state){                       //清空列表
      state.musicList = []
      state.nowSongIndex = -1
    }
  },
  actions: {},
  modules: {}
});

<template>
  <div class="mv">
    <template v-if="mvs.length">
      <div class="mvBox" v-for="(mv, index) in mvs" :key="'mv' + index" @click="toPath(mv.id)">
        <div class="mvImg">
          <img :src="mv.imgurl16v9" />
          <div class="playCount">
            <div class="iconfont">&#xe652;</div>
            <div>{{ mv.playCount }}</div>
          </div>
          <div class="duration">{{ mv.duration }}</div>
        </div>
        <p style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">{{ mv.name }}</p>
      </div>
    </template>
    <div v-if="noMvs">{{ noMvs }}</div>
  </div>
</template>

<script>
import {
  _getArtistMvInfo
} from '@/ajax/artist'

export default {
  data(){
    return {
      mvs: [],                //此歌手的mv,有的歌手没有mv
      noMvs: '',              //没有mv的显示
    }
  },
  props: ['id', 'artist'],
  created(){
    _getArtistMvInfo(this.id).then(res => {
      // console.log(res.data.mvs)
      //处理显示听歌单人数和mv时长的输出格式
      res.data.mvs.forEach(val => {
        val.playCount = this.$transPlayCount(val.playCount)      
        val.duration = this.$transDuration(val.duration)
      });
      this.mvs = res.data.mvs
      if(!this.mvs.length){
        this.noMvs = '此歌手暂时还没有mv哦！'
      }
    }).catch(res => {
      console.log('请求此歌手mv失败！', res)
    })
  },
  methods: {
    toPath(id){
      this.$router.push({
        name: 'audio',
        query: {
          id,
          type: 'mv'
        }
      })
    }
  }
}
</script>

<style lang="scss">
.mv {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  padding-top: 15px;

  .mvBox {
    width: 180px;
    margin-bottom: 40px;

    &:hover {
      cursor: pointer;
    }

    .mvImg {
      position: relative;

      img {
        width: 180px;
        // height: 100px;
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

      .duration {
        position: absolute;
        left: 5px;
        bottom: 3px;
        font-size: 12px;
        color: #ffffff;
      }
    }

    p {
      font-size: 14px;
      line-height: 20px;
      word-break: break-all;
    }

    
  }
}
</style>
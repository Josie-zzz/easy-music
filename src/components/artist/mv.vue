<template>
  <div class="mv">
    <div class="mvBox" v-for="(mv, index) in mvs" :key="'mv' + index">
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
  </div>
</template>

<script>
import {
  _getArtistMvInfo
} from '@/ajax/artist'

export default {
  data(){
    return {
      mvs: null,                //此歌手的mv
    }
  },
  props: ['id'],
  created(){
    _getArtistMvInfo(this.id).then(res => {
      if(res.data.code === 200){
        // console.log(res.data.mvs)
        //处理显示听歌单人数和mv时长的输出格式
        res.data.mvs.forEach(val => {
          val.playCount = val.playCount < 100000 ? val.playCount : Math.floor(val.playCount/10000) + '万'       
          val.duration = this.transTimeLen(val.duration)
        });
        this.mvs = res.data.mvs
      }
    }).catch(res => {
      console.log('请求此歌手mv失败！', res)
    })
  },
  methods: {
    transTimeLen(time){                        //处理时长输出格式
      time = Math.floor(time / 1000)
      let min = Math.floor(time / 60)
      let se = time % 60
      min = min < 10 ? '0' + min : min
      se = se < 10 ? '0' + se : se
      return min + ':' + se
    },
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
        height: 100px;
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
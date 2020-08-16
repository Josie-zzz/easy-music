<template>
  <div class="rankingList">
    <div class="officialList">
      <div class="title">
        <div style="font-size: 18px">官方榜</div>
      </div>
      <div class="official">
        <div class="officialBox" v-for="(rankO, index) in rankingOne" :key="'rankO' + index" @click="showPlayList(rankO.id)">
          <img :src="rankO.coverImgUrl">
          <div class="songs" v-for="(track, j) in rankO.tracks" :key="'tra' + j">
            <div style="width:15px;margin-right: 5px;font-size: 16px;text-align: right;color:#cd2929;">{{ j + 1 }}</div>
            <div style="flex:1;overflow:hidden;white-space: nowrap;text-overflow: ellipsis;">{{ track.first }}</div>
            <div style="width:80px;text-align:right;color: rgba(37, 37, 37, 0.6);overflow:hidden;white-space:nowrap;text-overflow:ellipsis;">{{ track.second }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="worldList">
      <div class="title">
        <div style="font-size: 18px">全球榜</div>
      </div>
      <div class="world">
        <div class="songListBox">
        <div class="songBox" v-for="(rankT, index) in rankingTwo" :key="'rankT' + index" @click="showPlayList(rankT.id)">
          <img :src="rankT.coverImgUrl" />
          <p>{{ rankT.name }}</p>
          <div class="playCount">
            <div class="iconfont">&#xe652;</div>
            <div>{{ rankT.playCount }}</div>
          </div>
        </div>
      </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  _getRankingList
} from '@/ajax/discover'
export default {
  data(){
    return {
      rankingOne: null,                     //官方榜
      rankingTwo: null,                     //全球榜
    }
  },
  created(){
    this.getRankingList()
  },
  methods: {
    async getRankingList(){                           //请求全部排行榜和对应下面八首歌曲
      await _getRankingList().then(res => {
        if(res.data.code === 200){
          // console.log(res.data.list)
          //处理显示听歌单人数的输出格式
          res.data.list.forEach(val => {
            val.playCount = val.playCount < 100000 ? val.playCount : Math.floor(val.playCount/10000) + '万'
          });
          this.rankingOne = res.data.list.slice(0, 4)
          this.rankingTwo = res.data.list.slice(4)
        }
      }).catch(res => {
        console.log('请求排行榜失败！', res)
      })
    },
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
.rankingList {
  .title {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
    padding: 8px 0;
    border-bottom: solid 1px #e1e1e2;
  }

  .official {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: wrap;
    width: 100%;
    padding-top: 20px;

    .officialBox {
      width: 32%;
      margin-bottom: 20px;

      &:hover {
        cursor: pointer;
      }

      img {
        width: 100%;
        height: 100px;
      }

      .songs {
        display: flex;
        flex-direction: row;
        font-size: 12px;
        line-height: 30px;

        &:nth-child(even){
          background-color: #f5f5f7;
        }
      }
    }
  }

  .world {
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
}
</style>
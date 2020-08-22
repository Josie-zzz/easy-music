import http from './http'

//个性推荐的轮播图
export function _bannerOne(){
  return http({
    url: '/banner'
  })
}

//获得歌单推荐（未登录）
export function _getPersonalized(limit){
  return http({
    url: '/personalized',
    params: {
      limit
    }
  })
}

//独家放送
export function _privateContent(){
  return  http({
    url: '/personalized/privatecontent'
  })
}

//推荐新音乐
export function _newSong(){
  return http({
    url: '/personalized/newsong'
  })
}

//推荐MV
export function _getMV(){
  return http({
    url: '/personalized/mv'
  })
}

// 根据歌单信息显示详细信息,创建者、收藏者（订阅者）、歌单列表所有id，等基本信息
export function _getPlayList(id){
  return http({
    url: '/playlist/detail',
    params: {
      id
    }
  })
}

//获取歌曲详情
export function _getSongDetail(trackIds){
  return http({
    url: '/song/detail',
    params: {
      ids: trackIds
    }
  })
}

//获取歌单评论
// limit: 取出评论数量 , 默认为 20
// offset: 偏移数量 , 用于分页 , 如 :( 评论页数 -1)*20, 其中 20 为 limit 的值
// before: 分页参数,取上一页最后一项的 time 获取下一页数据(获取超过5000条评论的时候需要用到)
export function _getSongListComments(id, offset, limit){
  return http({
    url: '/comment/playlist',
    params: {
      id,
      offset,
      limit
    }
  })
}

//获取歌单收藏者，下面是可选参数
// limit: 取出评论数量 , 默认为 20
// offset: 偏移数量 , 用于分页 , 如 :( 评论页数 -1)*20, 其中 20 为 limit 的值
export function _getSubscribers(id, limit){
  return http({
    url: '/playlist/subscribers',
    params: {
      id,
      limit
    }
  })
}

//获取热门歌单分类tags
export function _getListHotTags(){
  return http({
    url: '/playlist/hot'
  })
}

//获得精选歌单，根据tags值，默认是全部，下面是可选参数
// order: 可选值为 'new' 和 'hot', 分别对应最新和最热 , 默认为 'hot'
// cat:cat: tag, 比如 " 华语 "、" 古风 " 、" 欧美 "、" 流行 ", 默认为 "全部",可从歌单分类接口获取(/playlist/catlist)
// limit: 取出歌单数量 , 默认为 50
// offset: 偏移数量 , 用于分页 , 如 :( 评论页数 -1)*50, 其中 50 为 limit 的值
export function _getTopPlayList(cat, offset, limit){
  return http({
    url: '/top/playlist',
    params: {
      cat,
      offset,
      limit
    }
  })
}

//这个接口可以请求到所有榜单内容摘要，包含前三首top的歌曲简单信息，但没有明确标识官方榜和全球榜，所以暂时取前四个
export function _getRankingList(){
  return http({
    url: '/toplist/detail'
  })
}

//歌手榜单，下面是可选参数
// type : 地区
// 1: 华语
// 2: 欧美
// 3: 韩国
// 4: 日本
export function _getRankingArtist(){
  return http({
    url: '/toplist/artist'
  })
}
import http from './http'

//个性推荐的轮播图
export function _bannerOne(){
  return http({
    url: '/banner'
  })
}

//获得歌单推荐（未登录）
export function _getPersonalized(){
  return http({
    url: '/personalized',
    params: {
      limit: 10
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
import http from './http'

//新歌速递
// type: 地区类型 id,对应以下:全部:0、华语:7、欧美:96、日本:8、韩国:16
export function _getTopSongs(type){  
  return http({
    url: '/top/song',
    params: {
      type
    }
  })
}

//判断音乐是否可用,id为音乐id
export function _checkMusic(id){    
  return http({
    url: '/check/music',
    params: {
      id
    }
  })
}

//获得音乐url
export function _getSongUrl(id){    
  return http({
    url: '/song/url',
    params: {
      id
    }
  })
}
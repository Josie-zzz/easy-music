import http from './http'

//歌手分类,下面是可选参数 
// limit: 返回数量 , 默认为 30
// offset: 默认为 0 
// initial: 按首字母索引查找参数,返回内容将以 name 字段开头为 b 或者拼音开头为 b 为顺序排列, 热门传-1, #传0
// type 取值: -1:全部 1:男歌手 2:女歌手 3:乐队 
// area 取值: -1:全部 7华语 96欧美 8:日本 16韩国 0:其他
export function _getArtistList(area, type, offset, limit, initial){
  return http({
    url: '/artist/list',
    params: {
      area,
      type,
      offset,
      limit,
      initial
    }
  })
}

//获取歌手热门单曲
export function _getArtistSongs(id){
  return http({
    url: '/artists',
    params: {
      id
    }
  })
}

//获取歌手专辑，只能获取简单的信息没有歌曲，可以保存里卖弄的专辑id
export function _getArtistAlbums(id, offset, limit){
  return http({
    url: '/artist/album',
    params: {
      id,
      offset,
      limit
    }
  })
}

//根据专辑id请求专辑详细信息
export function _getArtistAlbumsAll(id){      //专辑id
  return http({
    url: '/album',
    params: {
      id
    }
  })
}

// 获取歌手描述
export function _getArtistDesc(id){
  return http({
    url: '/artist/desc',
    params: {
      id
    }
  })
}

//获取相似歌手(需要登陆)
// export function _getArtistSimi(id){
//   return http({
//     url: '/simi/artist',
//     params: {
//       id
//     }
//   })
// }

// 获取歌手mv的信息
export function _getArtistMvInfo(id){
  return http({
    url: '/artist/mv',
    params: {
      id
    }
  })
}

//获取歌手mv播放地址，
// export function _getArtistMv(id){
//   return http({
//     url: '/mv',
//     params: {
//       id
//     }
//   })
// }


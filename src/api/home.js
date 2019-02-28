import fetch from './fetch'
export default class home extends fetch {
  // 排行
  static songListCategory(data) {
    const url = '/music/tencent/songListCategory'
    return this.get(url, data)
  }
  // 热歌
  static getHotSongList(data) {
    const url = '/music/tencent/hotSongList'
    return this.get(url, data)
  }
  // 歌单获取
  static getSongList(data) {
    const url = '/music/tencent/songList'
    return this.get(url, data)
  }
  // 搜索
  static searchSongs(data) {
    const url = '/music/tencent/search'
    return this.get(url, data)
  }
  // 获取歌曲信息
  static getSongs(data) {
    const url = '/music/tencent/song'
    return this.get(url, data)
  }

  // 获取首页信息
  static getHomeList(data) {
    const url = '/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
    return this.get(url, data)
  }

  // 获取搜索热词
  static gethotkey(data) {
    const url = '/splcloud/fcgi-bin/gethotkey.fcg'
    return this.get(url, data)
  }
}
import fetch from './fetch'
export default class home extends fetch {
  //  排行
  static songListCategory(data){
    const url = '/music/tencent/songListCategory'
    return this.get(url,data)
  }
  // 热歌
  static getHotSongList(data){
    const url = '/music/tencent/hotSongList'
    return this.get(url,data)
  }
  // 歌单获取
  static getSongList(data){
    const url = '/music/tencent/songList'
    return this.get(url,data)
  }
}
import Taro, { Component } from '@tarojs/taro'
import { View, Image, Icon, Input, Swiper, SwiperItem } from '@tarojs/components'
import './index.less'
import home from '../../api/home'

export default class Home extends Component {
  config = {
    navigationBarTitleText: '首页'
  }

  constructor(props) {
    super(props)

    this.state = {
      banner: [], //轮播图
      radioList: [], //电台
      songList: [], //歌单
      inputVal: '',
      hasPlay: false // 是否正在播放
    }
  }

  componentWillMount() {

  }

  componentDidMount() {
    this.getHotSongList()
    // 模拟数据
    var data = {
      "slider": [{
        "linkUrl": "http://y.qq.com/w/album.html?albummid=004ZGlrw3Me8eI",
        "picUrl": "http://y.gtimg.cn/music/common/upload/MUSIC_FOCUS/1155264.jpg",
        "id": 19857
      }, {
        "linkUrl": "http://y.qq.com/w/album.html?albummid=003vVUT83SaF4l",
        "picUrl": "http://y.gtimg.cn/music/common/upload/MUSIC_FOCUS/1155138.jpg",
        "id": 19858
      }, {
        "linkUrl": "https://y.qq.com/m/digitalbum/gold/index.html?openinqqmusic=1_video=true&id=5447522&g_f=shoujijiaodian",
        "picUrl": "http://y.gtimg.cn/music/common/upload/MUSIC_FOCUS/1155430.jpg",
        "id": 19853
      }, {
        "linkUrl": "http://y.qq.com/w/album.html?albummid=000uoyVq093DIY",
        "picUrl": "http://y.gtimg.cn/music/common/upload/MUSIC_FOCUS/1155139.jpg",
        "id": 19859
      }, {
        "linkUrl": "https://y.qq.com/apg/612/index.html?ADTAG=JDT&openinqqmusic=1",
        "picUrl": "http://y.gtimg.cn/music/common/upload/MUSIC_FOCUS/1155328.jpg",
        "id": 19850
      }],
      "radioList": [{
        "picUrl": "http://y.gtimg.cn/music/photo/radio/track_radio_199_13_1.jpg",
        "Ftitle": "热歌",
        "radioid": 199
      }, {
        "picUrl": "http://y.gtimg.cn/music/photo/radio/track_radio_307_13_1.jpg",
        "Ftitle": "一人一首招牌歌",
        "radioid": 307
      }]
    }
    this.setState({
      banner: data.slider,
      radioList: data.radioList
    })
  }

  componentWillUnmount() { }

  componentDidShow() {
  }

  componentDidHide() { }
  async getHotSongList() {
    Taro.showLoading({
      title: ''
    })
    try {
      const params = {
        key: '579621905', // API默认
      }
      const { data: { data } } = await home.getHotSongList(params)
      this.setState({
        songList: data.length > 10 ? data.slice(0, 10) : data
      })
      Taro.hideLoading()
    } catch (error) {
      console.log(error, 'err==')
    }
  }
  // 键入搜索
  onInput(e) {
    const { detail: { value } } = e
    this.setState({
      inputVal: value
    })
  }
  // 页面跳转
  navigateTo(type, data) {
    switch (type) {
      case 'banner':
        Taro.navigateTo({
          url: `/pages/webview/index?linkUrl=${data}`
        })
        break;
      case 'radio':

        break;
      case 'songList':
        Taro.navigateTo({
          url: `/pages/songList/index?id=${data}`
        })
        break;
      default:
        break;
    }
  }
  // 分享
  onShareAppMessage() {
    return {
      title: 'QQ音乐--让生活充满音乐',
      content: '十三年的陪伴，国民音乐平台',
      path: '/pages/home/index'
    };
  }
  render() {
    const { banner, radioList, songList, inputVal, hasPlay } = this.state
    return (
      <View className="container">
        {/* 搜索框 */}
        <View className="searchBar">
          <View className="searchBarbox">
            <Icon type="search" size="14" style={{ marginRight: '20px' }}></Icon>
            <Input type="text" placeholder="搜索歌曲、歌手、专辑" className="searchInput" value={inputVal} onInput={this.onInput.bind(this)} />
            {inputVal.length > 0 &&
              <Icon type="clear" size="14"></Icon>
            }
          </View>
        </View>
        <View className="main">
          {/* 轮播图 */}
          <Swiper className="banner" indicatorDots="true" indicatorActiveColor="#fff" autoplay='true' interval='3000' circular='true'>
            {banner && banner.map((item, index) =>
              <SwiperItem key={index}>
                <Image src={item.picUrl} className="bannerImage" onClick={this.navigateTo.bind(this, 'banner', item.linkUrl)}></Image>
              </SwiperItem>
            )}
          </Swiper>
          {/* 电台 */}
          <View className="RSList">
            <View className="title">电台</View>
            <View className="listCon">
              {radioList && radioList.map((item, index) =>
                <View className="radioItemBox" key={index} onClick={this.navigateTo.bind(this, 'radio', item.radioid)}>
                  <Image className="radioImg" src={item.picUrl}></Image>
                  <View className="radioText">{item.Ftitle}</View>
                  <Image className="PlayCenter" src={require("../../assert/play.png")}></Image>
                </View>
              )}
            </View>
          </View >
          {/* < !--热门歌单 --> */}
          <View className="RSList">
            <View className="title">热门歌单</View>
            <View className="listCon">
              {songList && songList.map((item, index) =>
                <View className="radioItemBox" key={index} onClick={this.navigateTo.bind(this, 'songList', item.id)}>
                  <Image className="radioImg" src={item.pic}></Image>
                  <View className="radioText" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">{item.name}</View>
                  <View className="radioAuthor">{item.creator}</View>
                  <View className="radioPlayBox">
                    <Image className="radioIcon" src={require("../../assert/music.png")}></Image>
                    <View className="playCount">{item.playCount}</View>
                  </View>
                  <Image className="radioPlay" data-id={item.id} src={require("../../assert/play.png")} catchtap='selectHot'></Image>
                </View>
              )}
            </View>
          </View>
        </View>
        {/* 底部播放 */}
        <View className="bottomPlay">
          {hasPlay && <View className="plays">
            <View className="musicImg">
              <Image className="playImg"></Image>
            </View>
            <View className="musicName"></View>
            <View className="singer"></View>
          </View>}
          {!hasPlay && <View className="plays">
            <View className="des">QQ音乐,让生活充满音乐</View>
            <View className="musicImg">
              <Image className="playImg" src={require("../../assert/opt_icon.png")}></Image>
            </View>
          </View>}
        </View>
      </View>
    )
  }
}


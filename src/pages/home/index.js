import Taro, { Component } from '@tarojs/taro'
import { View, Image, Icon, Input, Swiper, SwiperItem } from '@tarojs/components'
import { AtSearchBar } from 'taro-ui'
import './index.less'
// import "taro-ui/dist/style/components/search-bar.scss";
import home from '../../api/home'

export default class Home extends Component {
  config = {
    navigationBarTitleText: '首页',
    enablePullDownRefresh: true,
  }

  constructor(props) {
    super(props)

    this.state = {
      banner: [], // 轮播图
      radioList: [], // 电台
      songList: [], // 歌单
      inputVal: '',
      hasPlay: false, // 是否正在播放
      showHotkey: false, // 是否显示搜索热词 
      hotkey: [] // 热词列表
    }
  }

  componentWillMount() {

  }

  componentDidMount() {
    this.getHomeList()
    this.getHotSongList()
  }

  componentWillUnmount() { }

  componentDidShow() {
  }

  componentDidHide() { }
  // 首页信息
  async getHomeList() {
    try {
      const params = { urlType: 1 }
      const { data: { data } } = await home.getHomeList(params)
      // console.log(data, 'datatatatat')
      this.setState({
        banner: data.slider,
        radioList: data.radioList
      })
    } catch (error) {
      console.log(error, 'err')
      Taro.showToast({
        title: '网络较慢，请稍后重试',
        icon: 'none'
      })
    }
  }
  // 热门歌单
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
      Taro.showToast({
        title: '网络较慢，请稍后重试',
        icon: 'none'
      })
    }
  }
  // 搜索热词
  async getHotKey() {
    const params = { urlType: 1 }
    const { data: { data: { hotkey } } } = await home.gethotkey(params)
    // console.log(hotkey, 'datatat')
    this.setState({
      hotkey: hotkey
    })
  }
  // 键入搜索
  onInput(e) {
    this.setState({
      inputVal: e,
    })
  }
  inputFocus() {
    this.setState({
      showHotkey: true
    })
    this.getHotKey()
  }
  // 选择热词
  choosekey(data) {
    this.setState({
      inputVal: data
    })
  }
  // 搜索
  async searchSong() {
    const { inputVal } = this.state
    inputVal.trim().length !== 0 ?
      Taro.navigateTo({
        url: `/pages/search/index?val=${inputVal}`
      }) :
      Taro.showToast({
        title: '请输入搜索内容~',
        icon: 'none'
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
    const { banner, radioList, songList, inputVal, hasPlay, showHotkey, hotkey } = this.state
    return (
      <View className="container">
        {/* 搜索框 */}
        <View className="searchBar">
          <AtSearchBar
            placeholder="搜索歌曲、歌手、专辑"
            actionName='搜索'
            value={inputVal}
            onChange={this.onInput.bind(this)}
            onActionClick={this.searchSong.bind(this)}
            onFocus={this.inputFocus.bind(this)}
            className="search"
          />
        </View>
        {showHotkey &&
          <View className="whiteBoard">
            {hotkey && hotkey.map((item, index) =>
              <View key={index} className="keyItem" onClick={this.choosekey.bind(this,item.k)}>{item.k}</View>
            )}
          </View>
        }
        {!showHotkey && <View className="main">
          {/* 轮播图 */}
          <Swiper
            className="banner"
            indicatorDots="true"
            indicatorActiveColor="#fff"
            autoplay='true'
            interval='3000'
            circular='true'
          >
            {banner && banner.map((item, index) =>
              <SwiperItem key={index}>
                <Image
                  src={item.picUrl}
                  className="bannerImage"
                  onClick={this.navigateTo.bind(this, 'banner', item.linkUrl)}
                ></Image>
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
          {/* 热门歌单 */}
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
                  <Image className="radioPlay" src={require("../../assert/play.png")}></Image>
                </View>
              )}
            </View>
          </View>
        </View>}
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


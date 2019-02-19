import Taro, { Component } from '@tarojs/taro'
import { View, Image, Icon, Input, Swiper, SwiperItem } from '@tarojs/components'
import './index.less'
import home from '../../api/home'

export default class songList extends Component {
  config = {
    navigationBarTitleText: '歌单'
  }

  constructor(props) {
    super(props)

    this.state = {
      songId: '',
      songsDetail: ''
    }
  }

  componentWillMount() {
    const { id } = this.$router.params
    this.setState({
      songId: id
    })

  }

  componentDidMount() {
    this.getList()
  }

  componentWillUnmount() { }

  componentDidShow() {
  }

  componentDidHide() { }

  async getList() {
    const _this = this
    const { songId } = this.state
    const params = {
      key: '579621905',
      id: songId
    }
    const { data: { data } } = await home.getSongList(params)
    // console.log(data, 'datatatataat')
    this.setState({
      songsDetail: data
    })
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
    const { songsDetail } = this.state
    return (
      <View className="container">
        <View className="headerTitle">
          <View className="filterBox">
            <Image src={songsDetail.logo} className="filterImg"></Image>
          </View>
          <View className="headerContent">
            <Image src={songsDetail.logo} className="songsImg"></Image>
            <View className="desBox">
              <View className="songsName">{songsDetail.title}</View>
              <View className="songsAuth">{songsDetail.author}</View>
              <View className="desc">简介：{songsDetail.desc}</View>
            </View>
          </View>
        </View>
        <View className="list">
          <View className="listTop">
            <View className="leftBox">
              <Image src={require('../../assert/playIcon.png')} className="playAll"></Image>
              <View className="playText">播放全部({songsDetail.songnum||'--'})</View>
            </View>
            <View className="rightBox">
              <Image src={require('../../assert/playlist.png')} className="playlist"></Image>
            </View>
          </View>
          <View className="listCon">
            {songsDetail.songs && songsDetail.songs.map((item, index) =>
              <View key={index} className="listItem">
                <View className="leftBox">
                  <View className="num">{index + 1}</View>
                  <View className="nameBox">
                    <View className="songName">{item.name}</View>
                    <View className="singer">{item.singer}</View>
                  </View>
                </View>
                <View className="rightBox">
                  <Image src={require('../../assert/opt_icon.png')} className="playIcon"></Image>
                </View>
              </View>
            )}
          </View>
        </View >
      </View>
    )
  }
}


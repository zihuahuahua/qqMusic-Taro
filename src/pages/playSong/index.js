import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import './index.less'
import home from '../../api/home'

export default class webView extends Component {
  config = {
    navigationBarTitleText: '详情'
  }

  constructor(props) {
    super(props)

    this.state = {
      type: '',
      id: '',
      song: []
    }
  }

  componentWillMount() {

  }

  componentDidMount() {
    const { id, type } = this.$router.params
    this.setState({
      type: type,
      id: id
    }, () => this.getSongsDetail())
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  async getSongsDetail() {
    const { id } = this.state
    const params = {
      key: '579621905',
      id: id
    }
    const { data: { data } } = await home.getSongs(params)
    console.log(data, 'songdata')
    this.setState({
      song: data
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
    const { song } = this.state
    return (
      <View className="container">
        <View className="bgCon">
          <View className="mask"></View>
          <Image className="imgBg" src={song.pic}></Image>
        </View>
        <View className="main">
          <View className="wordBox">
            <View className="name">{song.name}</View>
            <View className="singer">{song.singer}</View>
          </View>
          <Image className="songImg animate" src={song.pic}></Image>
          <Audio
            src={song.url}
            controls={true}
            autoplay={true}
            loop={false}
            muted={false}
          />
        </View>
      </View>
    )
  }
}
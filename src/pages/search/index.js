import Taro, { Component } from '@tarojs/taro'
import { View, Image, Icon, Input, Swiper, SwiperItem } from '@tarojs/components'
import './index.less'
import home from '../../api/home'

export default class Home extends Component {
  config = {
    navigationBarTitleText: '搜索'
  }

  constructor(props) {
    super(props)

    this.state = {
      inputVal: '',
      currentPage: 1,
      songList: []
    }
  }

  componentWillMount() {

  }

  componentDidMount() {
    const { val } = this.$router.params
    this.setState({
      inputVal: val
    }, () => this.searchSong())
  }

  componentWillUnmount() { }

  componentDidShow() {
  }

  componentDidHide() { }

  // 键入搜索
  onInput(e) {
    const { detail: { value } } = e
    this.setState({
      inputVal: value,
    })
  }
  // 清空
  clearVal(){
    this.setState({
      inputVal: ''
    })
  }
  // 输入框聚焦
  inputFocus() {
    this.setState({ focus: true })
  }

  // 搜索
  async searchSong() {
    const { inputVal, currentPage } = this.state
    const params = {
      key: '579621905',
      s: inputVal,
      type: 'song',
      limit: 20,
      offset: currentPage
    }
    const { data: { data } } = await home.searchSongs(params)
    console.log(data, 'search==')
    this.setState({
      songList: data
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
    const { inputVal, songList } = this.state
    return (
      <View className="container">
        {/* 搜索框 */}
        <View className="searchBar">
          <View className="searchBarbox">
            <Icon type="search" size="14" style={{ marginRight: '20px' }}></Icon>
            <Input type="text" placeholder="搜索歌曲、歌手、专辑" className="searchInput" value={inputVal} onInput={this.onInput.bind(this)} onFocus={this.inputFocus.bind(this)} />
            {inputVal.length > 0 &&
              <Icon type="clear" size="14" className="clear" onClick={this.clearVal.bind(this)}></Icon>
            }
          </View>
          <View className="comfirm" onClick={this.searchSong.bind(this)}>确定</View>
        </View>
        {/* 搜索列表 */}
        <View className="list">
          {songList && songList.map((item, index) =>
            <View className="listItem" key={index}>
              <View className="leftBox">
                <View className="songName">{item.name}</View>
                <View className="singer">{item.singer}</View>
              </View>
              <View className="rightBox">
                <Image src={require('../../assert/opt_icon.png')} className="playIcon"></Image>
              </View>
            </View>
          )}
        </View>
      </View>
    )
  }
}


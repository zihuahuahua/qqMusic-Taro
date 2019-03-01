import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { link } from 'fs';
import home from '../../api/home'

export default class webView extends Component {
  config = {
    navigationBarTitleText: 'QQ音乐排行榜'
  }

  constructor(props) {
    super(props)

    this.state = {
      topList: []
    }
  }

  componentWillMount() {

  }

  componentDidMount() {
    this.getTopList()
  }

  componentWillUnmount() { }

  componentDidShow() {
  }

  componentDidHide() { }

  async getTopList() {
    const params = { urlType: 1 }
    const { data } = await home.getTopList(params)
    // 转 返回格式
    let data_re = data.replace(/MusicJsonCallback\(/, '')
    data_re = data_re.substr(0, data_re.length - 1)
    data_re = JSON.parse(data_re)
    const { data: { topList } } = data_re
    console.log(topList)

    this.setState({
      topList: topList
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
    const { topList } = this.state
    return (
      <View className="container">
        {topList && topList.map((item, i) => 
          <View className="listItem" key={i}>
            <View className="leftBox">
              <View className="title">{item.topTitle}</View>
              <View className="songs">
                {item.songList && item.songList.map((v, j) =>
                  <Text className="song" key={j}>
                    <Text className="num">{j + 1}.</Text>
                    <Text className="songName">{v.songname}</Text>
                    <Text className="singer">- {' '}{v.singername}</Text>
                  </Text>
                )}
              </View>
            </View>
            <View className="rightBox">
              <Image className="itemPic" src={item.picUrl}></Image>
              <View className="descBox">
                <View className="countBox">
                  <Image className="countIcon" src={require('../../assert/icon.png')}></Image>
                  <View className="count">{item.listenCount > 9999 ? (item.listenCount / 10000).toFixed(1) + '万' : item.listenCount}</View>
                </View>
                <Image className="playIcon" src={require('../../assert/play.png')}></Image>
              </View>
            </View>
          </View>
        

        )}
      </View>
    )
  }
}
import Taro, { Component } from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import { AtSlider } from 'taro-ui';
import './index.less';
import home from '../../api/home';

export default class webView extends Component {
  config = {
    navigationBarTitleText: '详情'
  }

  constructor(props) {
    super(props)

    this.state = {
      type: '',
      id: '',
      song: [],
      togShow: true,
      isPlaying: true,
      playTime: 0,
      totalTime: 0,
      playing: null
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

  setPlay(index = 0) {
    let { playing, totalTime } = this.state
    let temp = setInterval(() => {
      if (index > totalTime) {
        clearInterval(playing);
        return;
      }
      ++index;
      this.setState({
        playTime: `0${Math.floor(index / 60)}:${index >= 60 ? index % 60 : (index < 10 ? '0' + index : index)}`, playValue: index
      })
    }, 1000);
    this.setState({ playing: temp })
  }
  getTotalTime(time) {
    return `0${Math.floor(time / 60)}:${time >= 60 ? time % 60 : (time < 10 ? '0' + time : time)}`
  }
  // toggle
  toggleShow() {
    this.setState({ togShow: !this.state.togShow })
  }
  async getSongsDetail() {
    const { id } = this.state
    const params = {
      key: '579621905',
      id: id
    }
    const { data: { data } } = await home.getSongs(params)
    console.log(data, 'songdata')
    this.setState({
      song: data,
      totalTime: data.time
    },()=>this.setPlay())
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
    const { song, togShow, isPlaying, playTime, playValue, totalTime } = this.state
    return (
      <View className="container">
        <View className="bgCon">
          <View className="mask"></View>
          <Image className="imgBg" src={song.pic}></Image>
        </View>
        {togShow ?
          <View className='main'>
            <View className="wordBox">
              <View className="name">{song.name}</View>
              <View className="singer">{song.singer}</View>
            </View>
            <View onClick={this.toggleShow.bind(this)} className={`playImgCon ${isPlaying ? '' : 'stopAnim'}`}>
              <View className={`playImgBefore ${isPlaying ? '' : 'stopAnim'}`}>
                <View className='playCic'></View>
                <View className='playCic2'></View>
                <View className='playCic3'></View>
              </View>
              <Image className='playImg' src={song.pic} />
            </View>
          </View>
          : <View onClick={this.toggleShow.bind(this)} className='playIrcCon'>
            <ScrollView className='playIrc' id='ircView' scroll-y='true' scroll-top={`${this.state.scTop}rpx`}>
              <View style='height:400rpx'></View>
              {this.state.msP.map((item, idx) => {
                return (<View className={this.state.scTop == idx * 60 ? 'playLight' : ''} key={idx}>{item[1]}</View>)
              })}
            </ScrollView>
          </View>
        }
        <View className="bottomBar">
          <View class='iconCon'>
            <Text class='iconfont icon-heart'></Text>
            <Text class='iconfont icon-plus-download'></Text>
            <Text class='iconfont icon-pinglun' onClick={this.toComment}></Text>
            <Text class='iconfont icon-menu2'></Text>
          </View>

          <View class='sliderCon'>
            <View>{playTime}</View>
            <View class='playSlider'>
              <AtSlider activeColor='white' backgroundColor='gainsboro' min={0} value={playValue} blockSize={12} max={totalTime}></AtSlider>
            </View>
            <View>{this.getTotalTime(totalTime)}</View>
          </View>
          <View class='iconCon'>
            <Text class='iconfont icon-icon-1'></Text>
            <Text class='iconfont icon-shangyishoushangyige'></Text>
            {this.state.isPlaying ?
              <Text class='iconfont icon-zanting' onClick={this.togglePlay}></Text> :
              <Text class='iconfont icon-bofang' onClick={this.togglePlay}></Text>
            }
            <Text class='iconfont icon-xiayigexiayishou'></Text>
            <Text class='iconfont icon-yinleliebiao'></Text>
          </View>
        </View>
      </View>
    )
  }
}
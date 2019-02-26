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
      id: '', // 歌曲id
      song: [], // 歌曲信息
      togShow: true, // toggle
      isPlaying: true, 
      playTime: 0, // 播放时间
      totalTime: 0, // 总时间
      lrcMap:[], // 歌词
      playing: null,
      scTop: 0
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
  // 播放 样式
  setPlay(index = 0) {
    let { playing, totalTime, lrcMap } = this.state
    let scTop = 0
    let temp = setInterval(() => {
      if (index > totalTime) {
        clearInterval(playing);
        return;
      }
      ++index;

      lrcMap.forEach((item, i) => {
        if (lrcMap[i - 1] && lrcMap[i + 1]) {
          if (lrcMap[i - 1][0] <= index && lrcMap[i + 1][0] >= index) {
            scTop = (i - 1) * 60
          }
        }
      })
      this.setState({
        playTime: `0${Math.floor(index / 60)}:${index >= 60 ? index % 60 : (index < 10 ? '0' + index : index)}`,
        playValue: index,
        scTop: scTop
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
  // 获取歌曲信息
  async getSongsDetail() {
    const { id } = this.state
    const params = {
      key: '579621905',
      id: id
    }
    const { data: { data } } = await home.getSongs(params)
    console.log(data, 'songdata')
    // 获取歌词
    Taro.request({ url: data.lrc }).then(res => {
      let lrc = res.data
      let arr = lrc.split('\n')
      let temp
      let lrcMap = arr.map(item => {
        item = item.split(']')
        if (item[1]) {
          temp = item[0].match(/\d{2}/g)
          item[0] = temp[0] * 60 + Number(temp[1])
        }
        return item;
      })
      // console.log(lrcMap, 'mapppp')
      this.setState({
        song: data,
        totalTime: data.time,
        lrcMap: lrcMap
      }, () => this.setPlay())
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
    const { song, togShow, isPlaying, playTime, playValue, totalTime, lrcMap, scTop } = this.state
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
              <Image className='playImg' src={song.pic} />
            </View>
          </View>
          : <View onClick={this.toggleShow.bind(this)} className='playIrcCon'>
            <ScrollView className='playIrc' scrollWithAnimation={true} scroll-y={true} scroll-top={`${scTop}rpx`}>
              <View style='height:400rpx'></View>
              {lrcMap.map((item, i) => {
                return (<View className={scTop == i * 60 ? 'playLight' : ''} key={i}>{item[1]}</View>)
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
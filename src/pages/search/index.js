import Taro, { Component } from '@tarojs/taro'
import { View, Image, Icon, Input, Swiper, SwiperItem } from '@tarojs/components'
import { AtTabs, AtTabsPane } from 'taro-ui'
import './index.less'
import home from '../../api/home'
import 'taro-ui/dist/style/index.scss'
export default class Home extends Component {
  config = {
    navigationBarTitleText: '搜索',
    enablePullDownRefresh: true,
    onReachBottomDistance: 100,
  }

  constructor(props) {
    super(props)

    this.state = {
      inputVal: '',
      currentPage: 1,
      song: [], // 歌曲列表
      album: [], // 专辑列表
      list: [], // 歌单列表
      mv: [], // mv列表
      user: [], // 用户列表
      lrc: [], // 歌词列表
      current: 0, // tab页
      type: 'song',
    }
  }

  componentWillMount() {
    Taro.showLoading({ title: '' })
  }

  componentDidMount() {
    const { val } = this.$router.params
    this.setState({
      inputVal: val
    }, () => {
      try {
        this.searchSong()
      } catch (error) {
        console.log(error)
      }
    })
  }

  componentWillUnmount() { }

  componentDidShow() {
  }

  componentDidHide() { }

  chooseTab(index) {
    this.setState({
      current: index,
      currentPage: 1
    })
    const tabs = [
      { title: '音乐', type: 'song' },
      { title: '专辑', type: 'album' },
      { title: '歌单', type: 'list' },
      { title: 'MV', type: 'mv' },
      { title: '用户', type: 'user' },
      { title: '歌词', type: 'lrc' }
    ]
    this.setState({
      type: tabs[index].type
    }, () => { // 若列表中有数据 则不请求
      const { type } = this.state
      if (this.state[type].length == 0) {
        Taro.showLoading({ title: '' })
        this.searchSong()
      }
    })
  }
  // 键入搜索
  onInput(e) {
    const { detail: { value } } = e
    this.setState({
      inputVal: value,
    })
  }
  // 清空
  clearVal() {
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
    const { inputVal, currentPage, type } = this.state
    const params = {
      key: '579621905',
      s: inputVal,
      type: type,
      limit: 20,
      offset: currentPage
    }
    try {
      const { data: { data } } = await home.searchSongs(params)
      console.log(data, 'search==')
      this.setState({
        [type]: currentPage == 1 ? data : this.state[type].concat(data)
      })
      if (type == 'lrc') {
        for (let i = 0; i < data.length; i++) {
          let content = data[i].content
          let contents = content.split('\\n')
          data[i].content = contents
          // console.log()
        }
      }
      Taro.hideLoading()
    } catch (error) {
      console.log(error, 'err')
      Taro.showToast({
        title: '网络较慢，请稍后重试',
        icon: 'none'
      })
      Taro.hideLoading()
    }
  }
  // 触底加载
  onReachBottom() {
    Taro.showLoading({ title: '' })
    const { currentPage } = this.state
    this.setState({
      currentPage: currentPage + 1
    }, () => this.searchSong())
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
    const { inputVal, song, album, list, mv, user, lrc } = this.state
    const tabList = [{ title: '音乐' }, { title: '专辑' }, { title: '歌单' }, { title: 'MV' }, { title: '用户' }, { title: '歌词' }]
    return (
      <View className="container">
        {/* 搜索框 */}
        <View className="searchBar">
          <View className="searchBarbox">
            <Icon type="search" size="14" style={{ marginRight: '20px' }}></Icon>
            <Input
              placeholder="搜索歌曲、歌手、专辑"
              className="searchInput"
              value={inputVal}
              onInput={this.onInput.bind(this)}
              onFocus={this.inputFocus.bind(this)}
            />
            {inputVal.length > 0 &&
              <Icon type="clear" size="14" className="clear" onClick={this.clearVal.bind(this)}></Icon>
            }
          </View>
          <View className="comfirm" onClick={this.searchSong.bind(this)}>确定</View>
        </View>
        <AtTabs
          current={current}
          tabList={tabList}
          scroll
          onClick={this.chooseTab.bind(this)}
          style={{ position: 'fixed' }}
          className="tabsPage"
        >
          <AtTabsPane current={current} index={0} >
            {/* 歌曲列表 */}
            <View className="list">
              {song && song.map((item, i) =>
                <View className="listItem" key={i}>
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
          </AtTabsPane>
          <AtTabsPane current={current} index={1}>
            {/* 专辑列表 */}
            <View className="list">
              {album && album.map((item, i) =>
                <View className="listItem" key={i}>
                  <View className="leftBox row">
                    <Image className="albumImg" src={item.albumPic}></Image>
                    <View className="albumDesc">
                      <View className="songName">{item.albumName}</View>
                      <View className="singer">{item.singerName}{' '} {item.publicTime}</View>
                    </View>
                  </View>
                  <View className="rightBox">
                    <Image src={require('../../assert/opt_icon.png')} className="playIcon"></Image>
                  </View>
                </View>
              )}
            </View>
          </AtTabsPane>
          <AtTabsPane current={current} index={2}>
            {/* 歌单列表 */}
            <View className="list">
              {list && list.map((item, i) =>
                <View className="listItem" key={i}>
                  <View className="leftBox row">
                    <Image className="albumImg" src={item.imgurl}></Image>
                    <View className="albumDesc">
                      <View className="songName">{item.dissname}</View>
                      <View className="singer overflow">{item.introduction}</View>
                      <View className="singer">播放次数： {item.listennum}次</View>
                    </View>
                  </View>
                  <View className="rightBox">
                    <Image src={require('../../assert/opt_icon.png')} className="playIcon"></Image>
                  </View>
                </View>
              )}
            </View>
          </AtTabsPane>
          <AtTabsPane current={current} index={3}>
            {/* MV列表 */}
            <View className="list">
              {mv && mv.map((item, i) =>
                <View className="listItem" key={i}>
                  <View className="leftBox row">
                    <Image className="albumImg" src={item.mv_pic_url}></Image>
                    <View className="albumDesc">
                      <View className="songName">{item.mv_name}</View>
                      <View className="singer">{item.singer_name}</View>
                    </View>
                  </View>
                  <View className="rightBox">
                    <Image src={require('../../assert/opt_icon.png')} className="playIcon"></Image>
                  </View>
                </View>
              )}
            </View>
          </AtTabsPane>
          <AtTabsPane current={current} index={4}>
            {/* 用户列表 */}
            <View className="list">
              {user && user.map((item, i) =>
                <View className="listItem" key={i}>
                  <View className="leftBox row">
                    <View className="profileBox">
                      <Image className="avatar" src={item.pic}></Image>
                      <Image className="icon" src={item.iconurl}></Image>
                    </View>
                    <View className="albumDesc">
                      <View className="songName">{item.title}</View>
                      <View className="singer">{item.fans_title}</View>
                      <View className="singer">{item.gedan_title}</View>
                    </View>
                  </View>
                  <View className="rightBox">
                    <Image src={require('../../assert/next.png')} className="playIcon"></Image>
                  </View>
                </View>
              )}
            </View>
          </AtTabsPane>
          <AtTabsPane current={current} index={5}>
            {/* 歌词列表 */}
            <View className="list">
              {lrc && lrc.map((item, i) =>
                <View className="listItem" key={i}>
                  <View className="leftBox">
                    <View className="songName">{item.songname}</View>
                    <View className="singer">{item.albumname}-{item.singer[0].name}</View>
                    <View className="lrcs">
                      {item.content.map((Item, l) =>
                        <View>
                          {l < 3 && <View className="lrc" key={l}>{Item}</View>}
                        </View>
                      )}
                    </View>
                  </View>
                  <View className="rightBox">
                    <Image src={require('../../assert/opt_icon.png')} className="playIcon"></Image>
                  </View>
                </View>
              )}
            </View>
          </AtTabsPane>
        </AtTabs>
      </View>
    )
  }
}


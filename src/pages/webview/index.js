import Taro, { Component } from '@tarojs/taro'
import { WebView } from '@tarojs/components'
import { link } from 'fs';

export default class webView extends Component {
  config = {
    navigationBarTitleText: '详情'
  }

  constructor(props) {
    super(props)

    this.state = {
      linkUrl: ''
    }
  }

  componentWillMount() {

  }

  componentDidMount() {
    const { linkUrl } = this.$router.params
    this.setState({
      linkUrl: linkUrl
    })
  }

  componentWillUnmount() { }

  componentDidShow() {
  }

  componentDidHide() { }

  // 分享
  onShareAppMessage() {
    return {
      title: 'QQ音乐--让生活充满音乐',
      content: '十三年的陪伴，国民音乐平台',
      path: '/pages/home/index'
    };
  }
  render() {
    const { linkUrl } = this.state
    return (
      <WebView src={linkUrl} />
    )
  }
}
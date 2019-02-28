import Taro, { Component } from '@tarojs/taro'
// import { get } from 'https';
export default class fetch {
  static request(method, url, data, contType) {
    const { type = 0 } = data
    const baseurl = 'https://api.bzqll.com'
    const _baseurl = 'https://c.y.qq.com'

    let params = {
      url: type==0?`${baseurl}${url}`:`${_baseurl}${url}`,
      data: data,
      method: method,
      header: {
        'content-type': contType || 'application/json'
      }
    }
    return Taro.request(params)
  }
  static param(a = {}) {
    var b = []
    for (var i in a) {
      b.push(`${i}=${a[i]}`)
    }
    return b.join('&')
  }
  static get(url, data) {
    // if (data) {
    //   url = `${url}?${this.param(data)}`
    // }
    return this.request('GET', url, data)
  }
  static post(url, data) {
    return this.request('POST', url, data)
  }
  static jsonget(url, data) {
    return this.request('GET', url, data, 'application/json')
  }
}


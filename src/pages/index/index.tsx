import { Button, Text, View } from '@tarojs/components';
import Taro from "@tarojs/taro";
import { Component } from 'react';
import './index.less';


export default class Index extends Component {

  render() {
    return (
      <View className='index'>
        <Text>Hello world!</Text>
        <Button onClick={() => { Taro.navigateTo({ url: '/pages/virtualList/index' }) }}>官方虚拟列表</Button>
        <Button onClick={() => { Taro.navigateTo({ url: '/pages/TaroVitualized/index' }) }}>TaroVitualized</Button>
      </View>
    )
  }
}

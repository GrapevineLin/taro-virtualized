# 基于 Taro3 的简易虚拟列表

## 示例

```javascript
import { View } from '@tarojs/components';
import { useMemo } from 'react';
import TaroVirtualized from '../../components/TaroVitualized';
import './index.less';

export default function Index() {
  console.log(TaroVirtualized)
  const dataList = useMemo(() => Array(1000).fill(0).map((_, i) => i), []);

  return (
    <View>
      <TaroVirtualized
        list={dataList}
        onRenderItem={(item) => {
          return <View className='item'>{item}</View>;
        }}
        onRenderPlaceHolder={(_) => {
          return <View className='item'>加载中...</View>;
        }}
      />
    </View>
  )
}
```

## 起源

1. 开发场景中经常会有渲染长列表的需求，当列表数量足够庞大的时候，一次性渲染出全部的列表项目就有可能出现卡顿现象，所以我们的做法是按需渲染，即只渲染出现在视口以及即将出现在视口的列表项。react生态有一个非常好用的虚拟列表库[react-window](https://github.com/bvaughn/react-window)，可惜参照[这篇文章](https://tarojsx.github.io/blog/2020-06-08-taro3-virtual-list/)也未能运行成功。

2. [官方虚拟列表](https://taro-docs.jd.com/taro/docs/virtual-list)存在一定的渲染 bug，特别是针对**列表节点不等高**，存在诸多问题，比如节点闪动、滚动过快造成无限加载、白屏率较高等；并且会给每个列表项目套上一个父类，导致子项目的样式灵活性下降。从源码函数名来看，应该是参照了react-window的思路。(@tarojs\components\virtual-list和https://github.com/bvaughn/react-window/blob/master/src/FixedSizeList.js)

3. 在网上找到了一个很不错的第三方虚拟列表库[taro-virtual-list
   ](https://www.npmjs.com/package/taro-virtual-list/v/1.0.13),这个库不仅比官方的灵活，还支持服务端分页，作者采用了二维数组的思路进行分页，是一个很有趣的做法。

4. 但是我有一个场景是需要跳转到列表当中某个还未渲染出来的项目，要怎么做呢？显然以上两个库都不好实现，究其原因是项目没有渲染出来；那么假如我预渲染出全部的列表，只有出现在视口的项目才会在一定的延时下渲染出真知的项目，这样子不仅列表高度不会随着渲染项逐渐增多而变高，并且在快速滑动的过程中开销极小。

## 该组件适用场景

1. 页面节点渲染较多（主要是列表页）；
2. 针对列表页**节点不等高**具有更好的支持；
3. 列表高度固定不变


## 参数说明

### Props

| 参数|  类型   | 默认值 | 必填 | 说明    |
| ----  | ----  | ---- | ----     | ---- |
| list            |  Array  | -                 | 是   | 列表数据                                                                                                                                                           |
| listId          | String  | "TaroVirtualized" | 否   | 虚拟列表唯一 id（防止同一个页面有多个虚拟列表导致渲染错乱）|                                                                                                                                       
| scrollViewProps | Object  | -                 | 否   | 自定义 scrollView 的参数，会合并到组件内部的 scrollView 的参数里                    |

### Events

| 参数  | 回调参数  | 默认值 | 必填 | 说明 |
| ----  | ----  | ---- | ----     | ---- |
| onRender | (item, index, segmentIndex) => {}<br>item: 列表的单个数据项的值;<br> index：列表的单个数据项的 index;<br>segmentIndex：当前二维数组维度的 index | -  | 是|列表的渲染回调，用于自定义列表 Item | -                                                                                                                                                                      | 列表的渲染回调，用于自定义列表 Item |
| onRenderPlaceHolder        | (item, index, segmentIndex) => {}<br>item: 列表的单个数据项的值;<br> index：列表的单个数据项的 index;<br>segmentIndex：当前二维数组维度的 index | -      | 列表的渲染回调，用于自定义列表 Item |  是|-                                                                                                                                                                      | 列表的占位渲染回调，用于自定义列表占位Item|                                                                                                                                                  |                                                                           |
| onRenderTop     |                                                                        -                                                                        | -      | 否                                  | 列表上部分内容渲染回调，用于渲染插入虚拟列表上边的内容                                                                                                                 |
| onRenderBottom  |                                                                        -                                                                        | -      | 否                                  | 列表下部分内容渲染回调，用于渲染插入虚拟列表下边的内容                                                                                                                 |

## 注意事项

1. 目前h5的兼容性还存在少许问题，如果有大哥给点建议或者提个pr，感激不尽

## 版本
#### 0.0.2

- 发布


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

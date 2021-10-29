import { ScrollView, View } from '@tarojs/components';
import Taro, { Current } from '@tarojs/taro';
import classNames from 'classnames';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { VirtualListProps } from '../../../@types/VirtualList';
import { isH5 } from '../../common/utils';

export default function TaroVirtualized(props: VirtualListProps) {
  const {
    scrollViewProps,
    onRenderTop,
    onRenderBottom,
    onRenderItem,
    onRenderPlaceHolder,
    listId = 'TaroVirtualized',
    className,
    itemsWrapperClassName,
    list,
  } = props;
  const scrollStyle = {
    height: '100%',
  }

  const scrollViewClassName = 'virtual-list';

  /**
   * 初始化渲染列表
   */
  const initRenderList: JSX.Element[] = useMemo(() => {
    return list.map((item, index) => {
      const renderItem = onRenderItem(item, index);
      return React.cloneElement(renderItem, { ...renderItem.props, className: classNames(renderItem.props.className, `wrap_${index}`) });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * 初始化占位的虚拟列表
   */
  const placeRenderList: JSX.Element[] = useMemo(() => {
    return list.map((item, index) => {
      const renderItem = onRenderPlaceHolder(item, index);
      //TODO  直接使用 renderItem而不去复用initRenderList[index]的props会导致节点被插入末尾而不是替换
      return React.cloneElement(renderItem, { ...initRenderList[index].props, className: classNames(renderItem.props.className, `wrap_${index}`), children: renderItem.props.children ?? undefined });
      // return React.cloneElement(renderItem);
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [renderList, setRenderList] = useState<JSX.Element[]>([...placeRenderList]);

  const currentPage: Current = useMemo(() => Taro.getCurrentInstance(), []);

  const IntersectionObserverListRef = useRef<(Taro.IntersectionObserver | IntersectionObserver)[]>([])

  /**
   * 监听元素可见性
   */
  useEffect(() => {
    if (!isH5) {
      Taro.nextTick(miniObserve);
    }
    const temp = IntersectionObserverListRef.current;
    return () => temp.forEach(e => e.disconnect());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isH5) {
      let timers = [];
      Taro.nextTick(() => webObserve(timers));
      const temp = IntersectionObserverListRef.current;
      return () => { timers.map(e => clearTimeout(e)); temp.forEach(e => e.disconnect()); }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [renderList]);

  /**
   * 小程序平台监听
   * 依次给每个列表元素注册监听
   */
  const miniObserve = (): void => {
    for (let index = 0; index < renderList.length; index++) {
      const observer = Taro.createIntersectionObserver(currentPage.page!).relativeToViewport();
      IntersectionObserverListRef.current.push(observer);
      let renderTimer: NodeJS.Timeout;
      observer.observe(`#${listId} .wrap_${index}`, (res) => {
        if (res?.intersectionRatio <= 0) {
          clearTimeout(renderTimer);
          // 当没有与当前视口有相交区域，则将该元素设置为对应的占位元素
          renderList[index] = placeRenderList[index];
          setRenderList([...renderList]);
        } else {
          // 如果有相交区域，则将在一定的延迟后渲染，此举可以在快速滑动的时候提高性能，避免白屏
          renderTimer = setTimeout(() => {
            renderList[index] = initRenderList[index];
            setRenderList([...renderList]);
          }, 200);
        }
      })
    }
  }

  /**
   * h5平台监听
   * 依次给每个列表元素注册监听
   * //FIX: 目前存在渲染过度的问题
   */
  const webObserve = (timers): void => {
    const targets = document.querySelectorAll(`#${listId} [class*='wrap_']`)
    const options = {
      root: document.querySelector(`#${listId}`),
      rootMargin: "500px 0px",
      threshold: [0.5],
    }
    let observer = new IntersectionObserver((...args) => observerCallBack(...args, timers), options);
    IntersectionObserverListRef.current?.push(observer);
    targets.forEach(item => {
      observer?.observe(item)
    })
  }

  const observerCallBack = (entries: IntersectionObserverEntry[], _observers: IntersectionObserver, timers): void => {

    entries.forEach((item) => {
      const index = item.target.className?.match(/wrap_\d+/)?.[0].split?.('_')[1];
      let newIndex;
      if (index !== undefined) {
        newIndex = parseInt(index);
      }
      if (item.isIntersecting) {
        timers[newIndex] = setTimeout(() => {
          if (renderList[newIndex] != initRenderList[newIndex]) {
            renderList[newIndex] = initRenderList[newIndex];
            setRenderList([...renderList]);
          }
        }, 200);
      } else {
        clearTimeout(timers[newIndex]);
        if (renderList[newIndex] != placeRenderList[newIndex]) {
          renderList[newIndex] = placeRenderList[newIndex];
          setRenderList([...renderList]);
        }
      }
    })
  }

  return (
    <ScrollView
      scrollY
      id={listId}
      style={scrollStyle}
      lowerThreshold={250}
      className={`${scrollViewClassName} ${className}`}
      {...scrollViewProps}
    >
      {onRenderTop?.()}
      <View className={itemsWrapperClassName}>
        {renderList.map((item) => {
          return item;
        })}
      </View>
      {onRenderBottom?.()}
    </ScrollView>
  )
}

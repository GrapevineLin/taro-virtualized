import { ScrollViewProps } from "@tarojs/components/types/ScrollView";
import { FunctionComponent } from "react";
import { BaseComponent } from "./baseType";

export interface VirtualListProps extends BaseComponent {
  /**
   * 列表数据
   */
  list: Array<any>;
  /**
   * 包裹列表项目的父标签类名
   */
  itemsWrapperClassName?: string;
  /**
   * 虚拟列表一id，默认值'TaroVirtualized'
   */
  listId?: string;
  /**
   * 自定义scrollView的参数
   */
  scrollViewProps?: ScrollViewProps;
  /**
   * 列表的渲染回调，用于自定义列表Item
   * @param item 列表的单个数据项的值
   * @param index 列表的单个数据项的index
   */
  onRenderItem(item: any, index: number): JSX.Element;
  /**
   * 列表的占位渲染回调，用于自定义列表占位Item
   * @param item 列表的单个数据项的值
   * @param index 列表的单个数据项的index
   */
  onRenderPlaceHolder(item: any, index: number): JSX.Element;
  /**
   * 列表上部分内容渲染回调，用于渲染插入虚拟列表上边的内容
   */
  onRenderTop?(): any;
  /**
   * 列表下部分内容渲染回调，用于渲染插入虚拟列表下边的内容
   */
  onRenderBottom?(): any;
}

declare const TaroVirtualized: FunctionComponent<VirtualListProps>;

export default TaroVirtualized;

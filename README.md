# list-vue

A list component used to display items and control loading status.

[![](https://img.shields.io/npm/v/@axios-use/list-vue.svg)](https://www.npmjs.com/package/@axios-use/list-vue)

```shell
npm i @axios-use/list-vue
```

```ts
import { ScrollList } from '@axios-use/list-vue'
```

## ScrollList

### `ScrollList`.props

| name           | type         | default      | desc                                                                                         |
| -------------- | ------------ | ------------ | -------------------------------------------------------------------------------------------- |
| prefixCls      | `string`     | --           | prefix classname. 自定义 class 前缀                                                          |
| direction      | `up`\|`down` | `down`       | Scroll direction. 滚动方向                                                                   |
| offset         | `number`     | `300`        | Trigger `load` distance condition. 小于 offset 距离，触发 `load` 事件                        |
| scroller       | `Element`    | --           | Custom the parent scroll node. 自定义父类滚动节点                                            |
| loading        | `boolean`    | --           | Whether to show loading info. 展示加载中                                                     |
| disabled       | `boolean`    | --           | Whether to disable the load event. 是否禁用滚动加载                                          |
| finished       | `boolean`    | --           | Whether loading is finished                                                                  |
| error          | `boolean`    | --           | Whether loading is error. 是否加载失败                                                       |
| immediateCheck | `boolean`    | `true`       | Whether to check loading position immediately after mounted. 是否在 `onMounted` 检查滚动位置 |
| finishedText   | `string`     | --           | Finished text. 加载完成后提示文案                                                            |
| errorText      | `string`     | --           | Error loaded text. 加载失败后提示文案                                                        |
| loadingText    | `string`     | `loading...` | Loading text. 加载过程中提示文案                                                             |

### `ScrollList`.emits

| name           | desc                                                                                                                                      |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| load           | Triggered when the distance between the scroll bar and the head or bottom is less than offset. 滚动条与头部或底部距离小于 `offset` 时触发 |
| update:loading |                                                                                                                                           |
| update:error   |                                                                                                                                           |

### `ScrollList`.slot

| name     | desc                                           |
| -------- | ---------------------------------------------- |
| default  | List content. 列表内容                         |
| finished | Custom finished node. 自定义加载完成后提示模块 |
| error    | Custom error node. 自定义加载失败后提示模块    |
| loading  | Custom loading node. 自定义底部/头部加载中模块 |

## License

[MIT](./LICENSE)

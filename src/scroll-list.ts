import type { ExtractPropTypes, PropType, RenderFunction, SlotsType } from 'vue'
import { computed, defineComponent, h, nextTick, onMounted, onUpdated, ref, watch } from 'vue'

import { useScrollParent } from './use-scroll-parant'
import { useEventListener } from './use-event-listener'
import { getPrefixCls, isHidden, useRect } from './utils'

export type ListDirection = 'up' | 'down'

export const scrollListProps = {
  prefixCls: String,
  direction: { type: String as PropType<ListDirection>, default: 'down' as const },
  offset: { type: Number, default: 300 },
  scroller: Object as PropType<Element>,
  loading: Boolean,
  disabled: Boolean,
  finished: Boolean,
  error: Boolean,
  immediateCheck: { type: Boolean, default: true },
  finishedText: String,
  errorText: String,
  loadingText: { type: String, default: 'loading...' }
}

export type ScrollListProps = ExtractPropTypes<typeof scrollListProps>

export type ScrollListSlotsType = {
  default?: RenderFunction
  finished?: RenderFunction
  error?: RenderFunction
  loading?: RenderFunction
}

export const ScrollList = defineComponent({
  name: 'ScrollList',
  props: scrollListProps,
  emits: {
    load: () => true,
    'update:loading': (val: boolean) => val != null,
    'update:error': (val: boolean) => val != null
  },
  slots: Object as SlotsType<ScrollListSlotsType>,
  setup(props, ctx) {
    const prefixCls = getPrefixCls('scroll-list', props.prefixCls)

    const loading = ref(props.loading)
    const root = ref<HTMLElement>()
    const placeholder = ref<HTMLElement>()
    const scrollParent = useScrollParent(root)
    const scroller = computed(() => props.scroller || scrollParent.value)

    const check = () => {
      nextTick(() => {
        if (loading.value || props.finished || props.disabled || props.error) {
          return
        }

        const offset = +props.offset
        const scrollParentRect = useRect(scroller)

        if (!scrollParentRect.height || isHidden(root)) {
          return
        }

        let isReachEdge = false
        const placeholderRect = useRect(placeholder)

        if (props.direction === 'up') {
          isReachEdge = scrollParentRect.top - placeholderRect.top <= offset
        } else {
          isReachEdge = placeholderRect.bottom - scrollParentRect.bottom <= offset
        }

        if (isReachEdge) {
          loading.value = true
          ctx.emit('update:loading', true)
          ctx.emit('load')
        }
      })
    }

    watch(() => [props.loading, props.finished, props.error], check)

    const renderFinishedText = () => {
      if (props.finished) {
        const text = ctx.slots.finished ? ctx.slots.finished() : props.finishedText
        if (text) {
          return h('div', { class: `${prefixCls}_finished` }, { default: () => text })
        }
      }
    }

    const clickErrorText = () => {
      ctx.emit('update:error', false)
      check()
    }
    const renderErrorText = () => {
      if (props.error) {
        const text = ctx.slots.error ? ctx.slots.error() : props.errorText
        if (text) {
          return h(
            'div',
            {
              role: 'button',
              class: `${prefixCls}_error`,
              tabindex: 0,
              onClick: clickErrorText
            },
            { default: () => text }
          )
        }
      }
    }

    const renderLoading = () => {
      if (loading.value && !props.finished && !props.disabled) {
        const loadingNode = ctx.slots.loading ? ctx.slots.loading() : props.loadingText

        return h('div', { class: `${prefixCls}_loading` }, { default: () => loadingNode })
      }
    }

    onUpdated(() => {
      loading.value = Boolean(props.loading)
    })

    onMounted(() => {
      if (props.immediateCheck) {
        check()
      }
    })

    useEventListener('scroll', check, {
      target: scroller as any,
      passive: true
    })

    return () => {
      const Content = ctx.slots.default?.()
      const Placeholder = h('div', {
        ref: placeholder,
        class: `${prefixCls}_placeholder`
      })
      const isDirectionUp = props.direction === 'up'
      return h('div', { ref: root, class: [prefixCls, `${prefixCls}_wrapper`] }, [
        isDirectionUp ? Placeholder : Content,
        renderLoading(),
        renderFinishedText(),
        renderErrorText(),
        isDirectionUp ? Content : Placeholder
      ])
    }
  }
})

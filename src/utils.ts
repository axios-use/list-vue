import type { Ref } from 'vue'
import { unref } from 'vue'

export const inBrowser = typeof window !== 'undefined'

export const getPrefixCls = (suffixCls: string, customizePrefixCls?: string) =>
  `${customizePrefixCls ? customizePrefixCls + '-' : ''}${suffixCls}`

export function isHidden(elementRef: HTMLElement | Ref<HTMLElement | undefined>) {
  const el = unref(elementRef)
  if (!el) {
    return false
  }

  const style = window.getComputedStyle(el)
  const hidden = style.display === 'none'

  const parentHidden = el.offsetParent === null && style.position !== 'fixed'

  return hidden || parentHidden
}

const isWindow = (val: unknown): val is Window => val === window

const makeDOMRect = (width: number, height: number) =>
  ({
    top: 0,
    left: 0,
    right: width,
    bottom: height,
    width,
    height
  }) as DOMRect

export const useRect = (elementOrRef: Element | Window | Ref<Element | Window | undefined>) => {
  const element = unref(elementOrRef)

  if (isWindow(element)) {
    const width = element.innerWidth
    const height = element.innerHeight
    return makeDOMRect(width, height)
  }

  if (element?.getBoundingClientRect) {
    return element.getBoundingClientRect()
  }

  return makeDOMRect(0, 0)
}

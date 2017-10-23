// @flow
/* global XMLHttpRequest, ProgressEvent */

export type XHRListener = ProgressEvent => void

export const addListeners = (handler: XHRListener, xhr :XMLHttpRequest): void => {
  xhr.addEventListener('load', handler)
  xhr.addEventListener('error', handler)
  xhr.addEventListener('timeout', handler)
}

export const removeListeners = (handler: XHRListener, xhr :XMLHttpRequest): void => {
  xhr.removeEventListener('load', handler)
  xhr.removeEventListener('error', handler)
  xhr.removeEventListener('timeout', handler)
}

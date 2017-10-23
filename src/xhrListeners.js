// @flow
/* global XMLHttpRequest, ProgressEvent */

export type XHRListener = ProgressEvent => void

export const XHR_EVENTS = ['load', 'error', 'timeout']

export const addListeners = (handler: XHRListener, xhr :XMLHttpRequest): void =>
  XHR_EVENTS.forEach(event => xhr.addEventListener(event, handler))

export const removeListeners = (handler: XHRListener, xhr :XMLHttpRequest): void =>
  XHR_EVENTS.forEach(event => xhr.removeEventListener(event, handler))

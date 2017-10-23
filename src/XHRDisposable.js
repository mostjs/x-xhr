// @flow
import { type XHRListener, removeListeners } from './xhrListeners'

/* global XMLHttpRequest */

// Flow seems to have issues with XMLHttpRequest.DONE satic constant,
// so define one locally for now.
export const XHR_DONE = 4

export const xhrIsDone = (xhr: XMLHttpRequest): boolean =>
  xhr.readyState === XHR_DONE

export class XHRDisposable {
  handler: XHRListener
  xhr: XMLHttpRequest

  constructor (handler: XHRListener, xhr: XMLHttpRequest) {
    this.handler = handler
    this.xhr = xhr
  }

  dispose (): void {
    removeListeners(this.handler, this.xhr)
    if (!xhrIsDone(this.xhr)) {
      this.xhr.abort()
    }
  }
}

// @flow
import type { Stream, Sink, Scheduler, Disposable } from '@most/types'
import { currentTime } from '@most/scheduler'
import { addListeners } from './xhrListeners'
import { XHRDisposable } from './XHRDisposable'

/* global XMLHttpRequest, ProgressEvent */

export const xhrStream = (createXHR: () => XMLHttpRequest): Stream<ProgressEvent> =>
  new XHRStream(createXHR)

class XHRStream {
  createXHR: () => XMLHttpRequest

  constructor (createXHR: () => XMLHttpRequest) {
    this.createXHR = createXHR
  }

  run (sink: Sink<ProgressEvent>, scheduler: Scheduler): Disposable {
    return handleXHR(this.createXHR(), sink, scheduler)
  }
}

const handleXHR = (xhr: XMLHttpRequest, sink: Sink<ProgressEvent>, scheduler: Scheduler): Disposable => {
  const handler = (event: ProgressEvent): void => {
    const time = currentTime(scheduler)
    sink.event(time, event)
    sink.end(time)
  }

  addListeners(handler, xhr)

  xhr.send()

  return new XHRDisposable(handler, xhr)
}

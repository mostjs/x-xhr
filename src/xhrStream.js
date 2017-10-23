// @flow
import type { Stream, Sink, Scheduler, Disposable } from '@most/types'
import { currentTime } from '@most/scheduler'
import { addListeners } from './xhrListeners'
import { XHRDisposable } from './XHRDisposable'

/* global XMLHttpRequest, ProgressEvent */

// Minimalist XHR stream
// Provide a function to setup the XHR however
// you want/need, but don't call send().  The returned
// stream will call send(), handle XHR events, and
// call abort() if necessary.
// The returned Stream will contain at most 1 events:
// the ProgressEvent emitted by XHR's 'load' OR 'error'
// event.  You can detect errors and turn them into
// Stream failures using chain() if you need.
// chain(progressEvent =>
//   progressEvent.type === 'error'
//     ? throwError(new Error(...))
//     : just(event), xhrStream(...))
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

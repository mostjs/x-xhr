// @flow
import type { Stream, Sink, Scheduler, Disposable, Time } from '@most/types'
import { currentTime } from '@most/scheduler'
import { addListeners } from './xhrListeners'
import { XHRDisposable } from './XHRDisposable'

/* global XMLHttpRequest, ProgressEvent */

export const request = (createXHR: () => XMLHttpRequest): Stream<ProgressEvent> =>
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
  const handler = (event: ProgressEvent): void =>
    eventThenEnd(currentTime(scheduler), event, sink)

  addListeners(handler, xhr)

  xhr.send()

  return new XHRDisposable(handler, xhr)
}

const eventThenEnd = <A> (t: Time, a: A, sink: Sink<A>): void => {
  sink.event(t, a)
  sink.end(t)
}

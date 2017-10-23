// @flow
import { describe, it } from 'mocha'
import { xhrStream } from './xhrStream'
import { run } from '@most/core'
import { newDefaultScheduler } from '@most/scheduler'
import { is, fail } from '@briancavalier/assert'

type Done = () => void
type TestCase = Done => void

const testXHREvent = (event: string): TestCase =>
  (done) => {
    const xhr = createXHR()
    const progressEvent = {}
    const s = xhrStream(() => xhr)

    setTimeout(() => xhr.emit(event, progressEvent))

    let actual
    run({
      event (t, x) {
        actual = x
      },
      error (t, e) {
        fail(e)
      },
      end (t) {
        is(progressEvent, actual)
        done()
      }
    }, newDefaultScheduler(), s)
  }

const createXHR = (): Object => ({
  _sendCalled: 0,
  _abortCalled: 0,
  _events: {
    load: [],
    error: [],
    timeout: []
  },
  send () {
    this._sendCalled += 1
  },
  abort () {
    this._abortCalled += 1
  },
  addEventListener (event, listener) {
    this._events[event].push(listener)
  },
  removeEventListener (event, listener) {
    this._events[event] = this._events[event].filter(l => l !== listener)
  },
  emit (event, value) {
    this._events[event].forEach(listener => listener(value))
  }
})

describe('xhrStream', () => {
  it('should contain ProgressEvent for load event', testXHREvent('load'))

  it('should contain ProgressEvent for error event', testXHREvent('error'))

  it('should contain ProgressEvent for timeout event', testXHREvent('timeout'))
})

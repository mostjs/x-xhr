// @flow
import { describe, it } from 'mocha'
import { assert, is } from '@briancavalier/assert'

import { XHRDisposable, xhrIsDone, XHR_DONE } from './XHRDisposable'

// WARNING: Fool typechecker because fully mocking XHR is prohibitive
const asXHR = (x: Object): Object => x

describe('xhrIsDone', () => {
  it('should be true given done', () => {
    assert(xhrIsDone(asXHR({ readyState: XHR_DONE })))
  })

  it('should be false given not done', () => {
    assert(!xhrIsDone(asXHR({ readyState: XHR_DONE - 1 })))
  })
})

describe('XHRDisposable', () => {
  it('should abort and remove listeners given not done', () => {
    const removed = new Map()
    let aborted = false
    const xhr = {
      readyState: XHR_DONE - 1,
      abort () {
        aborted = true
      },
      removeEventListener (name, listener) {
        removed.set(name, listener)
      }
    }
    const listener = event => {}

    const disposable = new XHRDisposable(listener, asXHR(xhr))

    disposable.dispose()

    assert(aborted)
    is(removed.get('load'), listener)
    is(removed.get('error'), listener)
    is(removed.get('timeout'), listener)
  })

  it('should remove listeners given done', () => {
    const removed = new Map()
    let abortCalled = false
    const xhr = {
      readyState: XHR_DONE,
      abort () {
        abortCalled = true
      },
      removeEventListener (name, listener) {
        removed.set(name, listener)
      }
    }
    const listener = event => {}

    const disposable = new XHRDisposable(listener, asXHR(xhr))

    disposable.dispose()

    assert(!abortCalled)
    is(removed.get('load'), listener)
    is(removed.get('error'), listener)
    is(removed.get('timeout'), listener)
  })
})

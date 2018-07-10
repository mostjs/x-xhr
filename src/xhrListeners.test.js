// @flow
import { describe, it } from 'mocha'
import { assert, eq } from '@briancavalier/assert'
import { type XHRListener, addListeners, removeListeners, XHR_EVENTS } from './xhrListeners'

const createXHR = (listeners: Map<string, XHRListener>): Object =>
  ({
    addEventListener (event, listener) {
      listeners.set(event, listener)
    },
    removeEventListener (event, listener) {
      listeners.delete(event)
    }
  })

const listener = () => {}

describe('addListeners', () => {
  it('should add and remove expected listeners', () => {
    const listeners = new Map()
    const xhr = createXHR(listeners)

    addListeners(listener, xhr)

    eq(XHR_EVENTS.sort(), Array.from(listeners.keys()).sort())
    assert(Array.from(listeners.values()).every(l => l === listener))
  })
})

describe('removeListeners', () => {
  it('should add and remove expected listeners', () => {
    const listeners = new Map()
    const xhr = createXHR(listeners)

    addListeners(listener, xhr)

    removeListeners(listener, xhr)

    eq(0, listeners.size)
  })
})

// @flow
import { describe, it } from 'mocha'
import { assert, eq } from '@briancavalier/assert'
import { addListeners, removeListeners, XHR_EVENTS } from './xhrListeners'

describe('addListeners', () => {
  it('should add and remove expected listeners', () => {
    const listeners = new Map()
    const xhr = {
      addEventListener (event, listener) {
        listeners.set(event, listener)
      },
      removeEventListener (event, listener) {
        listeners.delete(event)
      }
    }

    const listener = () => {}

    addListeners(listener, (xhr: Object))

    eq(XHR_EVENTS.sort(), Array.from(listeners.keys()).sort())
    assert(Array.from(listeners.values()).every(l => l === listener))

    removeListeners(listener, (xhr: Object))

    eq(0, listeners.size)
  })
})

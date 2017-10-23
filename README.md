# most-xhr: Minimalist XHR stream

Make XMLHttpRequests with a [`@most/core` Stream](http://mostcore.readthedocs.io/en/latest/).  Provide a function to setup the XMLHttpRequests however you want/need and get back a Stream containing the `load` (or `error`, or `timeout`) event.

## Get it

`npm i most-xhr --save`

`yarn add most-xhr`

## API

### xhrStream :: (() &rarr; XMLHttpRequest) &rarr; Stream ProgressEvent

Provide a function to setup the XMLHttpRequest however you need (e.g. setting request headers, etc.), but don't call `.send()`. Running the Stream will send the XMLHttpRequest, handle events, and call `.abort()` when necessary.

The returned Stream will contain at most 1 event: the ProgressEvent emitted by XMLHttpRequest's `load`, `error`, or `timeout` events.

```js
import { xhrStream } from 'most-xhr'
import { runEffects } from '@most/core'
import { newDefaultScheduler } from '@most/scheduler'

const responseStream = xhrStream(() => {
  const xhr = new XMLHttpRequest()
  xhr.responseType = 'json'
  xhr.open('GET', 'https://...', true)
  return xhr
})

runEffects(responseStream, newDefaultScheduler())
```

#### Handling errors

By default, the returned stream _does not_ fail for errors or for successful HTTP requests whose status is >= 300.  This allows you to handle error events and HTTP status codes in whatever way is best for your application.

If you need, you can detect errors and turn them into Stream failures using `chain()`:

```js
import { xhrStream } from 'most-xhr'
import { chain, now, throwError } from '@most/core'

const responseStream = xhrStream(() => {
  const xhr = new XMLHttpRequest()
  // setup xhr ...
  return xhr
})

const failOnError = progressEvent =>
  progressEvent.type === 'error'
  ? throwError(new Error(...))
  : now(event)

const failOnErrorStream = chain(failOnError, responseStream)
```

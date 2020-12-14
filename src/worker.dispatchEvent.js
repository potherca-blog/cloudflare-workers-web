/*global dispatchEvent, Event, Request, URL */

let state = 'pre-init'

const createScript = (source, events) => {
  let script = document.createElement('script');
  script.src = source

  for (const [eventName, eventListener] of Object.entries(events)) {
    script.addEventListener(eventName, eventListener, false);
  }

  return document.body.appendChild(script)
};

const handleError = e => {
  let state = 'error'

  // @FIXME: Rather than setting the message on all containers, find first _visible_ one
  document.querySelectorAll('[data-js="errors"]').forEach(errorElement => {
    errorElement.innerHTML += e
    errorElement.style.display = 'initial'
  })
  console.error(e)
}

const loadError = (event) => {
  let container = document.querySelector('.help');
  container.classList.remove('hidden')
  handleError(`${event.type} : could not load "${event.target.src}"`)
}

const loadSuccess = (event) => {
  state = 'success'
  document.querySelector('.dashboard').classList.remove('hidden')
}

window.addEventListener('DOMContentLoaded', () => {
  // DOM fully loaded and parsed
  const url = new URL(document.location);

  if (url.searchParams.has('source')) {
    url.searchParams.getAll('source').forEach(source => {
      createScript(source, {error: loadError, load: loadSuccess});
    })

    // createScript('./src/api-bootstrap.js', {});
  } else {
    document.querySelector('.help').classList.remove('hidden')
  }
})

window.addEventListener('load', () => {
  // Page is fully loaded including all scripts, stylesheets and images

  if (state === 'success') {
    const event = new Event('fetch', {})

    event.request = new Request(document.location)

    event.respondWith = input => event.response = input

    try {
      dispatchEvent(event)
    } catch (e) {
      handleError(e)
    }

    if ( ! event.response) {
      handleError('No response was attached to the EventListener. Make sure the code responds to the "fetch" event: <code>addEventListener("fetch", event => event.respondWith(/* ... */))</code>'
      )
    } else {
      event.response
        .then(response => {
          response.json().then(data => {
            const searchParams = new URL(document.location).searchParams

            let indent = 0
            if (searchParams.has('pretty') || searchParams.has('verbose')) {
              indent = 2
            }

            document.querySelector('[data-js="response-headers"]').innerHTML +=
              `Status: <span style="background:${response.status < 500 ? 'green' : 'red'};color:white;">${response.status}</span> (${response.statusText})\n` +
              JSON.stringify(Object.fromEntries(response.headers.entries()), null, 2)

            document.querySelector('[data-js="response-body"]').innerHTML += JSON.stringify(data, null, indent)
          })
        }).catch(handleError)
    }
  }
})

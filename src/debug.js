addEventListener('fetch', event => {
  event.respondWith(handleRequest(event))
})

async function handleRequest(event) {
  var cache = [];
  function clean(key, value) {
    if (typeof value === 'object' && value !== null) {
      if (cache.indexOf(value) !== -1) { return;}
      cache.push(value);
    }
    return value;
  }

  return new Response(
    JSON.stringify({
      "input": event,
      "self": this
    }, clean),
    {
      headers: {
        'Content-Type': 'application/json',
      },
      status: 200,
    }
  )
}

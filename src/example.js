/*global router */

const examplePromise = (config) => {
  const descriptions = {
    'data': 'the current date',
  }

  const docs = {
    code_source: 'https://github.com/potherca-blog/cloudflare-workers-web/',
    data_source: 'https://blog.pother.ca/cloudflare-workers-web/',
    keys: descriptions,
  }

  return Promise.resolve({data: {date: new Date()}, errors: []})
    .then(({data, errors}) => ({data, docs, errors, status: errors.length === 0 ? 200 : 500}))
    .catch(error => ({errors: [error.toString()], status: 500}))
}

router = typeof (router) == 'undefined' ? [] : router;

router.push({
  callback: examplePromise,
  route: '.*',
})

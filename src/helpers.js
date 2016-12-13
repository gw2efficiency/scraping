// Build a url out of a base url and query parameters
export function buildUrl (url, query) {
  if (!query || Object.keys(query).length === 0) {
    return url
  }

  return url + '?' + buildQueryString(query)
}

// Build a query string out of a object map
export function buildQueryString (query) {
  return Object.keys(query)
    .map(k => k + '=' + encodeURIComponent(query[k]))
    .join('&')
}

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

// Get all matches of a global regular expression
export function matchAll (regex, string) {
  if (regex.flags.indexOf('g') === -1) {
    throw new Error('The regular expression needs the "g" flag set')
  }

  let match
  let matches = []
  while ((match = regex.exec(string)) !== null) {
    delete match['index']
    delete match['input']
    matches.push(match)
  }

  return matches
}

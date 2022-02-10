import fetch from 'lets-fetch'
import querystring from 'querystringify'

export default { getWikiHtml, getWikiMarkup, getWikiImage }

const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.82 Safari/537.36'
}

// Get the wiki html for the given title
export async function getWikiHtml (title) {
  let url = 'http://wiki.guildwars2.com/wiki/' + encodeURIComponent(title)
  return fetch.single(url, { headers, type: 'text' })
}

// Get the wiki markup for the given title
export async function getWikiMarkup (title) {
  let query = {
    action: 'query',
    prop: 'revisions',
    rvprop: 'content',
    format: 'json',
    titles: title
  }
  let url = 'http://wiki.guildwars2.com/api.php?' + querystring.stringify(query)

  let content = await fetch.single(url, { headers })
  let pageId = Object.keys(content.query.pages)[0]

  return content.query.pages[pageId].revisions[0]['*']
}

// Get the image url of a image file name
export async function getWikiImage (file) {
  let query = {
    action: 'query',
    prop: 'imageinfo',
    iiprop: 'timestamp|user|url',
    format: 'json',
    titles: 'File:' + file
  }
  let url = 'http://wiki.guildwars2.com/api.php?' + querystring.stringify(query)

  let content = await fetch.single(url, { headers })
  let pageId = Object.keys(content.query.pages)[0]
  let imageinfo = content.query.pages[pageId].imageinfo

  return imageinfo ? imageinfo[0]['url'] : null
}

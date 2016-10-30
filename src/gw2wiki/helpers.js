import fetch from 'lets-fetch'
import {buildUrl} from '../helpers.js'

export default {getWikiHtml, getWikiMarkup, getWikiImage}

// Get the wiki html for the given title
export async function getWikiHtml (title) {
  let url = 'http://wiki.guildwars2.com/wiki/' + encodeURIComponent(title)
  return await fetch.single(url, {type: 'text'})
}

// Get the wiki markup for the given title
export async function getWikiMarkup (title) {
  let url = buildUrl('http://wiki.guildwars2.com/api.php', {
    action: 'query',
    prop: 'revisions',
    rvprop: 'content',
    format: 'json',
    titles: title
  })

  let content = await fetch.single(url)
  let pageId = Object.keys(content.query.pages)[0]

  return content.query.pages[pageId].revisions[0]['*']
}

// Get the image url of a image file name
export async function getWikiImage (file) {
  let url = buildUrl('http://wiki.guildwars2.com/api.php', {
    action: 'query',
    prop: 'imageinfo',
    iiprop: 'timestamp|user|url',
    format: 'json',
    titles: 'File:' + file
  })

  let content = await fetch.single(url)
  let pageId = Object.keys(content.query.pages)[0]
  let imageinfo = content.query.pages[pageId].imageinfo

  return imageinfo ? imageinfo[0]['url'] : null
}


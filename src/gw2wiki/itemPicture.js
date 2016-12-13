import {getWikiMarkup, getWikiImage} from './helpers.js'

// Get the picture of an item
export default async function itemPicture (item) {
  let markup = await getWikiMarkup(item)
  let matches = /gallery1 = ([^\n|]*)/.exec(markup)
  let image = matches !== null ? matches[1] : item + '.jpg'
  return await getWikiImage(image)
}

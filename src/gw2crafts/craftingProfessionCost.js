import fetch from 'lets-fetch'
import cheerio from 'cheerio'
import flow from 'promise-control-flow'

// Get the cost to level crafting professions
export default async function craftingProfessionCost () {
  const promises = {
    armorsmith: async () => {
      let baseCraft = await getProfessionParts('http://gw2crafts.net/armorcraft.html')
      let maxCraft = await getProfessionTotalCost('http://gw2crafts.net/armorcraft_400.html')
      return {...baseCraft, 500: maxCraft + baseCraft[400]}
    },
    artificer: async () => {
      let baseCraft = await getProfessionParts('http://gw2crafts.net/artificing.html')
      let maxCraft = await getProfessionTotalCost('http://gw2crafts.net/artificing_400.html')
      return {...baseCraft, 500: maxCraft + baseCraft[400]}
    },
    chef: async () => {
      let baseCraft = await getProfessionTotalCost('http://gw2crafts.net/cooking_karma_light.html')
      return {400: baseCraft}
    },
    huntsman: async () => {
      let baseCraft = await getProfessionParts('http://gw2crafts.net/huntsman.html')
      let maxCraft = await getProfessionTotalCost('http://gw2crafts.net/huntsman_400.html')
      return {...baseCraft, 500: maxCraft + baseCraft[400]}
    },
    jeweler: async () => {
      return await getProfessionParts('http://gw2crafts.net/jewelcraft.html')
    },
    leatherworker: async () => {
      let baseCraft = await getProfessionParts('http://gw2crafts.net/leatherworking.html')
      let maxCraft = await getProfessionTotalCost('http://gw2crafts.net/leatherworking_400.html')
      return {...baseCraft, 500: maxCraft + baseCraft[400]}
    },
    scribe: async () => {
      return await getProfessionParts('http://gw2crafts.net/scribe.html')
    },
    tailor: async () => {
      let baseCraft = await getProfessionParts('http://gw2crafts.net/tailor.html')
      let maxCraft = await getProfessionTotalCost('http://gw2crafts.net/tailor_400.html')
      return {...baseCraft, 500: maxCraft + baseCraft[400]}
    },
    weaponsmith: async () => {
      let baseCraft = await getProfessionParts('http://gw2crafts.net/weaponcraft.html')
      let maxCraft = await getProfessionTotalCost('http://gw2crafts.net/weaponcraft_400.html')
      return {...baseCraft, 500: maxCraft + baseCraft[400]}
    }
  }

  // Return an array of all crafting professions
  return await flow.parallel(promises)
}

// Get partial data, one per segment
async function getProfessionParts (url) {
  let content = await fetch.single(url, {type: 'text'})
  let $ = cheerio.load(content)
  let costs = []

  // Go through the headings, since that is where
  // the cost is defined in
  $('h4').map((i, element) => {
    let html = $(element).html()

    // Only take "cost" headlines
    if (!html.match(/^Cost:/)) {
      return
    }

    // Rip the rolling total only
    html = html.replace(/.+ \(Rolling Total: (.+)\)$/, '$1')

    // Replace and split the icons for gold, silver and copper
    html = html.replace(/<span.+?<\/span>/g, '###')
    html = html.split('###')

    // Get a copper cost and push it into our list
    let goldCost = cleanGoldArray(html)
    costs.push(goldCost)
  })

  // Get a nice, clean array with costs per level
  return {
    75: costs[0],
    150: costs[1],
    225: costs[2],
    300: costs[3],
    400: costs[4]
  }
}

// Get the total cost of a profession
async function getProfessionTotalCost (url) {
  let content = await fetch.single(url, {type: 'text'})
  let $ = cheerio.load(content)

  // Get the first defined cost, that's the total cost
  let html = $('dd').eq(2).html()

  // Replace and split the icons for gold, silver and copper
  html = html.replace(/<span.+?<\/span>/g, '###')
  html = html.split('###')

  // Get a copper cost and return it
  return cleanGoldArray(html)
}

// Get a clean "copper" number from an array of money
function cleanGoldArray (array) {
  array = array.filter(x => x !== '').map(x => parseInt(x, 10))

  // Copper
  if (array.length === 1) {
    return array[0]
  }

  // Copper + Silver
  if (array.length === 2) {
    return array[0] * 100 + array[1]
  }

  // Copper, Silver + Gold
  return array[0] * 10000 + array[1] * 100 + array[2]
}

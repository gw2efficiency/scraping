import _claimTicketOffers from './gw2wiki/claimTicketOffers.js'
import _dyeCategories from './gw2wiki/dyeCategories.js'
import _miniSets from './gw2wiki/miniSets.js'
import _itemPicture from './gw2wiki/itemPicture.js'
import _gemPriceHistory from './gw2spidy/gemPriceHistory.js'
import _craftingProfessionCost from './gw2crafts/craftingProfessionCost.js'
import _blackLionStatuette from './gw2wiki/blackLionStatuette.js'

export default {
  claimTicketOffers: _claimTicketOffers,
  dyeCategories: _dyeCategories,
  miniSets: _miniSets,
  itemPicture: _itemPicture,
  gemPriceHistory: _gemPriceHistory,
  craftingProfessionCost: _craftingProfessionCost,
  blackLionStatuette: _blackLionStatuette
}

export const claimTicketOffers = _claimTicketOffers
export const dyeCategories = _dyeCategories
export const miniSets = _miniSets
export const itemPicture = _itemPicture
export const gemPriceHistory = _gemPriceHistory
export const craftingProfessionCost = _craftingProfessionCost
export const blackLionStatuette = _blackLionStatuette

export function generateWikiMarkup (content) {
  return {
    query: {
      pages: {
        123: {
          title: 'Controls',
          revisions: [{ '*': content }]
        }
      }
    }
  }
}

export function generateWikiImage (url) {
  if (!url) {
    return { query: { pages: { 123: { title: 'File:Kudzu.jpg' } } } }
  }

  return {
    query: {
      pages: {
        123: {
          title: 'File:Kudzu.jpg',
          imageinfo: [{ url: url }]
        }
      }
    }
  }
}

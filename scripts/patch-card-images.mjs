import fs from 'fs'

const p = 'src/app/page.tsx'
let s = fs.readFileSync(p, 'utf8')

// helper to inject an image block before a given card title
function inject(beforeTitle, imgPath, alt, href = '#') {
  const re = new RegExp(
    String.raw`(<div className="rttu-card">\s*)(<h4 className="rttu-card-title">${beforeTitle}</h4>)`
  , 'm')
  s = s.replace(re, (_m, a, b) => {
    const block =
      `<a href="${href}" className="rttu-card-img"><span className="rttu-card-img-inner"><img src="${imgPath}" alt="${alt}" /></span></a>\n`
    return a + block + b
  })
}

// Inject for the two cards
inject('Order Food &amp; Drink', '/golf/images/card-food.jpg', 'Order Food & Drink')
inject('New Member Perks', '/golf/images/card-member.jpg', 'New Member Perks')

// Save back
fs.writeFileSync(p, s)
console.log('Patched images for Food & Drink and New Member cards in', p)

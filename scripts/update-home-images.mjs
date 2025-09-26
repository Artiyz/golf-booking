import fs from 'fs'
const hero = process.env.HERO || '/golf/images/hero.jpg'
const about = process.env.ABOUT || '/golf/images/about.jpg'
const slidesEnv = process.env.SLIDES || ''
const slides = slidesEnv.split(',').map(s=>s.trim()).filter(Boolean)
const body = `export const homeImages = {
  hero: "${hero}",
  about: "${about}",
  slides: [${slides.map(s=>`"${s}"`).join(',')}]
}
`
fs.mkdirSync('src/config',{recursive:true})
fs.writeFileSync('src/config/homeImages.ts',body)
console.log('updated src/config/homeImages.ts')

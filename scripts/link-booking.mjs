import fs from 'fs'
const p = 'src/app/page.tsx'
let s = fs.readFileSync(p,'utf8')
s = s.replace(/<Link href="#"([^>]*)>\s*Book a Tee Time\s*<\/Link>/g, (_m, attrs) => `<Link href="/booking"${attrs}>Book a Tee Time</Link>`)
s = s.replace(/<Link href="#"([^>]*)>\s*Reserve Bay\s*<\/Link>/g, (_m, attrs) => `<Link href="/booking"${attrs}>Reserve Bay</Link>`)
fs.writeFileSync(p,s)
console.log('Updated booking links in', p)

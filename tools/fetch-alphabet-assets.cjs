// Run once to vendor the openly licensed illustrations and Czech cursive font.
const fs = require('node:fs/promises');
const path = require('node:path');
require('../abeceda/data.js');
const dir = path.join(__dirname, '../abeceda/assets');
async function download(url, name) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${response.status}: ${url}`);
  const content = Buffer.from(await response.arrayBuffer());
  await fs.writeFile(path.join(dir, name), content);
}
(async () => {
  await fs.mkdir(dir, { recursive: true });
  const images = [...new Set(Alphabet.letters.map(item => item.image.split('/').pop()))].filter(name => name !== 'ace.svg');
  // Sequential small batches keep downloads bounded.
  for (let i = 0; i < images.length; i += 6) {
    await Promise.all(images.slice(i, i + 6).map(name => download(name === 'igloo.svg'
      ? 'https://raw.githubusercontent.com/game-icons/icons/master/delapouite/igloo.svg'
      : `https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/${name}`, name)));
  }
  await download('https://raw.githubusercontent.com/google/fonts/main/ofl/playwritecz/PlaywriteCZ%5Bwght%5D.ttf', 'PlaywriteCZ.ttf');
  await download('https://raw.githubusercontent.com/google/fonts/main/ofl/playwritecz/OFL.txt', 'PlaywriteCZ-OFL.txt');
  await download('https://raw.githubusercontent.com/twitter/twemoji/v14.0.2/LICENSE-GRAPHICS', 'Twemoji-LICENSE.txt');
  const igloo = await fs.readFile(path.join(dir, 'igloo.svg'), 'utf8');
  await fs.writeFile(path.join(dir, 'igloo.svg'), igloo.replace('<path d="M0 0h512v512H0z"/>', '').replace(/fill="#fff"/g, 'fill="#4d7789"'));
  const pie = await fs.readFile(path.join(dir, '1f967.svg'), 'utf8');
  await fs.writeFile(path.join(dir, '1f967.svg'), pie.replace(/#A0041E/g, '#E9CE78').replace(/#BE1931/g, '#69994C'));
  console.log(`Downloaded ${images.length} illustrations and Playwrite CZ, with licenses.`);
})().catch(error => { console.error(error); process.exitCode = 1; });

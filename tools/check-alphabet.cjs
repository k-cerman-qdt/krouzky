// Requires Playwright; run with the local preview server already running.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const base = process.env.ALPHABET_URL || 'http://127.0.0.1:4174/abeceda/';
const screenshots = process.env.ALPHABET_SCREENSHOTS;
(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'msedge' });
  try {
    const page = await browser.newPage({ viewport:{ width:1024, height:768 }, hasTouch:true });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
    await page.goto(base);
    await page.locator('#upper').waitFor();
    assert.equal(await page.locator('#upper').textContent(), 'A');
    assert.equal(await page.locator('.letter-chip').count(), 42);
    assert.equal(await page.locator('#prev').isDisabled(), true);
    await page.locator('#next').click();
    assert.equal(await page.locator('#upper').textContent(), 'Á');
    assert.equal(await page.locator('#word mark').textContent(), 'á');
    await page.locator('#prev').click();
    await page.locator('#cursive-toggle').check();
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.evaluate(() => document.fonts.check('32px Playwrite')), true);
    assert.equal(await page.locator('#cursive-panel').isVisible(), true);
    for (const [letter, word, highlight] of [['Ch','chléb','ch'], ['Ě','hvězda','ě'], ['Ů','dům','ů'], ['Ď','loď','ď'], ['Q','quiche','q'], ['Ž','žába','ž']]) {
      await page.locator('.letter-chip').filter({ hasText: new RegExp(`^${letter}$`) }).click();
      assert.equal(await page.evaluate(() => document.activeElement?.getAttribute('aria-pressed') === 'true' && document.activeElement?.classList.contains('letter-chip')), true, 'Selecting a letter must preserve keyboard focus');
      assert.equal(await page.locator('#word').textContent(), word);
      assert.equal(await page.locator('#word mark').textContent(), highlight);
    }
    assert.equal(await page.locator('#next').isDisabled(), true);
    await page.locator('[data-set="basic"]').click();
    assert.equal(await page.locator('.letter-chip').count(), 27);
    await page.locator('[data-set="all"]').click();
    await page.locator('[data-mode="overview"]').click();
    assert.equal(await page.locator('.mini-card').count(), 42);
    await page.locator('.mini-card').last().locator('img').waitFor();
    await page.waitForFunction(() => [...document.querySelectorAll('.mini-card img')].every(img => img.complete && img.naturalWidth > 0));
    const assetCheck = await page.evaluate(async () => {
      const sources = [...new Set(Alphabet.letters.map(item => item.image))];
      return Promise.all(sources.map(async src => {
        const response = await fetch(src);
        const body = await response.text();
        return { src, ok:response.ok && body.includes('<svg') };
      }));
    });
    assert.ok(assetCheck.every(asset => asset.ok));
    if (screenshots) { await fs.mkdir(screenshots, { recursive:true }); await page.screenshot({ path:path.join(screenshots,'overview.png'), fullPage:true, animations:'disabled' }); }
    await page.getByRole('button', { name:'Otevřít B, babička', exact:true }).click();
    assert.equal(await page.locator('#upper').textContent(), 'B');
    assert.equal(await page.locator('#learn').isVisible(), true);
    for (const viewport of [{width:1024,height:768},{width:768,height:1024},{width:390,height:844}]) {
      await page.setViewportSize(viewport);
      for (const mode of ['learn','overview','game']) {
        await page.locator(`[data-mode="${mode}"]`).click();
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
        assert.equal(overflow, false, `${mode} overflows at ${viewport.width}`);
        if (screenshots) await page.screenshot({ path:path.join(screenshots,`${mode}-${viewport.width}.png`), fullPage:true, animations:'disabled' });
      }
    }
    // Simulate the external speech capability being unavailable. This also gives
    // a visible, unambiguous target when two letters share a word (D and Ů).
    await page.addInitScript(() => Object.defineProperty(window, 'speechSynthesis', {value:undefined}));
    await page.reload();
    await page.locator('[data-mode="game"]').click();
    const question = await page.locator('#game-question').textContent();
    assert.match(question, /^Najdi písmenko /);
    const target = question.replace('Najdi písmenko ', '');
    const buttons = page.locator('.answer');
    const labels = await buttons.allTextContents();
    await buttons.nth(labels.findIndex(text => text !== target)).click();
    assert.match(await page.locator('#game-feedback').textContent(), /Zkus jiné/);
    assert.equal(await page.locator('#score').textContent(), '★ 0');
    await page.getByRole('button', {name:`Písmeno ${target}`,exact:true}).click();
    assert.equal(await page.locator('#score').textContent(), '★ 1');
    assert.equal(await page.locator('#game-next').isVisible(), true);
    await page.locator('#game-next').click();
    assert.equal(await page.evaluate(() => document.activeElement?.classList.contains('answer')), true, 'Next round must place keyboard focus on an answer');
    assert.notEqual(await page.locator('#game-question').textContent(), question);
    assert.ok(await page.locator('#answers .answer:not(:disabled)').count() === 3);
    await page.locator('#game-listen').click();
    assert.equal(await page.locator('#sound-status').isVisible(), true);
    await page.locator('[data-mode="learn"]').click();
    await page.locator('.schedule-link').click();
    await page.getByRole('link', {name:'Obrázková abeceda →'}).click();
    assert.equal(await page.locator('#upper').textContent(), 'A');
    assert.deepEqual(errors, []);
    console.log('PASS: 42 cards, 41 illustrations, Czech font, internal word highlighting, 27-letter subset, navigation, game retry/success, speech fallback, cross-links; no page errors or overflow at 1024/768/390 px.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const file = path.join(__dirname, '../abeceda/data.js');
const context = vm.createContext({});
if (fs.existsSync(file)) vm.runInContext(fs.readFileSync(file, 'utf8'), context);
const api = context.Alphabet;

test('každá karta má slovo začínající jejím písmenem; Ě, Ů a Ý jsou vynechány', () => {
  assert.ok(api, 'Chybí datový model abecedy');
  const expected = 'A Á B C Č D Ď E É F G H Ch I Í J K L M N Ň O Ó P Q R Ř S Š T Ť U Ú V W X Y Z Ž'.split(' ');
  assert.deepEqual(Array.from(api.letters, x => x.upper), expected);
  for (const item of api.letters) {
    const parts = api.splitWord(item);
    assert.equal(parts.before + parts.match + parts.after, item.word);
    assert.ok(item.word.toLocaleLowerCase('cs').startsWith(item.lower), `${item.upper}: ${item.word} nezačíná písmenem`);
    assert.equal(parts.before, '');
    assert.equal(parts.match.toLocaleLowerCase('cs'), item.lower);
    assert.ok(item.speech.length > 0);
    assert.ok(item.examples?.length > 0, `Chybí příklady pro ${item.upper}`);
    for (const example of item.examples) {
      assert.ok(example.word.toLocaleLowerCase('cs').startsWith(item.lower), `${item.upper}: ${example.word}`);
      assert.ok(example.image.startsWith('assets/'));
    }
  }
});

test('další příklad mění slovo i obrázek, zachová písmeno a cyklí zpět', () => {
  const a = api.letters.find(item => item.upper === 'A');
  assert.equal(typeof api.exampleFor, 'function');
  assert.equal(api.exampleFor(a, 0).word, 'auto');
  assert.equal(api.exampleFor(a, 1).word, 'ananas');
  assert.equal(api.exampleFor(a, 1).upper, 'A');
  assert.notEqual(api.exampleFor(a, 0).image, api.exampleFor(a, 1).image);
  assert.equal(api.exampleFor(a, 3).word, 'auto');
});

test('hra vybírá i další příklady a zachová jedinou správnou odpověď', () => {
  let call = 0;
  const round = api.createRound(api.pool('all'), null, () => ++call === 1 ? 0 : 0.5);
  assert.equal(round.target.upper, 'A');
  assert.equal(round.target.word, 'ananas');
  assert.equal(round.target.image, 'assets/1f34d.svg');
  assert.equal(round.options.filter(item => item.upper === 'A').length, 1);
});

test('zvýraznění ukáže výhradně první písmeno nebo celou počáteční spřežku', () => {
  assert.ok(api, 'Chybí datový model abecedy');
  for (const [letter, expected] of [
    ['Ch', ['', 'ch', 'léb']], ['Ď', ['', 'ď', 'áblík']],
    ['É', ['', 'é', 'ro']], ['X', ['', 'x', 'ylofon']], ['Í', ['', 'Í', 'rán']]
  ]) {
    const parts = api.splitWord(api.letters.find(x => x.upper === letter));
    assert.deepEqual([parts.before, parts.match, parts.after], expected);
  }
});

test('základní sada obsahuje Ch, širší zpřístupní všech 39 příkladů', () => {
  assert.ok(api, 'Chybí datový model abecedy');
  assert.ok(api.pool('basic').some(x => x.upper === 'Ch'));
  assert.ok(!api.pool('basic').some(x => x.upper === 'Ě'));
  assert.equal(api.pool('all').length, 39);
});

test('herní kola obsahují právě jednu správnou odpověď a neopakují předchozí otázku', () => {
  assert.ok(api, 'Chybí datový model abecedy');
  let previous = null;
  let seed = 17;
  const random = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  for (let i = 0; i < 200; i++) {
    const round = api.createRound(api.pool(i % 2 ? 'basic' : 'all'), previous, random);
    assert.notEqual(round.target.upper, previous);
    assert.equal(round.options.length, 3);
    assert.equal(new Set(round.options.map(x => x.upper)).size, 3);
    assert.equal(round.options.filter(x => x.upper === round.target.upper).length, 1);
    assert.ok(round.target.word.toLocaleLowerCase('cs').startsWith(round.target.lower));
    assert.ok(round.options.every(item => item.word.length > 0));
    previous = round.target.upper;
  }
});

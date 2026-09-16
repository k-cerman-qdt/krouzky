const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const file = path.join(__dirname, '../abeceda/data.js');
const context = vm.createContext({});
if (fs.existsSync(file)) vm.runInContext(fs.readFileSync(file, 'utf8'), context);
const api = context.Alphabet;

test('všechny české znaky mají jednoznačnou kartu včetně Ch a diakritiky', () => {
  assert.ok(api, 'Chybí datový model abecedy');
  const expected = 'A Á B C Č D Ď E É Ě F G H Ch I Í J K L M N Ň O Ó P Q R Ř S Š T Ť U Ú Ů V W X Y Ý Z Ž'.split(' ');
  assert.deepEqual(Array.from(api.letters, x => x.upper), expected);
  for (const item of api.letters) {
    const parts = api.splitWord(item);
    assert.equal(parts.before + parts.match + parts.after, item.word);
    assert.equal(parts.match.toLocaleLowerCase('cs'), item.lower);
    assert.ok(item.speech.length > 0);
  }
});

test('zvýraznění ukáže celé ch i diakritiku uvnitř a na konci slova', () => {
  assert.ok(api, 'Chybí datový model abecedy');
  for (const [letter, expected] of [
    ['Ch', ['', 'ch', 'léb']], ['Ě', ['hv', 'ě', 'zda']],
    ['Ů', ['d', 'ů', 'm']], ['Ď', ['lo', 'ď', '']]
  ]) {
    const parts = api.splitWord(api.letters.find(x => x.upper === letter));
    assert.deepEqual([parts.before, parts.match, parts.after], expected);
  }
});

test('základní sada obsahuje Ch, úplná zpřístupní všechny znaky', () => {
  assert.ok(api, 'Chybí datový model abecedy');
  assert.ok(api.pool('basic').some(x => x.upper === 'Ch'));
  assert.ok(!api.pool('basic').some(x => x.upper === 'Ě'));
  assert.equal(api.pool('all').length, 42);
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
    previous = round.target.upper;
  }
});

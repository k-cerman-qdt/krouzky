(function (root) {
  'use strict';
  function shuffle(values, random) {
    const result = [...values];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
  function generate(mode, max, random = Math.random) {
    if (![10, 20, 100].includes(max)) throw new RangeError('Unsupported range');
    const int = (min, limit) => min + Math.floor(random() * (limit - min + 1));
    const q = { mode, max };
    if (mode === 'count') {
      q.count = int(0, max);
      q.answer = q.count;
    } else if (mode === 'add') {
      q.a = int(0, max); q.b = int(0, max - q.a); q.answer = q.a + q.b;
    } else if (mode === 'subtract') {
      q.a = int(0, max); q.b = int(0, q.a); q.answer = q.a - q.b;
    } else if (mode === 'compare') {
      q.a = int(0, max);
      q.b = random() < 0.25 ? q.a : int(0, max);
      q.answer = q.a < q.b ? '<' : q.a > q.b ? '>' : '=';
      q.options = ['<', '=', '>'];
    } else if (mode === 'sequence') {
      const step = random() < 0.5 ? 1 : -1;
      const start = step === 1 ? int(0, max - 4) : int(4, max);
      q.sequence = Array.from({ length: 5 }, (_, i) => start + step * i);
      q.missing = int(1, 3); q.answer = q.sequence[q.missing]; q.step = step;
    } else {
      throw new RangeError('Unsupported exercise');
    }
    if (!q.options) {
      // A finite pool avoids retry loops even with a deterministic RNG.
      const pool = Array.from({ length: max + 1 }, (_, n) => n).filter(n => n !== q.answer);
      const nearby = pool.filter(n => Math.abs(n - q.answer) <= 4);
      const distractors = shuffle(nearby, random).slice(0, 3);
      q.options = shuffle([q.answer, ...distractors], random);
    }
    return q;
  }
  const api = { generate };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.MathGarden = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);

const test = require('node:test');
const assert = require('node:assert/strict');
const { generate } = require('../matematika/model.js');

  test('arithmetic includes zero and range boundaries', () => {
    assert.equal(generate('count', 10, () => 0).answer, 0);
    assert.equal(generate('count', 100, () => 0.999999).answer, 100);
    assert.equal(generate('add', 20, () => 0).answer, 0);
    assert.equal(generate('add', 20, () => 0.999999).answer, 20);
    assert.equal(generate('subtract', 100, () => 0.999999).answer, 0);
  });
  for (const max of [10, 20, 100]) {
    test(`arithmetic and choices stay within 0–${max}`, () => {
      for (const mode of ['count', 'add', 'subtract']) {
        for (let i = 0; i < 1200; i++) {
          const q = generate(mode, max);
          assert.ok(Number.isInteger(q.answer) && q.answer >= 0 && q.answer <= max);
          assert.equal(q.options.length, 4);
          assert.equal(new Set(q.options).size, 4);
          assert.ok(q.options.includes(q.answer));
          assert.ok(q.options.every(n => Number.isInteger(n) && n >= 0 && n <= max));
          if (mode === 'count') assert.equal(q.count, q.answer);
          if (mode === 'add') assert.equal(q.a + q.b, q.answer);
          if (mode === 'subtract') assert.equal(q.a - q.b, q.answer);
        }
      }
    });
  }
  test('generator terminates with deterministic random extremes', () => {
    for (const random of [() => 0, () => 0.999999]) {
      for (const mode of ['count', 'add', 'subtract']) {
        const q = generate(mode, 10, random);
        assert.equal(new Set(q.options).size, 4);
        assert.ok(q.options.includes(q.answer));
      }
    }
  });
  test('comparison includes equality and both inequalities', () => {
    const seen = new Set();
    for (let i = 0; i < 1500; i++) {
      const q = generate('compare', 100);
      assert.ok(q.options.includes(q.answer));
      assert.equal(q.answer, q.a === q.b ? '=' : q.a < q.b ? '<' : '>');
      seen.add(q.answer);
    }
    assert.deepEqual([...seen].sort(), ['<', '=', '>']);
  });
  test('number sequences stay in range and have an unambiguous missing number', () => {
    for (const max of [10, 20, 100]) {
      for (let i = 0; i < 500; i++) {
        const q = generate('sequence', max);
        assert.equal(q.sequence.length, 5);
        assert.ok(q.sequence.every(n => n >= 0 && n <= max));
        assert.ok(q.missing > 0 && q.missing < 4);
        assert.equal(q.answer, q.sequence[q.missing - 1] + q.step);
        assert.equal(q.sequence[q.missing + 1], q.answer + q.step);
        assert.ok(q.options.includes(q.answer));
      }
    }
  });

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
function model() {
  assert.ok(fs.existsSync('index.html'), 'Stránka s modelem rozvrhu musí existovat');
  const source = fs.readFileSync('index.html', 'utf8').match(/<script id="schedule-model">([\s\S]*?)<\/script>/);
  assert.ok(source, 'HTML obsahuje model rozvrhu');
  const scope = {};
  vm.runInNewContext(source[1] + ';this.model = { eventsOn, mondayOf, iso, addDays, parseDate };', scope);
  return scope.model;
}
test('Běžný týden má správné děti a časy', () => {
  const m = model();
  assert.equal(m.eventsOn('2026-09-21')[0].start, '15:30');
  const tuesday = m.eventsOn('2026-09-22');
  assert.deepEqual(Array.from(tuesday, e => e.name), ['Angličtina', 'Dramaták']);
  assert.deepEqual(Array.from(tuesday[1].children), ['A']);
  assert.equal(m.eventsOn('2026-09-23')[0].end, '14:45');
  assert.equal(m.eventsOn('2026-09-24').length, 0);
  assert.deepEqual(Array.from(m.eventsOn('2026-09-25')[0].children), ['A', 'B']);
});
test('Dramaták začíná až 22. září a dále se opakuje', () => {
  const m = model();
  assert.equal(m.eventsOn('2026-09-15').length, 1);
  assert.equal(m.eventsOn('2026-09-22').length, 2);
  assert.equal(m.eventsOn('2027-01-26').length, 2);
});
for (const date of ['2026-10-30','2026-12-25','2027-01-01','2027-01-29']) {
  test('Plavání odpadá ' + date, () => {
    const events = model().eventsOn(date);
    assert.equal(events.length, 1);
    assert.equal(events[0].cancelled, true);
  });
}
test('Ostatní pátky zůstávají aktivní', () => {
  const m = model();
  for (const date of ['2026-10-23','2026-11-06','2026-12-18','2027-01-08','2027-01-22']) {
    assert.equal(m.eventsOn(date)[0].cancelled, false);
  }
});
test('Události nepřesahují školní pololetí', () => {
  const m = model();
  for (const date of ['2026-08-31','2027-02-01','2027-02-02','2027-02-05']) assert.equal(m.eventsOn(date).length, 0);
  assert.equal(m.eventsOn('2026-09-01').length, 1);
});
test('Filtr dítěte ponechá společné plavání', () => {
  const m = model();
  assert.equal(m.eventsOn('2026-09-22', 'A')[0].name, 'Dramaták');
  assert.equal(m.eventsOn('2026-09-22', 'B')[0].name, 'Angličtina');
  assert.equal(m.eventsOn('2026-09-21', 'B').length, 0);
  assert.equal(m.eventsOn('2026-09-25', 'B').length, 1);
});
test('Týden funguje přes změnu roku i letního času', () => {
  const m = model();
  assert.equal(m.iso(m.mondayOf(m.parseDate('2027-01-01'))), '2026-12-28');
  assert.equal(m.iso(m.addDays(m.parseDate('2026-10-23'), 7)), '2026-10-30');
});

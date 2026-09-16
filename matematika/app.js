(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const assets = [
    { file: '1f34e', name: 'jablko' }, { file: '1f353', name: 'jahoda' },
    { file: '1f41f', name: 'ryba' }, { file: '1f98b', name: 'motýl' },
    { file: '1f955', name: 'mrkev' }, { file: '2b50', name: 'hvězda' }
  ];
  const descriptions = {
    count: ['POČÍTÁME OBRÁZKY', 'Kolik obrázků vidíš?', 'Klepni na každý obrázek. Pak vyber číslo.'],
    add: ['SČÍTÁME', 'Kolik je to dohromady?', 'Spočítej příklad a vyber výsledek.'],
    subtract: ['ODČÍTÁME', 'Kolik zůstane?', 'Spočítej příklad a vyber výsledek.'],
    compare: ['POROVNÁVÁME', 'Které znaménko patří mezi čísla?', 'Větší číslo patří k otevřené straně znaménka.'],
    sequence: ['DOPLŇUJEME ŘADU', 'Které číslo se schovalo?', 'Čti čísla zleva doprava a doplň mezeru.']
  };
  let mode = 'count', max = 10, score = 0, question, asset, solved = false;
  function element(tag, className, content) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (content !== undefined) el.textContent = content;
    return el;
  }
  function pictures(count, interactive = false, crossed = 0) {
    const groups = element('div', 'picture-groups');
    if (count === 0) {
      groups.append(element('div', 'zero-box', 'Tady není žádný obrázek.'));
      return groups;
    }
    for (let start = 0; start < count; start += 10) {
      const group = element('div', 'ten-group');
      for (let i = start; i < Math.min(start + 10, count); i++) {
        const picture = element(interactive ? 'button' : 'span', 'picture' + (i >= count - crossed ? ' crossed' : ''));
        const img = document.createElement('img');
        img.src = '../abeceda/assets/' + asset.file + '.svg';
        img.width = 40; img.height = 40; img.alt = interactive ? '' : asset.name;
        if (interactive) {
          picture.setAttribute('aria-label', asset.name + ' ' + (i + 1));
          picture.setAttribute('aria-pressed', 'false');
          picture.addEventListener('click', () => {
            picture.setAttribute('aria-pressed', String(picture.getAttribute('aria-pressed') !== 'true'));
          });
        }
        picture.append(img); group.append(picture);
      }
      groups.append(group);
    }
    return groups;
  }
  function equation(parts, sequence = false) {
    const line = element('div', 'equation' + (sequence ? ' sequence' : ''));
    parts.forEach(part => {
      const className = part === '?' ? 'question-box' : ['+', '−', '='].includes(part) ? 'operator' : '';
      line.append(element('span', className, part));
    });
    return line;
  }
  function newQuestion(focus = false) {
    const previous = question;
    for (let attempt = 0; attempt < 8; attempt++) {
      question = MathGarden.generate(mode, max);
      if (!previous || JSON.stringify([question.mode, question.count, question.a, question.b, question.sequence]) !== JSON.stringify([previous.mode, previous.count, previous.a, previous.b, previous.sequence])) break;
    }
    asset = assets[Math.floor(Math.random() * assets.length)];
    solved = false;
    $('hint-panel').hidden = true;
    $('hint-panel').replaceChildren();
    $('hint').setAttribute('aria-expanded', 'false');
    $('hint').textContent = 'Ukázat nápovědu';
    $('clear-marks').hidden = mode !== 'count';
    $('clear-marks').disabled = mode === 'count' && question.count === 0;
    $('workspace').className = 'workspace' + (mode === 'count' && max === 100 ? ' many' : '');
    const [label, title, instruction] = descriptions[mode];
    $('exercise-label').textContent = label;
    $('question').textContent = title;
    $('instruction').textContent = mode === 'sequence' ? (question.step > 0 ? 'Čísla rostou po jedné. Doplň mezeru.' : 'Čísla klesají po jedné. Doplň mezeru.') : instruction;
    const stage = $('workspace'); stage.replaceChildren();
    if (mode === 'count') stage.append(pictures(question.count, true));
    else if (mode === 'sequence') stage.append(equation(question.sequence.map((n, i) => i === question.missing ? '?' : n), true));
    else if (mode === 'compare') stage.append(equation([question.a, '?', question.b]));
    else stage.append(equation([question.a, mode === 'add' ? '+' : '−', question.b, '=', '?']));
    $('answer-label').textContent = mode === 'compare' ? 'VYBER SPRÁVNÉ ZNAMÉNKO' : 'VYBER SPRÁVNÉ ČÍSLO';
    $('answers').replaceChildren();
    question.options.forEach(value => {
      const button = element('button', 'answer', value);
      if (mode === 'compare') {
        const names = { '<': 'menší než', '=': 'rovná se', '>': 'větší než' };
        button.append(element('span', 'answer-symbol-label', names[value]));
        button.setAttribute('aria-label', names[value]);
      }
      button.addEventListener('click', () => answer(value, button));
      $('answers').append(button);
    });
    $('feedback').className = '';
    $('feedback').textContent = 'V klidu. Máš tolik času, kolik potřebuješ.';
    $('next').replaceChildren(document.createTextNode('Jiný příklad '), element('span', '', '→'));
    if (focus) $('question').focus({ preventScroll: true });
  }
  function answer(value, button) {
    if (solved || button.disabled) return;
    if (value !== question.answer) {
      button.classList.add('wrong');
      button.disabled = true;
      $('feedback').className = 'retry';
      $('feedback').textContent = 'Ještě to zkus. Pomůže ti nápověda.';
      // Keep keyboard users in the remaining choices after disabling an answer.
      $('answers').querySelector('button:not(:disabled)').focus({ preventScroll: true });
      return;
    }
    solved = true; score++;
    button.classList.add('correct');
    $('answers').querySelectorAll('button').forEach(el => { el.disabled = true; });
    $('score').querySelector('span').textContent = score;
    $('score').setAttribute('aria-label', 'Počet vyřešených příkladů: ' + score);
    $('feedback').className = 'success';
    $('feedback').textContent = score % 5 === 0 ? 'Paráda! Dalších pět příkladů máš za sebou. ★' : 'Výborně, máš to správně! ★';
    $('next').replaceChildren(document.createTextNode('Další příklad '), element('span', '', '→'));
    $('next').focus({ preventScroll: true });
  }
  function buildHint() {
    const panel = $('hint-panel'); panel.replaceChildren();
    if (mode === 'count') {
      panel.append(element('p', '', question.count === 0 ? 'Když tu nic není, říkáme tomu nula.' : max === 100 ? 'Každá plná skupina má 10 obrázků. Počítej desítky a pak obrázky v poslední skupině.' : 'Počítej po jednom. Na spočítaný obrázek klepni, aby se označil. Poslední vyslovené číslo říká, kolik jich je.'));
    } else if (mode === 'sequence') {
      panel.append(element('p', '', question.step > 0 ? 'Každé další číslo je o 1 větší. Začni číslem před otazníkem a přidej jednu.' : 'Každé další číslo je o 1 menší. Začni číslem před otazníkem a uber jednu.'));
    } else if (mode === 'subtract') {
      panel.append(element('p', '', 'Začni s ' + question.a + ' obrázky. Škrtneme ' + question.b + '. Spočítej ty, které zůstaly.'));
      panel.append(pictures(question.a, false, question.b));
    } else {
      panel.append(element('p', '', mode === 'add' ? 'Spočítej obě skupiny dohromady. Plná skupina má 10 obrázků.' : 'Porovnej obě množství. Otevřená strana znaménka míří k většímu. Když jsou stejná, vyber =.'));
      const columns = element('div', 'hint-columns');
      [question.a, question.b].forEach((n, i) => {
        const side = element('div', 'hint-side');
        side.append(element('p', '', (i === 0 ? 'Vlevo: ' : 'Vpravo: ') + n), pictures(n));
        columns.append(side);
      });
      panel.append(columns);
    }
  }
  $('hint').addEventListener('click', () => {
    const show = $('hint-panel').hidden;
    if (show) buildHint();
    $('hint-panel').hidden = !show;
    $('hint').setAttribute('aria-expanded', String(show));
    $('hint').textContent = show ? 'Skrýt nápovědu' : 'Ukázat nápovědu';
  });
  $('clear-marks').addEventListener('click', () => {
    $('workspace').querySelectorAll('.picture').forEach(el => el.setAttribute('aria-pressed', 'false'));
  });
  $('next').addEventListener('click', () => newQuestion(true));
  document.querySelectorAll('[data-mode]').forEach(button => button.addEventListener('click', () => {
    mode = button.dataset.mode;
    document.querySelectorAll('[data-mode]').forEach(el => el.setAttribute('aria-pressed', String(el === button)));
    newQuestion();
  }));
  document.querySelectorAll('[data-max]').forEach(button => button.addEventListener('click', () => {
    max = Number(button.dataset.max);
    document.querySelectorAll('[data-max]').forEach(el => el.setAttribute('aria-pressed', String(el === button)));
    $('range-note').textContent = max === 100 ? 'Větší výzva pro zvídavé počtáře.' : max === 20 ? 'O kousek dál, pořád vlastním tempem.' : 'Začínáme malými krůčky.';
    newQuestion();
  }));
  newQuestion();
})();

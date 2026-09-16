(() => {
  'use strict';
  const { pool, splitWord, createRound, exampleFor } = Alphabet;
  const $ = id => document.getElementById(id);
  const state = { set: 'all', mode: 'learn', index: 0, exampleIndex: 0, cursive: false, round: null, score: 0, solved: false };
  const synth = window.speechSynthesis;
  let voice = null;
  let utterance = null;
  let speechFailed = false;
  function refreshVoice() {
    voice = synth?.getVoices().find(v => /^cs(?:[-_]|$)/i.test(v.lang)) || null;
    if (voice) speechFailed = false;
    if (state.mode === 'game' && state.round) renderGamePrompt();
  }
  function cancelSpeech() { if (synth) synth.cancel(); }
  function soundAvailable() { return !!(voice && !speechFailed && window.SpeechSynthesisUtterance); }
  function soundNotice(message) { $('sound-status').textContent = message; $('sound-status').hidden = false; }
  function speak(text) {
    refreshVoice();
    if (!soundAvailable()) {
      soundNotice('Český hlas není v tomto prohlížeči dostupný. Písmenka si můžete říkat společně; ve hře se zadání ukáže i na obrazovce.');
      if (state.mode === 'game') renderGamePrompt();
      return;
    }
    cancelSpeech();
    utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'cs-CZ';
    utterance.voice = voice;
    utterance.rate = 0.8;
    utterance.onstart = () => { $('sound-status').hidden = true; };
    utterance.onerror = event => {
      if (event.error === 'interrupted' || event.error === 'canceled') return;
      speechFailed = true;
      soundNotice('Zvuk se nepodařilo přehrát. Zadání si můžete přečíst společně nebo zkusit tlačítko znovu.');
      if (state.mode === 'game') renderGamePrompt();
    };
    synth.speak(utterance);
  }
  function node(tag, className, content) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (content !== undefined) el.textContent = content;
    return el;
  }
  function current() { return exampleFor(pool(state.set)[state.index], state.exampleIndex); }
  function wordParts(item) {
    const parts = splitWord(item);
    return [document.createTextNode(parts.before), node('mark', '', parts.match), document.createTextNode(parts.after)];
  }
  function cardSpeech(item) {
    return `${item.speech}. Jako ${item.spokenWord}.${item.note ? ` ${item.note}.` : ''}`;
  }
  function renderCard(announce = false) {
    const items = pool(state.set);
    const item = current();
    $('upper').textContent = item.upper;
    $('lower').textContent = item.lower;
    $('print-pair').classList.toggle('digraph', item.upper === 'Ch');
    $('cursive-pair').replaceChildren(node('span', '', item.upper), node('span', '', item.lower));
    $('cursive-panel').hidden = !state.cursive;
    $('letter-image').src = item.image;
    $('letter-image').alt = item.word;
    $('word-intro').textContent = `${item.upper} jako`;
    $('word').replaceChildren(...wordParts(item));
    $('word-note').textContent = item.note;
    $('example-controls').hidden = item.examples.length < 2;
    $('example-count').textContent = `Slovo ${state.exampleIndex + 1} z ${item.examples.length}`;
    $('letter-position').textContent = `${state.index + 1} / ${items.length}`;
    $('progress').style.width = `${(state.index + 1) / items.length * 100}%`;
    $('prev').disabled = state.index === 0;
    $('next').disabled = state.index === items.length - 1;
    const colors = ['#f6dfcd', '#e5ebd8', '#ece6f1', '#f4e8bc', '#dce9ec'];
    document.querySelector('.picture-side').style.background = colors[state.index % colors.length];
    $('letter-strip').replaceChildren(...items.map((letter, index) => {
      const button = node('button', 'letter-chip', letter.upper);
      button.setAttribute('aria-label', `${letter.upper}, ${letter.word}`);
      button.setAttribute('aria-pressed', String(index === state.index));
      button.addEventListener('click', () => selectLetter(index));
      return button;
    }));
    if (announce) $('announcement').textContent = `${item.upper}, ${item.lower}. ${item.word}.`;
  }
  function selectLetter(index) {
    const restoreChipFocus = document.activeElement?.classList.contains('letter-chip');
    cancelSpeech();
    state.index = index;
    state.exampleIndex = 0;
    renderCard(true);
    if (restoreChipFocus) {
      const chip = $('letter-strip').children[state.index];
      chip.focus({ preventScroll: true });
      chip.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
  }
  function renderOverview() {
    $('alphabet-grid').replaceChildren(...pool(state.set).map((item, index) => {
      const button = node('button', 'mini-card');
      const img = node('img'); img.src = item.image; img.alt = ''; img.width = 65; img.height = 65;
      const pair = node('span', 'mini-letters');
      pair.append(document.createTextNode(`${item.upper} `), node('span', '', item.lower));
      button.append(pair, img, node('span', 'mini-word', item.word));
      if (state.cursive) button.append(node('span', 'mini-script', `${item.upper} ${item.lower}`));
      button.setAttribute('aria-label', `Otevřít ${item.upper}, ${item.word}`);
      button.addEventListener('click', () => {
        state.index = index; state.exampleIndex = 0; setMode('learn');
        $('listen').focus({ preventScroll: true });
        $('letter-card').scrollIntoView({ block: 'nearest' });
      });
      return button;
    }));
  }
  function renderGamePrompt() {
    const item = state.round.target;
    $('game-question').textContent = soundAvailable() ? 'Které písmenko slyšíš?' : `Najdi písmenko ${item.upper}`;
    $('game-hint').textContent = soundAvailable()
      ? `Nápověda: začíná na něj ${item.word}.`
      : 'Podívej se na zadání a najdi stejné písmenko.';
  }
  function readQuestion() { speak(`Najdi písmeno ${state.round.target.speech}.`); }
  function startRound(withSound = false) {
    cancelSpeech();
    state.round = createRound(pool(state.set), state.round?.target.upper);
    state.solved = false;
    $('game-image').src = state.round.target.image;
    $('game-image').alt = state.round.target.word;
    $('game-feedback').textContent = 'Klepni na správné písmenko.';
    $('game-next').hidden = true;
    renderGamePrompt();
    $('answers').replaceChildren(...state.round.options.map(item => {
      const button = node('button', 'answer', item.upper);
      button.setAttribute('aria-label', `Písmeno ${item.upper}`);
      button.addEventListener('click', () => {
        if (state.solved) return;
        if (item.upper === state.round.target.upper) {
          state.solved = true;
          state.score++;
          button.classList.add('correct');
          for (const answer of $('answers').children) answer.disabled = true;
          $('score').textContent = `★ ${state.score}`;
          $('game-feedback').textContent = `Ano! ${item.upper} — ${item.word}. To se povedlo!`;
          $('game-next').hidden = false;
          $('game-next').focus({ preventScroll: true });
          if (soundAvailable()) speak(`Ano! ${cardSpeech(item)}`);
        } else {
          button.classList.add('retry');
          button.disabled = true;
          $('game-feedback').textContent = 'Zkus jiné písmenko. Nic se neděje.';
        }
      });
      return button;
    }));
    if (withSound && soundAvailable()) readQuestion();
  }
  function setMode(mode) {
    cancelSpeech(); state.mode = mode;
    for (const id of ['learn', 'game', 'overview']) $(id).hidden = id !== mode;
    document.querySelectorAll('[data-mode]').forEach(button => {
      button.classList.toggle('active', button.dataset.mode === mode);
      button.setAttribute('aria-pressed', String(button.dataset.mode === mode));
    });
    document.querySelector('.switch-label').hidden = mode === 'game';
    if (mode === 'learn') renderCard();
    if (mode === 'overview') renderOverview();
    if (mode === 'game') startRound(true);
  }
  document.querySelectorAll('[data-mode]').forEach(button => button.addEventListener('click', () => setMode(button.dataset.mode)));
  document.querySelectorAll('[data-set]').forEach(button => button.addEventListener('click', () => {
    const letter = current().upper;
    state.set = button.dataset.set;
    state.index = Math.max(0, pool(state.set).findIndex(item => item.upper === letter));
    state.exampleIndex = 0;
    document.querySelectorAll('[data-set]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.set === state.set)));
    setMode(state.mode);
  }));
  $('cursive-toggle').addEventListener('change', event => {
    state.cursive = event.target.checked;
    renderCard();
    if (state.mode === 'overview') renderOverview();
    if (state.cursive) document.fonts.load('32px Playwrite').catch(() => {
      state.cursive = false; $('cursive-toggle').checked = false;
      renderCard(); if (state.mode === 'overview') renderOverview();
      soundNotice('Psací písmo se nepodařilo načíst. Zkus stránku znovu načíst.');
    });
  });
  $('prev').addEventListener('click', () => selectLetter(state.index - 1));
  $('next').addEventListener('click', () => selectLetter(state.index + 1));
  $('listen').addEventListener('click', () => speak(cardSpeech(current())));
  $('next-example').addEventListener('click', () => {
    cancelSpeech();
    state.exampleIndex = (state.exampleIndex + 1) % current().examples.length;
    renderCard(true);
  });
  $('game-listen').addEventListener('click', readQuestion);
  $('game-next').addEventListener('click', () => {
    startRound(true);
    $('answers').firstElementChild.focus({ preventScroll: true });
  });
  document.addEventListener('keydown', event => {
    if (state.mode !== 'learn' || event.altKey || event.ctrlKey || event.metaKey || /INPUT|SELECT|TEXTAREA/.test(event.target.tagName)) return;
    if (event.key === 'ArrowRight' && state.index < pool(state.set).length - 1) { event.preventDefault(); selectLetter(state.index + 1); }
    if (event.key === 'ArrowLeft' && state.index > 0) { event.preventDefault(); selectLetter(state.index - 1); }
  });
  let touchStart = null;
  $('letter-card').addEventListener('touchstart', event => {
    if (event.touches.length !== 1 || event.target.closest('button')) { touchStart = null; return; }
    touchStart = { x: event.touches[0].clientX, y: event.touches[0].clientY };
  }, { passive: true });
  $('letter-card').addEventListener('touchend', event => {
    if (!touchStart) return;
    const dx = event.changedTouches[0].clientX - touchStart.x;
    const dy = event.changedTouches[0].clientY - touchStart.y;
    touchStart = null;
    if (Math.abs(dx) < 65 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    const next = state.index + (dx < 0 ? 1 : -1);
    if (next >= 0 && next < pool(state.set).length) selectLetter(next);
  }, { passive: true });
  $('letter-card').addEventListener('touchcancel', () => { touchStart = null; }, { passive: true });
  window.addEventListener('pagehide', cancelSpeech);
  document.addEventListener('visibilitychange', () => { if (document.hidden) cancelSpeech(); });
  if (synth) synth.addEventListener('voiceschanged', refreshVoice);
  refreshVoice(); renderCard();
})();

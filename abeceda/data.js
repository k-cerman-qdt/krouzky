/* Data are shared by the browser and the Node verification suite. */
globalThis.Alphabet = (() => {
  const rows = [
    ['A', 'auto', '1f697', 'á'],
    ['Á', 'kráva', '1f404', 'dlouhé á'],
    ['B', 'babička', '1f475', 'bé'],
    ['C', 'citron', '1f34b', 'cé'],
    ['Č', 'čokoláda', '1f36b', 'čé'],
    ['D', 'dům', '1f3e0', 'dé'],
    ['Ď', 'loď', '26f5', 'ďé'],
    ['E', 'eso', 'ace', 'é'],
    ['É', 'lék', '1f48a', 'dlouhé é'],
    ['Ě', 'hvězda', '2b50', 'é s háčkem'],
    ['F', 'fotbal', '26bd', 'ef'],
    ['G', 'gorila', '1f98d', 'gé'],
    ['H', 'hruška', '1f350', 'há'],
    ['Ch', 'chléb', '1f35e', 'chá'],
    ['I', 'iglú', 'igloo', 'měkké í'],
    ['Í', 'klíč', '1f511', 'dlouhé měkké í'],
    ['J', 'jablko', '1f34e', 'jé'],
    ['K', 'kočka', '1f408', 'ká'],
    ['L', 'lev', '1f981', 'el'],
    ['M', 'motýl', '1f98b', 'em'],
    ['N', 'nos', '1f443', 'en'],
    ['Ň', 'kůň', '1f40e', 'eň'],
    ['O', 'opice', '1f412', 'ó'],
    ['Ó', 'gól', '1f945', 'dlouhé ó'],
    ['P', 'pes', '1f415', 'pé'],
    ['Q', 'quiche', '1f967', 'kvé', 'slaný koláč', 'kiš'],
    ['R', 'ryba', '1f41f', 'er'],
    ['Ř', 'řetěz', '26d3', 'eř'],
    ['S', 'slunce', '2600', 'es'],
    ['Š', 'šnek', '1f40c', 'eš'],
    ['T', 'traktor', '1f69c', 'té'],
    ['Ť', 'labuť', '1f9a2', 'ťé'],
    ['U', 'ucho', '1f442', 'ú'],
    ['Ú', 'úsměv', '1f600', 'ú s čárkou'],
    ['Ů', 'dům', '1f3e0', 'ů s kroužkem'],
    ['V', 'vlak', '1f682', 'vé'],
    ['W', 'kiwi', '1f95d', 'dvojité vé'],
    ['X', 'taxi', '1f695', 'iks'],
    ['Y', 'lyže', '1f3bf', 'tvrdé ypsilon'],
    ['Ý', 'sýr', '1f9c0', 'dlouhé tvrdé ypsilon'],
    ['Z', 'zebra', '1f993', 'zet'],
    ['Ž', 'žába', '1f438', 'žet']
  ];
  const letters = rows.map(([upper, word, image, speech, note = '', spokenWord = word]) => ({
    upper, lower: upper.toLocaleLowerCase('cs'), word, image: `assets/${image}.svg`, speech, note, spokenWord
  }));
  const basic = new Set('A B C Č D E F G H Ch I J K L M N O P R Ř S Š T U V Z Ž'.split(' '));
  function pool(set) { return set === 'basic' ? letters.filter(item => basic.has(item.upper)) : [...letters]; }
  function splitWord(item) {
    const index = item.word.toLocaleLowerCase('cs').indexOf(item.lower);
    return { before: item.word.slice(0, index), match: item.word.slice(index, index + item.lower.length), after: item.word.slice(index + item.lower.length) };
  }
  function shuffle(items, random) {
    const result = [...items];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
  function createRound(items, previous, random = Math.random) {
    const candidates = items.filter(item => item.upper !== previous);
    const target = candidates[Math.floor(random() * candidates.length)];
    const others = shuffle(items.filter(item => item !== target), random).slice(0, 2);
    return { target, options: shuffle([target, ...others], random) };
  }
  return { letters, pool, splitWord, createRound };
})();

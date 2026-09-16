/* Data are shared by the browser and the Node verification suite. */
globalThis.Alphabet = (() => {
  const rows = [
    ['A', 'auto', '1f697', 'á'],
    ['Á', 'árie', '1f469-200d-1f3a4', 'dlouhé á', 'zpěv v opeře'],
    ['B', 'babička', '1f475', 'bé'],
    ['C', 'citron', '1f34b', 'cé'],
    ['Č', 'čokoláda', '1f36b', 'čé'],
    ['D', 'dům', '1f3e0', 'dé'],
    ['Ď', 'ďáblík', '1f608', 'dé s háčkem'],
    ['E', 'eso', 'ace', 'é'],
    ['É', 'éro', '1f6e9', 'dlouhé é', 'jiné slovo pro letadlo'],
    ['F', 'fotbal', '26bd', 'ef'],
    ['G', 'gorila', '1f98d', 'gé'],
    ['H', 'hruška', '1f350', 'há'],
    ['Ch', 'chléb', '1f35e', 'chá'],
    ['I', 'iglú', 'igloo', 'měkké í'],
    ['Í', 'Írán', '1f1ee-1f1f7', 'dlouhé měkké í', 'jméno země a její vlajka'],
    ['J', 'jablko', '1f34e', 'jé'],
    ['K', 'kočka', '1f408', 'ká'],
    ['L', 'lev', '1f981', 'el'],
    ['M', 'motýl', '1f98b', 'em'],
    ['N', 'nos', '1f443', 'en'],
    ['Ň', 'ňam', '1f60b', 'en s háčkem', 'to je dobrota!'],
    ['O', 'opice', '1f412', 'ó'],
    ['Ó', 'óda', '1f4dc', 'dlouhé ó', 'oslavná báseň'],
    ['P', 'pes', '1f415', 'pé'],
    ['Q', 'quiche', '1f967', 'kvé', 'slaný koláč', 'kiš'],
    ['R', 'ryba', '1f41f', 'er'],
    ['Ř', 'řetěz', '26d3', 'eř'],
    ['S', 'slunce', '2600', 'es'],
    ['Š', 'šnek', '1f40c', 'eš'],
    ['T', 'traktor', '1f69c', 'té'],
    ['Ť', 'ťapka', '1f43e', 'té s háčkem'],
    ['U', 'ucho', '1f442', 'ú'],
    ['Ú', 'úsměv', '1f600', 'ú s čárkou'],
    ['V', 'vlak', '1f682', 'vé'],
    ['W', 'web', 'web', 'dvojité vé', 'stránka na internetu'],
    ['X', 'xylofon', 'xylophone', 'iks', 'hudební nástroj'],
    ['Y', 'yetti', 'yetti', 'tvrdé ypsilon', 'pohádkový sněžný muž', 'jeti'],
    ['Z', 'zebra', '1f993', 'zet'],
    ['Ž', 'žába', '1f438', 'žet']
  ];
  const extraExamples = {
    A: [['ananas', '1f34d'], ['anděl', '1f47c']],
    B: [['banán', '1f34c'], ['beruška', '1f41e']],
    C: [['cibule', '1f9c5'], ['cíl', '1f3af']],
    Č: [['čepice', '1f9e2'], ['česnek', '1f9c4']],
    D: [['dort', '1f382'], ['delfín', '1f42c']],
    E: [['elf', '1f9dd', 'pohádková bytost'], ['e-mail', '1f4e7', 'dopis na internetu', 'ímejl']],
    F: [['fotoaparát', '1f4f7']],
    G: [['glóbus', '1f30d', 'model naší Země']],
    H: [['had', '1f40d'], ['houba', '1f344']],
    Ch: [['chobotnice', '1f419'], ['chata', '1f6d6']],
    I: [['injekce', '1f489']],
    J: [['jahoda', '1f353'], ['ježek', '1f994']],
    K: [['koza', '1f410'], ['klíč', '1f511']],
    L: [['loď', '26f5'], ['liška', '1f98a']],
    M: [['medvěd', '1f43b'], ['mrkev', '1f955']],
    N: [['nůžky', '2702'], ['netopýr', '1f987']],
    O: [['okurka', '1f952'], ['orel', '1f985']],
    P: [['prase', '1f416'], ['panda', '1f43c']],
    R: [['raketa', '1f680'], ['růže', '1f339']],
    Ř: [['ředkvička', 'radish']],
    S: [['sova', '1f989'], ['slon', '1f418']],
    Š: [['šála', '1f9e3'], ['šaty', '1f457']],
    T: [['tygr', '1f405'], ['tučňák', '1f427']],
    U: [['uzel', '1faa2']],
    Ú: [['ústa', '1f444']],
    V: [['velbloud', '1f42b'], ['včela', '1f41d']],
    Z: [['zámek', '1f3f0'], ['zmrzlina', '1f366']],
    Ž: [['želva', '1f422'], ['žirafa', '1f992']]
  };
  function example(word, image, note = '', spokenWord = word) {
    return { word, image: `assets/${image}.svg`, note, spokenWord };
  }
  const letters = rows.map(([upper, word, image, speech, note = '', spokenWord = word]) => {
    const first = example(word, image, note, spokenWord);
    return {
      upper, lower: upper.toLocaleLowerCase('cs'), speech, ...first,
      examples: [first, ...(extraExamples[upper] || []).map(args => example(...args))]
    };
  });
  function exampleFor(item, index = 0) { return { ...item, ...item.examples[index % item.examples.length] }; }
  const basic = new Set('A B C Č D E F G H Ch I J K L M N O P R Ř S Š T U V Z Ž'.split(' '));
  function pool(set) { return set === 'basic' ? letters.filter(item => basic.has(item.upper)) : [...letters]; }
  function splitWord(item) {
    return { before: '', match: item.word.slice(0, item.lower.length), after: item.word.slice(item.lower.length) };
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
    items = items.filter(item => item.word && item.word.toLocaleLowerCase('cs').startsWith(item.lower));
    const candidates = items.filter(item => item.upper !== previous);
    const letter = candidates[Math.floor(random() * candidates.length)];
    const target = exampleFor(letter, Math.floor(random() * letter.examples.length));
    const others = shuffle(items.filter(item => item.upper !== target.upper), random).slice(0, 2);
    return { target, options: shuffle([target, ...others], random) };
  }
  return { letters, pool, splitWord, createRound, exampleFor };
})();

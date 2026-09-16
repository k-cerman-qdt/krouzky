# Naše kroužky

Samostatná statická stránka s rodinným rozvrhem od 1. září 2026 do 31. ledna 2027.

Otevřete `index.html` v prohlížeči. Není potřeba instalace ani internet. Lze přepínat týdny, filtrovat děti a vytisknout vybraný týden. Výjimky plavání jsou zobrazeny jako zrušené lekce a nezapočítávají se do počtu aktivních lekcí.

## Úprava dat

V `index.html` najděte `const ACTIVITIES`. Každý záznam obsahuje název, den (1 = pondělí, 5 = pátek), čas a děti. `first` určuje první lekci; `except` jsou výjimky ve formátu `RRRR-MM-DD`. `PERIOD` určuje období platnosti.

Dramaták je předpokládán každý týden od 22. září. Prázdniny a svátky se automaticky nevynechávají.

## GitHub Pages

1. Vytvořte veřejný repozitář `krouzky` a nahrajte `index.html` a `.nojekyll` do hlavní větve.
2. V Settings → Pages vyberte Deploy from a branch, hlavní větev a složku `/ (root)`.
3. GitHub v této sekci zobrazí výslednou adresu stránky po dokončení nasazení.

## Ověření

S Node.js: `node --test tests/schedule.test.cjs`.

## Obrázková abeceda

Na [k-cerman-qdt.github.io/krouzky/abeceda/](https://k-cerman-qdt.github.io/krouzky/abeceda/) je samostatná statická stránka pro tablet. Soubory jsou ve složce `abeceda/`; nevyžaduje sestavení ani instalaci balíčků. Lze otevřít i `abeceda/index.html` přímo ze souboru. Z kroužků na ni vede odkaz v patičce a z abecedy vede odkaz zpět.

- 39 karet: velká i malá tiskací písmena, český psací font Playwrite Česko, obrázek a slovo začínající daným písmenem. Ě, Ů a Ý jsou na přání vynechány, protože pro ně není vhodný běžný příklad na začátku slova.
- Širší sada nebo menší sada „Na začátek“, přehled všech karet a hra se třemi možnostmi. Výběr písmen se zalamuje podle šířky stránky do řádků bez vodorovného posouvání. Přepínání kartiček také šipkami, tlačítky a tahem prstu.
- Obrázky a font jsou lokální; atribuce a licence jsou v části „Pro rodiče a zdroje“ a v `abeceda/assets/`. Obrázky Twemoji jsou pod CC BY 4.0; iglú a xylofon od Delapouite pod CC BY 3.0 mají upravené barvy; eso, web a yetti jsou vlastní SVG. Font je pod SIL OFL 1.1.
- Zvuk používá Web Speech API a český hlas zařízení. Kvalita a dostupnost závisí na systému/prohlížeči; některé hlasy potřebují připojení. Pokud český hlas chybí, hra ukáže písmeno v zadání pro vizuální přiřazování. Web nesbírá data.

Obsah karet upravujte v `abeceda/data.js`, vzhled v `abeceda/style.css` a interakce v `abeceda/app.js`.

Celkem je k dispozici 89 obrázkových příkladů; 28 písmen má dva až tři příklady. Více příkladů je v `extraExamples` podle písmena. Tlačítko „Další slovo“ mění slovo i obrázek a cyklí zpět na první příklad; po změně písmena se začíná prvním příkladem. Hra náhodně vybírá také z dalších příkladů. Písmeno s jediným příkladem přepínací tlačítko nezobrazuje.

Lokální náhled: `node tools/preview.cjs`, adresa `http://127.0.0.1:4174/abeceda/` (volitelně proměnná prostředí `PORT`).

Všechny automatické testy: `node --test tests/*.test.cjs`.

## Hravá matematika

Web: [k-cerman-qdt.github.io/krouzky/matematika/](https://k-cerman-qdt.github.io/krouzky/matematika/).

`matematika/index.html` je česká stránka pro počítání obrázků, sčítání,
odčítání, porovnávání čísel a doplňování vzestupné i sestupné řady.
Výchozí rozsah je 0–10, dále lze vybrat 0–20 a 0–100 jako výzvu.
Příklady mohou přecházet přes desítku; nikdy nemají záporný výsledek.
Obrázky lze označovat klepnutím, nápověda ukáže skupiny nebo škrtání při
odčítání. Za vyřešený příklad přibude jedna hvězdička i po opravě.
Počítadlo se po obnovení stránky vynuluje. Bez časovače, přihlášení či analytiky.

Stránka funguje i přímo ze souboru bez internetu; používá místní obrázky
Twemoji ze složky `abeceda/assets/` (CC BY 4.0, atribuce v patičce).
Náhled po spuštění `node tools/preview.cjs`: `http://127.0.0.1:4174/matematika/`.
Logika příkladů je v `matematika/model.js`, vzhled v `style.css`, interakce v `app.js`.

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

- 42 karet: velká i malá tiskací písmena, český psací font Playwrite Česko, obrázek a příklad slova.
- Úplná abeceda nebo menší sada „Na začátek“, přehled všech karet a hra se třemi možnostmi. Přepínání šipkami, tlačítky a tahem prstu.
- Obrázky a font jsou lokální; atribuce a licence jsou v části „Pro rodiče a zdroje“ a v `abeceda/assets/`. Obrázky Twemoji jsou pod CC BY 4.0; iglú od Delapouite pod CC BY 3.0 má upravené barvy; eso je vlastní SVG. Font je pod SIL OFL 1.1.
- Zvuk používá Web Speech API a český hlas zařízení. Kvalita a dostupnost závisí na systému/prohlížeči; některé hlasy potřebují připojení. Pokud český hlas chybí, hra ukáže písmeno v zadání pro vizuální přiřazování. Web nesbírá data.

Obsah karet upravujte v `abeceda/data.js`, vzhled v `abeceda/style.css` a interakce v `abeceda/app.js`.

Lokální náhled: `node tools/preview.cjs`, adresa `http://127.0.0.1:4174/abeceda/` (volitelně proměnná prostředí `PORT`).

Všechny automatické testy: `node --test tests/*.test.cjs`.

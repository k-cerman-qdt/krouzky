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

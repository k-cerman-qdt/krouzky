# Rozvrh kroužků

Zadání: samostatné české HTML, týdenní přehled, děti A/B odlišené barvou a textem, mobilní zobrazení. Období 1. 9. 2026–31. 1. 2027. Dramaták se předpokládá každý týden od 22. 9. 2026. Vynechat pouze zadané výjimky plavání, nikoli automaticky školní prázdniny.

Hosting: uživatel zvolil GitHub Pages. Zveřejnit po dostupném přihlášení v novém repozitáři krouzky; zachovat anonymní označení dětí. Bez závislostí, analytiky a externích fontů. index.html obsahuje data, styly i logiku; funguje ze souboru a na projektové adrese GitHub Pages.

## Postup
- [x] Otestovat opakování událostí, začátek dramatáku, všechny čtyři výjimky, konec období a filtr dětí pomocí node --test tests/schedule.test.cjs. Všech 10 testů prošlo.
- [x] Vytvořit index.html: navigace po týdnech, výběr dne, filtr dětí, karty pěti pracovních dnů, přehled výjimek a tisk.
- [x] Ověřit skutečné chování v prohlížeči a rozložení pro telefon. Ověřeno přepnutí týdne, datum 30. 10., filtr B, poslední týden a neaktivní další navigace, šířka 390 px bez horizontálního přetečení; žádné chyby konzole.
- [ ] Přidat návod a zveřejnit na GitHub Pages po přihlášení; ověřit nasazenou URL.

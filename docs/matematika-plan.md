# Hravá matematika

Samostatná stránka `matematika/` ve stávajícím statickém webu. Český text, velké dotykové ovládání, bez časovače, bez ukládání osobních údajů a bez vzdálených závislostí. Výchozí rozsah 0–10, volitelně 0–20 a 0–100 jako výzva. Existující kroužky a abeceda zůstávají dostupné.

- [x] Model v `matematika/model.js`: generování počtu obrázků, sčítání a odčítání. Jedinečné odpovědi v rozsahu, správná odpověď vždy přítomna. Testovat hranice a tisíce generovaných příkladů v `tests/math.test.cjs`.
- [x] Rozhraní v `matematika/index.html`, `style.css`, `app.js`: výběr cvičení a rozsahu, označování spočítaných obrázků, čtyři odpovědi, laskavá zpětná vazba, další příklad a obrázková nápověda. Obrázky seskupovat po deseti. Použít existující lokální Twemoji s atribucí.
- [x] Volitelná cvičení: porovnávání čísel a doplňování řady.
- [x] Propojit stránky, rozšířit lokální náhled a README. Ověřit správnou i chybnou odpověď, změnu režimu/rozsahu, focus, obrázky, šířky 390/768/1280 px a všechny stávající testy.

Provedení v aktuálním úkolu. Výsledek nejprve předán v místním náhledu. Uživatel následně schválil podobu a požádal o publikaci na stávající GitHub Pages z větve `main`: https://k-cerman-qdt.github.io/krouzky/matematika/. Nepřevádět existující GitHub Pages web do Sites.

## Ověření

23 automatických testů včetně stávající abecedy a kroužků. Generátor ověřen pro všechny tři rozsahy, správnost aritmetiky, jedinečné možnosti, nulu a hraniční hodnoty; porovnávání včetně rovnosti a obousměrné řady.

V prohlížeči ověřeno všech 15 kombinací pěti cvičení a tří rozsahů: správná odpověď, nápověda a přičtení jedné hvězdy. Navíc chybná odpověď a oprava, zachování skóre při změně cvičení, klávesnicový focus, označování obrázků a reset, nula, navigace do abecedy a zpět. Při 390/768/1280 px žádné vodorovné přetečení ani chybějící obrázky. Konzole bez chyb. Závěrečné review vedlo k opravě navigačních odkazů pro přímé otevírání ze souborů.

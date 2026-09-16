# Obrázková abeceda

Schválený směr: samostatná statická stránka pro tablet, vedle kroužků ve stávajícím repozitáři na GitHub Pages. Velká/malá tiskací písmena, české psací tvary, obrázky, úplná abeceda s diakritikou a Ch. Kartičky, přehled a hra; české předčítání podle dostupného hlasu zařízení.

## Provedení

- [x] Vytvořit `abeceda/data.js` s 42 kartami, výběrem základní/úplné abecedy, rozdělením slova pro zvýraznění a náhodnými otázkami se třemi různými odpověďmi. Ověřit na ručně zvolených příkladech Ch, Ě, Ů, Ď a na opakovaných herních kolech.
- [x] Přidat lokální SVG obrázky s uvedením autorů a licencí, font Playwrite Česko pod OFL. Každá karta má konkrétní obrázek odpovídající slovu. Méně obvyklá písmena mohou být uvnitř slova.
- [x] Vytvořit `abeceda/index.html`, `style.css`, `app.js`: tabletové rozložení, velká dotyková tlačítka, procházení kartiček, volitelná psací písmena, přehled, hra s možností opakování po chybě. Bez přihlášení, analytiky a vzdálených závislostí za běhu. Předčítání pouze českým hlasem; pokud chybí, zobrazit srozumitelnou informaci.
- [x] Přidat navigační odkazy mezi kroužky a abecedou, rozšířit lokální náhled pro statické soubory a README.
- [x] Ověřit automatické testy, chování v prohlížeči, načtení všech obrázků a fontu, tablet na výšku/šířku a menší telefon.

Publikace: aktualizace větve `main` ve stávajícím repozitáři `k-cerman-qdt/krouzky`; cílová adresa `https://k-cerman-qdt.github.io/krouzky/abeceda/`. Po aktualizaci ověřit tuto živou adresu včetně propojení s kroužky.

## Výsledky ověření

14 automatických testů prošlo (4 abeceda, 10 existující rozvrh). Prohlížečový test ověřuje všechny obrázky, načtení fontu, přesné zvýraznění, oba výběry písmen, správné i chybné odpovědi, režim bez hlasu a odkazy tam/zpět. Bez horizontálního přetečení při šířkách 1024, 768 a 390 px. Nezávislé review odhalilo ztrátu focusu na kartičkách a po další hádance a nejednoznačný test pro D/Ů; opraveno a ověřeno regresními testy. Skutečné přehrávání zvuku na uživatelově tabletu zde nebylo možné otestovat.

## Záměr vzhledu

Teplé papírové pozadí, tmavě zelený inkoust, barevné obrázky a měkké pastelové plochy. Jedna dominantní kartička, malá sada ovládacích prvků; plný přehled až po klepnutí. Výchozí úplná abeceda, jednodušší sada dostupná jedním přepnutím. Bez časovače a penalizace chyb.

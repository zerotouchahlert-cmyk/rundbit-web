# rundbit-web

Website von RundBit (Christian Ahlert und Marco Klär) – Prozessautomatisierung und Software
für kleine und mittlere Betriebe.

Statische Seite ohne Framework, Build-Schritt, externe Requests, Tracker oder Cookies.

## Aufbau

- `site/` – alles, was ausgeliefert wird. Genau diesen Ordner auf den Webserver legen.
  - `index.html`, `style.css`
  - `fonts/` – selbst gehostete Schriften (Space Grotesk, Inter; SIL Open Font License, siehe `*-OFL.txt`)
  - `img/` – Logo (normal und invers), Open-Graph-Bild
  - `favicon.svg`, `favicon-32.png`, `apple-touch-icon.png`

Außerhalb von `site/` liegt nichts, was ausgeliefert werden muss.

## Lokal ansehen

Ein beliebiger statischer Server auf `site/` genügt, zum Beispiel:

```sh
npx serve site
# oder
python -m http.server 8080 --directory site
```

Danach http://localhost:3000 bzw. http://localhost:8080 öffnen. Direktes Öffnen der
`index.html` per Doppelklick funktioniert ebenfalls weitgehend.

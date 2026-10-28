# Begehungsmappe 1.0.0

Offline-App für Arbeitssicherheits- und Brandschutzbegehungen auf dem Android-Tablet.

## Inhalt des Ordners

| Datei | Zweck |
|---|---|
| `index.html` | Die komplette App |
| `sw.js` | Service Worker für den Offline-Betrieb |
| `manifest.webmanifest` | Angaben für die Installation als App |
| `icon-*.png` | App-Symbole |

## Einrichten (einmalig)

Eine installierbare Web-App braucht eine HTTPS-Adresse. Am einfachsten geht das kostenlos mit GitHub Pages:

1. Auf GitHub ein neues Repository anlegen, z. B. `begehungsmappe` (öffentlich oder, mit passendem Tarif, privat).
2. Alle Dateien aus diesem Ordner hochladen („Add file“ → „Upload files“).
3. Unter **Settings → Pages** als Quelle den Branch `main` und den Ordner `/ (root)` wählen, speichern.
4. Nach etwa einer Minute ist die App unter `https://<benutzername>.github.io/begehungsmappe/` erreichbar.

Andere Wege funktionieren genauso, solange die Dateien per HTTPS ausgeliefert werden (eigener Webspace, Netlify, Cloudflare Pages). Eine reine `http://`-Adresse im Heimnetz reicht nicht, weil Chrome dort weder Installation noch Offline-Betrieb zulässt.

Die Daten verlassen das Tablet dabei nicht. Der Server liefert nur die App-Dateien aus, alle Ordner, Notizen und Fotos bleiben im Speicher des Tablets.

## Auf dem Tablet installieren

1. Die Adresse in **Chrome** öffnen.
2. Menü (⋮) → **Zum Startbildschirm hinzufügen** bzw. **App installieren**.
3. Die App einmal mit Internet öffnen, danach läuft sie auch ohne Netz.

## Bedienung in Kürze

- **Ordner**: frei benennbar, z. B. ein Ordner pro Kunde. Darin beliebig viele Begehungen.
- **Einfügemarke** (grüne Linie): Dort landet alles Neue. Zwischen zwei Blöcken tippen, um sie zu versetzen. Wer in ein Textfeld oder eine Handschriftfläche tippt, setzt sie automatisch dahinter.
- **Foto**: öffnet die Kamera. Das Foto kommt an die Einfügemarke, direkt danach wird eine leere Notiz angelegt (einstellbar unter „Nach Foto“: Handschrift, Text oder nichts).
- **Handschrift**: Der S-Pen schreibt, der Finger scrollt. Aufliegender Handballen wird ignoriert, solange der Stift schreibt. Mit „Finger scrollt / Finger malt“ lässt sich umschalten. Die Fläche wächst beim Schreiben nach unten mit, „Mehr Platz“ verlängert sie von Hand.
- **Text**: normales Textfeld für die Bildschirmtastatur.
- **Mangel?**: Antippen schaltet durch hoch / mittel / gering / kein Mangel. Markierte Blöcke erscheinen im Bericht in der Mängelübersicht.
- **Bericht**: Übersicht mit Kopfdaten, Mängelliste und dem ganzen Protokoll. „Drucken / PDF“ öffnet den Android-Druckdialog, dort „Als PDF speichern“ wählen.

## Datensicherung

Alle Daten liegen nur auf diesem Tablet. Werden die Browserdaten von Chrome gelöscht oder die App deinstalliert, sind sie weg.

- **Einzelne Begehung**: In der Ordneransicht oder im Bericht auf „Sichern“ tippen.
- **Alles**: Startseite → „Datensicherung und Speicher“ → „Alles sichern“ oder „Sicherung teilen“ (z. B. an Google Drive oder per Mail).
- **Wiederherstellen**: „Sicherung einlesen“ und die JSON-Datei wählen. Gleiche Einträge werden dabei überschrieben, alles andere bleibt erhalten.

Fotos werden beim Aufnehmen auf höchstens 1600 Pixel verkleinert (typisch 200–400 KB pro Foto).

## Update einspielen

Neue Dateien auf GitHub hochladen. In `sw.js` steht `CACHE_VERSION`; die muss bei jeder neuen Version erhöht werden. Das Tablet lädt das Update beim nächsten Öffnen mit Internet, aktiv wird es beim übernächsten Start.

## Geplant für Version 2

- Handschrift per KI in Text umwandeln und daraus einen Bericht formulieren
- Ausgabe auf ein definiertes Formblatt und Versand per Mail

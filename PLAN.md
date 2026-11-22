# PathLab – Wartungsplan

1. Gewichtete Wege, kürzeste Schrittzahl, unerreichbare Ziele und Historie mit den bestehenden Referenztests prüfen.
2. Den Lebenszyklus der Tastaturkürzel testen und den registrierten Listener beim Aushängen entfernen.
3. Demo, Bedienung, Feldkosten und Algorithmuswahl in beiden READMEs zusammenfassen.
4. Vitest vor und nach der Korrektur ausführen, ESLint und Vite-Build prüfen.

Vor dem Commit `pytest -q` und `ruff check src tests` ausführen und ihre Anwendbarkeit dokumentieren. Nur geprüfte Projektdateien aufnehmen. Dateien unter `data/` vom Commit ausschliessen. Den Entwicklungsbranch pushen. Der Merge bleibt eine separate Entscheidung.

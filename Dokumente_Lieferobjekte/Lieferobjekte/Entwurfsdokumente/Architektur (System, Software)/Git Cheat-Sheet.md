# 📌 Git Cheat-Sheet für den Server


## 📚 Empfohlene Vorgehensweise

1. Änderungen vornehmen  
2. `git status`  
3. `git add .`  
4. `git commit -m "Nachricht"`

## 📥 Status & Änderungen prüfen

Status des Repositories anzeigen:
```bash
git status
```

Änderungen zwischen Dateien und letztem Commit anzeigen:
```bash
git diff
```

Dateien anzeigen, die aktuell im Repository sind:
```bash
git ls-files
```

---

## ➕ Dateien hinzufügen & committen

Alle Änderungen hinzufügen:
```bash
git add .
```

Einzelne Datei hinzufügen:
```bash
git add datei.txt
```

Änderungen committen (mit Nachricht):
```bash
git commit -m "Commit-Nachricht"
```

---

## 🗃️ Commit-Historie anzeigen

Kurzübersicht (einzeilig):
```bash
git log --oneline
```

Detaillierte Übersicht:
```bash
git log
```

---

## 🚫 Dateien ignorieren (.gitignore)

Beispiel `.gitignore` erstellen und editieren:
```bash
nano .gitignore
```

Beispiel-Inhalt für `.gitignore`:
```
node_modules/
certs/
*.log
```

Dateien aus Git entfernen, aber lokal behalten:
```bash
git rm -r --cached ordner_name
```
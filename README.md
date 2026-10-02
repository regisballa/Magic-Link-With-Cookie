# Magic Link Authentication with Cookies

Webprojekt HTL Shkodër. Login ohne Passwort: der User gibt seine E-Mail ein, bekommt
einen einmalig gültigen Link per Mail, und der Klick darauf setzt ein Session-Cookie.

**Team:** Regis (Backend, Datenbank, Sequenzdiagramm), Suisa (Frontend, Register-Flow, E-R-Diagramm)

## Tech-Stack

- SvelteKit
- Tailwind CSS
- MySQL
- Nodemailer mit SMTP2GO

## Setup

```bash
git clone <repo-url>
cd Magic-Link-With-Cookie
npm install
```

Datenbank anlegen:

```bash
mysql -u root -p < schema.sql
```

`.env.example` nach `.env` kopieren und ausfüllen:

```bash
cp .env.example .env
```

Starten:

```bash
npm run dev
```

Die App läuft auf http://localhost:5173

## Projektstruktur

```
src/
  hooks.server.js              Session aus Cookie lesen, locals.user setzen
  lib/server/
    database.js                MySQL Connection Pool
    auth.js                    Magic Links, Sessions, User
    mail.js                    Mailversand
    ratelimit.js               Schutz vor Massen-Anfragen
    cleanup.js                 Abgelaufene Daten löschen
  routes/
    +page.svelte               Startseite
    login/                     Login-Formular und Versand
    register/                  Registrierung mit Aktivierung
    auth/verify/               Login-Link einlösen
    auth/activate/             Aktivierungs-Link einlösen
    dashboard/                 Geschützte Seite
    logout/                    Session löschen
docs/
  sequence-diagram.mmd         Ablauf des Logins
  er-diagram.mmd               Datenbankstruktur
schema.sql                     Tabellen
```

## Datenbank

| Tabelle | Zweck |
|---|---|
| `users` | Identität: E-Mail, Name, Rolle |
| `magic_links` | Einmal-Links für Login und Aktivierung |
| `sessions` | Aktive Sitzungen |

## Security

- Tokens werden mit `randomBytes(32)` erzeugt, nicht mit UUIDs
- In der DB steht nur der SHA-256-Hash, nie der Token selbst
- Magic Links laufen nach 15 Minuten ab und gelten nur einmal (`used_at`)
- Auch die Session-ID wird gehasht gespeichert
- Cookie mit HttpOnly, Secure und SameSite=Lax
- Gleiche Antwort für existierende und nicht existierende Adressen (keine User-Enumeration)
- Maximal 3 Link-Anfragen pro Adresse in 15 Minuten
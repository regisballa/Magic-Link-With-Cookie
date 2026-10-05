// Einfaches Rate Limiting im Speicher
// Verhindert, dass jemand hunderte Magic Links auf eine Adresse schickt

// Eine Map merkt sich für jeden Schlüssel (hier die E-Mail), wie oft er es versucht hat
const attempts = new Map();

// Maximal 3 Versuche
const MAX_ATTEMPTS = 3;
// Pro Zeitfenster von 15 Minuten (in Millisekunden)
const WINDOW_MS = 15 * 60 * 1000;

// Gibt true zurück, wenn der Versuch erlaubt ist, und false, wenn es zu viele waren
export function checkRateLimit(key) {
    // Aktuelle Zeit
    const now = Date.now();
    // Gibt es schon einen Eintrag für diesen Schlüssel?
    const entry = attempts.get(key);

    // Kein Eintrag oder Zeitfenster abgelaufen: neu anfangen zu zählen
    if (!entry || now > entry.resetAt) {
        attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
        return true;
    }

    // Schon 3 Versuche gemacht? Dann nicht mehr erlauben
    if (entry.count >= MAX_ATTEMPTS) {
        return false;
    }

    // Noch Platz: Zähler um 1 erhöhen und erlauben
    entry.count++;
    return true;
}

// Alte Einträge regelmäßig aufräumen, damit die Map nicht immer größer wird
setInterval(() => {
    const now = Date.now();
    // Alle Einträge durchgehen und die abgelaufenen löschen
    for (const [key, entry] of attempts) {
        if (now > entry.resetAt) attempts.delete(key);
    }
}, WINDOW_MS);
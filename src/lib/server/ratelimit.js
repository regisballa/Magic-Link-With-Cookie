// Einfaches Rate Limiting im Speicher
// Verhindert, dass jemand hunderte Magic Links auf eine Adresse schickt
const attempts = new Map();

const MAX_ATTEMPTS = 3;
const WINDOW_MS = 15 * 60 * 1000;

export function checkRateLimit(key) {
    const now = Date.now();
    const entry = attempts.get(key);

    // Kein Eintrag oder Zeitfenster abgelaufen, also neu zählen
    if (!entry || now > entry.resetAt) {
        attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
        return true;
    }

    if (entry.count >= MAX_ATTEMPTS) {
        return false;
    }

    entry.count++;
    return true;
}

// Alte Einträge aufräumen, damit die Map nicht wächst
setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of attempts) {
        if (now > entry.resetAt) attempts.delete(key);
    }
}, WINDOW_MS);
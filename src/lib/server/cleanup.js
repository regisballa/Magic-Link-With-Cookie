// Abgelaufene Sessions und Magic Links aus der DB entfernen
// Die Datenbankverbindung aus database.js holen
import pool from './database.js';

// 60 Minuten * 60 Sekunden * 1000 Millisekunden = 1 Stunde
const INTERVAL_MS = 60 * 60 * 1000; // jede Stunde

// Eine Funktion, die alte Daten löscht (async, weil sie auf die Datenbank wartet)
export async function cleanupExpired() {
    // Alle Sessions löschen, deren Ablaufzeit schon vorbei ist (NOW() = jetzt)
    const [sessions] = await pool.execute(
        'DELETE FROM sessions WHERE expires_at < NOW()'
    );

    // Links löschen, die älter als 1 Tag sind UND (benutzt ODER abgelaufen)
    const [links] = await pool.execute(
        `DELETE FROM magic_links
         WHERE created_at < NOW() - INTERVAL 1 DAY
           AND (used_at IS NOT NULL OR expires_at < NOW())`
    );

    // Zurückgeben, wie viele Zeilen gelöscht wurden
    return { sessions: sessions.affectedRows, links: links.affectedRows };
}

// Diese Funktion startet das automatische Aufräumen
export function startCleanup() {
    // Einmal sofort aufräumen (bei einem Fehler nur ausgeben, nicht abstürzen)
    cleanupExpired().catch(console.error);

    // Danach alle 1 Stunde wieder aufräumen
    setInterval(() => cleanupExpired().catch(console.error), INTERVAL_MS);
}
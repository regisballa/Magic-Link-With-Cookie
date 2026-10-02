// Abgelaufene Sessions und Magic Links aus der DB entfernen
import pool from './database.js';

const INTERVAL_MS = 60 * 60 * 1000; // jede Stunde

export async function cleanupExpired() {
    const [sessions] = await pool.execute(
        'DELETE FROM sessions WHERE expires_at < NOW()'
    );

    // Benutzte oder abgelaufene Links, die älter als 24 Stunden sind
    const [links] = await pool.execute(
        `DELETE FROM magic_links
         WHERE created_at < NOW() - INTERVAL 1 DAY
           AND (used_at IS NOT NULL OR expires_at < NOW())`
    );

    return { sessions: sessions.affectedRows, links: links.affectedRows };
}

// Beim Serverstart einmal laufen lassen, dann stündlich
export function startCleanup() {
    cleanupExpired().catch(console.error);
    setInterval(() => cleanupExpired().catch(console.error), INTERVAL_MS);
}
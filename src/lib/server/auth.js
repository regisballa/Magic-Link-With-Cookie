// Magic-Link- und Session-Verwaltung

// Datenbankverbindung aus database.js holen
import pool from './database.js';

// randomBytes: erzeugt zufällige Bytes (für Tokens), createHash: macht Hashes
import { randomBytes, createHash } from 'crypto';

// Wie lange ist ein Magic Link gültig? 15 Minuten
const MAGIC_LINK_TTL_MIN = 15;

// Wie lange ist eine Session gültig? 7 Tage
const SESSION_TTL_DAYS = 7;

// Hilfsfunktion: macht aus einem Text einen SHA-256-Hash (64 Zeichen, nicht umkehrbar)
// Alles, was in die Datenbank kommt, wird vorher gehasht
function sha256(value) {
    return createHash('sha256').update(value).digest('hex');
}

// Hilfsfunktion: gibt den Zeitpunkt "jetzt plus X Minuten" zurück
function inMinutes(min) {
    return new Date(Date.now() + min * 60 * 1000);
}

// Hilfsfunktion: gibt den Zeitpunkt "jetzt plus X Tage" zurück
function inDays(days) {
    return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

// ---------- Magic Links ----------
 
// Neuen Magic Link erzeugen. Rückgabe ist der Klartext-Token für die Mail.
// purpose: 'login' (einloggen) oder 'activation' (Konto bestätigen)
export async function createMagicLink(userId, purpose = 'login') {
    // 32 zufällige Bytes als Text: niemand kann den Token erraten
    const token = randomBytes(32).toString('base64url');
    
    // Vom Token einen Hash machen, nur der Hash kommt in die Datenbank
    const tokenHash = sha256(token);

    // Ablaufzeit berechnen
    const expiresAt = inMinutes(MAGIC_LINK_TTL_MIN);

    // Link in der Datenbank speichern (die ? werden sicher durch die Werte ersetzt)
    await pool.execute(
        'INSERT INTO magic_links (user_id, token_hash, purpose, expires_at) VALUES (?, ?, ?, ?)',
        [userId, tokenHash, purpose, expiresAt]
    );

    // Nur hier existiert der Klartext-Token, in der Datenbank steht nur der Hash
    return token;
}

// Token aus der URL prüfen und sofort entwerten. Rückgabe ist der User oder null.
export async function consumeMagicLink(token, purpose = 'login') {
    // Kein Token in der URL? Dann ist der Link ungültig
    if (!token) return null;
    
    // Den Token hashen, denn nur der Hash steht in der Datenbank
    const tokenHash = sha256(token);


    // Suche einen Link, der passt, noch nicht benutzt ist und noch nicht abgelaufen ist
    const [rows] = await pool.execute(
        `SELECT id, user_id
         FROM magic_links
         WHERE token_hash = ? AND purpose = ? AND used_at IS NULL AND expires_at > NOW()`,
        [tokenHash, purpose]
    );

    // Den ersten Treffer nehmen (oder undefined, wenn nichts gefunden wurde)
    const link = rows[0];

    // Nichts gefunden? Dann ist der Link ungültig, abgelaufen oder schon benutzt
    if (!link) return null;



    // Einmal-Nutzung: Link als benutzt markieren.
    // "AND used_at IS NULL" prüft nochmal, damit zwei gleichzeitige Klicks
    // den Link nicht doppelt einlösen können
    const [result] = await pool.execute(
        'UPDATE magic_links SET used_at = NOW() WHERE id = ? AND used_at IS NULL',
        [link.id]
    );
    // Wurde keine Zeile geändert, war jemand schneller: Link ungültig
    if (result.affectedRows === 0) return null;

    // Den User zu diesem Link aus der Datenbank laden
    const [users] = await pool.execute(
        'SELECT id, email, name, role FROM users WHERE id = ?',
        [link.user_id]
    );

    // User zurückgeben (oder null, falls er nicht existiert)
    return users[0] ?? null;
}

// Alle offenen Links eines Users entwerten, z.B. bevor ein neuer verschickt wird
export async function invalidateMagicLinks(userId, purpose = 'login') {
    // Alle noch nicht benutzten Links bekommen eine "benutzt"-Zeit und sind damit wertlos
    await pool.execute(
        'UPDATE magic_links SET used_at = NOW() WHERE user_id = ? AND purpose = ? AND used_at IS NULL',
        [userId, purpose]
    );
}

// ---------- Sessions ----------

// Neue Session erstellen. Rückgabe ist die Session-ID für das Cookie.
export async function createSession(userId) {
    // Zufällige Session-ID erzeugen
    const sessionId = randomBytes(32).toString('base64url');
    // Ablaufzeit berechnen
    const expiresAt = inDays(SESSION_TTL_DAYS);

    // In der Datenbank steht der Hash, im Cookie die Klartext-ID
    await pool.execute(
        'INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)',
        [sha256(sessionId), userId, expiresAt]
    );
    // Klartext-ID zurückgeben, sie kommt ins Cookie
    return sessionId;
}

// User anhand der Session-ID aus dem Cookie laden
export async function validateSession(sessionId) {
    // Kein Cookie, also nicht eingeloggt
    if (!sessionId) return null;
 
    // Session suchen (über den Hash) und gleich den passenden User dazu laden.
    // Die Session muss noch gültig sein (expires_at in der Zukunft)
    const [rows] = await pool.execute(
        `SELECT u.id, u.email, u.name, u.role
         FROM sessions s
         JOIN users u ON s.user_id = u.id
         WHERE s.id = ? AND s.expires_at > NOW()`,
        [sha256(sessionId)]
    );
    // User zurückgeben oder null, wenn keine gültige Session gefunden wurde
    return rows[0] ?? null;
}
 
// Session löschen beim Logout
export async function invalidateSession(sessionId) {
    // Ohne Session-ID gibt es nichts zu löschen
    if (!sessionId) return;
    // Die Session über ihren Hash aus der Datenbank löschen
    await pool.execute('DELETE FROM sessions WHERE id = ?', [sha256(sessionId)]);
}
 
// ---------- User ----------
 
// User per E-Mail suchen
export async function findUserByEmail(email) {
    const [rows] = await pool.execute(
        'SELECT id, email, name, role, email_verified_at FROM users WHERE email = ?',
        [email]
    );
    // User zurückgeben oder null, wenn es die E-Mail nicht gibt
    return rows[0] ?? null;
}
 
// E-Mail als bestätigt markieren, nach dem Klick auf den Aktivierungslink
export async function markEmailVerified(userId) {
    // Nur setzen, wenn die Mail noch nicht bestätigt war
    await pool.execute(
        'UPDATE users SET email_verified_at = NOW() WHERE id = ? AND email_verified_at IS NULL',
        [userId]
    );
}
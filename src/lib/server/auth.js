// Magic-Link- und Session-Verwaltung
// Datenverbindung importieren
import pool from './database.js';
// randomBytes für unratbare Tokens, createHash zum Hashen importieren
import { randomBytes, createHash } from 'crypto';

// Gültigkeitsdauern an einer Stelle
const MAGIC_LINK_TTL_MIN = 15;
const SESSION_TTL_DAYS = 7;

// Hilfsfunktion: alles was in die DB geht, wird vorher gehasht
function sha256(value) {
    return createHash('sha256').update(value).digest('hex');
}

// Hilfsfunktion: Ablaufzeitpunkt als Date
function inMinutes(min) {
    return new Date(Date.now() + min * 60 * 1000);
}

function inDays(days) {
    return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

// ---------- Magic Links ----------

// Neuen Magic Link erzeugen, Rückgabe ist der Klartext-Token für die Mail
// purpose: 'login' oder 'activation'
export async function createMagicLink(userId, purpose = 'login') {
    const token = randomBytes(32).toString('base64url');
    const tokenHash = sha256(token);
    const expiresAt = inMinutes(MAGIC_LINK_TTL_MIN);

    await pool.execute(
        'INSERT INTO magic_links (user_id, token_hash, purpose, expires_at) VALUES (?, ?, ?, ?)',
        [userId, tokenHash, purpose, expiresAt]
    );

    // Nur hier existiert der Klartext-Token, in der DB steht nur der Hash
    return token;
}

// Token aus der URL prüfen und sofort entwerten, Rückgabe ist der User oder null
export async function consumeMagicLink(token, purpose = 'login') {
    if (!token) return null;
    const tokenHash = sha256(token);

    const [rows] = await pool.execute(
        `SELECT id, user_id
         FROM magic_links
         WHERE token_hash = ? AND purpose = ? AND used_at IS NULL AND expires_at > NOW()`,
        [tokenHash, purpose]
    );
    const link = rows[0];
    if (!link) return null;

    // Einmal-Nutzung: das UPDATE prüft nochmal auf used_at IS NULL,
    // damit zwei parallele Klicks den Link nicht doppelt einlösen
    const [result] = await pool.execute(
        'UPDATE magic_links SET used_at = NOW() WHERE id = ? AND used_at IS NULL',
        [link.id]
    );
    if (result.affectedRows === 0) return null;

    const [users] = await pool.execute(
        'SELECT id, email, name, role FROM users WHERE id = ?',
        [link.user_id]
    );
    return users[0] ?? null;
}

// Alle offenen Links eines Users entwerten, z.B. bevor ein neuer verschickt wird
export async function invalidateMagicLinks(userId, purpose = 'login') {
    await pool.execute(
        'UPDATE magic_links SET used_at = NOW() WHERE user_id = ? AND purpose = ? AND used_at IS NULL',
        [userId, purpose]
    );
}

// ---------- Sessions ----------

// Neue Session erstellen, Rückgabe ist die Session-ID fürs Cookie
export async function createSession(userId) {
    const sessionId = randomBytes(32).toString('base64url');
    const expiresAt = inDays(SESSION_TTL_DAYS);

    // In der DB steht der Hash, im Cookie die Klartext-ID
    await pool.execute(
        'INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)',
        [sha256(sessionId), userId, expiresAt]
    );
    return sessionId;
}

// User anhand der Session-ID aus dem Cookie laden
export async function validateSession(sessionId) {
    // Kein Cookie, also nicht eingeloggt
    if (!sessionId) return null;

    const [rows] = await pool.execute(
        `SELECT u.id, u.email, u.name, u.role
         FROM sessions s
         JOIN users u ON s.user_id = u.id
         WHERE s.id = ? AND s.expires_at > NOW()`,
        [sha256(sessionId)]
    );
    return rows[0] ?? null;
}

// Session löschen beim Logout
export async function invalidateSession(sessionId) {
    if (!sessionId) return;
    await pool.execute('DELETE FROM sessions WHERE id = ?', [sha256(sessionId)]);
}

// ---------- User ----------

// User per E-Mail suchen
export async function findUserByEmail(email) {
    const [rows] = await pool.execute(
        'SELECT id, email, name, role, email_verified_at FROM users WHERE email = ?',
        [email]
    );
    return rows[0] ?? null;
}

// E-Mail als bestätigt markieren, nach dem Klick auf den Aktivierungslink
export async function markEmailVerified(userId) {
    await pool.execute(
        'UPDATE users SET email_verified_at = NOW() WHERE id = ? AND email_verified_at IS NULL',
        [userId]
    );
}
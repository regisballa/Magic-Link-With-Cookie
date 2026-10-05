// Login-Seite: E-Mail entgegennehmen und Magic Link verschicken

// "fail" gibt dem Formular einen Fehler zurück, "redirect" leitet auf eine andere Seite um
import { fail } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
// Funktionen aus auth.js: User suchen, Link erzeugen, alte Links entwerten
import { findUserByEmail, createMagicLink, invalidateMagicLinks } from '$lib/server/auth.js';
// Funktion zum Verschicken der Login-Mail
import { sendLoginMail } from '$lib/server/mail.js';
// Funktion gegen zu viele Anfragen
import { checkRateLimit } from '$lib/server/ratelimit.js';

// "load" läuft, wenn die Seite geöffnet wird
export function load({ locals }) {
    // Wer schon eingeloggt ist, braucht keinen Login
    if (locals.user) throw redirect(303, '/dashboard');
}

// "actions" läuft, wenn das Formular abgeschickt wird (POST)
export const actions = {
    default: async ({ request }) => {
        // Die Formulardaten lesen
        const data = await request.formData();
        // E-Mail holen, in Text umwandeln, Leerzeichen entfernen, klein schreiben
        const email = String(data.get('email') ?? '').trim().toLowerCase();

        // Ist es überhaupt eine E-Mail (mit @)? Wenn nicht, Fehler zurückgeben
        if (!email.includes('@')) {
            return fail(400, { error: 'Bitte gib eine gültige E-Mail-Adresse ein.' });
        }

        // Nicht mehr als 3 Anfragen pro Adresse in 15 Minuten
        if (!checkRateLimit(email)) {
            return fail(429, { error: 'Zu viele Versuche. Bitte warte 15 Minuten.' });
        }

        // Den User in der Datenbank suchen
        const user = await findUserByEmail(email);

        // Nur wenn der User existiert, wird wirklich eine Mail verschickt.
        // Die Antwort ist trotzdem immer gleich, damit niemand herausfinden
        // kann, welche Adressen registriert sind (User-Enumeration).
        if (user) {
            // Alte offene Login-Links ungültig machen
            await invalidateMagicLinks(user.id, 'login');
            // Neuen Link erzeugen
            const token = await createMagicLink(user.id, 'login');
            // Mail mit dem Link verschicken
            await sendLoginMail(user.email, token);
        }

        // Immer "gesendet" melden, egal ob es den User gibt oder nicht
        return { sent: true };
    }
};
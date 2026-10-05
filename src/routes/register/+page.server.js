// Registrierung: User anlegen und Aktivierungs-Link schicken

// "fail" gibt dem Formular einen Fehler zurück, "redirect" leitet auf eine andere Seite um
import { fail, redirect } from '@sveltejs/kit';
// Die Datenbankverbindung
import pool from '$lib/server/database.js';
// Funktionen aus auth.js: User suchen und Link erzeugen
import { findUserByEmail, createMagicLink } from '$lib/server/auth.js';
// Funktion zum Verschicken der Aktivierungsmail
import { sendActivationMail } from '$lib/server/mail.js';

// "load" läuft, wenn die Seite geöffnet wird
export function load({ locals }) {
    // Wer schon eingeloggt ist, braucht keine Registrierung
    if (locals.user) throw redirect(303, '/dashboard');
}

// "actions" läuft, wenn das Formular abgeschickt wird (POST)
export const actions = {
    default: async ({ request }) => {
        // Die Formulardaten lesen
        const data = await request.formData();
        // E-Mail holen, in Text umwandeln, Leerzeichen entfernen, klein schreiben
        const email = String(data.get('email') ?? '').trim().toLowerCase();
        // Name holen, in Text umwandeln, Leerzeichen entfernen
        const name = String(data.get('name') ?? '').trim();

        // Ist die E-Mail gültig (mit @) und der Name mindestens 2 Zeichen lang?
        if (!email.includes('@') || name.length < 2) {
            return fail(400, { error: 'Bitte Name und gültige E-Mail eingeben.' });
        }

        // Gibt es diese E-Mail schon in der Datenbank?
        const existing = await findUserByEmail(email);

        // Existiert der User schon, legen wir keinen neuen an.
        // Die Antwort bleibt trotzdem gleich, damit niemand
        // registrierte Adressen durchprobieren kann.
        if (!existing) {
            // Neuen User in der Datenbank speichern
            const [result] = await pool.execute(
                'INSERT INTO users (email, name) VALUES (?, ?)',
                [email, name]
            );
            // Aktivierungs-Link für den neuen User erzeugen (insertId ist seine neue ID)
            const token = await createMagicLink(result.insertId, 'activation');
            // Mail mit dem Link verschicken
            await sendActivationMail(email, token);
        }

        // Immer "gesendet" melden, egal ob es den User schon gab oder nicht
        return { sent: true };
    }
};
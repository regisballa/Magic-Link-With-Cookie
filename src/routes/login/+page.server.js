// Login-Seite: E-Mail entgegennehmen und Magic Link verschicken
import { fail } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { findUserByEmail, createMagicLink, invalidateMagicLinks } from '$lib/server/auth.js';
import { sendLoginMail } from '$lib/server/mail.js';
import { checkRateLimit } from '$lib/server/ratelimit.js';

export function load({ locals }) {
    // Wer schon eingeloggt ist, braucht keinen Login
    if (locals.user) throw redirect(303, '/dashboard');
}

export const actions = {
    default: async ({ request }) => {
        const data = await request.formData();
        const email = String(data.get('email') ?? '').trim().toLowerCase();

        if (!email.includes('@')) {
            return fail(400, { error: 'Bitte gib eine gültige E-Mail-Adresse ein.' });
        }

        // Nicht mehr als 3 Anfragen pro Adresse in 15 Minuten
        if (!checkRateLimit(email)) {
            return fail(429, { error: 'Zu viele Versuche. Bitte warte 15 Minuten.' });
        }

        const user = await findUserByEmail(email);

        // Nur wenn der User existiert, wird wirklich eine Mail verschickt.
        // Die Antwort ist trotzdem immer gleich, damit niemand herausfinden
        // kann, welche Adressen registriert sind (User-Enumeration).
        if (user) {
            await invalidateMagicLinks(user.id, 'login');
            const token = await createMagicLink(user.id, 'login');
            await sendLoginMail(user.email, token);
        }

        return { sent: true };
    }
};
// Registrierung: User anlegen und Aktivierungs-Link schicken
import { fail, redirect } from '@sveltejs/kit';
import pool from '$lib/server/database.js';
import { findUserByEmail, createMagicLink } from '$lib/server/auth.js';
import { sendActivationMail } from '$lib/server/mail';

export function load({ locals }) {
    if (locals.user) throw redirect(303, '/dashboard')
}

export const actions = {
    default: async ({ request }) => {
        const data = await request.formData();
        const email = String(data.get('email') ?? '').trim().toLowerCase();
        const name = String(data.get('name') ?? '').trim();

        if (!email.includes('@') || name.length < 2) {
            return fail(400, { error: 'Bitte Name und gültige E-Mail eingeben.' })
        }

        const existing = await findUserByEmail(email);

        // Existiert der User schon, legen wir keinen neuen an.
        // Die Antwort bleibt trotzdem gleich, damit niemand
        // registrierte Adressen durchprobieren kann.
        if (!existing) {
            const [result] = await pool.execute(
                'INSERT INTO users (email, name) VALUES (?, ?)',
                [email, name]
            );
            const token = await createMagicLink(result.insertId, 'activation');
            await sendActivationMail(email, token);
        }

        return { sent: true };
    }
};
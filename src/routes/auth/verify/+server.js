// Magic Link einlösen: Token prüfen, Session anlegen, Cookie setzen
import { redirect } from '@sveltejs/kit';
import { consumeMagicLink, createSession, markEmailVerified } from '$lib/server/auth.js';
import { dev } from '$app/environment';

export async function GET({ url, cookies }) {
    const token = url.searchParams.get('token');

    // Token prüfen und sofort entwerten
    const user = await consumeMagicLink(token, 'login');
    if (!user) {
        throw redirect(303, '/login?error=invalid');
    }

    // Wer sich per Link einloggt, hat seine Mail nachweislich
    await markEmailVerified(user.id);

    const sessionId = await createSession(user.id);

    cookies.set('session', sessionId, {
        path: '/',
        httpOnly: true,   // kein Zugriff über JavaScript, schützt vor XSS
        secure: !dev,     // nur über HTTPS, in der Entwicklung aus
        sameSite: 'lax',  // schützt vor CSRF
        maxAge: 60 * 60 * 24 * 7
    });

    throw redirect(303, '/dashboard');
}
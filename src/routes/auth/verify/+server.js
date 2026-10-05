// Magic Link einlösen: Token prüfen, Session anlegen, Cookie setzen

// "redirect" leitet den User auf eine andere Seite um
import { redirect } from '@sveltejs/kit';
// Funktionen aus auth.js: Link einlösen, Session erstellen, Mail als bestätigt markieren
import { consumeMagicLink, createSession, markEmailVerified } from '$lib/server/auth.js';
// "dev" ist true, wenn wir lokal entwickeln, und false auf dem echten Server
import { dev } from '$app/environment';

// GET: wird aufgerufen, wenn der User auf den Link in der Mail klickt
export async function GET({ url, cookies }) {
    // Den Token aus der URL lesen (?token=...)
    const token = url.searchParams.get('token');

    // Token prüfen und sofort entwerten (nur einmal nutzbar)
    const user = await consumeMagicLink(token, 'login');
    // Ungültig, abgelaufen oder schon benutzt? Zurück zum Login mit Fehlermeldung
    if (!user) {
        throw redirect(303, '/login?error=invalid');
    }

    // Wer sich per Link einloggt, hat seine Mail nachweislich
    await markEmailVerified(user.id);

    // Neue Session in der Datenbank anlegen
    const sessionId = await createSession(user.id);

    // Cookie mit der Session-ID im Browser setzen
    cookies.set('session', sessionId, {
        path: '/',          // Das Cookie gilt für die ganze Website
        httpOnly: true,     // JavaScript kann es nicht lesen, schützt vor XSS
        secure: !dev,       // Nur über HTTPS senden, lokal ist es aus
        sameSite: 'lax',    // Wird nicht von fremden Seiten mitgeschickt, schützt vor CSRF
        maxAge: 60 * 60 * 24 * 7  // Lebensdauer in Sekunden: 7 Tage
    });

    // Eingeloggt: weiter zum Dashboard
    throw redirect(303, '/dashboard');
}
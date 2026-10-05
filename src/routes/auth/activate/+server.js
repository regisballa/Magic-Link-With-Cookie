// Aktivierungs-Link einlösen: Mail bestätigen und direkt einloggen

// "redirect" leitet den User auf eine andere Seite um
import { redirect } from '@sveltejs/kit';
// Funktionen aus auth.js: Link einlösen, Session erstellen, Mail als bestätigt markieren
import { consumeMagicLink, createSession, markEmailVerified } from '$lib/server/auth.js';
// "dev" ist true, wenn wir lokal entwickeln, und false auf dem echten Server
import { dev } from '$app/environment';

// GET: wird aufgerufen, wenn der User auf den Aktivierungslink in der Mail klickt
export async function GET({ url, cookies }) {
    // Den Token aus der URL lesen (?token=...)
    const token = url.searchParams.get('token');

    // Token prüfen und entwerten. Hier mit dem Zweck 'activation'
    const user = await consumeMagicLink(token, 'activation');
    // Ungültig, abgelaufen oder schon benutzt? Zurück zum Login mit Fehlermeldung
    if (!user) {
        throw redirect(303, '/login?error=invalid');
    }

    // Die E-Mail ist jetzt bestätigt: Zeitpunkt in der Datenbank speichern
    await markEmailVerified(user.id);

    // Neue Session in der Datenbank anlegen
    const sessionId = await createSession(user.id);

    // Cookie mit der Session-ID im Browser setzen
    cookies.set('session', sessionId, {
        path: '/',          // Das Cookie gilt für die ganze Website
        httpOnly: true,     // JavaScript kann es nicht lesen
        secure: !dev,       // Nur über HTTPS, lokal aus
        sameSite: 'lax',    // Schutz vor CSRF
        maxAge: 60 * 60 * 24 * 7  // 7 Tage in Sekunden
    });

    // Konto bestätigt und eingeloggt: weiter zum Dashboard
    throw redirect(303, '/dashboard');
}
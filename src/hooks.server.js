// Läuft bei jedem Request, bevor die Seite geladen wird
import { validateSession } from '$lib/server/auth.js';

export async function handle({ event, resolve }) {
    // Session-ID aus dem Cookie lesen
    const sessionId = event.cookies.get('session');

    // User laden, wenn die Session noch gültig ist
    event.locals.user = await validateSession(sessionId);

    // Abgelaufenes oder ungültiges Cookie aufräumen
    if (sessionId && !event.locals.user) {
        event.cookies.delete('session', { path: '/' });
    }

    return resolve(event);
}
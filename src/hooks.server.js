// Diese Datei läuft bei jedem Request, bevor die Seite geladen wird

// Funktion zum Prüfen der Session aus auth.js holen
import { validateSession } from '$lib/server/auth.js';
// Funktion zum Aufräumen aus cleanup.js holen
import { startCleanup } from '$lib/server/cleanup.js';

// Aufräumen beim Serverstart starten (läuft danach jede Stunde)
startCleanup();

// "handle" wird von SvelteKit bei jedem Request automatisch aufgerufen
export async function handle({ event, resolve }) {
    // Session-ID aus dem Cookie lesen (undefined, wenn es kein Cookie gibt)
    const sessionId = event.cookies.get('session');

    // User laden, wenn die Session noch gültig ist, sonst null.
    // event.locals ist ein Speicher, den alle Seiten und Routen lesen können
    event.locals.user = await validateSession(sessionId);

    // Es gibt ein Cookie, aber die Session ist abgelaufen oder ungültig?
    // Dann das alte Cookie löschen
    if (sessionId && !event.locals.user) {
        event.cookies.delete('session', { path: '/' });
    }

    // Den Request normal weiterlaufen lassen und die Antwort zurückgeben
    return resolve(event);
}
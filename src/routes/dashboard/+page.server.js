// Geschütztes Dashboard: nur für eingeloggte User

// "redirect" leitet den User auf eine andere Seite um
import { redirect } from '@sveltejs/kit';

// "load" läuft, bevor die Seite angezeigt wird
export function load({ locals }) {
    // locals.user wurde in hooks.server.js gesetzt. Ist es leer, ist niemand eingeloggt
    if (!locals.user) {
        // Nicht eingeloggt: zurück zum Login
        throw redirect(303, '/login');
    }

    // Eingeloggt: die User-Daten an die Seite weitergeben
    return { user: locals.user };
}
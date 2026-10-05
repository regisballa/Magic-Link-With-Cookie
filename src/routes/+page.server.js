// Startseite: zeigt je nach Login-Status andere Buttons

// "load" läuft, bevor die Seite angezeigt wird
export function load({ locals }) {
    // locals.user wurde in hooks.server.js gesetzt (leer, wenn niemand eingeloggt ist)
    // Wir geben es an die Seite weiter, damit sie die richtigen Buttons zeigen kann
    return { user: locals.user };
}
// Logout: Session löschen und Cookie entfernen

// "redirect" leitet den User auf eine andere Seite um
import { redirect } from '@sveltejs/kit';
// Funktion aus auth.js, die die Session in der Datenbank löscht
import { invalidateSession } from '$lib/server/auth.js';

// POST: wird aufgerufen, wenn der User auf "Logout" klickt
export async function POST({ cookies }) {
    // Die Session-ID aus dem Cookie lesen
    const sessionId = cookies.get('session');

    // Die Session in der Datenbank löschen
    await invalidateSession(sessionId);
    // Das Cookie im Browser löschen
    cookies.delete('session', { path: '/' });

    // Zurück zum Login
    throw redirect(303, '/login');
}
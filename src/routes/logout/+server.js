// Logout: Session löschen und Cookie entfernen
import { redirect } from '@sveltejs/kit';
import { invalidateSession } from '$lib/server/auth.js';

export async function POST({ cookies }) {
    const sessionId = cookies.get('session');

    await invalidateSession(sessionId);
    cookies.delete('session', { path: '/' });

    throw redirect(303, '/login');
}
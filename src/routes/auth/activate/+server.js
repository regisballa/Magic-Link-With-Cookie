// Aktivierungs-Link einlösen: Mail bestätigen und direkt einloggen
import { redirect } from '@sveltejs/kit';
import { consumeMagicLink, createSession, markEmailVerified } from '$lib/server/auth.js';
import { dev } from '$app/environment';

export async function GET({ url, cookies }) {
    const token = url.searchParams.get('token');

    const user = await consumeMagicLink(token, 'activation');
    if (!user) {
        throw redirect(303, '/login?error=invalid');
    }

    await markEmailVerified(user.id);

    const sessionId = await createSession(user.id);

    cookies.set('session', sessionId, {
        path: '/',
        httpOnly: true,
        secure: !dev,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7
    });

    throw redirect(303, '/dashboard');
}
// Mailversand für Magic Links
import nodemailer from 'nodemailer';
import { env } from '$env/dynamic/private';

const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: Number(env.SMTP_PORT),
    auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS
    }
});

// Login-Link verschicken
export async function sendLoginMail(email, token) {
    const url = `${env.APP_URL}/auth/verify?token=${token}`;

    await transporter.sendMail({
        from: env.MAIL_FROM,
        to: email,
        subject: 'Dein Login-Link',
        text: `Klicke hier, um dich einzuloggen:\n\n${url}\n\nDer Link ist 15 Minuten gültig und funktioniert nur einmal.`,
        html: `
            <p>Klicke auf den Button, um dich einzuloggen:</p>
            <p><a href="${url}">Jetzt einloggen</a></p>
            <p>Der Link ist 15 Minuten gültig und funktioniert nur einmal.</p>
            <p>Falls du das nicht angefordert hast, ignoriere diese Mail.</p>
        `
    });
}

// Aktivierungs-Link nach dem Registrieren
export async function sendActivationMail(email, token) {
    const url = `${env.APP_URL}/auth/activate?token=${token}`;

    await transporter.sendMail({
        from: env.MAIL_FROM,
        to: email,
        subject: 'Konto bestätigen',
        text: `Bestätige dein Konto:\n\n${url}\n\nDer Link ist 15 Minuten gültig.`,
        html: `
            <p>Bestätige dein Konto:</p>
            <p><a href="${url}">Konto bestätigen</a></p>
            <p>Der Link ist 15 Minuten gültig.</p>
        `
    });
}
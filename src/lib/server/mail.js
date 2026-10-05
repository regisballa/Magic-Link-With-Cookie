// Mailversand für Magic Links

// Nodemailer ist die Bibliothek, die E-Mails verschickt
import nodemailer from 'nodemailer';
// Die Werte aus der .env-Datei lesen
import { env } from '$env/dynamic/private';

// Verbindung zum Mail-Server (SMTP2GO) einrichten
const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,           // Adresse des Mail-Servers
    port: Number(env.SMTP_PORT),   // Port, als Zahl (aus der .env kommt es als Text)
    auth: {
        user: env.SMTP_USER,       // SMTP-Benutzername
        pass: env.SMTP_PASS        // SMTP-Passwort
    }
});

// Login-Link verschicken
export async function sendLoginMail(email, token) {
    // Den Link bauen: Basis-URL + Pfad + Token
    const url = `${env.APP_URL}/auth/verify?token=${token}`;

    await transporter.sendMail({
        from: env.MAIL_FROM,       // Absender (muss bei SMTP2GO verifiziert sein)
        to: email,                 // Empfänger: die Adresse, die der User eingegeben hat
        subject: 'Dein Login-Link',// Betreff
        // Text-Version, falls das Mailprogramm kein HTML zeigt
        text: `Klicke hier, um dich einzuloggen:\n\n${url}\n\nDer Link ist 15 Minuten gültig und funktioniert nur einmal.`,
        // HTML-Version mit klickbarem Link
        html: `
            <p>Klicke auf den Button, um dich einzuloggen:</p>
            <p><a href="${url}">Jetzt einloggen</a></p>
            <p>Der Link ist 15 Minuten gültig und funktioniert nur einmal.</p>
            <p>Falls du das nicht angefordert hast, ignoriere diese Mail.</p>
        `
    });
}

// Aktivierungs-Link nach dem Registrieren verschicken
export async function sendActivationMail(email, token) {
    // Link zur Aktivierungs-Route
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
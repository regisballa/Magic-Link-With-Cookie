// Startseite: zeigt je nach Login-Status andere Buttons
export function load({ locals }) {
    return { user: locals.user };
}
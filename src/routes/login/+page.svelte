<script>
    // enhance schickt das Formular im Hintergrund ab, ohne die Seite neu zu laden
    import { enhance } from '$app/forms';
    // page enthält Infos über die aktuelle Seite, z.B. die URL
    import { page } from '$app/state';

    // form enthält die Antwort vom Server (z.B. { sent: true } oder { error: '...' })
    let { form } = $props();
    // loading ist true, solange das Formular gesendet wird
    let loading = $state(false);
</script>

<!-- Ganze Seite: Inhalt in der Mitte, heller Hintergrund -->
<div class="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
    <div class="w-full max-w-sm">
        <!-- Wurde die Mail schon gesendet? Dann zeigen wir nur die Bestätigung -->
        {#if form?.sent}
            <div class="text-center">
                <h1 class="text-2xl font-semibold text-neutral-900">Check deine Mails</h1>
                <p class="mt-3 text-sm text-neutral-500">
                    Falls die Adresse bei uns registriert ist, haben wir dir einen Login-Link
                    geschickt. Er ist 15 Minuten gültig.
                </p>
            </div>
        {:else}
            <!-- Sonst zeigen wir das Login-Formular -->
            <h1 class="text-2xl font-semibold text-neutral-900">Einloggen</h1>
            <p class="mt-2 text-sm text-neutral-500">
                Kein Passwort nötig. Wir schicken dir einen Link per Mail.
            </p>

            <!-- Steht ?error=invalid in der URL? Dann war der Link ungültig, abgelaufen oder benutzt -->
            {#if page.url.searchParams.get('error') === 'invalid'}
                <p class="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                    Der Link ist abgelaufen oder wurde schon benutzt. Fordere einen neuen an.
                </p>
            {/if}

            <!-- Das Formular wird per POST an den Server geschickt (+page.server.js) -->
            <form
                method="POST"
                class="mt-8 space-y-4"
                use:enhance={() => {
                    // Beim Absenden: Button auf "lädt" stellen
                    loading = true;
                    return async ({ update }) => {
                        // Auf die Antwort vom Server warten und die Seite aktualisieren
                        await update();
                        // Fertig: Button wieder normal
                        loading = false;
                    };
                }}
            >
                <div>
                    <!-- Beschriftung des Eingabefelds -->
                    <label for="email" class="block text-sm font-medium text-neutral-700">
                        E-Mail
                    </label>
                    <!-- Eingabefeld für die E-Mail, "required" heißt Pflichtfeld -->
                    <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        autocomplete="email"
                        placeholder="du@beispiel.com"
                        class="mt-1.5 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm
                               outline-none transition focus:border-neutral-900"
                    />
                </div>

                <!-- Fehlermeldung vom Server anzeigen, falls es eine gibt -->
                {#if form?.error}
                    <p class="text-sm text-red-600">{form.error}</p>
                {/if}

                <!-- Absende-Button, während des Sendens deaktiviert -->
                <button
                    type="submit"
                    disabled={loading}
                    class="w-full rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium
                           text-white transition hover:bg-neutral-700 disabled:opacity-50"
                >
                    {loading ? 'Wird gesendet...' : 'Login-Link senden'}
                </button>
            </form>

            <!-- Link zur Registrierung für neue User -->
            <p class="mt-6 text-center text-sm text-neutral-500">
                Noch kein Konto?
                <a href="/register" class="text-neutral-900 underline">Registrieren</a>
            </p>
        {/if}
    </div>
</div>
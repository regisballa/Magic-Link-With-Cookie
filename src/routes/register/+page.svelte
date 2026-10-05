<script>
    // enhance schickt das Formular im Hintergrund ab, ohne die Seite neu zu laden
    import { enhance } from '$app/forms';

    // form enthält die Antwort vom Server (z.B. { sent: true } oder { error: '...' })
    let { form } = $props();
    // loading ist true, solange das Formular gesendet wird
    let loading = $state(false);
</script>

<!-- Ganze Seite: Inhalt in der Mitte, heller Hintergrund -->
<div class="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
    <div class="w-full max-w-sm">
        <!-- Wurde die Aktivierungsmail schon gesendet? Dann zeigen wir nur die Bestätigung -->
        {#if form?.sent}
            <div class="text-center">
                <h1 class="text-2xl font-semibold text-neutral-900">Fast geschafft</h1>
                <p class="mt-3 text-sm text-neutral-500">
                    Wir haben dir eine Mail geschickt. Klicke auf den Link darin, um dein
                    Konto zu bestätigen. Der Link ist 15 Minuten gültig.
                </p>
            </div>
        {:else}
            <!-- Sonst zeigen wir das Registrierungs-Formular -->
            <h1 class="text-2xl font-semibold text-neutral-900">Konto erstellen</h1>
            <p class="mt-2 text-sm text-neutral-500">
                Du brauchst kein Passwort. Wir melden dich per Link an.
            </p>

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
                    <!-- Beschriftung des Namensfelds -->
                    <label for="name" class="block text-sm font-medium text-neutral-700">
                        Name
                    </label>
                    <!-- Eingabefeld für den Namen -->
                    <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        autocomplete="name"
                        placeholder="Dein Name"
                        class="mt-1.5 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm
                               outline-none transition focus:border-neutral-900"
                    />
                </div>

                <div>
                    <!-- Beschriftung des E-Mail-Felds -->
                    <label for="email" class="block text-sm font-medium text-neutral-700">
                        E-Mail
                    </label>
                    <!-- Eingabefeld für die E-Mail, prüft automatisch das E-Mail-Format -->
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
                    {loading ? 'Wird gesendet...' : 'Konto erstellen'}
                </button>
            </form>

            <!-- Link zum Login für User, die schon ein Konto haben -->
            <p class="mt-6 text-center text-sm text-neutral-500">
                Schon ein Konto?
                <a href="/login" class="text-neutral-900 underline">Einloggen</a>
            </p>
        {/if}
    </div>
</div>
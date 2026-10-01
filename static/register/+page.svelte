<script>
    import { enhance } from '$app/forms';

    let { form } = $props();
    let loading = $state(false);
</script>

<div class="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
    <div class="w-full max-w-sm">
        {#if form?.sent}
            <div class="text-center">
                <h1 class="text-2xl font-semibold text-neutral-900">Fast geschafft</h1>
                <p class="mt-3 text-sm text-neutral-500">
                    Wir haben dir eine Mail geschickt. Klicke auf den Link darin, um dein
                    Konto zu bestätigen. Der Link ist 15 Minuten gültig.
                </p>
            </div>
        {:else}
            <h1 class="text-2xl font-semibold text-neutral-900">Konto erstellen</h1>
            <p class="mt-2 text-sm text-neutral-500">
                Du brauchst kein Passwort. Wir melden dich per Link an.
            </p>

            <form
                method="POST"
                class="mt-8 space-y-4"
                use:enhance={() => {
                    loading = true;
                    return async ({ update }) => {
                        await update();
                        loading = false;
                    };
                }}
            >
                <div>
                    <label for="name" class="block text-sm font-medium text-neutral-700">
                        Name
                    </label>
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
                    <label for="email" class="block text-sm font-medium text-neutral-700">
                        E-Mail
                    </label>
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

                {#if form?.error}
                    <p class="text-sm text-red-600">{form.error}</p>
                {/if}

                <button
                    type="submit"
                    disabled={loading}
                    class="w-full rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium
                           text-white transition hover:bg-neutral-700 disabled:opacity-50"
                >
                    {loading ? 'Wird gesendet...' : 'Konto erstellen'}
                </button>
            </form>

            <p class="mt-6 text-center text-sm text-neutral-500">
                Schon ein Konto?
                <a href="/login" class="text-neutral-900 underline">Einloggen</a>
            </p>
        {/if}
    </div>
</div>
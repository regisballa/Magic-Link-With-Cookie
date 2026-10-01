<script>
    let { data } = $props();
</script>

<div class="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
    <div class="w-full max-w-md text-center">
        <h1 class="text-3xl font-semibold tracking-tight text-neutral-900">
            Magic Link Login
        </h1>
        <p class="mt-3 text-sm text-neutral-500">
            Login ohne Passwort. Du gibst deine E-Mail ein, wir schicken dir einen Link,
            und der Klick darauf meldet dich an.
        </p>

        <div class="mt-8 flex justify-center gap-3">
            {#if data.user}
                <a
                    href="/dashboard"
                    class="rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium
                           text-white transition hover:bg-neutral-700"
                >
                    Zum Dashboard
                </a>
            {:else}
                <a
                    href="/login"
                    class="rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium
                           text-white transition hover:bg-neutral-700"
                >
                    Einloggen
                </a>
                <a
                    href="/register"
                    class="rounded-lg border border-neutral-300 px-4 py-2.5 text-sm
                           font-medium text-neutral-700 transition hover:bg-neutral-100"
                >
                    Konto erstellen
                </a>
            {/if}
        </div>
    </div>
</div>
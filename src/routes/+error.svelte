<script>
    import { page } from '$app/state';
</script>

<div class="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
    <div class="w-full max-w-sm text-center">
        <p class="text-sm font-medium text-neutral-400">{page.status}</p>

        <h1 class="mt-2 text-2xl font-semibold text-neutral-900">
            {#if page.status === 404}
                Seite nicht gefunden
            {:else}
                Etwas ist schiefgelaufen
            {/if}
        </h1>

        <p class="mt-3 text-sm text-neutral-500">
            {page.error?.message ?? 'Bitte versuche es noch einmal.'}
        </p>

        <a
            href="/login"
            class="mt-8 inline-block rounded-lg bg-neutral-900 px-4 py-2.5 text-sm
                   font-medium text-white transition hover:bg-neutral-700"
        >
            Zurück zum Login
        </a>
    </div>
</div>
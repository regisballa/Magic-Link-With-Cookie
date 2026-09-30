<script>
    let { data } = $props();
</script>

<div class="min-h-screen bg-neutral-50">
    <header class="border-b border-neutral-200 bg-white">
        <div class="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
            <span class="text-sm font-semibold text-neutral-900">Dashboard</span>
            <form method="POST" action="/logout">
                <button
                    type="submit"
                    class="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm
                           text-neutral-700 transition hover:bg-neutral-100"
                >
                    Logout
                </button>
            </form>
        </div>
    </header>

    <main class="mx-auto max-w-3xl px-4 py-12">
        <h1 class="text-2xl font-semibold text-neutral-900">
            Hallo {data.user.name}
        </h1>
        <p class="mt-2 text-sm text-neutral-500">
            Du bist eingeloggt, ganz ohne Passwort.
        </p>

        <dl class="mt-8 divide-y divide-neutral-200 rounded-xl border border-neutral-200 bg-white">
            <div class="flex justify-between px-4 py-3 text-sm">
                <dt class="text-neutral-500">E-Mail</dt>
                <dd class="text-neutral-900">{data.user.email}</dd>
            </div>
            <div class="flex justify-between px-4 py-3 text-sm">
                <dt class="text-neutral-500">Rolle</dt>
                <dd class="text-neutral-900">{data.user.role}</dd>
            </div>
        </dl>
    </main>
</div>
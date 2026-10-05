<script>
    // data kommt vom Server (+page.server.js) und enthält die Infos zum eingeloggten User
    let { data } = $props();
</script>

<!-- Ganze Seite mit hellem Hintergrund -->
<div class="min-h-screen bg-neutral-50">
    <!-- Obere Leiste mit Titel und Logout-Button -->
    <header class="border-b border-neutral-200 bg-white">
        <div class="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
            <span class="text-sm font-semibold text-neutral-900">Dashboard</span>
            <!-- Logout: schickt einen POST an /logout, dort wird die Session gelöscht -->
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

    <!-- Hauptbereich der Seite -->
    <main class="mx-auto max-w-3xl px-4 py-12">
        <!-- Begrüßung mit dem Namen des Users -->
        <h1 class="text-2xl font-semibold text-neutral-900">
            Hallo {data.user.name}
        </h1>
        <p class="mt-2 text-sm text-neutral-500">
            Du bist eingeloggt, ganz ohne Passwort.
        </p>

        <!-- Kleine Tabelle mit den Daten des Users -->
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
<script>
    // Diese Werte bekommt die Komponente von außen, wenn man sie benutzt:
    // children: der Text im Button
    // loading: ist true, solange gesendet wird (Button ist dann deaktiviert)
    // variant: Aussehen des Buttons, primary (dunkel) oder secondary (mit Rand)
    // type: Art des Buttons, Standard ist submit (Formular absenden)
    let { children, loading = false, variant = 'primary', type = 'submit' } = $props();

    // Die Farben für die beiden Varianten
    const styles = {
        primary: 'bg-neutral-900 text-white hover:bg-neutral-700',
        secondary: 'border border-neutral-300 text-neutral-700 hover:bg-neutral-100'
    };
</script>

<!-- Der Button, die Farbe kommt aus styles je nach variant -->
<button
    {type}
    disabled={loading}
    class="w-full rounded-lg px-4 py-2.5 text-sm font-medium transition
           disabled:opacity-50 {styles[variant]}"
>
    <!-- Hier wird der Text eingesetzt, der beim Benutzen zwischen den Tags steht -->
    {@render children()}
</button>
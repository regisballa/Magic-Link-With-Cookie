<script>
    // Diese Werte bekommt die Komponente von außen, wenn man sie benutzt:
    // label: Beschriftung über dem Feld
    // name: Name des Felds (so heißt es später im Formular)
    // type: Art des Felds (text, email, ...), Standard ist text
    // placeholder: Hilfetext im leeren Feld
    // required: Pflichtfeld, Standard ist nein
    // autocomplete: Hilfe für das automatische Ausfüllen im Browser
    let { label, name, type = 'text', placeholder = '', required = false, autocomplete } = $props();
</script>

<div>
    <!-- Beschriftung, "for" verbindet sie mit dem Eingabefeld -->
    <label for={name} class="block text-sm font-medium text-neutral-700">
        {label}
    </label>
    <!-- Das Eingabefeld, alle Werte von oben werden hier eingesetzt -->
    <input
        id={name}
        {name}
        {type}
        {placeholder}
        {required}
        {autocomplete}
        class="mt-1.5 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm
               outline-none transition focus:border-neutral-900"
    />
</div>
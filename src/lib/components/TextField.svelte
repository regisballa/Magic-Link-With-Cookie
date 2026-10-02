<script>
    let { label, name, type = 'text', placeholder = '', required = false, autocomplete } = $props();
</script>

<div>
    <label for={name} class="block text-sm font-medium text-neutral-700">
        {label}
    </label>
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
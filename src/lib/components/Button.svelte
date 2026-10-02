<script>
    let { children, loading = false, variant = 'primary', type = 'submit' } = $props();

    const styles = {
        primary: 'bg-neutral-900 text-white hover:bg-neutral-700',
        secondary: 'border border-neutral-300 text-neutral-700 hover:bg-neutral-100'
    };
</script>

<button
    {type}
    disabled={loading}
    class="w-full rounded-lg px-4 py-2.5 text-sm font-medium transition
           disabled:opacity-50 {styles[variant]}"
>
    {@render children()}
</button>
<script>
    import { onMount } from "svelte";

    onMount ( () => {
        const basePath = window.location.pathname.trim().split('/')[1];

        const routes = ['', 'blank', 'profile', 'node']

        if (!routes.includes(basePath)) {
            window.location.replace ('/#' + window.location.pathname);
        }
    });

</script>

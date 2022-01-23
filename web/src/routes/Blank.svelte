<script>
    import { onMount } from "svelte";
    import { navRoute } from '../store.js';

    onMount ( () => {

        $navRoute.Paths = [];
        $navRoute.Views = [];
        $navRoute.ViewSelect = '';
    });

</script>

<p>
Waiting ...    
</p>
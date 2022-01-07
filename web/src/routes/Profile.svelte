<script>
    import { Route } from "svelte-routing";
    import { onMount } from "svelte";
    import { selectedNode } from '../store.js';


    export let profileName;

    onMount ( () => {
        selectedNode.update(name => profileName);
    });
    
</script>
<p>
    Profile - {profileName}
    <Route path="/:id" let:params>
        {params.id}
    </Route>
</p>
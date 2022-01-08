<script>
    import { Route } from "svelte-routing";
    import { onMount } from "svelte";
    import { selectedNode } from '../store.js';
    import { sideStore } from '../store';
    


    export let profileName;

    onMount ( () => {
        selectedNode.update(name => profileName);
        $sideStore.ProfileRoot.expanded = true;
    });
    
</script>
<p>
    Profile - {profileName}
    <Route path="/:id" let:params>
        {params.id}
    </Route>
</p>
<script>
    import { Route } from "svelte-routing";
    import { onMount } from "svelte";
    import { selectedNode } from '../store.js';
    import { profileTreeRoot } from '../store';
    


    export let profileName;

    onMount ( () => {
        selectedNode.update(name => profileName);
        $profileTreeRoot.expanded = true;
    });
    
</script>
<p>
    Profile - {profileName}
    <Route path="/:id" let:params>
        {params.id}
    </Route>
</p>
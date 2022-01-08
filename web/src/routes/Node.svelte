<script>
    import { sideStore } from '../store';
    import { selectedNode } from '../store.js';

    import { onMount } from "svelte";
    
    export let nodeName;

    onMount ( () => {
        selectedNode.update(name => nodeName);
        $sideStore.NodeRoot.expanded = true;
    });

</script>
<p>
    Node - {nodeName}
</p>
<script>
    import { nodeTreeRoot } from '../store';
    import { selectedNode } from '../store.js';

    import { onMount } from "svelte";
    
    export let nodeName;

    onMount ( () => {
        selectedNode.update(name => nodeName);
        $nodeTreeRoot.expanded = true;
    });

</script>
<p>
    Node - {nodeName}
</p>